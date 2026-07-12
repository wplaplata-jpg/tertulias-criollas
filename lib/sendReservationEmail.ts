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
  return `Hola, ${reservation.nombreApellido}:

Muchas gracias por tu interés en participar de una nueva edición de Tertulias Criollas.

Hemos recibido correctamente tu solicitud de reserva.

Para continuar con el proceso, comunicate por WhatsApp y te enviaremos los datos o el enlace correspondiente al medio de pago que prefieras.

Medios de pago disponibles:
- Transferencia bancaria (Banco Galicia)
- Mercado Pago (+10 %)
- PayPal

WhatsApp:
+54 9 221 501 0965

Información del encuentro:
- Inicio: 18:00 hs.
- Duración aproximada: 2 horas y 30 minutos.

Una vez recibido y verificado el pago, te enviaremos un nuevo correo con la confirmación definitiva de tu reserva.

Muchas gracias por tu interés.

Quedamos a disposición para cualquier consulta y esperamos darte la bienvenida muy pronto a una nueva velada de Tertulias Criollas.

Tertulias Criollas

reservas@tertuliascriollas.com
+54 9 221 501 0965
www.tertuliascriollas.com`;
}

function buildPaymentConfirmationEmailText(
  reservation: ReservationEmailPayload
) {
  const reservationCode = reservation.publicCode ?? "Sin asignar";

  return `Hola, ${reservation.nombreApellido}:

Nos complace informarte que hemos recibido correctamente tu pago.

Tu reserva ha quedado confirmada.

Código de reserva:
${reservationCode}

Información del encuentro:
- Inicio: 18:00 hs.
- Duración aproximada: 2 horas y 30 minutos.

Información importante:
Se recomienda asistir con una vestimenta acorde al carácter de la velada.

Si necesitás realizar alguna consulta antes del encuentro, podés comunicarte con nosotros por WhatsApp.

+54 9 221 501 0965

Será un placer recibirte y compartir una nueva edición de Tertulias Criollas.

Tertulias Criollas

tertuliascriollas@gmail.com
+54 9 221 501 0965
www.tertuliascriollas.com`;
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
      subject: "Hemos recibido tu solicitud | Tertulias Criollas",
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
    subject: "Tu reserva ha sido confirmada | Tertulias Criollas",
    text: buildPaymentConfirmationEmailText(reservation)
  });

  if (confirmationEmailResult.error) {
    throw new Error(JSON.stringify(confirmationEmailResult.error));
  }
}
