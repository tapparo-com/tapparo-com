import { urlFor } from "@/sanity/lib/image";
import type { HeroImage } from "@/components/hero/types";

export type SanityHeroImage = {
  _key: string;
  alt?: string;
  asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
  crop?: { left: number; right: number; top: number; bottom: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
};

// Sanity applies the editor's crop. CSS cover keeps the focal point in view
// as the viewport-dependent hero rectangle changes.
export function heroImage(source: SanityHeroImage, frame?: { width: number; height: number }): HeroImage | null {
  if (!source.asset?._id) return null;
  const crop = source.crop || { left: 0, right: 0, top: 0, bottom: 0 };
  const hotspot = source.hotspot || { x: .5, y: .5 };
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  let x = clamp((hotspot.x - crop.left) / (1 - crop.left - crop.right));
  let y = clamp((hotspot.y - crop.top) / (1 - crop.top - crop.bottom));
  const dimensions = source.asset.metadata?.dimensions;
  if (frame && dimensions && frame.width > 0 && frame.height > 0) {
    const width = dimensions.width * (1 - crop.left - crop.right);
    const height = dimensions.height * (1 - crop.top - crop.bottom);
    const scale = Math.max(frame.width / width, frame.height / height);
    x = width * scale > frame.width + .01 ? clamp((x * width * scale - frame.width / 2) / (width * scale - frame.width)) : .5;
    y = height * scale > frame.height + .01 ? clamp((y * height * scale - frame.height / 2) / (height * scale - frame.height)) : .5;
  }
  try {
    return { id: source._key, src: urlFor({ ...source, asset: { _ref: source.asset._id } }).width(2400).quality(80).auto("format").url(), alt: source.alt || "", position: `${x * 100}% ${y * 100}%` };
  } catch { return null; }
}
