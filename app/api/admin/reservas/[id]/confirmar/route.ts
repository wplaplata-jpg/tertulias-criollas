import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
  unauthorizedAdminResponse
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/sendReservationEmail";

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
    const reservation = await prisma.reservation.update({
      where: {
        id: params.id
      },
      data: {
        status: "CONFIRMED"
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

    await sendPaymentConfirmationEmail(reservation);

    return NextResponse.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error("Error confirmando la reserva.", error);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo confirmar la reserva."
      },
      { status: 500 }
    );
  }
}
