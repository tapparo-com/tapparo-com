import assert from "node:assert/strict";
import { test } from "node:test";
import type { SlugValidationContext } from "sanity";
import { auditSlugs, type SlugDocument } from "../sanity/lib/slug-audit";
import { isUniqueSlug } from "../sanity/schemaTypes/slug-field";

const doc = (id: string, type: string, slug?: string): SlugDocument => ({
  _id: id, _rev: "original-revision", _type: type, slug: slug ? { current: slug } : undefined,
});

test("case-only migration preserves IDs and revisions without generating replacement slugs", () => {
  const documents = [doc("legal-id", "legalPage", "Impressum"), doc("drafts.legal-id", "legalPage", "IMPRESSUM"), doc("story-id", "post", "strayorigin")];
  const original = structuredClone(documents);
  const report = auditSlugs(documents);
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.changes, [
    { id: "legal-id", revision: "original-revision", before: "Impressum", after: "impressum" },
    { id: "drafts.legal-id", revision: "original-revision", before: "IMPRESSUM", after: "impressum" },
  ]);
  assert.deepEqual(documents, original);
  assert.equal(auditSlugs([doc("legal-id", "legalPage", "impressum")]).changes.length, 0);
});

test("case-insensitive collisions are caught across pages, posts, legal pages and drafts", () => {
  const report = auditSlugs([doc("one", "page", "hello"), doc("drafts.two", "post", "HELLO"), doc("three", "legalPage", "hello")]);
  assert.equal(report.errors.length, 1);
  assert.match(report.errors[0].message, /collision/);
});

test("versions of one document are not collisions; anchors have their own namespace", () => {
  const report = auditSlugs([
    doc("one", "page", "focaccia"), doc("drafts.one", "page", "focaccia"),
    doc("versions.release.one", "page", "focaccia"), doc("category", "menuCategory", "focaccia"),
  ]);
  assert.deepEqual(report.errors, []);
  assert.equal(auditSlugs([doc("one", "menuCategory", "wine"), doc("two", "menuCategory", "WINE")]).errors.length, 1);
});

test("unsafe migrations fail, while unfinished drafts remain untouched", () => {
  const report = auditSlugs([
    doc("bad-path", "post", "Foo/Bar"), doc("reserved", "page", "Menu"),
    doc("missing", "post"), doc("drafts.unfinished", "page"),
  ]);
  assert.equal(report.errors.length, 3);
  assert.equal(report.warnings.length, 1);
  assert.equal(report.changes.length, 0);
});

test("Studio uniqueness uses uncached raw data and excludes only versions of the current document", async () => {
  let matches = [{ _id: "one" }, { _id: "drafts.one" }, { _id: "versions.release.one" }];
  const context = {
    document: { _id: "drafts.one", _type: "post" },
    getClient: () => ({ fetch: async (_query: string, params: { types: string[]; slug: string }, options: unknown) => {
      assert.deepEqual(params, { types: ["page", "post", "legalPage"], slug: "impressum" });
      assert.deepEqual(options, { perspective: "raw", useCdn: false });
      return matches;
    } }),
  } as unknown as SlugValidationContext;
  assert.equal(await isUniqueSlug("Impressum", context), true);
  matches = [...matches, { _id: "drafts.another-document" }];
  assert.equal(await isUniqueSlug("Impressum", context), false);
});
