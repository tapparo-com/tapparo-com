"use client";

import Image from "next/image";
import { useLayoutEffect, useState, type RefObject } from "react";
import { motion } from "motion/react";

import { heroImageSizes } from "@/lib/hero-images";
import { IntroWelcome } from "./IntroWelcome";

type Rect = { left: number; top: number; width: number; height: number };
const HANDOFF_EASE = [0.76, 0, 0.24, 1] as const;

export function HeroIntro({
  photo,
  image,
  artwork,
}: {
  photo: RefObject<HTMLDivElement | null>;
  image: {
    src: string;
    position?: string;
    aspectRatio?: number;
  };
  artwork?: string | null;
}) {
  const [geometry, setGeometry] = useState<{
    start: Rect;
    target: Rect;
    mobile: boolean;
  } | null>(null);
  const [landed, setLanded] = useState(false);

  useLayoutEffect(() => {
    if (!photo.current) return;
    const targetPhoto = photo.current;
    targetPhoto.dataset.introPending = "true";
    const rect = targetPhoto.getBoundingClientRect();
    const heroRight = targetPhoto
      .closest("section")!
      .getBoundingClientRect().right;
    const mobile = window.innerWidth < 1024;
    const target = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
    setGeometry({
      mobile,
      target,
      start: {
        left: mobile ? 0 : Math.max(0, heroRight - rect.width - 20),
        top: mobile ? window.innerHeight * 0.32 : 20,
        width: rect.width,
        height: mobile ? window.innerHeight * 0.62 : window.innerHeight - 40,
      },
    });
    return () => {
      delete targetPhoto.dataset.introPending;
    };
  }, [photo]);

  if (!geometry) return null;
  const { start, target, mobile } = geometry;
  return (
    <div
      className="hero-intro pointer-events-none fixed top-0 right-0 bottom-0 left-0 z-[90] motion-reduce:hidden [&[data-preparing]]:bg-background"
      aria-hidden="true"
      data-first-intro
    >
      <IntroWelcome
        artwork={artwork}
        width={mobile ? "100%" : start.left}
        height={mobile ? start.top : "100%"}
      />
      {!landed && (
        <motion.div
          className="fixed overflow-hidden bg-background"
          style={{ left: target.left, top: target.top, width: target.width }}
          initial={{
            x: start.left - target.left,
            y: start.top - target.top,
            height: start.height,
            clipPath: "inset(0 100% 0 0)",
          }}
          animate={{
            x: 0,
            y: 0,
            height: target.height,
            clipPath: "inset(0 0% 0 0)",
          }}
          transition={{
            default: { duration: 0.7, delay: 0.65, ease: HANDOFF_EASE },
            clipPath: { duration: 0.7, delay: 0, ease: HANDOFF_EASE },
          }}
          onAnimationComplete={() => {
            // Reveal the real photo before removing its animated duplicate.
            // A separate CSS timer can finish on a different frame and leave a gap.
            if (photo.current) delete photo.current.dataset.introPending;
            setLanded(true);
          }}
        >
          <div className="absolute inset-0">
            <Image
              src={image.src}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes={heroImageSizes(image, {
                width: target.width,
                height: Math.max(start.height, target.height),
              })}
              className="hero-photo-image object-cover [object-position:center]"
              style={{ objectPosition: image.position }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
