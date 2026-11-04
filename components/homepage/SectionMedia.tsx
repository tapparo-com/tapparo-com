import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import styles from "./Homepage.module.css";

export type SectionImage = {
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  } | null;
  alt?: string | null;
  crop?: { left: number; right: number; top: number; bottom: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
};
export function SectionMedia({
  image,
  ratio = 4 / 3,
  natural = false,
  sizes = "(max-width: 767px) 100vw, 55vw",
  maxWidth = 1600,
}: {
  image: SectionImage;
  ratio?: number;
  natural?: boolean;
  sizes?: string;
  maxWidth?: number;
}) {
  if (!image.asset) return null;
  const dimensions = image.asset.metadata?.dimensions;
  const crop = image.crop;
  const nativeWidth = dimensions
    ? dimensions.width * (1 - (crop?.left || 0) - (crop?.right || 0))
    : 1600;
  const nativeHeight = dimensions
    ? dimensions.height * (1 - (crop?.top || 0) - (crop?.bottom || 0))
    : 1200;
  const aspect = natural ? nativeWidth / nativeHeight : ratio;
  const width = Math.max(1, Math.min(maxWidth, Math.round(nativeWidth)));
  const source = urlFor(image).width(width).quality(85).auto("format");
  const src = (
    natural ? source : source.height(Math.round(width / aspect)).fit("crop")
  ).url();
  return (
    <div
      className={styles.media}
      style={{ aspectRatio: aspect }}
      data-content-image={image.asset._id || image.asset._ref}
    >
      <Image
        src={src}
        alt={image.alt || ""}
        fill
        sizes={sizes}
        placeholder={image.asset.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image.asset.metadata?.lqip}
      />
    </div>
  );
}
