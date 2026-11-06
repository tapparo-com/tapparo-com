import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveHeroSecondaryLink } from "../lib/hero-links";

test("an optional hero link requires enablement, authored wording and a resolved page", () => {
  for (const link of [
    undefined,
    null,
    {},
    { enabled: false, label: "alle stories", slug: "stories" },
    { enabled: true, label: " ", slug: "stories" },
    { enabled: true, label: "alle stories", slug: null },
    { enabled: true, label: "alle stories", slug: "" },
  ])
    assert.equal(resolveHeroSecondaryLink(link), null);
});

test("hero links use the author's exact wording and canonical internal destination", () => {
  for (const [label, slug, href] of [
    ["Speisekarte", "menu", "/menu"],
    ["alle stories", "stories", "/stories"],
    ["Schreib uns", "kontakt", "/kontakt"],
    ["Unsere neue Seite", "neue-seite", "/neue-seite"],
    ["Home", "home", "/"],
    ["Rechtliches", "Impressum", "/impressum"],
  ])
    assert.deepEqual(resolveHeroSecondaryLink({ enabled: true, label, slug }), {
      label,
      href,
    });
});
