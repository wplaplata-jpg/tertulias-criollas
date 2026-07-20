import { Resend } from "resend";

const WHATSAPP_NUMBER = "+54 9 221 501 0965";
const WHATSAPP_URL = "https://wa.me/5492215010965";
const LOGO_URL = "https://www.tertuliascriollas.com/logo.svg";
const FOOTER_EMAIL = "contacto@tertuliascriollas.com";
const WEBSITE_URL = "https://tertuliascriollas.com";
const WEBSITE_LABEL = "tertuliascriollas.com";

export type ReservationEmailPayload = {
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

function emailLink() {
  return `<a href="mailto:${FOOTER_EMAIL}" style="color:#17345c;text-decoration:underline;">${FOOTER_EMAIL}</a>`;
}

function websiteLink() {
  return `<a href="${WEBSITE_URL}" target="_blank" rel="noopener noreferrer" style="color:#17345c;text-decoration:underline;">${WEBSITE_LABEL}</a>`;
}

function buildEmailLayout(title: string, content: string) {
  const footer = `<div style="margin-top:32px;padding-top:18px;border-top:1px solid #e6dcc7;color:#4b5563;font-size:14px;line-height:1.7;">
    <p style="margin:0 0 4px;color:#17345c;font-weight:700;">Tertulias Criollas</p>
    <p style="margin:0;">${emailLink()}</p>
    <p style="margin:0;">${whatsappNumberLink()}</p>
    <p style="margin:0;">${websiteLink()}</p>
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

contacto@tertuliascriollas.com
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

contacto@tertuliascriollas.com
+54 9 221 501 0965
www.tertuliascriollas.com`;
}

function getEmailConfig() {
  const resendConfig = getResendConfig();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error("Falta la variable de entorno ADMIN_EMAIL.");
  }

  return {
    ...resendConfig,
    adminEmail
  };
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error(
      "Faltan variables de entorno de Resend: RESEND_API_KEY o RESEND_FROM_EMAIL."
    );
  }

  return {
    apiKey,
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

function buildAdminPaymentApprovedEmailText(reservation: ReservationEmailPayload) {
  const reservationCode = reservation.publicCode ?? reservation.id;

  return [
    "Pago aprobado",
    "Tertulias Criollas",
    "",
    "Datos del cliente",
    "",
    `Nombre: ${reservation.nombreApellido}`,
    `Email: ${reservation.email}`,
    `Telefono: ${reservation.telefono || "No informado"}`,
    "Cantidad de personas / entradas: 1",
    "",
    "Datos del pago",
    "",
    "Fecha de la tertulia: No especificada",
    "Importe pagado: No especificado",
    `ID de reserva: ${reservationCode}`,
    "ID de pago: No disponible",
    "Estado del pago: Aprobado"
  ].join("\n");
}

function buildAdminPaymentApprovedEmailHtml(
  reservation: ReservationEmailPayload
) {
  const reservationCode = reservation.publicCode ?? reservation.id;

  return buildEmailLayout(
    "Pago aprobado",
    [
      paragraph("Se registro la aprobacion de un pago de reserva."),
      sectionTitle("Datos del cliente"),
      list([
        `Nombre: ${reservation.nombreApellido}`,
        `Email: ${reservation.email}`,
        `Telefono: ${reservation.telefono || "No informado"}`,
        "Cantidad de personas / entradas: 1"
      ]),
      sectionTitle("Datos del pago"),
      list([
        "Fecha de la tertulia: No especificada",
        "Importe pagado: No especificado",
        `ID de reserva: ${reservationCode}`,
        "ID de pago: No disponible",
        "Estado del pago: Aprobado"
      ])
    ].join("")
  );
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
  const { apiKey, fromEmail } = getResendConfig();
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

export async function sendAdminPaymentApprovedEmail(
  reservation: ReservationEmailPayload
) {
  const { apiKey, adminEmail, fromEmail } = getEmailConfig();
  const resend = new Resend(apiKey);

  const adminEmailResult = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    replyTo: reservation.email,
    subject: `Pago aprobado - ${reservation.nombreApellido}`,
    text: buildAdminPaymentApprovedEmailText(reservation),
    html: buildAdminPaymentApprovedEmailHtml(reservation)
  });

  if (adminEmailResult.error) {
    throw new Error(JSON.stringify(adminEmailResult.error));
  }
}
