import { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { sendReservationEmails } from "@/lib/sendReservationEmail";

const MAX_CAPACITY = 25;
const ACTIVE_RESERVATION_STATUSES = ["PENDING", "CONFIRMED"] as const;

type ReservationRequestBody = {
  nombreApellido?: unknown;
  documento?: unknown;
  fechaNacimiento?: unknown;
  email?: unknown;
  residencia?: unknown;
  telefono?: unknown;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseBirthDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function buildPublicCode(sequence: number) {
  return `TC-${String(sequence).padStart(4, "0")}`;
}

function getPublicCodeSequence(publicCode: string | null) {
  if (!publicCode) {
    return 0;
  }

  const sequence = Number(publicCode.replace("TC-", ""));

  return Number.isNaN(sequence) ? 0 : sequence;
}

function isRetryableReservationError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2034" || error.code === "P2002")
  );
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    if (
      isRateLimited({
        key: `reservation:${clientIp}`,
        limit: 5,
        windowMs: 10 * 60 * 1000
      })
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Demasiadas solicitudes. Intentá nuevamente más tarde."
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ReservationRequestBody;

    const nombreApellido = normalizeText(body.nombreApellido);
    const documento = normalizeText(body.documento);
    const fechaNacimientoValue = normalizeText(body.fechaNacimiento);
    const email = normalizeText(body.email).toLowerCase();
    const residencia = normalizeText(body.residencia);
    const telefono = normalizeText(body.telefono);

    if (
      !nombreApellido ||
      !documento ||
      !fechaNacimientoValue ||
      !email ||
      !residencia
    ) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "El email no es válido." },
        { status: 400 }
      );
    }

    const fechaNacimiento = parseBirthDate(fechaNacimientoValue);

    if (!fechaNacimiento) {
      return NextResponse.json(
        { success: false, message: "La fecha de nacimiento no es válida." },
        { status: 400 }
      );
    }

    let reservationResult:
      | {
          reservation: {
            id: string;
            publicCode: string | null;
            nombreApellido: string;
            documento: string;
            fechaNacimiento: Date;
            email: string;
            residencia: string;
            telefono: string | null;
            createdAt: Date;
          };
          remainingSeats: number;
        }
      | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        reservationResult = await prisma.$transaction(
          async (tx) => {
            const reservedSeats = await tx.reservation.count({
              where: {
                status: {
                  in: [...ACTIVE_RESERVATION_STATUSES]
                }
              }
            });

            if (reservedSeats >= MAX_CAPACITY) {
              return null;
            }

            const lastReservationWithCode = await tx.reservation.findFirst({
              where: {
                publicCode: {
                  not: null
                }
              },
              orderBy: {
                publicCode: "desc"
              },
              select: {
                publicCode: true
              }
            });
            const publicCode = buildPublicCode(
              getPublicCodeSequence(lastReservationWithCode?.publicCode ?? null) +
                1
            );

            const reservation = await tx.reservation.create({
              data: {
                nombreApellido,
                documento,
                fechaNacimiento,
                email,
                residencia,
                telefono: telefono || null,
                publicCode
              },
              select: {
                id: true,
                publicCode: true,
                nombreApellido: true,
                documento: true,
                fechaNacimiento: true,
                email: true,
                residencia: true,
                telefono: true,
                createdAt: true
              }
            });

            return {
              reservation,
              remainingSeats: Math.max(0, MAX_CAPACITY - reservedSeats - 1)
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
          }
        );
        break;
      } catch (transactionError) {
        if (attempt < 2 && isRetryableReservationError(transactionError)) {
          continue;
        }

        throw transactionError;
      }
    }

    if (!reservationResult) {
      return NextResponse.json({
        success: false,
        error: "No quedan cupos disponibles para esta edición."
      });
    }

    const { reservation, remainingSeats } = reservationResult;

    try {
      await sendReservationEmails(reservation);
    } catch (emailError) {
      console.error(
        "La reserva fue registrada, pero falló el envío de email.",
        emailError instanceof Error ? emailError.message : "Error desconocido"
      );
    }

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
      publicCode: reservation.publicCode,
      message: "Reserva registrada correctamente",
      remainingSeats
    });
  } catch (error) {
    console.error(
      "Error guardando la reserva.",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      { success: false, message: "No se pudo procesar la solicitud." },
      { status: 500 }
    );
  }
}
