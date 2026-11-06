"use client";

import Image from "next/image";
import { useLayoutEffect, useState, type RefObject } from "react";
import { motion } from "motion/react";
import styles from "./Hero.module.css";
import { heroImageSizes } from "@/lib/hero-images";

type Rect = { left: number; top: number; width: number; height: number };
const HANDOFF_EASE = [0.76, 0, 0.24, 1] as const;

export function HeroIntro({ photo, image, artwork }: {
  photo: RefObject<HTMLDivElement | null>;
  image: { src: string; sketch?: boolean; position?: string; aspectRatio?: number };
  artwork?: string | null;
}) {
  const [geometry, setGeometry] = useState<{ start: Rect; target: Rect; mobile: boolean } | null>(null);
  const [landed, setLanded] = useState(false);
  const [artworkFailed, setArtworkFailed] = useState(false);

  useLayoutEffect(() => {
    if (!photo.current) return;
    const rect = photo.current.getBoundingClientRect();
    const heroRight = photo.current.closest("section")!.getBoundingClientRect().right;
    const compact = window.matchMedia("(max-height: 500px) and (min-width: 640px)").matches;
    const mobile = window.innerWidth < 1024 && !compact;
    const target = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    setGeometry({ mobile, target, start: {
      left: mobile ? 0 : Math.max(0, heroRight - rect.width - 14),
      top: mobile ? window.innerHeight * 0.32 : 14,
      width: rect.width,
      height: mobile ? window.innerHeight * 0.62 : window.innerHeight - 28,
    } });
  }, [photo]);

  if (!geometry) return null;
  const { start, target, mobile } = geometry;
  return <div className={styles.intro} aria-hidden="true" data-first-intro>
    <motion.div className={styles.introBackdrop} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.45, delay: 1.85 }} />
    <motion.div className={styles.introGreeting}
      style={{ width: mobile ? "100%" : start.left, height: mobile ? start.top : "100%" }}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: [0, 1, 1, 0], filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(4px)"] }}
      transition={{ duration: 1.5, delay: 0.15, times: [0, 0.4, 0.72, 1], ease: "easeInOut" }}>
      {/* Decorative visual duplicate: the persistent hero h1 supplies name + tagline. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artworkFailed ? "/brand/intro-lockup.svg" : artwork || "/brand/intro-lockup.svg"}
        width={1070} height={1392} alt="" onError={() => setArtworkFailed(true)} />
    </motion.div>
    {!landed && <motion.div className={styles.introPhoto}
      style={{ left: target.left, top: target.top, width: target.width }}
      initial={{ x: start.left - target.left, y: start.top - target.top, height: start.height, clipPath: "inset(0 100% 0 0)" }}
      animate={{ x: 0, y: 0, height: target.height, clipPath: "inset(0 0% 0 0)" }}
      transition={{
        default: { duration: 1, delay: 1.35, ease: HANDOFF_EASE },
        clipPath: { duration: 1.05, delay: 0, ease: HANDOFF_EASE },
      }} onAnimationComplete={() => setLanded(true)}>
      <div className={image.sketch ? styles.sketchFrame : styles.imageFrame}>
        <Image src={image.src} alt="" fill priority fetchPriority="high" sizes={heroImageSizes(image, { width: target.width, height: Math.max(start.height, target.height) })} className={styles.photoImage} style={{ objectPosition: image.position }} />
      </div>
    </motion.div>}
  </div>;
}
