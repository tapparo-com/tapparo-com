import type { KeyedContentImage } from "./content";
import { urlFor } from "@/sanity/lib/image";

export type HeroImage = {
  id: string;
  src: string;
  alt: string;
  position?: string;
  aspectRatio?: number;
};

export type SanityHeroImage = KeyedContentImage;

// Sanity applies the editor's crop. CSS cover keeps the focal point in view
// as the viewport-dependent hero rectangle changes.
export function heroImage(
  source: SanityHeroImage,
  frame?: { width: number; height: number },
): HeroImage | null {
  if (!source.asset?._id) return null;
  const crop = source.crop || { left: 0, right: 0, top: 0, bottom: 0 };
  const hotspot = source.hotspot || { x: 0.5, y: 0.5 };
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  let x = clamp((hotspot.x - crop.left) / (1 - crop.left - crop.right));
  let y = clamp((hotspot.y - crop.top) / (1 - crop.top - crop.bottom));
  const assetDimensions = source.asset._id.match(/-(\d+)x(\d+)-/);
  const dimensions =
    source.asset.metadata?.dimensions ||
    (assetDimensions
      ? {
          width: Number(assetDimensions[1]),
          height: Number(assetDimensions[2]),
        }
      : undefined);
  const width = dimensions
    ? dimensions.width * (1 - crop.left - crop.right)
    : 0;
  const height = dimensions
    ? dimensions.height * (1 - crop.top - crop.bottom)
    : 0;
  const aspectRatio = width > 0 && height > 0 ? width / height : undefined;
  if (frame && dimensions && frame.width > 0 && frame.height > 0) {
    const scale = Math.max(frame.width / width, frame.height / height);
    x =
      width * scale > frame.width + 0.01
        ? clamp(
            (x * width * scale - frame.width / 2) /
              (width * scale - frame.width),
          )
        : 0.5;
    y =
      height * scale > frame.height + 0.01
        ? clamp(
            (y * height * scale - frame.height / 2) /
              (height * scale - frame.height),
          )
        : 0.5;
  }
  try {
    return {
      id: source._key,
      src: urlFor({ ...source, asset: { _ref: source.asset._id } })
        .width(Math.max(1, Math.min(3840, Math.round(width) || 3840)))
        .fit("max")
        .quality(80)
        .auto("format")
        .url(),
      alt: source.alt || "",
      position: `${x * 100}% ${y * 100}%`,
      aspectRatio,
    };
  } catch {
    return null;
  }
}

// Cover can render an image much wider than its clipped frame. Describe that
// rendered width to the browser; it applies devicePixelRatio itself.
export function heroImageSizes(
  image: Pick<HeroImage, "aspectRatio">,
  frame?: { width: number; height: number },
) {
  const ratio = image.aspectRatio || 1.5;
  if (frame && frame.width > 0 && frame.height > 0)
    return `${Math.ceil(Math.max(frame.width, frame.height * ratio))}px`;
  return `(min-width: 1024px) max(60vw, calc(100svh * ${ratio})), max(100vw, calc((100svh - 400px) * ${ratio}))`;
}
