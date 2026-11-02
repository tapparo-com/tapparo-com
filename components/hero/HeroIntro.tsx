"use client";

import Image from "next/image";
import { useLayoutEffect, useState, type RefObject } from "react";
import { motion } from "motion/react";
import styles from "./Hero.module.css";

type Rect = { left: number; top: number; width: number; height: number };
const HANDOFF_EASE = [0.76, 0, 0.24, 1] as const;

export function HeroIntro({ photo, image, tagline, name, logo }: {
  photo: RefObject<HTMLDivElement | null>;
  image: { src: string; sketch?: boolean; position?: string };
  tagline?: string;
  name: string;
  logo?: string | null;
}) {
  const [geometry, setGeometry] = useState<{ start: Rect; target: Rect; mobile: boolean } | null>(null);
  const [landed, setLanded] = useState(false);

  useLayoutEffect(() => {
    if (!photo.current) return;
    const rect = photo.current.getBoundingClientRect();
    const heroWidth = photo.current.closest("section")!.getBoundingClientRect().width;
    const compact = window.matchMedia("(max-height: 500px) and (min-width: 640px)").matches;
    const mobile = window.innerWidth < 1024 && !compact;
    const target = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    setGeometry({ mobile, target, start: {
      left: mobile ? 0 : heroWidth - rect.width - 14,
      top: mobile ? window.innerHeight * 0.24 : 14,
      width: rect.width,
      height: mobile ? window.innerHeight * 0.7 : window.innerHeight - 28,
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
      <div>
        {/* The original artwork stays intact; only its wrapper is animated. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo || "/design-preview/logo-mobile.svg"} width={180} height={66} alt={name} />
        {tagline && <p>{tagline}</p>}
      </div>
    </motion.div>
    {!landed && <motion.div className={styles.introPhoto}
      initial={{ ...start, clipPath: "inset(0 100% 0 0)" }}
      animate={{ ...target, clipPath: "inset(0 0% 0 0)" }}
      transition={{
        default: { duration: 1, delay: 1.35, ease: HANDOFF_EASE },
        clipPath: { duration: 1.05, delay: 0, ease: HANDOFF_EASE },
      }} onAnimationComplete={() => setLanded(true)}>
      <div className={image.sketch ? styles.sketchFrame : styles.imageFrame}>
        <Image src={image.src} alt="" fill priority sizes="(min-width: 2100px) 1200px, (min-width: 1024px) 57vw, 100vw" className={styles.photoImage} style={{ objectPosition: image.position }} />
      </div>
    </motion.div>}
  </div>;
}
