import { enabledReasons, validateContactAnswers, type ContactAnswers, type ContactReason, type ContactSection } from "../contact";
import type { ContactMode } from "./config";

export type ContactSubmission = ContactAnswers & { documentId: string; sectionKey: string; submissionId: string; token: string; website: string };
export class ContactFailure extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}
export type ContactServices = {
  mode: ContactMode;
  origin: string;
  getSection: (documentId: string, sectionKey: string) => Promise<ContactSection | null>;
  limit: (request: Request, scope: "visitor" | "global") => Promise<void>;
  verify: (token: string, hostname: string) => Promise<boolean>;
  deliver: (submission: ContactSubmission, reason: ContactReason) => Promise<void>;
};
const unavailable = "Deine Anfrage konnte gerade nicht gesendet werden. Deine Angaben bleiben erhalten. Bitte versuche es später noch einmal oder schreib uns direkt per E-Mail.";
const response = (body: object, status = 200, retryAfter?: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}) } });

async function readSubmission(request: Request): Promise<ContactSubmission> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new ContactFailure(415, "Bitte sende deine Anfrage über das Kontaktformular.");
  const reader = request.body?.getReader();
  if (!reader) throw new ContactFailure(400, "Bitte fülle das Kontaktformular aus.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 32768) { await reader.cancel(); throw new ContactFailure(413, "Deine Nachricht ist zu lang. Bitte kürze sie und versuche es erneut."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  let value: unknown;
  try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new ContactFailure(400, "Bitte prüfe deine Angaben."); }
  const fields = ["reason", "name", "email", "message", "documentId", "sectionKey", "submissionId", "token", "website"];
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(key => !fields.includes(key)) || fields.some(key => typeof (value as Record<string, unknown>)[key] !== "string")) throw new ContactFailure(400, "Bitte prüfe deine Angaben.");
  const data = value as ContactSubmission;
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(data.documentId) || !/^[a-zA-Z0-9_-]{1,128}$/.test(data.sectionKey) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId) || data.token.length > 2048 || data.website.length > 200) throw new ContactFailure(400, "Bitte lade das Kontaktformular neu und versuche es erneut.");
  return data;
}

export async function handleContact(request: Request, services: ContactServices): Promise<Response> {
  try {
    if (services.mode === "disabled") throw new ContactFailure(503, unavailable);
    if (request.headers.get("origin") !== services.origin || request.headers.get("sec-fetch-site") === "cross-site") throw new ContactFailure(403, "Bitte öffne das Kontaktformular auf unserer Website.");
    if (services.mode === "live") await services.limit(request, "visitor");
    const submission = await readSubmission(request);
    if (submission.website) throw new ContactFailure(400, "Die Anfrage konnte nicht geprüft werden. Bitte schreib uns direkt per E-Mail.");
    const section = await services.getSection(submission.documentId, submission.sectionKey);
    if (!section?.privacySlug) throw new ContactFailure(503, unavailable);
    const reasons = enabledReasons(section.reasons);
    const errors = validateContactAnswers(submission, reasons);
    if (Object.keys(errors).length) return response({ ok: false, errors, ...(errors.reason ? { reasons } : {}), message: errors.reason ? "Die verfügbaren Anliegen wurden aktualisiert. Bitte wähle noch einmal; deine anderen Angaben bleiben erhalten." : "Bitte prüfe die markierten Angaben." }, 422);
    const normalized = { ...submission, name: submission.name.trim(), email: submission.email.trim(), message: submission.message.trim() };
    if (services.mode === "demo") return response({ ok: true, demo: true, reference: submission.submissionId });
    if (!submission.token || !await services.verify(submission.token, new URL(services.origin).hostname)) throw new ContactFailure(422, "Die Sicherheitsprüfung ist abgelaufen oder fehlgeschlagen. Bitte wiederhole sie und sende deine Anfrage erneut.");
    await services.limit(request, "global");
    await services.deliver(normalized, reasons.find(reason => reason.value === submission.reason)!);
    return response({ ok: true, reference: submission.submissionId });
  } catch (error) {
    if (error instanceof ContactFailure) return response({ ok: false, message: error.message }, error.status, error.retryAfter);
    // Provider errors may include personal data or credentials. Never return/log their payloads.
    console.error("[contact] submission service unavailable");
    return response({ ok: false, message: unavailable }, 503);
  }
}
