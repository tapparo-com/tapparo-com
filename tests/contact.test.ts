import test from "node:test";
import assert from "node:assert/strict";
import {
  enabledReasons,
  initialContactReasons,
  validateContactAnswers,
  type ContactSection,
} from "../lib/contact";
import { contactMode } from "../lib/contact/config";
import {
  handleContact,
  type ContactServices,
  type ContactSubmission,
} from "../lib/contact/handler";

const section: ContactSection = {
  _type: "sectionContactForm",
  _key: "contact",
  reasons: initialContactReasons,
  privacySlug: "impressum",
};
const submission: ContactSubmission = {
  documentId: "page-id",
  sectionKey: "contact",
  reason: "catering",
  name: "Ada Muster",
  email: "ada@example.com",
  message: "Catering für 20 Personen?\nAm Samstag in München.",
  website: "",
};
function request(patch = {}, headers: Record<string, string> = {}) {
  return new Request("https://tapparo.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://tapparo.com",
      ...headers,
    },
    body: JSON.stringify({ ...submission, ...patch }),
  });
}
function services(overrides: Partial<ContactServices> = {}) {
  const calls: string[] = [];
  const dependencies: ContactServices = {
    mode: "demo",
    origin: "https://tapparo.com",
    getSection: async () => {
      calls.push("cms");
      return section;
    },
    ...overrides,
  };
  return { calls, dependencies };
}

test("contact: demo is limited to development data; production and live mode stay disabled", () => {
  assert.equal(
    contactMode({
      NODE_ENV: "development",
      NEXT_PUBLIC_SANITY_DATASET: "development",
    }),
    "demo",
  );
  for (const env of [
    {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      CONTACT_DELIVERY_MODE: "live",
    },
    {
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SANITY_DATASET: "development",
      CONTACT_DELIVERY_MODE: "demo",
    },
    { VERCEL_ENV: "production", NEXT_PUBLIC_SANITY_DATASET: "production" },
    {
      NEXT_PUBLIC_SANITY_DATASET: "development",
      CONTACT_DELIVERY_MODE: "live",
    },
  ])
    assert.equal(contactMode(env), "disabled");
  assert.equal(
    contactMode({
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      CONTACT_DELIVERY_MODE: "live",
    }),
    "disabled",
  );
});

test("contact: validates CMS choices, control characters, long messages and international names", () => {
  assert.deepEqual(
    validateContactAnswers(
      {
        ...submission,
        name: "李 Müller O’Connor",
        email: "ada+event@example.com",
      },
      initialContactReasons,
    ),
    {},
  );
  assert.ok(
    validateContactAnswers(
      { ...submission, name: "Ada\r\nBcc: victim@example.com" },
      initialContactReasons,
    ).name,
  );
  assert.ok(
    validateContactAnswers(
      { ...submission, email: "ada@example.com\n" },
      initialContactReasons,
    ).email,
  );
  assert.ok(
    validateContactAnswers(
      { ...submission, message: "a".repeat(5001) },
      initialContactReasons,
    ).message,
  );
  assert.ok(
    validateContactAnswers(
      { ...submission, message: "   " },
      initialContactReasons,
    ).message,
  );
  const choices = enabledReasons([
    ...initialContactReasons,
    { ...initialContactReasons[0], _key: "duplicate" },
    { _key: "off", value: "off", label: "Off", enabled: false },
  ]);
  assert.equal(choices.length, 3);
});

test("contact: checks origin, types, size and honeypot before reading CMS", async () => {
  for (const req of [
    request({}, { Origin: "https://attacker.example" }),
    request({}, { "Sec-Fetch-Site": "cross-site" }),
    request({ message: undefined }),
    request({ to: "victim@example.com" }),
    request({ email: ["ada@example.com"] }),
    request({ documentId: "drafts.page-id" }),
    request({ message: "a".repeat(33000) }),
    request({ website: "spam" }),
    request({}, { "Content-Type": "text/plain" }),
  ]) {
    const { calls, dependencies } = services();
    assert.ok((await handleContact(req, dependencies)).status >= 400);
    assert.deepEqual(calls, []);
  }
});

test("contact: updated/disabled CMS reason returns fresh choices without sending", async () => {
  const { calls, dependencies } = services({
    getSection: async () => ({
      ...section,
      reasons: initialContactReasons.map((reason) => ({
        ...reason,
        enabled: reason.value !== "catering",
      })),
    }),
  });
  const res = await handleContact(request(), dependencies);
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.ok(data.errors.reason);
  assert.ok(
    data.reasons.every(
      (reason: { value: string }) => reason.value !== "catering",
    ),
  );
  assert.deepEqual(calls, []);
});

test("contact: valid demo submission returns an explicit no-email confirmation", async () => {
  const { calls, dependencies } = services({ mode: "demo" });
  const res = await handleContact(request(), dependencies);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, demo: true });
  assert.equal(res.headers.get("cache-control"), "no-store");
  assert.deepEqual(calls, ["cms"]);
});

test("contact: disabled mode and missing published form/privacy never report success", async () => {
  const disabled = services({ mode: "disabled" });
  const result = await handleContact(request(), disabled.dependencies);
  assert.equal(result.status, 503);
  assert.equal((await result.json()).ok, false);
  assert.deepEqual(disabled.calls, []);
  for (const value of [null, { ...section, privacySlug: null }]) {
    const { dependencies } = services({ getSection: async () => value });
    const res = await handleContact(request(), dependencies);
    assert.equal(res.status, 503);
    assert.equal((await res.json()).ok, false);
  }
});

test("contact: CMS failures return a recoverable error without exposing service details", async (context) => {
  const log = context.mock.method(console, "error", () => {});
  const { dependencies } = services({
    getSection: async () => {
      throw new Error("private service details");
    },
  });
  const res = await handleContact(request(), dependencies);
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.doesNotMatch(body.message, /private service details/);
  assert.deepEqual(log.mock.calls[0].arguments, [
    "[contact] submission service unavailable",
  ]);
});
