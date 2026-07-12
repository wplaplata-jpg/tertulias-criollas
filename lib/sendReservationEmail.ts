import { Resend } from "resend";

const WHATSAPP_NUMBER = "+54 9 221 501 0965";
const WHATSAPP_URL = "https://wa.me/5492215010965";
const LOGO_URL = "https://www.tertuliascriollas.com/logo.svg";
const FOOTER_EMAIL = "reservas@tertuliascriollas.com";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraph(content: string) {
  return `<p style="margin:0 0 16px;color:#2f3437;">${escapeHtml(content)}</p>`;
}

function list(items: string[]) {
  return `<ul style="margin:0 0 20px;padding-left:22px;color:#2f3437;">${items
    .map((item) => `<li style="margin:0 0 8px;">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function sectionTitle(content: string) {
  return `<p style="margin:24px 0 10px;color:#17345c;font-weight:700;">${escapeHtml(content)}</p>`;
}

function whatsappNumberLink() {
  return `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" style="color:#17345c;text-decoration:underline;">${WHATSAPP_NUMBER}</a>`;
}

function whatsappUrlLink() {
  return `<a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" style="color:#17345c;text-decoration:underline;">${WHATSAPP_URL}</a>`;
}

function buildEmailLayout(title: string, content: string) {
  const footer = `<div style="margin-top:32px;padding-top:18px;border-top:1px solid #e6dcc7;color:#4b5563;font-size:14px;line-height:1.7;">
    <p style="margin:0 0 4px;color:#17345c;font-weight:700;">Tertulias Criollas</p>
    <p style="margin:0;">${FOOTER_EMAIL}</p>
    <p style="margin:0;">${whatsappNumberLink()}</p>
    <p style="margin:0;">www.tertuliascriollas.com</p>
  </div>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px;color:#2f3437;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;">
      <div style="text-align:center;margin-bottom:28px;">
        <img src="${LOGO_URL}" alt="Tertulias Criollas" width="96" style="display:inline-block;width:96px;max-width:96px;height:auto;border:0;" />
      </div>
      <h1 style="margin:0 0 24px;color:#17345c;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;line-height:1.25;">
        ${escapeHtml(title)}
      </h1>
      ${content}
      ${footer}
    </div>
  </body>
</html>`;
}

function buildUserReservationEmailHtml(reservation: ReservationEmailPayload) {
  return buildEmailLayout(
    "Hemos recibido tu solicitud",
    [
      paragraph(`Hola, ${reservation.nombreApellido}:`),
      paragraph(
        "Muchas gracias por tu interés en participar de una nueva edición de Tertulias Criollas."
      ),
      paragraph("Hemos recibido correctamente tu solicitud de reserva."),
      paragraph(
        "Para continuar con el proceso, comunicate por WhatsApp y te enviaremos los datos o el enlace correspondiente al medio de pago que prefieras."
      ),
      sectionTitle("Medios de pago disponibles:"),
      list([
        "Transferencia bancaria (Banco Galicia)",
        "Mercado Pago (+10 %)",
        "PayPal"
      ]),
      sectionTitle("WhatsApp:"),
      `<p style="margin:0 0 20px;color:#2f3437;">${whatsappNumberLink()}</p>`,
      sectionTitle("Información del encuentro:"),
      list(["Inicio: 18:00 hs.", "Duración aproximada: 2 horas y 30 minutos."]),
      paragraph(
        "Una vez recibido y verificado el pago, te enviaremos un nuevo correo con la confirmación definitiva de tu reserva."
      ),
      paragraph("Muchas gracias por tu interés."),
      paragraph(
        "Quedamos a disposición para cualquier consulta y esperamos darte la bienvenida muy pronto a una nueva velada de Tertulias Criollas."
      )
    ].join("")
  );
}

function buildPaymentConfirmationEmailHtml(
  reservation: ReservationEmailPayload
) {
  const reservationCode = reservation.publicCode ?? "Sin asignar";

  return buildEmailLayout(
    "Tu reserva ha sido confirmada",
    [
      paragraph(`Hola, ${reservation.nombreApellido}:`),
      paragraph("Nos complace informarte que hemos recibido correctamente tu pago."),
      paragraph("Tu reserva ha quedado confirmada."),
      sectionTitle("Código de reserva:"),
      `<p style="margin:0 0 20px;color:#17345c;font-size:20px;font-weight:700;letter-spacing:0.04em;">${escapeHtml(reservationCode)}</p>`,
      sectionTitle("Información del encuentro:"),
      list(["Inicio: 18:00 hs.", "Duración aproximada: 2 horas y 30 minutos."]),
      sectionTitle("Información importante:"),
      paragraph(
        "Se recomienda asistir con una vestimenta acorde al carácter de la velada."
      ),
      paragraph(
        "Si necesitás realizar alguna consulta antes del encuentro, podés comunicarte con nosotros por WhatsApp."
      ),
      `<p style="margin:0 0 20px;color:#2f3437;">${whatsappNumberLink()}</p>`,
      paragraph(
        "Será un placer recibirte y compartir una nueva edición de Tertulias Criollas."
      )
    ].join("")
  );
}

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

reservas@tertuliascriollas.com
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
  const userEmailText = buildUserReservationEmailText(reservation);

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
      text: userEmailText,
      html: buildUserReservationEmailHtml(reservation)
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
  const confirmationEmailText = buildPaymentConfirmationEmailText(reservation);

  const confirmationEmailResult = await resend.emails.send({
    from: fromEmail,
    to: reservation.email,
    subject: "Tu reserva ha sido confirmada | Tertulias Criollas",
    text: confirmationEmailText,
    html: buildPaymentConfirmationEmailHtml(reservation)
  });

  if (confirmationEmailResult.error) {
    throw new Error(JSON.stringify(confirmationEmailResult.error));
  }
}
