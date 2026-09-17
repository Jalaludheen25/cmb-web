import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { enquiryTypes, site } from "@/lib/content";

/**
 * Enquiry intake — delivers the contact form to the sales mailbox.
 *
 * ── CONFIGURATION ──────────────────────────────────────────────────────────
 * Set these in `.env.local` (development) or the host's environment (Vercel →
 * Settings → Environment Variables). See `.env.example`.
 *
 *   SMTP_HOST      e.g. smtp.hostinger.com / smtp.office365.com / smtp.zoho.com
 *   SMTP_PORT      465 for implicit TLS, 587 for STARTTLS
 *   SMTP_USER      the full mailbox address, e.g. enquiry@cmbcargo.ae
 *   SMTP_PASS      that mailbox's password or app password
 *   SMTP_SECURE    optional; defaults to true when the port is 465
 *   ENQUIRY_TO     optional; defaults to the site's salesEmail
 *   ENQUIRY_FROM   optional; defaults to SMTP_USER
 *
 * A webhook (`ENQUIRY_WEBHOOK_URL`) is still honoured as an alternative for a
 * CRM or Zapier/Make intake. SMTP wins if both are present.
 *
 * ── WHY IT STILL FAILS LOUDLY WHEN UNCONFIGURED ────────────────────────────
 * With neither transport set, this returns 503 and the form tells the visitor
 * to phone or email instead. That is deliberate: a form that reports success
 * and quietly discards the enquiry loses real business invisibly. The error the
 * client reported was this safety net firing because no mail transport had been
 * configured yet — not a bug in the form. Set the SMTP variables and it clears.
 *
 * Note there is no `export const runtime`: Node is already the default in this
 * version of Next, and the Edge runtime is deprecated.
 */

const MAX = { name: 120, company: 160, email: 200, phone: 40, message: 4000 };

type Payload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  enquiry?: unknown;
  message?: unknown;
  /** Honeypot — real users never fill this. */
  website?: unknown;
};

/** Single-line fields are stripped of CR/LF so nothing can forge a mail header
 *  by smuggling a newline into, say, the name that lands in the subject. */
function asLine(value: unknown, limit: number) {
  return typeof value === "string"
    ? value.replace(/[\r\n]+/g, " ").trim().slice(0, limit)
    : "";
}

function asBlock(value: unknown, limit: number) {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, limit) : "";
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Silently accept-and-discard bot submissions so they get no signal.
  if (asLine(body.website, 100) !== "") {
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: asLine(body.name, MAX.name),
    company: asLine(body.company, MAX.company),
    email: asLine(body.email, MAX.email),
    phone: asLine(body.phone, MAX.phone),
    enquiry: asLine(body.enquiry, 60),
    message: asBlock(body.message, MAX.message),
  };

  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.name = "Please give us a name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    errors.email = "That email address does not look right.";
  }
  if (data.message.length < 10) errors.message = "A little more detail, please.";
  if (data.enquiry && !enquiryTypes.includes(data.enquiry as (typeof enquiryTypes)[number])) {
    errors.enquiry = "Unknown enquiry type.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const receivedAt = new Date().toISOString();
  const to = process.env.ENQUIRY_TO || site.contact.salesEmail;

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Company", data.company || "—"],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Enquiry", data.enquiry || "—"],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Details:",
    data.message,
    "",
    `Received: ${receivedAt}`,
    `Source: ${site.domain}/contact`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 16px">Website enquiry</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:18px 0 6px;color:#666">Details</p>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #ddd">
      <p style="color:#888;font-size:12px;margin:0">
        Received ${receivedAt} · ${site.domain}/contact
      </p>
    </div>`;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, ENQUIRY_FROM } = process.env;
  const smtpReady = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

  if (smtpReady) {
    const port = Number(SMTP_PORT);
    try {
      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        // Implicit TLS on 465; STARTTLS on 587/25. Override with SMTP_SECURE.
        secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
        auth: { user: SMTP_USER as string, pass: SMTP_PASS as string },
      });

      await transport.sendMail({
        // From must be a mailbox the SMTP account is allowed to send as, so it
        // defaults to the authenticated user rather than the visitor's address
        // — spoofing the visitor here is what gets mail marked as spam.
        from: `"${site.name} website" <${ENQUIRY_FROM || SMTP_USER}>`,
        to,
        // Hitting Reply in the mailbox answers the person who enquired.
        replyTo: `"${data.name}" <${data.email}>`,
        subject: `Website enquiry — ${data.enquiry || "General"} — ${data.name}`,
        text,
        html,
      });

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[enquiry] SMTP delivery failed:", error);
      return NextResponse.json(
        {
          error:
            "We could not send that just now. Please email or call us directly — details are alongside this form.",
        },
        { status: 502 },
      );
    }
  }

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;
  if (endpoint) {
    try {
      const forwarded = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, receivedAt, source: `${site.domain}/contact` }),
      });
      if (!forwarded.ok) throw new Error(`Upstream responded ${forwarded.status}`);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[enquiry] Webhook delivery failed:", error);
      return NextResponse.json(
        { error: "We could not send that just now. Please email or call us directly." },
        { status: 502 },
      );
    }
  }

  console.error(
    "[enquiry] No mail transport configured. Set SMTP_HOST/PORT/USER/PASS (see .env.example). " +
      "Rejecting rather than silently dropping the enquiry.",
  );
  return NextResponse.json(
    {
      error:
        "Our enquiry form is not connected yet. Please email or call us directly — details are alongside this form.",
    },
    { status: 503 },
  );
}
