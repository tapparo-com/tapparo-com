import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeTickerPhrases,
  resolveContent,
  type ContentLookup,
} from "../lib/content";

test("an unset or cleared CMS ticker stays hidden; authored phrases keep their order", () => {
  assert.deepEqual(normalizeTickerPhrases(null), []);
  assert.deepEqual(normalizeTickerPhrases(undefined), []);
  assert.deepEqual(normalizeTickerPhrases([]), []);
  assert.deepEqual(normalizeTickerPhrases([" Caffè ", "", "  ", "Focaccia"]), [
    "Caffè",
    "Focaccia",
  ]);
});

test("route resolution preserves page, story, legal precedence and stops after a match", async () => {
  const calls: string[] = [];
  const lookup: ContentLookup = {
    page: async (slug) => {
      calls.push(`page:${slug}`);
      return { _id: "page", title: "Page", sections: [] };
    },
    post: async (slug) => {
      calls.push(`post:${slug}`);
      return { _id: "post", title: "Story", slug };
    },
    legal: async (slug) => {
      calls.push(`legal:${slug}`);
      return { _id: "legal", title: "Legal", slug };
    },
  };
  assert.equal((await resolveContent("about", lookup))?.kind, "page");
  assert.deepEqual(calls, ["page:about"]);
  calls.length = 0;
  lookup.page = async (slug) => {
    calls.push(`page:${slug}`);
    return null;
  };
  assert.equal((await resolveContent("story", lookup))?.kind, "post");
  assert.deepEqual(calls, ["page:story", "post:story"]);
  calls.length = 0;
  lookup.post = async (slug) => {
    calls.push(`post:${slug}`);
    return null;
  };
  assert.equal((await resolveContent("impressum", lookup))?.kind, "legal");
  assert.deepEqual(calls, [
    "page:impressum",
    "post:impressum",
    "legal:impressum",
  ]);
  lookup.legal = async () => null;
  assert.equal(await resolveContent("missing", lookup), null);
});

test("a CMS outage propagates instead of rendering a different content type or a false 404", async () => {
  await assert.rejects(
    resolveContent("about", {
      page: async () => {
        throw new Error("CMS unavailable");
      },
      post: async () => assert.fail("should not fall through after an outage"),
      legal: async () => assert.fail("should not fall through after an outage"),
    }),
    /CMS unavailable/,
  );
});
