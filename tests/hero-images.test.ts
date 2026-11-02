import test from "node:test";
import assert from "node:assert/strict";

// URL construction only; these tests never request an asset or connect to Sanity.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= "testproject";
process.env.NEXT_PUBLIC_SANITY_DATASET ||= "development";
const implementation = import("../lib/hero-images");
const source = {
  _key: "owner-choice", alt: "Owner description",
  asset: { _id: "image-0000000000000000000000000000000000000000-1000x1000-jpg", url: "", metadata: { dimensions: { width: 1000, height: 1000 } } },
};

test("hero delivery preserves the CMS crop and alt text without substituting images", async () => {
  const { heroImage } = await implementation;
  const image = heroImage({ ...source, crop: { left: .1, right: .2, top: .1, bottom: .1 } })!;
  assert.equal(new URL(image.src).searchParams.get("rect"), "100,100,700,800");
  assert.equal(image.alt, source.alt);
  assert.equal(image.id, source._key);
  assert.equal(heroImage({ _key: "unfinished" }), null);
  assert.equal(heroImage({ ...source, asset: { ...source.asset, _id: "invalid" } }), null);
});

test("responsive cover centers the cropped focal point and clamps at image edges", async () => {
  const { heroImage } = await implementation;
  const image = { ...source, hotspot: { x: .7, y: .5, width: .1, height: .1 } };
  assert.equal(heroImage(image, { width: 200, height: 1000 })!.position, "75% 50%");
  assert.equal(heroImage({ ...image, crop: { left: .1, right: .2, top: .1, bottom: .1 } }, { width: 200, height: 800 })!.position, "100% 50%");
  assert.equal(heroImage(source, { width: 1000, height: 200 })!.position, "50% 50%");
});
