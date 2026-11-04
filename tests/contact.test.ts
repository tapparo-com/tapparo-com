import test from "node:test";
import assert from "node:assert/strict";
import { enabledReasons, initialContactReasons, validateContactAnswers, type ContactSection } from "../lib/contact";
import { contactMode } from "../lib/contact/config";
import { ContactFailure, handleContact, type ContactServices, type ContactSubmission } from "../lib/contact/handler";
import { contactEmail, createContactProviders } from "../lib/contact/providers";

const section: ContactSection = { _type: "sectionContactForm", _key: "contact", reasons: initialContactReasons, privacySlug: "impressum" };
const submission: ContactSubmission = { documentId: "page-id", sectionKey: "contact", submissionId: "d8821083-6125-4d22-a94d-e7a6092dd129", reason: "catering", name: "Ada Muster", email: "ada@example.com", message: "Catering für 20 Personen?\nAm Samstag in München.", token: "valid-token", website: "" };
function request(patch = {}, headers: Record<string, string> = {}) {
  return new Request("https://tapparo.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://tapparo.com", ...headers }, body: JSON.stringify({ ...submission, ...patch }) });
}
function services(overrides: Partial<ContactServices> = {}) {
  const calls: string[] = [];
  const dependencies: ContactServices = {
    mode: "live", origin: "https://tapparo.com",
    getSection: async () => { calls.push("cms"); return section; },
    limit: async (_request, scope) => { calls.push(scope); },
    verify: async () => { calls.push("verify"); return true; },
    deliver: async () => { calls.push("deliver"); },
    ...overrides,
  };
  return { calls, dependencies };
}

test("contact: only explicitly configured production can send live mail", () => {
  assert.equal(contactMode({ NODE_ENV: "development", NEXT_PUBLIC_SANITY_DATASET: "development" }), "demo");
  for (const env of [
    { VERCEL_ENV: "preview", NEXT_PUBLIC_SANITY_DATASET: "production", CONTACT_DELIVERY_MODE: "live" },
    { VERCEL_ENV: "production", NEXT_PUBLIC_SANITY_DATASET: "development", CONTACT_DELIVERY_MODE: "demo" },
    { VERCEL_ENV: "production", NEXT_PUBLIC_SANITY_DATASET: "production" },
    { NEXT_PUBLIC_SANITY_DATASET: "development", CONTACT_DELIVERY_MODE: "live" },
  ]) assert.equal(contactMode(env), "disabled");
  assert.equal(contactMode({ VERCEL_ENV: "production", NEXT_PUBLIC_SANITY_DATASET: "production", CONTACT_DELIVERY_MODE: "live" }), "live");
});

test("contact: validates CMS choices, control characters, long messages and international names", () => {
  assert.deepEqual(validateContactAnswers({ ...submission, name: "李 Müller O’Connor", email: "ada+event@example.com" }, initialContactReasons), {});
  assert.ok(validateContactAnswers({ ...submission, name: "Ada\r\nBcc: victim@example.com" }, initialContactReasons).name);
  assert.ok(validateContactAnswers({ ...submission, email: "ada@example.com\n" }, initialContactReasons).email);
  assert.ok(validateContactAnswers({ ...submission, message: "a".repeat(5001) }, initialContactReasons).message);
  assert.ok(validateContactAnswers({ ...submission, message: "   " }, initialContactReasons).message);
  const choices = enabledReasons([...initialContactReasons, { ...initialContactReasons[0], _key: "duplicate" }, { _key: "off", value: "off", label: "Off", enabled: false }]);
  assert.equal(choices.length, 3);
});

test("contact: checks origin, types, size and honeypot before delivery", async () => {
  for (const req of [request({}, { Origin: "https://attacker.example" }), request({ to: "victim@example.com" }), request({ email: ["ada@example.com"] }), request({ documentId: "drafts.page-id" }), request({ message: "a".repeat(33000) }), request({ website: "spam" }), request({}, { "Content-Type": "text/plain" })]) {
    const { calls, dependencies } = services();
    assert.ok((await handleContact(req, dependencies)).status >= 400);
    assert.ok(!calls.includes("deliver"));
  }
});

test("contact: updated/disabled CMS reason returns fresh choices without sending", async () => {
  const { calls, dependencies } = services({ getSection: async () => ({ ...section, reasons: initialContactReasons.map(reason => ({ ...reason, enabled: reason.value !== "catering" })) }) });
  const res = await handleContact(request(), dependencies);
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.ok(data.errors.reason);
  assert.ok(data.reasons.every((reason: { value: string }) => reason.value !== "catering"));
  assert.ok(!calls.includes("deliver"));
});

test("contact: demo validates content but cannot invoke providers", async () => {
  const { calls, dependencies } = services({ mode: "demo" });
  const res = await handleContact(request(), dependencies);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).demo, true);
  assert.deepEqual(calls, ["cms"]);
});

test("contact: only verified, rate-limited requests reach delivery", async () => {
  const { calls, dependencies } = services();
  const res = await handleContact(request(), dependencies);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).reference, submission.submissionId);
  assert.deepEqual(calls, ["visitor", "cms", "verify", "global", "deliver"]);
  assert.equal(res.headers.get("cache-control"), "no-store");
});

test("contact: missing/expired challenge, throttling and service failures never report success", async () => {
  const cases: Partial<ContactServices>[] = [
    { mode: "disabled" }, { verify: async () => false },
    { getSection: async () => null }, { getSection: async () => ({ ...section, privacySlug: null }) },
    { limit: async () => { throw new ContactFailure(429, "Bitte später versuchen.", 600); } },
    { deliver: async () => { throw new ContactFailure(503, "Provider unavailable"); } },
  ];
  for (const override of cases) {
    const { dependencies } = services(override);
    const res = await handleContact(request(), dependencies);
    assert.ok(res.status >= 400);
    assert.equal((await res.json()).ok, false);
    if (res.status === 429) assert.equal(res.headers.get("retry-after"), "600");
  }
  const { calls, dependencies } = services();
  assert.equal((await handleContact(request({ token: "" }), dependencies)).status, 422);
  assert.ok(!calls.includes("deliver"));
});

test("contact: email preserves text, escapes HTML and strips subject header injection", () => {
  const email = contactEmail({ ...submission, name: "<Ada>", message: '<script>alert("x")</script>\n& Danke' }, "Catering\r\nBcc: attacker");
  assert.ok(email.text.includes('<script>alert("x")</script>'));
  assert.ok(!email.html.includes("<script>"));
  assert.ok(email.html.includes("&lt;Ada&gt;"));
  assert.ok(!/[\r\n]/.test(email.subject));
});

test("contact: delivery retries retain the CMS label and key, and accepted requests are not resent", async (context) => {
  const records = new Map<string, string>();
  const sent: { body: Record<string, unknown>; key: string | null }[] = [];
  let firstAttempt = true;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith("https://redis.example")) {
      const execute = (command: unknown[]) => {
        const [method, key, value] = command as string[];
        if (method.toLowerCase() === "set") { if (!(command.includes("nx") && records.has(key))) records.set(key, value); return { result: "OK" }; }
        if (method.toLowerCase() === "get") return { result: records.get(key) || null };
        throw new Error(`Unexpected Redis command: ${method}`);
      };
      const commands = JSON.parse(init?.body as string);
      return Response.json(Array.isArray(commands[0]) ? commands.map(execute) : execute(commands));
    }
    if (url === "https://api.resend.com/emails") {
      sent.push({ body: JSON.parse(init?.body as string), key: new Headers(init?.headers).get("Idempotency-Key") });
      if (firstAttempt) { firstAttempt = false; return Response.json({ message: "Unknown delivery outcome", name: "application_error" }, { status: 500 }); }
      return Response.json({ id: "email-id" });
    }
    throw new Error(`Unexpected outgoing URL ${url}`);
  });
  const providers = createContactProviders({ UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "test", RESEND_API_KEY: "re_test", CONTACT_RATE_LIMIT_SECRET: "test-only", CONTACT_FROM: "Tapparo <website@notify.tapparo.com>" });
  await assert.rejects(providers.deliver(submission, initialContactReasons[0]));
  await providers.deliver(submission, { ...initialContactReasons[0], label: "Changed in CMS" });
  assert.equal(sent.length, 2);
  assert.deepEqual(sent[0], sent[1]);
  assert.deepEqual(sent[0].body.to, ["hello@tapparo.com"]);
  assert.equal(sent[0].body.reply_to, submission.email);
  await providers.deliver(submission, initialContactReasons[0]);
  assert.equal(sent.length, 2);
  await assert.rejects(providers.deliver({ ...submission, message: "Changed payload" }, initialContactReasons[0]), { status: 409 });
});

test("contact: Turnstile verification enforces hostname and action", async (context) => {
  let result = { success: true, hostname: "tapparo.com", action: "contact" };
  context.mock.method(globalThis, "fetch", async () => Response.json(result));
  const providers = createContactProviders({ UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "test", RESEND_API_KEY: "re_test", TURNSTILE_SECRET_KEY: "test" });
  assert.equal(await providers.verify("token", "tapparo.com"), true);
  result = { ...result, hostname: "attacker.example" };
  assert.equal(await providers.verify("token", "tapparo.com"), false);
  result = { ...result, hostname: "tapparo.com", action: "different" };
  assert.equal(await providers.verify("token", "tapparo.com"), false);
});
