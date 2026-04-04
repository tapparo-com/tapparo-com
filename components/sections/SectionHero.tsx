"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";
import { SanityLogo } from "@/components/ui/SanityLogo";

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
    <>
      {/* Fixed background carousel — stays locked to viewport */}
      <div className="fixed inset-0 top-[65px] z-0 overflow-hidden">
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
      </div>

      {/* Hero content — takes up viewport height, scrolls naturally */}
      <section className="relative z-10 flex h-[calc(100svh-65px)] items-end overflow-hidden py-12">
        <div className="mx-auto w-full max-w-[1856px] px-3 md:px-8">
          {/* Grid: empty left col + logo right col on desktop. Full-width on mobile. */}
          <div className="md:grid grid-cols-sidebar md:gap-10">
            <div className="col-start-2 pb-20 md:pb-0">
              <h1 className="sr-only">{restaurantName}</h1>

              <div className="flex max-w-gutter flex-col items-center gap-5 drop-shadow-[0_0_20px_rgba(0,0,0,0.55)]">
                {logo?.asset ? (
                  <SanityLogo
                    logo={logo}
                    alt={`${restaurantName} logo`}
                    className="w-full text-background [&_svg]:w-full [&_svg]:h-auto"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white md:text-6xl xl:text-8xl">
                    {restaurantName}
                  </span>
                )}

                {tagline && (
                  <p className="font-display text-[18px] font-medium tracking-[6.66px] text-background md:text-[28px] md:tracking-[10.36px] xl:text-[36px] xl:tracking-[13.32px]">
                    {tagline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
