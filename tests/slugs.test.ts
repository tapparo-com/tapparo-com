import assert from "node:assert/strict";
import { test } from "node:test";
import type { SlugValidationContext } from "sanity";
import { isUniqueSlug } from "../sanity/schemaTypes/slug-field";

test("Studio uniqueness uses uncached raw data and excludes only versions of the current document", async () => {
  let matches = [
    { _id: "one" },
    { _id: "drafts.one" },
    { _id: "versions.release.one" },
  ];
  const context = {
    document: { _id: "drafts.one", _type: "post" },
    getClient: () => ({
      fetch: async (
        _query: string,
        params: { types: string[]; slug: string },
        options: unknown,
      ) => {
        assert.deepEqual(params, {
          types: ["page", "post", "legalPage"],
          slug: "impressum",
        });
        assert.deepEqual(options, { perspective: "raw", useCdn: false });
        return matches;
      },
    }),
  } as unknown as SlugValidationContext;
  assert.equal(await isUniqueSlug("Impressum", context), true);
  matches = [...matches, { _id: "drafts.another-document" }];
  assert.equal(await isUniqueSlug("Impressum", context), false);
});
