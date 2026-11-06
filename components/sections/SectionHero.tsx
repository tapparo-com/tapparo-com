"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { usePageTransition } from "@/components/ui/PageTransition";
import { BrandArtwork, CROSSFADE_SECONDS, HeroTicker, HeroChoices, StatusDetails } from "@/components/hero/HeroParts";
import { heroSlideInterval } from "@/lib/animation";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { useSite } from "@/components/hero/SiteShell";
import { ENTRANCE_BOOTSTRAP, SITE_INTRO_SESSION_KEY, useHeroEntrance } from "@/components/hero/useHeroEntrance";
import { heroImage, heroImageSizes, type SanityHeroImage } from "@/lib/hero-images";
import styles from "@/components/hero/Hero.module.css";

type HeroProps = {
  heroImages?: SanityHeroImage[] | null;
  tickerPhrases?: string[];
  imageDuration?: number | null;
  description?: string;
  menuLinkLabel?: string;
};

export function SectionHero(props: HeroProps) {
  return <Hero key={JSON.stringify(props.heroImages)} {...props} />;
}

function Hero({ heroImages, tickerPhrases = [], imageDuration, description, menuLinkLabel }: HeroProps) {
  const slideInterval = heroSlideInterval(imageDuration);
  const { data: { brand, contact, intro }, status, reduced, hydrated, visible, menuPresent } = useSite();
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<{ width: number; height: number }>();
  const images = useMemo(() => (heroImages || []).map(image => heroImage(image, frame)).filter(image => image !== null), [heroImages, frame]);
  const phrases = tickerPhrases.filter(phrase => typeof phrase === "string" && phrase.trim()).map(phrase => phrase.trim());
  const [slide, setSlide] = useState({ current: 0, previous: 0, version: 0 });
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState(false);
  const inView = useInView(root, { amount: 0.1 });
  const { isTransitioning } = usePageTransition();
  const { entrance, active, finish } = useHeroEntrance(root, photo, reduced, SITE_INTRO_SESSION_KEY, isTransitioning, intro?.enabled !== false);
  const next = images.length ? (slide.current + 1) % images.length : 0;
  const current = images[slide.current], previous = images[slide.previous], upcoming = images[next];
  const stopped = !hydrated || reduced || !visible || !inView || active || menuPresent || isTransitioning;

  useEffect(() => { if (menuPresent) finish(); }, [menuPresent, finish]);
  useEffect(() => {
    if (!photo.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFrame(current => current?.width === width && current.height === height ? current : { width, height });
    });
    observer.observe(photo.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!upcoming || images.length < 2 || loaded.has(upcoming.id) || stopped) return;
    let active = true;
    const image = new window.Image();
    const { props } = getImageProps({ src: upcoming.src, alt: "", fill: true, sizes: heroImageSizes(upcoming, frame) });
    image.onload = () => { if (active) setLoaded(current => new Set(current).add(upcoming.id)); };
    image.sizes = props.sizes || ""; image.srcset = props.srcSet || ""; image.src = props.src;
    return () => { active = false; image.onload = null; };
  }, [upcoming, images.length, loaded, stopped, frame]);
  useEffect(() => {
    if (stopped || images.length < 2 || !loaded.has(current.id) || !loaded.has(upcoming.id)) return;
    const timer = setTimeout(() => {
      setFailed(false);
      setSlide(slide => ({ current: next, previous: slide.current, version: slide.version + 1 }));
    }, slideInterval);
    return () => clearTimeout(timer);
  }, [stopped, images.length, loaded, current?.id, upcoming?.id, next, slideInterval]);

  return <div ref={root} className={styles.preview} data-site-hero data-has-ticker={phrases.length > 0} data-reduced-motion={reduced}
    data-entrance={entrance.mode} data-entrance-run={entrance.run} suppressHydrationWarning onPointerDownCapture={active ? finish : undefined}>
    <script dangerouslySetInnerHTML={{ __html: ENTRANCE_BOOTSTRAP }} />
    <section className={`${styles.viewportLayout} ${styles.hero}`} aria-label={brand.name}>
      {/* Keep the intro's spoken identity available after its decorative artwork exits. */}
      <h1 className="sr-only">{brand.name}{brand.tagline ? ` — ${brand.tagline}` : ""}</h1>
      <div ref={photo} className={styles.photo} data-hero-photo data-slide={slide.current} data-image-count={images.length}>
        {previous && previous.id !== current?.id && <div className={styles.imageLayer} aria-hidden="true"><Image src={previous.src} alt="" fill sizes={heroImageSizes(previous, frame)} className={styles.photoImage} style={{ objectPosition: previous.position }} /></div>}
        {current && <motion.div key={slide.version} className={styles.imageLayer} data-active-image
          initial={slide.version && !reduced ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : CROSSFADE_SECONDS, ease: "linear" }}>
          <Image src={current.src} alt={current.alt} fill sizes={heroImageSizes(current, frame)} priority={slide.current === 0} fetchPriority={slide.current === 0 ? "high" : "auto"} className={styles.photoImage} style={{ objectPosition: current.position }}
            onLoad={() => setLoaded(loaded => loaded.has(current.id) ? loaded : new Set(loaded).add(current.id))} onError={() => setFailed(true)} />
        </motion.div>}
        {(!current || failed) && <div className={styles.photoFallback}><BrandArtwork logo={brand.logo} /><span>{brand.tagline || brand.name}</span></div>}
      </div>
      <div className={styles.heroInformation}>
        <div className={styles.heroCopy}>
          <div className={styles.heroBrand} aria-hidden="true"><BrandArtwork logo={brand.logo} /></div>
          {description && <div className={styles.heroIntroduction}><p>{description}</p></div>}
          <HeroChoices menuLinkLabel={menuLinkLabel} />
          <div className={styles.details}><StatusDetails status={status} contact={contact} /></div>
        </div>
        {phrases.length > 0 && <HeroTicker phrases={phrases} stopped={stopped} reduced={reduced} />}
      </div>
    </section>
    {entrance.mode === "first" && current && <HeroIntro key={entrance.run} photo={photo} image={current} artwork={intro?.artworkUrl} />}
  </div>;
}
