"use client";

import Image, { getImageProps } from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { pathForSlug } from "@/lib/urls";
import { ORDER_PATH } from "@/lib/ordering";
import { HeroIntro } from "./HeroIntro";
import { ENTRANCE_BOOTSTRAP, useHeroEntrance } from "./useHeroEntrance";
import styles from "./DesignPreview.module.css";

type PreviewImage = { id: string; src: string; alt: string; sketch: boolean };
export type PreviewContent = {
  brand: { name: string; logo: string | null; tagline?: string };
  contact: { address?: string; mapUrl?: string } | null;
  navigation: {
    pageLinks?: { _key: string; label: string; slug: string }[];
    socialLinks?: { _id: string; label: string; url: string }[];
    phone?: string;
  } | null;
  images: PreviewImage[];
  tickerPhrases: string[];
};

const ASSETS = "/design-preview/";
const EASE = [0.22, 1, 0.36, 1] as const;
const IMAGE_SIZES = "(min-width: 2100px) 1200px, (min-width: 1024px) 57vw, 100vw";
const SLIDE_INTERVAL = 2500;
const CROSSFADE_SECONDS = 0.1;

// Original Figma strokes: translate/rotate these same lines into a handdrawn cross.
const MENU_STROKES = [
  "M4.1875 7.00369C5.49983 6.95714 8.89143 7.36277 12.3757 7.53643C15.5579 7.69503 18.6742 7.2468 20.5135 7.30314C22.0679 7.35076 23.0223 7.42668 26.2735 7.61995C27.0445 7.67687 27.4045 7.74437 27.6799 7.77913C27.9553 7.8139 28.1353 7.8139 28.3207 7.8139",
  "M4.14258 16.1384C4.23257 16.1384 6.21367 16.0245 9.57255 15.8856C11.85 15.7915 14.5996 15.9066 17.9462 15.8135C20.4604 15.9015 22.4265 16.1289 24.06 16.2985C24.7935 16.3335 25.3334 16.2645 26.0235 16.1926",
  "M4 24.3076C4.22497 24.3976 4.74581 24.6014 7.32786 24.9636C9.49336 25.2674 13.4419 25.4155 15.7288 25.5199C19.3104 25.6835 20.581 25.233 21.9922 25.0025C23.6529 24.9084 24.6312 24.9747 25.1411 25.0769C25.4036 25.1117 25.6735 25.1117 26.2244 25.2481",
];

function MenuIcon({ open, reduced }: { open: boolean; reduced: boolean }) {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {MENU_STROKES.map((stroke, index) => <motion.g key={stroke} initial={false}
      animate={{ y: open ? [8.6, 0, -9.2][index] : 0, opacity: open && index === 1 ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}>
      <motion.path d={stroke} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
        style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }} initial={false}
        animate={{ rotate: open ? [45, 0, -45][index] : 0, scaleX: open && index === 1 ? 0.6 : 1 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: EASE }} />
    </motion.g>)}
  </svg>;
}

function BrandArtwork() {
  return <picture className={styles.artwork}>
    <source media="(min-width: 1024px)" srcSet={`${ASSETS}logo-desktop.svg`} />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`${ASSETS}logo-mobile.svg`} alt="" width={180} height={66} />
  </picture>;
}

function OrderingLink() {
  return <TransitionLink href={ORDER_PATH} aria-label="Jetzt bestellen" className={styles.orderingLink}>
    <span className={styles.orderArtwork} aria-hidden="true" />
  </TransitionLink>;
}

function MenuArtwork({ children, reduced, delay }: { children: ReactNode; reduced: boolean; delay: number }) {
  return <span className={styles.menuArtworkMask}>
    <motion.span className={styles.menuArtwork}
      initial={reduced ? false : { y: "105%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: EASE }}
      exit={{ y: reduced ? "0%" : "-105%", opacity: 0, transition: { duration: reduced ? 0 : 0.18, delay: 0, ease: EASE } }}>
      {children}
    </motion.span>
  </span>;
}

function StatusDetails({ open, contact }: { open: boolean; contact: PreviewContent["contact"] }) {
  const address = contact?.address?.replace(/\s*\n\s*/g, ", ");
  return <div className={styles.statusDetails}>
    <p><span className={styles.statusDot} data-open={open} /><span>{open ? "Gerade offen" : "Gerade geschlossen"}</span></p>
    {address && (contact?.mapUrl
      ? <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.address}>{address}</a>
      : <p className={styles.address}>{address}</p>)}
  </div>;
}

function HeroTicker({ phrases, stopped }: { phrases: string[]; stopped: boolean }) {
  const windowRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLSpanElement>(null);
  const [repeats, setRepeats] = useState(4);

  useEffect(() => {
    const windowElement = windowRef.current, sequence = sequenceRef.current;
    if (!windowElement || !sequence) return;
    // Each identical half must fill the viewport, even with one short CMS phrase.
    const update = () => setRepeats(Math.max(1, Math.ceil(windowElement.clientWidth / Math.max(1, sequence.getBoundingClientRect().width))));
    const observer = new ResizeObserver(update);
    observer.observe(windowElement);
    observer.observe(sequence);
    update();
    return () => observer.disconnect();
  }, [phrases]);

  return <div ref={windowRef} className={styles.ticker}>
    <p className="sr-only">{phrases.join(", ")}</p>
    <div className={styles.tickerTrack} aria-hidden="true" style={{ animationPlayState: stopped ? "paused" : "running" }}>
      {[0, 1].map(copy => <span className={styles.tickerCopy} key={copy}>
        {Array.from({ length: repeats }, (_, repeat) => <span className={styles.tickerSequence} key={repeat} ref={copy === 0 && repeat === 0 ? sequenceRef : undefined}>
          {phrases.map((phrase, index) => <span className={styles.tickerItem} key={index}><span>{phrase}</span><span className={styles.tickerSeparator}>•</span></span>)}
        </span>)}
      </span>)}
    </div>
  </div>;
}

export function DesignPreview({ content }: { content: PreviewContent }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const systemPrefersReduced = hydrated && Boolean(systemReduced);
  const reduced = reduceMotion || systemPrefersReduced;
  const [visible, setVisible] = useState(true);
  const [sampleOpen, setSampleOpen] = useState(true);
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
  const { images, contact, navigation, brand, tickerPhrases } = content;
  const { entrance, active: introActive, play, finish } = useHeroEntrance(focusScope, photo, reduced);
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
    // 2.5 seconds from one transition's start to the next; crossfade is included.
    const timer = setTimeout(() => {
      setFailed(false);
      setSlide(current => ({ current: next, previous: current.current, version: current.version + 1 }));
    }, SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [stopped, images.length, loaded, next, slide.current]);

  useEffect(() => {
    if (!menuPresent) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuButton.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(focusScope.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") || [])
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
          <h1 className="sr-only">{brand.name} — Tagesbar & Focacceria</h1>
          {tickerPhrases.length > 0 && <HeroTicker phrases={tickerPhrases} stopped={stopped} />}

          <a href="/" aria-label={`${brand.name} Startseite`} className={styles.logo}>
            <span className={styles.artworkMask}><span className={styles.artworkEntrance}><BrandArtwork /></span></span>
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

        <div className={styles.order}><span className={styles.artworkMask}><span className={styles.artworkEntrance}><OrderingLink /></span></span></div>
        <div className={styles.details}><StatusDetails open={sampleOpen} contact={contact} /></div>
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
            <a href="/" className={styles.menuLogo} aria-label={`${brand.name} Startseite`}>
              <MenuArtwork reduced={reduced} delay={0.1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.logo || `${ASSETS}logo-mobile.svg`} alt="" />
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
            <div className={styles.order}><MenuArtwork reduced={reduced} delay={0.24}><OrderingLink /></MenuArtwork></div>
            <motion.div className={styles.details}
              initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.18 }}
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15, delay: 0 } }}>
              <StatusDetails open={sampleOpen} contact={contact} />
            </motion.div>
          </div>
        </motion.div>}
      </AnimatePresence>

      <details className={styles.review} inert={menuPresent}>
        <summary>Designprobe · Einstellungen und Statusbeispiel</summary>
        <div className={styles.reviewPanel}>
          <p><strong>Hero- & Navigationsprobe</strong><br />Status und Bildfolge sind Beispiele. Die Ticker-Phrasen kommen aus dem Hero der Home-Seite im Development-CMS.</p>
          <label>Statusbeispiel<select aria-label="Statusbeispiel" value={sampleOpen ? "open" : "closed"} onChange={event => setSampleOpen(event.target.value === "open")}><option value="open">Offen</option><option value="closed">Geschlossen</option></select></label>
          <label className={styles.checkbox}><input type="checkbox" checked={reduced} disabled={systemPrefersReduced} onChange={event => setReduceMotion(event.target.checked)} />Bewegung reduzieren{systemPrefersReduced ? " (System)" : ""}</label>
          <div className={styles.reviewButtons}>
            <button type="button" disabled={reduced || introActive} onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); play("first"); }}>Erstbesuch ansehen</button>
            <button type="button" disabled={reduced || introActive} onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); play("return"); }}>Kurzen Einstieg ansehen</button>
            <button type="button" disabled={reduced} onClick={() => setTransitionDemo(value => value + 1)}>Seitenwechsel ansehen</button>
          </div>
          <p>Erstbesuch: ca. 2,85 s, danach kurzer Einstieg mit 1,15 s. 100 ms Crossfade alle 2,5 s. Der Live-Status folgt mit den strukturierten Öffnungszeiten.</p>
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

    {entrance.mode === "first" && <HeroIntro key={entrance.run} photo={photo} image={images[slide.current]} name={brand.name} tagline={brand.tagline} />}

    <AnimatePresence>{transitionDemo > 0 && !reduced && <motion.div key={transitionDemo} className={styles.transitionDemo} aria-hidden="true" initial={{ y: "100%" }} animate={{ y: ["100%", "0%", "0%", "-100%"] }} transition={{ duration: 0.7, times: [0, 0.43, 0.57, 1], ease: [0.76, 0, 0.24, 1] }} onAnimationComplete={() => setTransitionDemo(0)} />}</AnimatePresence>
  </div>;
}
