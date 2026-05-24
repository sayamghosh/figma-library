const { asyncHandler } = require("../utils/asyncHandler");
const { ContactMessage } = require("../models/ContactMessage");
const { sendContactEmail } = require("../utils/mailer");

function buildEmailBody(contact, userId) {
  const intro = `New contact request from ${contact.name}`;
  const metaRows = [
    ["User ID", userId],
    ["Name", contact.name],
    ["Email", contact.email],
    ["Company", contact.company || "-"],
    ["Country", contact.country],
  ];

  const metaHtml = metaRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#111827;">${label}</td><td style="padding:6px 12px;color:#374151;">${value}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:24px;color:#111827;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 8px;font-size:20px;">${intro}</h2>
        <p style="margin:0 0 20px;color:#6b7280;">A new message was submitted from the dashboard contact form.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          ${metaHtml}
        </table>
        <div style="border-top:1px solid #e5e7eb;padding-top:16px;">
          <h3 style="margin:0 0 8px;font-size:16px;">Message</h3>
          <p style="white-space:pre-wrap;margin:0;color:#374151;line-height:1.6;">${contact.message}</p>
        </div>
      </div>
    </div>
  `;

  const text = `${intro}\n\nName: ${contact.name}\nEmail: ${contact.email}\nCompany: ${contact.company || "-"}\nCountry: ${contact.country}\nUser ID: ${userId}\n\nMessage:\n${contact.message}`;

  return { html, text };
}

const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, company = "", country, message } = req.body || {};

  if (!name || !email || !country || !message) {
    res.status(400);
    throw new Error("Please fill in all required fields.");
  }

  const contact = await ContactMessage.create({
    userId: req.user.userId,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    company: String(company || "").trim(),
    country: String(country).trim(),
    message: String(message).trim(),
    status: "submitted",
  });

  const to = process.env.CONTACT_TO_EMAIL || "";
  if (!to) {
    contact.status = "failed";
    contact.mailError = "CONTACT_TO_EMAIL is not configured";
    await contact.save();
    res.status(500);
    throw new Error("Contact email is not configured.");
  }

  const { html, text } = buildEmailBody(contact, req.user.userId);

  try {
    await sendContactEmail({
      to,
      replyTo: contact.email,
      subject: `New Contact Request: ${contact.name}`,
      html,
      text,
    });

    contact.status = "emailed";
    contact.mailError = "";
    await contact.save();
  } catch (error) {
    contact.status = "failed";
    contact.mailError = error instanceof Error ? error.message : "Email delivery failed";
    await contact.save();
    res.status(500);
    throw new Error("Could not send contact email.");
  }

  res.status(201).json({
    success: true,
    data: {
      id: contact._id,
      status: contact.status,
      createdAt: contact.createdAt,
    },
  });
});

const listMyContactMessages = asyncHandler(async (req, res) => {
  const items = await ContactMessage.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: {
      items,
    },
  });
});

module.exports = { createContactMessage, listMyContactMessages };
