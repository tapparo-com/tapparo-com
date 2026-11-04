"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SectionMedia, type SectionImage } from "@/components/homepage/SectionMedia";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import { useReducedMotion } from "@/lib/useReducedMotion";
import link from "@/components/homepage/Homepage.module.css";
import styles from "./Menu.module.css";

export function CategoryImages({ images, title }: { images: SectionImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => setEnhanced(true), []);
  const valid = images.filter(image => image.asset);
  if (!valid.length) return null;
  const current = valid[index % valid.length];
  return <figure>
    <motion.div key={index} initial={index > 0 && !reduced ? { opacity: 0 } : false}
      animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .25 }}>
      <SectionMedia image={{ ...current, alt: current.alt ?? title }} natural sizes="(max-width: 1023px) 90vw, (max-width: 2100px) 40vw, 800px" />
    </motion.div>
    {enhanced && valid.length > 1 && <div className={styles.imageControls}>
      <span className={styles.imageCount} role="status">Bild {index % valid.length + 1} / {valid.length}</span>
      <button type="button" className={link.animatedLink} aria-label={`Vorheriges Bild: ${title}`} onClick={() => setIndex(i => i + valid.length - 1)}><span>zurück</span><AnimatedUnderline /></button>
      <button type="button" className={link.animatedLink} aria-label={`Nächstes Bild: ${title}`} onClick={() => setIndex(i => i + 1)}><span>weiter</span><AnimatedUnderline /></button>
    </div>}
    {valid.length > 1 && <noscript><div className={styles.imageFallback}>{valid.slice(1).map((image, i) => <SectionMedia key={i} image={image} natural sizes="90vw" />)}</div></noscript>}
  </figure>;
}
