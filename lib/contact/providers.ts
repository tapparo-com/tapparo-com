import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Resend } from "resend";
import type { ContactReason } from "../contact";
import { ContactFailure, type ContactSubmission } from "./handler";

const ttl = 48 * 60 * 60;
type SubmissionRecord = { fingerprint: string; reasonLabel: string; created: number; sent?: boolean };
const escape = (text: string) => text.replace(/[&<>"']/g, value => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[value]!);
export function contactEmail(submission: ContactSubmission, reasonLabel: string) {
  const subject = `Website-Anfrage · ${reasonLabel.replace(/[\r\n\x00-\x1f\x7f]/g, " ").slice(0, 80)}`;
  const text = `Anliegen: ${reasonLabel}\nName: ${submission.name}\nE-Mail: ${submission.email}\n\n${submission.message}\n\nReferenz: ${submission.submissionId}`;
  return { subject, text, html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#181818"><h1 style="font-size:24px">Neue Anfrage über tapparo.com</h1><p><strong>Anliegen:</strong> ${escape(reasonLabel)}<br><strong>Name:</strong> ${escape(submission.name)}<br><strong>E-Mail:</strong> ${escape(submission.email)}</p><p style="white-space:pre-wrap">${escape(submission.message)}</p><p style="font-size:12px">Referenz: ${escape(submission.submissionId)}</p></div>` };
}

export function createContactProviders(env: Readonly<Record<string, string | undefined>> = process.env) {
  const redis = new Redis({ url: env.UPSTASH_REDIS_REST_URL!, token: env.UPSTASH_REDIS_REST_TOKEN!, retry: false, signal: () => AbortSignal.timeout(4000) });
  const visitor = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(8, "10 m"), prefix: "contact:visitor", analytics: false, timeout: 3000 });
  const global = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(80, "1 d"), prefix: "contact:global", analytics: false, timeout: 3000 });
  const resend = new Resend(env.RESEND_API_KEY);
  const digest = (value: string) => createHmac("sha256", env.CONTACT_RATE_LIMIT_SECRET!).update(value).digest("hex");
  return {
    async limit(request: Request, scope: "visitor" | "global") {
      const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim();
      if (scope === "visitor" && (!ip || !isIP(ip))) throw new Error("Missing trusted client address");
      const result = await (scope === "visitor" ? visitor.limit(digest(`${new Date().toISOString().slice(0, 10)}:${ip}`)) : global.limit("all"));
      await result.pending;
      if (result.reason === "timeout") throw new Error("Rate limiter unavailable");
      if (!result.success) throw new ContactFailure(429, "Gerade sind zu viele Anfragen eingegangen. Bitte versuche es später erneut oder schreib uns direkt per E-Mail.", Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)));
    },
    async verify(token: string, hostname: string) {
      const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }), signal: AbortSignal.timeout(5000), cache: "no-store",
      });
      if (!result.ok) throw new Error("Verification unavailable");
      const data = await result.json();
      return data.success === true && data.hostname === hostname && data.action === "contact";
    },
    async deliver(submission: ContactSubmission, reason: ContactReason) {
      const key = `contact:submission:${submission.submissionId}`;
      const fingerprint = digest(JSON.stringify([submission.documentId, submission.sectionKey, submission.reason, submission.name, submission.email, submission.message]));
      // Freeze the CMS label too: retries must produce identical provider payloads even after an owner edit.
      await redis.set(key, { fingerprint, reasonLabel: reason.label, created: Date.now() } satisfies SubmissionRecord, { nx: true, ex: ttl });
      const record = await redis.get<SubmissionRecord>(key);
      if (!record) throw new Error("Submission record unavailable");
      if (record.fingerprint !== fingerprint) throw new ContactFailure(409, "Diese Anfrage wurde bereits mit anderen Angaben verwendet. Bitte ändere deine Angaben und versuche es erneut.");
      if (record.sent) return;
      if (Date.now() - record.created > 23 * 60 * 60 * 1000) throw new ContactFailure(409, "Diese Anfrage ist zu alt für einen sicheren erneuten Versand. Bitte schreib uns direkt per E-Mail.");
      const result = await resend.emails.send({ from: env.CONTACT_FROM!, to: ["hello@tapparo.com"], replyTo: submission.email, ...contactEmail(submission, record.reasonLabel) }, { idempotencyKey: submission.submissionId });
      if (result.error || !result.data?.id) throw new Error("Email provider did not accept submission");
      await redis.set(key, { ...record, sent: true }, { ex: ttl });
      console.info("[contact] accepted", submission.submissionId);
    },
  };
}
