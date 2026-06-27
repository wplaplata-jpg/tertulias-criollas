export type ReservationEmailPayload = {
  nombreApellido: string;
  documento: string;
  fechaNacimiento: string;
  email: string;
  residencia: string;
};

export async function sendReservationEmail(payload: ReservationEmailPayload) {
  /*
   * Integrar aquí el proveedor de email cuando esté definido.
   *
   * Ejemplos posibles:
   * - Resend
   * - Nodemailer con SMTP propio
   * - Servicio transaccional de la organización
   *
   * El email interno debería incluir los datos de `payload` y enviarse
   * a la casilla de gestión de reservas de Tertulias Criollas.
   */

  console.info("Solicitud de reserva recibida:", payload);

  return {
    success: true,
    simulated: true
  };
}
