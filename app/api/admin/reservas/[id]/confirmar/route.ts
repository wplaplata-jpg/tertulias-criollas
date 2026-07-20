import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
  unauthorizedAdminResponse
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  sendAdminPaymentApprovedEmail,
  sendPaymentConfirmationEmail
} from "@/lib/sendReservationEmail";

type ConfirmReservationContext = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, { params }: ConfirmReservationContext) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const updateResult = await prisma.reservation.updateMany({
      where: {
        id: params.id,
        status: {
          not: "CONFIRMED"
        }
      },
      data: {
        status: "CONFIRMED"
      }
    });

    const reservation = await prisma.reservation.findUniqueOrThrow({
      where: {
        id: params.id
      },
      select: {
        id: true,
        publicCode: true,
        nombreApellido: true,
        documento: true,
        fechaNacimiento: true,
        email: true,
        telefono: true,
        residencia: true,
        createdAt: true,
        status: true
      }
    });

    if (updateResult.count > 0) {
      await sendPaymentConfirmationEmail(reservation);

      try {
        await sendAdminPaymentApprovedEmail(reservation);
      } catch (error) {
        console.error(
          "El pago fue confirmado, pero fallo el email administrativo.",
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    }

    return NextResponse.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error(
      "Error confirmando la reserva.",
      error instanceof Error ? error.message : "Error desconocido"
    );

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo confirmar la reserva."
      },
      { status: 500 }
    );
  }
}
