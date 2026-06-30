export type ReservationEmailPayload = {
  nombreApellido: string;
  documento: string;
  fechaNacimiento: string;
  email: string;
  residencia: string;
};

const ADMIN_EMAIL = "tertuliascriollas@gmail.com";

export async function sendReservationEmail(payload: ReservationEmailPayload) {
  /*
   * Integrar aquí el proveedor de email cuando esté definido.
   *
   * Ejemplos posibles:
   * - Resend
   * - Nodemailer con SMTP propio
   * - Servicio transaccional de la organización
   * Cuando haya proveedor real:
   * - Enviar un email interno a ADMIN_EMAIL con los datos de `payload`.
   * - Enviar un email de confirmación al usuario usando `payload.email`.
   */

  console.log("Email interno simulado:", {
    to: ADMIN_EMAIL,
    subject: "Nueva solicitud de reserva de preventa",
    payload
  });

  console.log("Email de confirmación simulado:", {
    to: payload.email,
    subject: "Solicitud de reserva recibida",
    message:
      "Recibimos tu solicitud de reserva de preventa. Nos contactaremos por email para compartir las instrucciones de transferencia y continuar con la confirmación."
  });

  return {
    success: true,
    simulated: true
  };
}
