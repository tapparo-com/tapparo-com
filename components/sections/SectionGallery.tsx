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

export function SectionGallery({ images }: SectionGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);

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

  if (!images || images.length === 0) return null;

  // Distribute images into columns of 1-2 images each
  const columns: GalleryImage[][] = [];
  let col: GalleryImage[] = [];
  images.forEach((img, i) => {
    col.push(img);
    if (col.length === 2 || i === images.length - 1) {
      columns.push(col);
      col = [];
    }
  });

  return (
    <section
      aria-label="Photo gallery"
      className="overflow-hidden bg-[#F2F2F2] py-12 md:py-12 xl:py-20"
    >
      <ul
        ref={trackRef}
        className="flex gap-4 will-change-transform"
        aria-hidden="true"
      >
        {/* Render columns twice for infinite loop */}
        {[...columns, ...columns].map((colImgs, colIdx) => (
          <li
            key={colIdx}
            className="flex shrink-0 flex-col gap-4"
          >
            {colImgs.map((img) => (
              <Image
                key={img._key}
                src={urlFor(img).width(400).height(500).url()}
                alt={img.alt || ""}
                width={400}
                height={500}
                className="h-auto w-[200px] rounded-sm object-cover shadow-[0_1px_2px_rgba(54,29,5,0.25)] md:w-[260px] xl:w-[320px]"
              />
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
