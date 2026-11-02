import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config, middleware } from "../middleware";
import { absoluteSiteUrl, canonicalPublicPath, normalizeInternalHref, pathForSlug, slugifyTitle, validateSlug } from "../lib/urls";

test("mixed case and a trailing slash redirect together, preserving the query exactly", () => {
  const response = middleware(new NextRequest("https://tapparo.com/IMPressum/?Campaign=Summer%2FSale&code=AbC"));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://tapparo.com/impressum?Campaign=Summer%2FSale&code=AbC");
  const again = middleware(new NextRequest(response.headers.get("location")!));
  assert.equal(again.headers.get("location"), null);
});

test("canonical paths, home aliases, repeated slashes, and encoded ASCII slugs", () => {
  for (const [input, expected] of [
    ["/", "/"], ["/menu", "/menu"], ["/Home/", "/"], ["/MENU/", "/menu"],
    ["//Stories///", "/stories"], ["/%49mpressum/", "/impressum"],
    ["/No-Such-Page", "/no-such-page"], ["/Foo%2fBar", "/foo%2Fbar"],
    ["/%E0%A4%A", "/%E0%A4%A"],
  ]) assert.equal(canonicalPublicPath(input), expected, input);
});

test("middleware excludes infrastructure and case-sensitive resources", () => {
  for (const path of ["/studio", "/studio/desk/AbC", "/api/Hook", "/_next/static/AbC.js", "/_vercel/insights", "/Logo.SVG", "/sitemap.xml", "/robots.txt"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: path }), false, path);
    assert.equal(middleware(new NextRequest(`https://tapparo.com${path}`)).headers.get("location"), null);
  }
  for (const path of ["/Studio/desk/AbC", "/%73tudio/desk/AbC", "/API/Secret", "/assets/My%2ESVG"]) {
    assert.equal(canonicalPublicPath(path), path);
  }
  for (const path of ["/Impressum", "/Menu/", "/home", "/strayorigin"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: path }), true, path);
  }
});

test("new slugs have predictable German transliteration and valid boundaries", () => {
  assert.equal(slugifyTitle("  Focaccia für München: Öl, Äpfel & Spaß!  "), "focaccia-fuer-muenchen-oel-aepfel-spass");
  assert.equal(slugifyTitle("Café / Déjà vu"), "cafe-deja-vu");
  const long = slugifyTitle("a".repeat(95) + " & more");
  assert.equal(long.length, 95);
  assert.equal(validateSlug(long, "post"), true);
});

test("manual slugs cannot bypass format, length, or reserved-route rules", () => {
  for (const slug of ["Impressum", " space", "foo/bar", "foo--bar", "-foo", "foo-", "über", "foo?x", "foo#bar", "a".repeat(97), ""]) {
    assert.notEqual(validateSlug(slug, "post"), true, slug);
  }
  for (const type of ["page", "post", "legalPage"]) {
    for (const slug of ["menu", "stories", "order", "design-preview", "studio", "api", "opengraph-image"]) {
      assert.notEqual(validateSlug(slug, type), true, `${type}:${slug}`);
    }
  }
  assert.equal(validateSlug("home", "page"), true);
  assert.notEqual(validateSlug("home", "post"), true);
  assert.equal(validateSlug("menu", "menuCategory"), true);
});

test("site URL joining removes duplicate slashes and internal links retain queries and fragments", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://tapparo.com/";
  try {
    assert.equal(absoluteSiteUrl("//menu/"), "https://tapparo.com/menu");
    assert.equal(new URL(absoluteSiteUrl("\\\\other.example")).origin, "https://tapparo.com");
    assert.equal(absoluteSiteUrl("/sitemap.xml"), "https://tapparo.com/sitemap.xml");
    assert.equal(pathForSlug("Home"), "/");
    assert.equal(pathForSlug("Impressum"), "/impressum");
    assert.equal(normalizeInternalHref("/Menu/?Campaign=AbC#focaccia"), "/menu?Campaign=AbC#focaccia");
    assert.equal(normalizeInternalHref("https://tapparo.com/Impressum?x=AbC#Section"), "https://tapparo.com/impressum?x=AbC#Section");
    for (const href of ["https://other.example/AbC", "//other.example/AbC", "mailto:Name@example.com", "tel:+49123", "#MyAnchor", "/studio/AbC", "/Logo.SVG"]) {
      assert.equal(normalizeInternalHref(href), href);
    }
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});
