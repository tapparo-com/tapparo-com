"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";

type HeroImage = {
  _key: string;
  asset: { _id: string; url: string; metadata?: { lqip?: string } };
  alt?: string;
};

type SectionHeroProps = {
  restaurantName: string;
  tagline?: string | null;
  logo?: { asset?: { _id: string; url: string } } | null;
  heroImages?: HeroImage[] | null;
};

export function SectionHero({
  restaurantName,
  tagline,
  logo,
  heroImages,
}: SectionHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = heroImages ?? [];

  useEffect(() => {
    if (images.length <= 1) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 800);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-[780px] overflow-hidden md:h-[640px] xl:h-[1080px]">
      {/* Background carousel */}
      {images.map((img, i) => (
        <div
          key={img._key}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={urlFor(img).width(1920).height(1080).url()}
            alt={img.alt || ""}
            fill
            className="object-cover"
            priority={i === 0}
            placeholder={img.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={img.asset?.metadata?.lqip || undefined}
          />
        </div>
      ))}

      {/* Fallback background if no images */}
      {images.length === 0 && (
        <div className="absolute inset-0 bg-foreground" />
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 xl:pb-20">
        <h1 className="sr-only">{restaurantName}</h1>

        {logo?.asset && (
          <Image
            src={urlFor(logo).url()}
            alt={`${restaurantName} logo`}
            width={752}
            height={208}
            className="mb-6 w-[calc(100%-48px)] max-w-[752px] md:mb-8"
          />
        )}

        {!logo?.asset && (
          <span className="mb-6 text-4xl font-bold text-white md:mb-8 md:text-6xl xl:text-8xl">
            {restaurantName}
          </span>
        )}

        {tagline && (
          <p className="font-display text-[17.5px] font-medium tracking-[0.5em] text-white drop-shadow-lg md:text-xl md:tracking-[0.83em] xl:text-4xl xl:tracking-[13.32px]">
            {tagline}
          </p>
        )}
      </div>
    </section>
  );
}
