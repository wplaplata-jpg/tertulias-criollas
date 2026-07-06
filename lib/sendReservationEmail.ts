import { Resend } from "resend";

type ReservationEmailPayload = {
  id: string;
  publicCode?: string | null;
  nombreApellido: string;
  documento: string;
  fechaNacimiento: Date;
  email: string;
  residencia: string;
  telefono?: string | null;
  createdAt: Date;
};

function buildUserReservationEmailText(reservation: ReservationEmailPayload) {
  const reservationCode = reservation.publicCode ?? "Sin asignar";

  return `Estimado/a ${reservation.nombreApellido},

Hemos recibido correctamente tu solicitud de reserva para una próxima edición de Tertulias Criollas.

La reserva se confirma una vez acreditado el pago correspondiente.

Código de reserva: ${reservationCode}

Datos de pago:

Banco Galicia
DU: 16763983
Cuenta: 4017304-5 373-5
CBU: 0070373230004017304558
CUIL: 20167639837
Alias: Tertulias.Criollas.h

Medios disponibles:
- Transferencia bancaria
- Mercado Pago (+10%)
- PayPal

WhatsApp para enviar comprobante:
+54 9 221 501 0965
https://wa.me/5492215010965

Información del encuentro:
- Veladas: últimos sábados de cada mes.
- Horario de inicio: 18:00 hs.
- Duración aproximada: 2 horas y 30 minutos.
- Se solicita asistir con vestimenta acorde al carácter de la velada.

Muchas gracias por tu interés.

Tertulias Criollas`;
}

function buildPaymentConfirmationEmailText(
  reservation: ReservationEmailPayload
) {
  const reservationCode = reservation.publicCode ?? "Sin asignar";

  return `Estimado/a,

Tu reserva para Tertulias Criollas ha sido confirmada correctamente.

Presentá este correo el día del encuentro como constancia de confirmación.

Datos de la reserva:
- Nombre: ${reservation.nombreApellido}
- Documento: ${reservation.documento}
- Código de reserva: ${reservationCode}
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
  const reservationCode = reservation.publicCode ?? "Sin asignar";
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
    `Código de reserva: ${reservationCode}`,
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
      subject: "Hemos recibido tu solicitud de reserva | Tertulias Criollas",
      text: buildUserReservationEmailText(reservation)
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
