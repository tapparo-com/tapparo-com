import assert from "node:assert/strict";
import test from "node:test";
import { normalizeProseHeadings } from "../lib/prose-headings";

test("CMS headings form consecutive levels below the page title without changing content or type size", () => {
  const blocks = ["h3", "normal", "h5", "h6", "h5", "h3", "h1", "h4"].map((style, index) => ({
    _type: "block", _key: String(index), style, children: [{ text: `Original content ${index}` }],
  }));
  const before = structuredClone(blocks);
  const result = normalizeProseHeadings(blocks);
  assert.deepEqual(result.map(block => block.style), ["h2", "normal", "h3", "h4", "h3", "h2", "h2", "h3"]);
  assert.deepEqual(result.map(block => block.children), blocks.map(block => block.children));
  assert.equal((result[0] as any).originalHeadingStyle, "h3");
  assert.deepEqual(blocks, before);
});

test("non-text blocks are untouched and headings never exceed h6", () => {
  const image = { _type: "image", style: "h1" };
  const result = normalizeProseHeadings([image, ...[1, 2, 3, 4, 5, 6].map(n => ({ _type: "block", style: `h${n}` }))]);
  assert.equal(result[0], image);
  assert.equal(result.at(-1)?.style, "h6");
});
