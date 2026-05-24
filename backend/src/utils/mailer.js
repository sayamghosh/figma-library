const nodemailer = require("nodemailer");

function buildTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

async function sendContactEmail({
  to,
  replyTo,
  subject,
  html,
  text,
}) {
  const transport = buildTransport();
  if (!transport) {
    throw new Error("SMTP is not configured");
  }

  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "Figma Components";

  await transport.sendMail({
    from: fromEmail ? `${fromName} <${fromEmail}>` : fromName,
    to,
    replyTo,
    subject,
    html,
    text,
  });
}

module.exports = { sendContactEmail };
