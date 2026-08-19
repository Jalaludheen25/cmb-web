import { NextResponse } from "next/server";
import { enquiryTypes } from "@/lib/content";

/**
 * Enquiry intake.
 *
 * ⚠️  DELIVERY IS NOT CONFIGURED OUT OF THE BOX.
 *
 * This route deliberately returns 503 unless `ENQUIRY_WEBHOOK_URL` is set. A
 * contact form that accepts a submission, shows a success message and then
 * drops the lead on the floor is worse than no form at all — so this fails
 * loudly instead. To go live, set one of:
 *
 *   ENQUIRY_WEBHOOK_URL   A POST endpoint (CRM, Zapier, Make, Slack webhook,
 *                         Resend/SendGrid proxy) that receives the JSON body.
 *
 * and redeploy. Swap in a provider SDK here if you would rather send email
 * directly.
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

function asString(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Silently accept-and-discard bot submissions so they get no signal.
  if (asString(body.website, 100) !== "") {
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: asString(body.name, MAX.name),
    company: asString(body.company, MAX.company),
    email: asString(body.email, MAX.email),
    phone: asString(body.phone, MAX.phone),
    enquiry: asString(body.enquiry, 60),
    message: asString(body.message, MAX.message),
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

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;
  if (!endpoint) {
    console.error(
      "[enquiry] ENQUIRY_WEBHOOK_URL is not set — enquiry rejected rather than silently dropped.",
    );
    return NextResponse.json(
      {
        error:
          "Our enquiry form is not connected yet. Please email or call us directly — details are alongside this form.",
      },
      { status: 503 },
    );
  }

  try {
    const forwarded = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        receivedAt: new Date().toISOString(),
        source: "cmbcargo.ae/contact",
      }),
    });

    if (!forwarded.ok) throw new Error(`Upstream responded ${forwarded.status}`);
  } catch (error) {
    console.error("[enquiry] Failed to forward enquiry:", error);
    return NextResponse.json(
      { error: "We could not send that just now. Please email or call us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
