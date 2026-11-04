import assert from "node:assert/strict";
import test from "node:test";
import { canIndexSite, serializeJsonLd, structuredHours } from "../lib/seo";
import { WEEKDAYS, type HoursSettings } from "../lib/opening-hours";

const hours = (): HoursSettings => ({
  weeklySchedule: Object.fromEntries(WEEKDAYS.map(day => [day, { closed: true }])),
  closedOnPublicHolidays: false,
});

test("only the production dataset outside a Vercel preview can be indexed", () => {
  assert.equal(canIndexSite({}), false);
  assert.equal(canIndexSite({ NEXT_PUBLIC_SANITY_DATASET: "development", VERCEL_ENV: "production" }), false);
  assert.equal(canIndexSite({ NEXT_PUBLIC_SANITY_DATASET: "production", VERCEL_ENV: "preview" }), false);
  assert.equal(canIndexSite({ NEXT_PUBLIC_SANITY_DATASET: "production", VERCEL_ENV: "production" }), true);
});

test("CMS text cannot close a JSON-LD script element", () => {
  const data = { name: '</script><script>alert("test")</script>', text: "< & > — Tapparo" };
  const result = serializeJsonLd(data);
  assert.ok(!result.includes("<"));
  assert.deepEqual(JSON.parse(result), data);
});

test("structured hours encode split service, overnight service and closed days", () => {
  const settings = hours();
  settings.weeklySchedule!.monday = { closed: false, periods: [{ start: "09:00", end: "12:00" }, { start: "18:00", end: "02:00", nextDay: true }] };
  const result = structuredHours(settings, 2026).openingHoursSpecification!;
  assert.deepEqual(result.slice(0, 2).map(day => [day.opens, day.closes]), [["09:00", "12:00"], ["18:00", "02:00"]]);
  assert.equal(result[0].dayOfWeek, "https://schema.org/Monday");
  assert.equal(result[2].opens, "00:00");
  assert.equal(result[2].closes, "00:00");
});

test("structured date exceptions override holidays and closures take precedence", () => {
  const settings = hours();
  settings.closedOnPublicHolidays = true;
  settings.dateExceptions = [{ date: "2026-12-25", closed: false, periods: [{ start: "10:00", end: "14:00" }] }];
  let special = structuredHours(settings, 2026).specialOpeningHoursSpecification!;
  assert.equal(special.find(day => day.validFrom === "2026-12-25")?.opens, "10:00");
  assert.equal(special.find(day => day.validFrom === "2027-01-01")?.closes, "00:00");
  settings.temporaryClosures = [{ startDate: "2026-12-24", endDate: "2026-12-26" }];
  special = structuredHours(settings, 2026).specialOpeningHoursSpecification!;
  assert.ok(!special.some(day => day.validFrom === "2026-12-25"));
  assert.deepEqual(special.at(-1), { "@type": "OpeningHoursSpecification", opens: "00:00", closes: "00:00", validFrom: "2026-12-24", validThrough: "2026-12-26" });
});

test("unmigrated, invalid and ambiguous 24-hour schedules are omitted", () => {
  assert.deepEqual(structuredHours({ openingHours: [{ _key: "a", day: "Montag", hours: "9 bis 18 Uhr" }] }, 2026), {});
  const settings = hours();
  settings.weeklySchedule!.monday = { closed: false, periods: [{ start: "oops", end: "18:00" }] };
  assert.deepEqual(structuredHours(settings, 2026), {});
  settings.weeklySchedule!.monday = { closed: false, periods: [{ start: "00:00", end: "00:00", nextDay: true }] };
  assert.deepEqual(structuredHours(settings, 2026), {});
});
