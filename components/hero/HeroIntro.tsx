"use client";

import Image from "next/image";
import { useLayoutEffect, useState, type RefObject } from "react";
import { motion } from "motion/react";
import styles from "./Hero.module.css";
import { heroImageSizes } from "@/lib/hero-images";
import { IntroWelcome } from "./IntroWelcome";

type Rect = { left: number; top: number; width: number; height: number };
const HANDOFF_EASE = [0.76, 0, 0.24, 1] as const;

export function HeroIntro({ photo, image, artwork }: {
  photo: RefObject<HTMLDivElement | null>;
  image: { src: string; sketch?: boolean; position?: string; aspectRatio?: number };
  artwork?: string | null;
}) {
  const [geometry, setGeometry] = useState<{ start: Rect; target: Rect; mobile: boolean } | null>(null);
  const [landed, setLanded] = useState(false);

  useLayoutEffect(() => {
    if (!photo.current) return;
    const targetPhoto = photo.current;
    targetPhoto.dataset.introPending = "true";
    const rect = targetPhoto.getBoundingClientRect();
    const heroRight = targetPhoto.closest("section")!.getBoundingClientRect().right;
    const mobile = window.innerWidth < 1024;
    const target = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    setGeometry({ mobile, target, start: {
      left: mobile ? 0 : Math.max(0, heroRight - rect.width - 20),
      top: mobile ? window.innerHeight * 0.32 : 20,
      width: rect.width,
      height: mobile ? window.innerHeight * 0.62 : window.innerHeight - 40,
    } });
    return () => { delete targetPhoto.dataset.introPending; };
  }, [photo]);

  if (!geometry) return null;
  const { start, target, mobile } = geometry;
  return <div className={styles.intro} aria-hidden="true" data-first-intro>
    <IntroWelcome artwork={artwork} width={mobile ? "100%" : start.left} height={mobile ? start.top : "100%"} />
    {!landed && <motion.div className={styles.introPhoto}
      style={{ left: target.left, top: target.top, width: target.width }}
      initial={{ x: start.left - target.left, y: start.top - target.top, height: start.height, clipPath: "inset(0 100% 0 0)" }}
      animate={{ x: 0, y: 0, height: target.height, clipPath: "inset(0 0% 0 0)" }}
      transition={{
        default: { duration: .7, delay: .65, ease: HANDOFF_EASE },
        clipPath: { duration: .7, delay: 0, ease: HANDOFF_EASE },
      }} onAnimationComplete={() => {
        // Reveal the real photo before removing its animated duplicate.
        // A separate CSS timer can finish on a different frame and leave a gap.
        if (photo.current) delete photo.current.dataset.introPending;
        setLanded(true);
      }}>
      <div className={image.sketch ? styles.sketchFrame : styles.imageFrame}>
        <Image src={image.src} alt="" fill priority fetchPriority="high" sizes={heroImageSizes(image, { width: target.width, height: Math.max(start.height, target.height) })} className={styles.photoImage} style={{ objectPosition: image.position }} />
      </div>
    </motion.div>}
  </div>;
}
