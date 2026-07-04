import { Resend } from "resend";

type ReservationEmailPayload = {
  id: string;
  nombreApellido: string;
  documento: string;
  fechaNacimiento: Date;
  email: string;
  residencia: string;
  telefono?: string | null;
  createdAt: Date;
};

const userConfirmationMessage = `Estimado/a,

Hemos recibido correctamente tu solicitud de reserva para una próxima edición de Tertulias Criollas.

En las próximas horas nos pondremos en contacto por este mismo medio para compartir las instrucciones de pago y continuar con la confirmación de tu lugar.

Recordamos que la reserva queda sujeta a disponibilidad y a la validación del pago correspondiente.

Muchas gracias por tu interés.

Tertulias Criollas`;

function buildPaymentConfirmationEmailText(
  reservation: ReservationEmailPayload
) {
  return `Estimado/a,

Tu reserva para Tertulias Criollas ha sido confirmada correctamente.

Presentá este correo el día del encuentro como constancia de confirmación.

Datos de la reserva:
- Nombre: ${reservation.nombreApellido}
- Documento: ${reservation.documento}
- Código interno de reserva: ${reservation.id}
- Estado: Confirmada

Muchas gracias.

Tertulias Criollas`;
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !adminEmail || !fromEmail) {
    throw new Error(
      "Faltan variables de entorno de Resend: RESEND_API_KEY, ADMIN_EMAIL o RESEND_FROM_EMAIL."
    );
  }

  return {
    apiKey,
    adminEmail,
    fromEmail
  };
}

function formatDate(date: Date) {
  return date.toISOString();
}

function buildAdminEmailText(reservation: ReservationEmailPayload) {
  const visitorDetails = [
    `Nombre: ${reservation.nombreApellido}`,
    `Documento: ${reservation.documento}`,
    `Fecha de nacimiento: ${formatDate(reservation.fechaNacimiento)}`,
    `Email: ${reservation.email}`,
    `Residencia: ${reservation.residencia}`
  ];

  if (reservation.telefono) {
    visitorDetails.push(`Teléfono: ${reservation.telefono}`);
  }

  return [
    "Nueva solicitud de reserva",
    "Tertulias Criollas",
    "",
    "Datos del visitante",
    "",
    ...visitorDetails,
    "",
    "Datos de la solicitud",
    "",
    `Código interno de reserva: ${reservation.id}`,
    `Fecha de creación: ${formatDate(reservation.createdAt)}`
  ].join("\n");
}

export async function sendReservationEmails(
  reservation: ReservationEmailPayload
) {
  const { apiKey, adminEmail, fromEmail } = getEmailConfig();
  const resend = new Resend(apiKey);

  const [adminEmailResult, userEmailResult] = await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: reservation.email,
      subject: "Nueva solicitud de reserva | Tertulias Criollas",
      text: buildAdminEmailText(reservation)
    }),
    resend.emails.send({
      from: fromEmail,
      to: reservation.email,
      subject: "Solicitud de reserva recibida | Tertulias Criollas",
      text: userConfirmationMessage
    })
  ]);

  if (adminEmailResult.error || userEmailResult.error) {
    throw new Error(
      JSON.stringify({
        adminEmailError: adminEmailResult.error,
        userEmailError: userEmailResult.error
      })
    );
  }
}

export async function sendPaymentConfirmationEmail(
  reservation: ReservationEmailPayload
) {
  const { apiKey, fromEmail } = getEmailConfig();
  const resend = new Resend(apiKey);

  const confirmationEmailResult = await resend.emails.send({
    from: fromEmail,
    to: reservation.email,
    subject: "Reserva confirmada | Tertulias Criollas",
    text: buildPaymentConfirmationEmailText(reservation)
  });

  if (confirmationEmailResult.error) {
    throw new Error(JSON.stringify(confirmationEmailResult.error));
  }
}
