import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
  unauthorizedAdminResponse
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  sendPaymentConfirmationEmail,
  sendReservationEmails
} from "@/lib/sendReservationEmail";

type ReservationContext = {
  params: {
    id: string;
  };
};

type ActionBody = {
  action?: unknown;
};

const actionStatus = {
  confirm: "CONFIRMED",
  cancel: "CANCELLED",
  pending: "PENDING"
} as const;

function selectReservation() {
  return {
    id: true,
    publicCode: true,
    nombreApellido: true,
    documento: true,
    fechaNacimiento: true,
    email: true,
    telefono: true,
    residencia: true,
    status: true,
    createdAt: true
  };
}

export async function PATCH(request: NextRequest, { params }: ReservationContext) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = (await request.json()) as ActionBody;

    if (
      body.action !== "confirm" &&
      body.action !== "cancel" &&
      body.action !== "pending" &&
      body.action !== "resend"
    ) {
      return NextResponse.json(
        { success: false, message: "Acción inválida." },
        { status: 400 }
      );
    }

    if (body.action === "resend") {
      const reservation = await prisma.reservation.findUniqueOrThrow({
        where: {
          id: params.id
        },
        select: selectReservation()
      });

      await sendReservationEmails(reservation);

      return NextResponse.json({
        success: true,
        reservation
      });
    }

    const reservation = await prisma.reservation.update({
      where: {
        id: params.id
      },
      data: {
        status: actionStatus[body.action]
      },
      select: selectReservation()
    });

    if (body.action === "confirm") {
      await sendPaymentConfirmationEmail(reservation);
    }

    return NextResponse.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error(
      "Error actualizando reserva desde admin.",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      { success: false, message: "No se pudo actualizar la reserva." },
      { status: 500 }
    );
  }
}
