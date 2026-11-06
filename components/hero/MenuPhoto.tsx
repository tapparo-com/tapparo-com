"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroImage, heroImageSizes, type SanityHeroImage } from "@/lib/hero-images";
import { BrandArtwork } from "./HeroParts";
import type { SiteData } from "./types";
import styles from "./Hero.module.css";

/** A frozen CMS photograph, framed independently of the page's scroll position. */
export function MenuPhoto({ source, brand }: { source: SanityHeroImage | null; brand: SiteData["brand"] }) {
  const root = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<{ width: number; height: number }>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFrame(current => current?.width === width && current?.height === height ? current : { width, height });
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => setFailed(false), [source]);
  const image = source ? heroImage(source, frame) : null;
  return <div ref={root} className={`${styles.photo} ${styles.menuPhoto}`} data-menu-photo aria-hidden="true">
    {frame && frame.width > 0 && image && !failed
      ? <Image src={image.src} alt="" fill sizes={heroImageSizes(image, frame)} className={styles.photoImage}
          style={{ objectPosition: image.position }} onError={() => setFailed(true)} />
      : <div className={styles.photoFallback}><BrandArtwork logo={brand.logo} /><span>{brand.tagline || brand.name}</span></div>}
  </div>;
}
