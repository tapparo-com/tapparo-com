"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useRef } from "react";

type GalleryImage = {
  _key: string;
  asset: { _id: string; url: string; metadata?: { lqip?: string } };
  alt?: string;
};

type SectionGalleryProps = {
  images?: GalleryImage[] | null;
};

// Placeholder column layout matching Figma's organic gallery
const PLACEHOLDER_COLUMNS = [
  [{ w: 200, h: 320 }],
  [{ w: 220, h: 240 }, { w: 220, h: 180 }],
  [{ w: 280, h: 300 }],
  [{ w: 160, h: 160 }, { w: 160, h: 220 }],
  [{ w: 240, h: 280 }],
  [{ w: 180, h: 200 }, { w: 180, h: 260 }],
  [{ w: 200, h: 240 }],
];

export function SectionGallery({ images }: SectionGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const hasImages = images && images.length > 0;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= 0.5;
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Build columns from real images or use placeholders
  let columns: { key: string; w: number; h: number; src?: string; alt?: string }[][] = [];

  if (hasImages) {
    let col: typeof columns[0] = [];
    images.forEach((img, i) => {
      col.push({
        key: img._key,
        w: 320,
        h: 400,
        src: urlFor(img).width(400).height(500).url(),
        alt: img.alt || "",
      });
      if (col.length === 2 || i === images.length - 1) {
        columns.push(col);
        col = [];
      }
    });
  } else {
    columns = PLACEHOLDER_COLUMNS.map((col, ci) =>
      col.map((item, ii) => ({
        key: `p-${ci}-${ii}`,
        w: item.w,
        h: item.h,
      }))
    );
  }

  return (
    <section
      aria-label="Photo gallery"
      className="overflow-hidden bg-[#F2F2F2] py-12 md:py-12 xl:py-20"
    >
      <ul
        ref={trackRef}
        className="flex items-center gap-4 will-change-transform"
        aria-hidden="true"
      >
        {[...columns, ...columns].map((colItems, colIdx) => (
          <li key={colIdx} className="flex shrink-0 flex-col gap-4">
            {colItems.map((item) =>
              item.src ? (
                <Image
                  key={item.key}
                  src={item.src}
                  alt={item.alt || ""}
                  width={item.w}
                  height={item.h}
                  className="h-auto rounded-sm object-cover shadow-[0_1px_2px_rgba(54,29,5,0.25)]"
                  style={{ width: item.w * 0.8, height: "auto" }}
                />
              ) : (
                <div
                  key={item.key}
                  className="shrink-0 rounded-sm bg-[#A0A0A0] shadow-[0_1px_2px_rgba(54,29,5,0.25)]"
                  style={{ width: item.w, height: item.h }}
                />
              )
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
