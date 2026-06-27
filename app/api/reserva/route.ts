import { NextResponse } from "next/server";

import {
  sendReservationEmail,
  type ReservationEmailPayload
} from "@/lib/sendReservationEmail";

function hasReservationFields(data: unknown): data is ReservationEmailPayload {
  if (!data || typeof data !== "object") {
    return false;
  }

  const payload = data as Record<string, unknown>;

  return (
    typeof payload.nombreApellido === "string" &&
    typeof payload.documento === "string" &&
    typeof payload.fechaNacimiento === "string" &&
    typeof payload.email === "string" &&
    typeof payload.residencia === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!hasReservationFields(body)) {
      return NextResponse.json(
        { success: false, message: "Datos incompletos." },
        { status: 400 }
      );
    }

    await sendReservationEmail({
      nombreApellido: body.nombreApellido,
      documento: body.documento,
      fechaNacimiento: body.fechaNacimiento,
      email: body.email,
      residencia: body.residencia
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "No se pudo procesar la solicitud." },
      { status: 500 }
    );
  }
}
