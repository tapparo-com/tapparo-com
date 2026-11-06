"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { pathForSlug } from "@/lib/urls";
import { type HoursSettings } from "@/lib/opening-hours";
import { useOpeningStatus } from "@/lib/opening-hours/useOpeningStatus";
import { ASSETS, EASE, IMAGE_SIZES, CROSSFADE_SECONDS, MenuIcon, BrandArtwork, OrderingLink, MenuArtwork, StatusDetails, HeroTicker } from "@/components/hero/HeroParts";
import { heroSlideInterval } from "@/lib/animation";
import { HeroIntro } from "@/components/hero/HeroIntro";
import type { SiteData } from "@/components/hero/types";
import { ENTRANCE_BOOTSTRAP, useHeroEntrance } from "@/components/hero/useHeroEntrance";
import styles from "@/components/hero/Hero.module.css";

type PreviewImage = { id: string; src: string; alt: string; sketch: boolean };
export type PreviewContent = {
  hours: HoursSettings | null;
  brand: { name: string; logo: string | null; tagline?: string };
  intro?: SiteData["intro"];
  contact: { address?: string; mapUrl?: string } | null;
  navigation: {
    pageLinks?: { _key: string; label: string; slug: string }[];
    socialLinks?: { _id: string; label: string; url: string }[];
    phone?: string;
  } | null;
  images: PreviewImage[];
  tickerPhrases: string[];
  imageDuration?: number | null;
};

export function DesignPreview({ content }: { content: PreviewContent }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const systemPrefersReduced = hydrated && Boolean(systemReduced);
  const reduced = reduceMotion || systemPrefersReduced;
  const [visible, setVisible] = useState(true);
  const [statusPreview, setStatusPreview] = useState<"live" | "open" | "closed">("live");
  const liveStatus = useOpeningStatus(content.hours);
  const status = statusPreview === "live" ? liveStatus : statusPreview;
  const [transitionDemo, setTransitionDemo] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPresent, setMenuPresent] = useState(false);
  const [slide, setSlide] = useState({ current: 0, previous: 0, version: 0 });
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [failed, setFailed] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const focusScope = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const inView = useInView(hero, { amount: 0.1 });
  const { images, contact, navigation, brand, tickerPhrases, intro } = content;
  const slideInterval = heroSlideInterval(content.imageDuration);
  const { entrance, active: introActive, play, finish } = useHeroEntrance(focusScope, photo, reduced, undefined, false, intro?.enabled !== false);
  const next = (slide.current + 1) % images.length;
  const stopped = !hydrated || reduced || !visible || !inView || introActive || menuPresent;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(preference.matches);
    update();
    setHydrated(true);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // The first frame remains visible while the next responsive image loads.
  useEffect(() => {
    if (images.length < 2 || loaded.has(next)) return;
    let active = true;
    const image = new window.Image();
    const { props } = getImageProps({ src: images[next].src, alt: "", fill: true, sizes: IMAGE_SIZES });
    image.onload = () => { if (active) setLoaded(current => new Set(current).add(next)); };
    image.sizes = props.sizes || "";
    image.srcset = props.srcSet || "";
    image.src = props.src;
    return () => { active = false; image.onload = null; };
  }, [images, next, loaded]);

  useEffect(() => {
    if (stopped || images.length < 2 || !loaded.has(slide.current) || !loaded.has(next)) return;
    // The owner controls start-to-start timing; the 100 ms crossfade is included.
    const timer = setTimeout(() => {
      setFailed(false);
      setSlide(current => ({ current: next, previous: current.current, version: current.version + 1 }));
    }, slideInterval);
    return () => clearTimeout(timer);
  }, [stopped, images.length, loaded, next, slide.current, slideInterval]);

  useEffect(() => {
    if (!menuPresent) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuButton.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(focusScope.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']") || [])
        .filter(element => !element.closest("[inert]") && element.getClientRects().length > 0);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      menuButton.current?.focus({ preventScroll: true });
    };
  }, [menuPresent]);

  return <div ref={focusScope} className={styles.preview} data-reduced-motion={reduced} data-menu-present={menuPresent} data-has-ticker={tickerPhrases.length > 0}
    data-entrance={entrance.mode} data-entrance-run={entrance.run} suppressHydrationWarning onPointerDownCapture={introActive ? finish : undefined}
    role={menuPresent ? "dialog" : undefined} aria-modal={menuPresent ? true : undefined} aria-label={menuPresent ? "Hauptnavigation" : undefined}>
    <script dangerouslySetInnerHTML={{ __html: ENTRANCE_BOOTSTRAP }} />
    <div className={styles.viewportOutline} aria-hidden="true" />
    <div>
      <section ref={hero} className={`${styles.viewportLayout} ${styles.hero}`} aria-label="Tapparo — Hero-Entwurf" inert={menuPresent} aria-hidden={menuPresent || undefined}>
        <div className={styles.heroBackground}>
          <h1 className="sr-only">{brand.name}{brand.tagline ? ` — ${brand.tagline}` : ""}</h1>
          {tickerPhrases.length > 0 && <HeroTicker phrases={tickerPhrases} stopped={stopped} reduced={reduced} />}

          <a href="/" aria-label={`${brand.name} Startseite`} className={styles.logo}>
            <span className={styles.artworkMask}><span className={styles.artworkEntrance}><BrandArtwork logo={brand.logo} /></span></span>
          </a>

          <div ref={photo} className={styles.photo}
            aria-label="Bilder von Tapparo" data-slide={slide.current}>
            <div className={styles.imageLayer} aria-hidden="true">
              <div className={images[slide.previous].sketch ? styles.sketchFrame : styles.imageFrame}>
                <Image src={images[slide.previous].src} alt="" fill sizes={IMAGE_SIZES} className={styles.photoImage} />
              </div>
            </div>
            <motion.div key={slide.version} className={styles.imageLayer} data-active-image
              initial={slide.version && !reduced ? { opacity: 0 } : false}
              animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : CROSSFADE_SECONDS, ease: "linear" }}>
              <div className={images[slide.current].sketch ? styles.sketchFrame : styles.imageFrame}>
                <Image src={images[slide.current].src} alt={images[slide.current].alt} fill sizes={IMAGE_SIZES}
                  priority={slide.current === 0} className={styles.photoImage}
                  onLoad={() => setLoaded(current => current.has(slide.current) ? current : new Set(current).add(slide.current))}
                  onError={() => setFailed(true)} />
              </div>
            </motion.div>
            {failed && <p className={styles.imageError}>Bild vorübergehend nicht verfügbar.</p>}
          </div>
        </div>

        <div className={styles.heroActions}>
          <div className={styles.order}><span className={styles.artworkMask}><span className={styles.artworkEntrance}><OrderingLink /></span></span></div>
          <div className={styles.details}><StatusDetails status={status} contact={contact} /></div>
        </div>
      </section>

      {/* Reuse the hero's responsive grid, anchored to the viewport rather than
          its current scroll offset. The page underneath stays in normal flow. */}
      <AnimatePresence onExitComplete={() => { if (!menuOpen) setMenuPresent(false); }}>
        {menuOpen && <motion.div key="navigation" id="preview-navigation" className={styles.navigation}
          initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.12, ease: EASE } }}>
          {/* The opaque surface and every menu element share this one reveal.
              Hero artwork remains underneath, so closing never swaps positions. */}
          <div className={`${styles.viewportLayout} ${styles.navigationLayout}`}>
            <div className={`${styles.photo} ${styles.menuPhoto}`} aria-hidden="true">
              <Image src={images[slide.current].src} alt="" fill sizes={IMAGE_SIZES} className={styles.photoImage} />
            </div>
            <a href="/" className={styles.menuLogo} aria-label={`${brand.name} Startseite`}>
              <MenuArtwork reduced={reduced} delay={0.1}>
                <BrandArtwork logo={brand.logo} />
              </MenuArtwork>
            </a>
            <motion.nav aria-label="Hauptnavigation" className={styles.menuLinks} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.15 }}>
              {[
                ...(navigation?.pageLinks || []).filter(link => link.slug).map(link => ({ key: link._key, label: link.label, href: pathForSlug(link.slug), external: false })),
                ...(navigation?.socialLinks || []).map(link => ({ key: link._id, label: link.label, href: link.url, external: true })),
              ].map((link, index) => <motion.a key={link.key} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}
                initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.08 + index * 0.05 }}>{link.label}</motion.a>)}
              {navigation?.phone && <a className={styles.menuPhone} href={`tel:${navigation.phone.replace(/[^+\d]/g, "")}`}>{navigation.phone}</a>}
            </motion.nav>
            <div className={styles.heroActions}>
              <div className={styles.order}><MenuArtwork reduced={reduced} delay={0.24}><OrderingLink /></MenuArtwork></div>
              <motion.div className={styles.details}
                initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.18 }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15, delay: 0 } }}>
                <StatusDetails status={status} contact={contact} />
              </motion.div>
            </div>
          </div>
          {tickerPhrases.length > 0 && <HeroTicker phrases={tickerPhrases} stopped reduced={reduced} />}
        </motion.div>}
      </AnimatePresence>

      <details className={styles.review} inert={menuPresent}>
        <summary>Designprobe · Einstellungen und Statusbeispiel</summary>
        <div className={styles.reviewPanel}>
          <p><strong>Hero- & Navigationsprobe</strong><br />Der Live-Status kommt aus Site Settings → Opening Hours im Development-CMS. Die Bildfolge ist weiterhin eine Designprobe; die Ticker-Phrasen kommen aus dem Hero der Home-Seite.</p>
          <label>Statusvorschau<select aria-label="Statusvorschau" value={statusPreview} onChange={event => setStatusPreview(event.target.value as typeof statusPreview)}><option value="live">Live aus dem CMS</option><option value="open">Offen (Designprobe)</option><option value="closed">Geschlossen (Designprobe)</option></select></label>
          <label className={styles.checkbox}><input type="checkbox" checked={reduced} disabled={systemPrefersReduced} onChange={event => setReduceMotion(event.target.checked)} />Bewegung reduzieren{systemPrefersReduced ? " (System)" : ""}</label>
          <div className={styles.reviewButtons}>
            <button type="button" disabled={reduced || introActive} onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); play("first"); }}>Erstbesuch ansehen</button>
            <button type="button" disabled={reduced || introActive} onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); play("return"); }}>Kurzen Einstieg ansehen</button>
            <button type="button" disabled={reduced} onClick={() => setTransitionDemo(value => value + 1)}>Seitenwechsel ansehen</button>
          </div>
          <p>Erstbesuch: ca. 1,8 s, danach kurzer Einstieg mit 0,95 s. 100 ms Crossfade alle {(slideInterval / 1000).toLocaleString("de-DE")} s. Der Live-Status verwendet Europe/Berlin und aktualisiert sich zu jeder vollen Minute.</p>
        </div>
      </details>
    </div>

    <div className={styles.menuShell}>
      <button ref={menuButton} type="button" className={styles.menuButton}
        onClick={() => { if (menuOpen) setMenuOpen(false); else { setMenuPresent(true); setMenuOpen(true); } }}
        aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"} aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls={menuPresent ? "preview-navigation" : undefined}>
        <MenuIcon open={menuOpen} reduced={reduced} />
      </button>
    </div>

    {entrance.mode === "first" && <HeroIntro key={entrance.run} photo={photo} image={images[slide.current]} artwork={intro?.artworkUrl} />}

    <AnimatePresence>{transitionDemo > 0 && !reduced && <motion.div key={transitionDemo} className={styles.transitionDemo} aria-hidden="true" initial={{ y: "100%" }} animate={{ y: ["100%", "0%", "0%", "-100%"] }} transition={{ duration: 0.7, times: [0, 0.43, 0.57, 1], ease: [0.76, 0, 0.24, 1] }} onAnimationComplete={() => setTransitionDemo(0)} />}</AnimatePresence>
  </div>;
}
