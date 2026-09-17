/**
 * End-to-end test of the enquiry form, through a real browser and a real SMTP
 * conversation.
 *
 *   node scripts/enquiry-e2e.mjs [baseUrl]
 *
 * Starts a throwaway SMTP server on 127.0.0.1:2525, fills in the form in
 * Chromium exactly as a visitor would, clicks Send, and then asserts on the
 * message the server actually received — recipient, Reply-To, subject and body.
 *
 * The site under test must be running with its SMTP_* variables pointed at this
 * catcher; `npm run enquiry:test` wires that up.
 */
import { chromium } from "playwright";
import { SMTPServer } from "smtp-server";
import { spawn } from "node:child_process";

const PORT = 2525;
const APP_PORT = Number(process.env.E2E_PORT ?? 3111);
const BASE = process.argv[2] ?? `http://localhost:${APP_PORT}`;
/** Pass a base URL to test a server you started yourself. */
const spawnServer = process.argv.length < 3;

const received = [];

/** Boots `next start` with SMTP pointed at the catcher below, so the whole
 *  path — browser, route handler, nodemailer, SMTP — is exercised for real. */
let server;
async function startServer() {
  server = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["next", "start", "-p", String(APP_PORT)],
    {
      env: {
        ...process.env,
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: String(PORT),
        SMTP_USER: "enquiry@cmbcargo.ae",
        SMTP_PASS: "test-password",
        SMTP_SECURE: "false",
      },
      stdio: "ignore",
      shell: process.platform === "win32",
    },
  );
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE}/contact`);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

const smtp = new SMTPServer({
  authOptional: true,
  disabledCommands: ["STARTTLS"],
  onAuth(auth, _session, callback) {
    callback(null, { user: auth.username });
  },
  onData(stream, session, callback) {
    let raw = "";
    stream.on("data", (chunk) => (raw += chunk));
    stream.on("end", () => {
      received.push({ raw, envelopeTo: session.envelope.rcptTo.map((r) => r.address) });
      callback();
    });
  },
});

await new Promise((resolve) => smtp.listen(PORT, "127.0.0.1", resolve));
console.log(`SMTP catcher listening on 127.0.0.1:${PORT}`);
if (spawnServer) {
  await startServer();
  console.log(`app under test on ${BASE}\n`);
} else {
  console.log(`testing existing server at ${BASE}\n`);
}

const results = [];
const check = (label, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 945 } });
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(e.message));
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));

await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// ── 1. Validation still blocks an empty submit ──────────────────────────────
await page.getByRole("button", { name: /Send enquiry/i }).click();
await page.waitForTimeout(500);
check(
  "empty submit is blocked",
  (await page.locator('input[name="name"]').getAttribute("aria-invalid")) === "true",
);

// ── 2. A bad email is caught before it reaches the network ──────────────────
await page.locator('input[name="name"]').fill("Ayesha Rahman");
await page.locator('input[name="email"]').fill("not-an-email");
await page.locator('textarea[name="message"]').fill("Two 40ft HC, Jebel Ali to Colombo.");
await page.getByRole("button", { name: /Send enquiry/i }).click();
await page.waitForTimeout(500);
check(
  "malformed email is rejected",
  (await page.locator('input[name="email"]').getAttribute("aria-invalid")) === "true",
);

// ── 3. The real thing ───────────────────────────────────────────────────────
const MESSAGE = "Two 40ft HC from Jebel Ali to Colombo, ready 3 October. Please quote all-in.";
await page.locator('input[name="email"]').fill("ayesha@example.com");
await page.locator('input[name="company"]').fill("Rahman Trading LLC");
await page.locator('input[name="phone"]').fill("+94 77 000 0000");
await page.locator('textarea[name="message"]').fill(MESSAGE);
await page.selectOption('select[name="enquiry"]', { label: "Sea freight (FCL/LCL)" }).catch(() => {});
await page.getByRole("button", { name: /Send enquiry/i }).click();

// Wait for either the success banner or an error to settle.
await page.waitForTimeout(3500);
const status = (await page.locator('[aria-live="polite"]').textContent())?.trim() ?? "";

check("success message shown to the visitor", /thank you/i.test(status), status.slice(0, 80));
check("no error banner", !/not connected|could not send/i.test(status));
check("form was reset after sending", (await page.locator('input[name="name"]').inputValue()) === "");

// ── 4. The mail actually arrived ────────────────────────────────────────────
check("exactly one message delivered", received.length === 1, `${received.length} received`);

if (received.length) {
  const { raw, envelopeTo } = received[0];
  const header = raw.split(/\r?\n\r?\n/)[0];
  // Long headers are folded across lines; unfold before matching.
  const unfolded = header.replace(/\r?\n[ \t]+/g, " ");
  // The em dashes push the subject out of ASCII, so it arrives as RFC 2047
  // encoded words — which may be either B (base64) or Q (quoted-printable),
  // split into several adjacent chunks. Handle both, and drop the whitespace
  // between adjacent encoded words as the spec requires.
  const subject = /Subject: (.*)/.exec(unfolded)?.[1] ?? "";
  const decodedSubject = subject
    .replace(/\?=\s+=\?/g, "?==?")
    .replace(/=\?UTF-8\?([BQ])\?(.+?)\?=/gi, (_, enc, payload) =>
      enc.toUpperCase() === "B"
        ? Buffer.from(payload, "base64").toString("utf8")
        : Buffer.from(
            payload.replace(/_/g, " ").replace(/=([0-9A-F]{2})/gi, (__, h) =>
              String.fromCharCode(parseInt(h, 16)),
            ),
            "binary",
          ).toString("utf8"),
    );

  check("delivered to the sales mailbox", envelopeTo.includes("enquiry@cmbcargo.ae"),
    envelopeTo.join(", "));
  check("Reply-To is the enquirer", /Reply-To:.*ayesha@example\.com/i.test(unfolded));
  check("From is the authenticated mailbox, not spoofed",
    /From:.*enquiry@cmbcargo\.ae/i.test(unfolded) && !/From:.*ayesha@example/i.test(unfolded));
  check("subject names the enquiry and sender",
    /Ayesha Rahman/.test(decodedSubject) && /Sea freight/i.test(decodedSubject),
    decodedSubject.slice(0, 70));

  // Body is quoted-printable; soft line breaks split words across lines.
  const body = raw.replace(/=\r?\n/g, "").replace(/=([0-9A-F]{2})/g, (_, h) =>
    String.fromCharCode(parseInt(h, 16)));
  check("message body carries the enquiry text", body.includes("ready 3 October"));
  check("company and phone included", body.includes("Rahman Trading LLC") && body.includes("+94 77 000 0000"));
}

// ── 5. Honeypot submissions are swallowed, not delivered ────────────────────
const before = received.length;
const bot = await page.evaluate(async (base) => {
  const r = await fetch(`${base}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Bot", email: "bot@example.com", message: "buy cheap things now",
      website: "http://spam.example",
    }),
  });
  return r.status;
}, BASE);
await page.waitForTimeout(800);
check("honeypot accepted but not delivered", bot === 200 && received.length === before,
  `status ${bot}, ${received.length - before} new mail`);

check("no console errors on the contact page", consoleErrors.length === 0,
  consoleErrors.slice(0, 2).join(" | "));

await browser.close();
await new Promise((resolve) => smtp.close(resolve));
server?.kill();

const failed = results.filter((r) => !r).length;
console.log(`\n${failed === 0 ? "PASS" : "FAIL"}  ${results.length - failed}/${results.length} checks`);
process.exit(failed === 0 ? 0 : 1);
