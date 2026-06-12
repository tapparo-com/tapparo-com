"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import { SanityLogo } from "@/components/ui/SanityLogo";
import {
  HERO_CROSSFADE,
  HERO_LOGO_DURATION,
  HERO_LOGO_DELAY,
  REVEAL_EASE,
} from "@/lib/animation";

type HeroImage = {
  _key: string;
  asset?: { _id: string; url: string; metadata?: { lqip?: string } } | null;
  alt?: string;
};

type SectionHeroProps = {
  restaurantName: string;
  tagline?: string | null;
  logoSvg?: string | null;
  heroImages?: HeroImage[] | null;
};

export function SectionHero({
  restaurantName,
  tagline,
  logoSvg,
  heroImages,
}: SectionHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = (heroImages ?? []).filter((img) => img.asset);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (images.length <= 1 || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, prefersReducedMotion]);

  return (
    <>
      {/* Fixed background carousel */}
      <div className="fixed inset-0 top-[65px] z-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={images[currentIndex]?._key || "fallback"}
            className="absolute inset-0"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : HERO_CROSSFADE }}
          >
            {images[currentIndex] ? (
              <Image
                src={urlFor(images[currentIndex])
                  .width(1920)
                  .quality(75)
                  .auto("format")
                  .url()}
                alt={images[currentIndex].alt || ""}
                fill
                sizes="100vw"
                className="object-cover"
                priority={currentIndex === 0}
                fetchPriority={currentIndex === 0 ? "high" : undefined}
                placeholder={
                  images[currentIndex].asset?.metadata?.lqip
                    ? "blur"
                    : undefined
                }
                blurDataURL={
                  images[currentIndex].asset?.metadata?.lqip || undefined
                }
              />
            ) : (
              <div className="absolute inset-0 bg-foreground" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero content */}
      <section className="relative z-10 flex h-[calc(100svh-65px)] items-end overflow-hidden py-12">
        <div className="mx-auto w-full max-w-[1856px] px-3 md:px-8">
          <div className="md:grid grid-cols-sidebar md:gap-10">
            <div className="col-start-2 pb-20 md:pb-0">
              <h1 className="sr-only">{restaurantName}</h1>

              <motion.div
                className="flex max-w-gutter flex-col items-center gap-5 drop-shadow-[0_0_20px_rgba(0,0,0,0.55)]"
                initial={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, scale: 0.95 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : HERO_LOGO_DURATION,
                  ease: REVEAL_EASE,
                  delay: prefersReducedMotion ? 0 : HERO_LOGO_DELAY,
                }}
              >
                {logoSvg ? (
                  <SanityLogo
                    svgHtml={logoSvg}
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
