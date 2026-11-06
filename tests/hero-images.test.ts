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

test("responsive sources account for cover width, crop and native resolution", async () => {
  const { heroImage, heroImageSizes } = await implementation;
  const landscape = heroImage({ ...source, crop: { left: 0, right: 0, top: .2, bottom: .2 } })!;
  assert(Math.abs(landscape.aspectRatio! - 1 / .6) < 1e-10);
  assert.equal(heroImageSizes(landscape, { width: 355, height: 560 }), "934px");
  assert.equal(heroImageSizes(landscape, { width: 1200, height: 500 }), "1200px");
  assert.equal(new URL(landscape.src).searchParams.get("w"), "1000");
  assert.equal(new URL(landscape.src).searchParams.get("fit"), "max");
  const cropped = heroImage({ ...source, crop: { left: .1, right: .2, top: 0, bottom: 0 } })!;
  assert.equal(new URL(cropped.src).searchParams.get("w"), "700");
  const large = heroImage({ ...source, asset: { _id: "image-0000000000000000000000000000000000000000-6000x4000-jpg", url: "" } })!;
  assert.equal(large.aspectRatio, 1.5);
  assert.equal(new URL(large.src).searchParams.get("w"), "3840");
  assert.match(heroImageSizes(large), /100svh/);
});
