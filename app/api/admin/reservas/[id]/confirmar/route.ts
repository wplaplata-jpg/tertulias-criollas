import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/sendReservationEmail";

type ConfirmReservationContext = {
  params: {
    id: string;
  };
};

export async function POST(_request: Request, { params }: ConfirmReservationContext) {
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
        nombreApellido: true,
        documento: true,
        fechaNacimiento: true,
        email: true,
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
