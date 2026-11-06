"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { OpeningStatus } from "@/lib/opening-hours";
import { ORDER_PATH } from "@/lib/ordering";
import type { SiteData } from "./types";
import { REVEAL_EASE, HERO_CROSSFADE } from "@/lib/animation";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import shared from "@/components/homepage/Homepage.module.css";
import styles from "./Hero.module.css";

export const ASSETS = "/design-preview/";
export const EASE = REVEAL_EASE;
export const IMAGE_SIZES = "(min-width: 1024px) 60vw, 100vw";
export const CROSSFADE_SECONDS = HERO_CROSSFADE;

// Original Figma strokes: translate/rotate these same lines into a handdrawn cross.
const MENU_STROKES = [
  "M4.1875 7.00369C5.49983 6.95714 8.89143 7.36277 12.3757 7.53643C15.5579 7.69503 18.6742 7.2468 20.5135 7.30314C22.0679 7.35076 23.0223 7.42668 26.2735 7.61995C27.0445 7.67687 27.4045 7.74437 27.6799 7.77913C27.9553 7.8139 28.1353 7.8139 28.3207 7.8139",
  "M4.14258 16.1384C4.23257 16.1384 6.21367 16.0245 9.57255 15.8856C11.85 15.7915 14.5996 15.9066 17.9462 15.8135C20.4604 15.9015 22.4265 16.1289 24.06 16.2985C24.7935 16.3335 25.3334 16.2645 26.0235 16.1926",
  "M4 24.3076C4.22497 24.3976 4.74581 24.6014 7.32786 24.9636C9.49336 25.2674 13.4419 25.4155 15.7288 25.5199C19.3104 25.6835 20.581 25.233 21.9922 25.0025C23.6529 24.9084 24.6312 24.9747 25.1411 25.0769C25.4036 25.1117 25.6735 25.1117 26.2244 25.2481",
];

export function MenuIcon({ open, reduced }: { open: boolean; reduced: boolean }) {
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

export function BrandArtwork({ logo }: { logo?: string | null }) {
  if (logo) return <span className={styles.artwork}><img src={logo} alt="" /></span>;
  return <picture className={styles.artwork}>
    <source media="(min-width: 1024px)" srcSet={`${ASSETS}logo-desktop.svg`} />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`${ASSETS}logo-mobile.svg`} alt="" width={180} height={66} />
  </picture>;
}

export function OrderingLink() {
  return <TransitionLink href={ORDER_PATH} className={`${shared.animatedLink} ${styles.actionLink}`}>
    <span>jetzt bestellen</span><AnimatedUnderline />
  </TransitionLink>;
}

export function HeroChoices({ menuLinkLabel }: { menuLinkLabel?: string }) {
  const menuLabel = !menuLinkLabel?.trim() || /^speisekarte$/i.test(menuLinkLabel.trim()) ? "speisekarte ansehen" : menuLinkLabel;
  return <div className={styles.heroChoices}>
    <TransitionLink href="/menu" className={`${shared.animatedLink} ${styles.actionLink}`}>
      <span>{menuLabel}</span><AnimatedUnderline />
    </TransitionLink>
    <OrderingLink />
  </div>;
}

export function StatusDetails({ status, contact }: { status: OpeningStatus; contact: SiteData["contact"] }) {
  const address = contact?.address?.replace(/\s*\n\s*/g, ", ");
  return <div className={styles.statusDetails}>
    <p aria-live="polite"><span className={styles.statusDot} data-open={status === "open"} data-status={status} /><span>{status === "open" ? "Gerade offen" : status === "closed" ? "Gerade geschlossen" : "Öffnungszeiten prüfen"}</span></p>
    {address && (contact?.mapUrl
      ? <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.address}>{address}</a>
      : <p className={styles.address}>{address}</p>)}
  </div>;
}

export function HeroTicker({ phrases, stopped, reduced = false }: { phrases: string[]; stopped: boolean; reduced?: boolean }) {
  const windowRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLSpanElement>(null);
  const [track, setTrack] = useState({ repeats: 4, duration: 80 });

  useEffect(() => {
    const windowElement = windowRef.current, sequence = sequenceRef.current;
    if (!windowElement || !sequence) return;
    // Each identical half must fill the viewport, even with one short CMS phrase.
    const update = () => {
      const width = Math.max(1, sequence.getBoundingClientRect().width);
      const repeats = Math.max(1, Math.ceil(windowElement.clientWidth / width));
      const duration = width * repeats / 24;
      setTrack(current => current.repeats === repeats && current.duration === duration ? current : { repeats, duration });
    };
    const observer = new ResizeObserver(update);
    observer.observe(windowElement);
    observer.observe(sequence);
    update();
    return () => observer.disconnect();
  }, [phrases]);

  return <div ref={windowRef} className={styles.ticker} data-static={reduced} role="region" aria-label="Tapparo in Worten">
    <p className="sr-only">{phrases.join(", ")}</p>
    <div className={styles.tickerTrack} aria-hidden="true" style={{ animationPlayState: stopped ? "paused" : "running", animationDuration: `${track.duration}s` }}>
      {[0, 1].map(copy => <span className={styles.tickerCopy} key={copy}>
        {Array.from({ length: track.repeats }, (_, repeat) => <span className={styles.tickerSequence} key={repeat} ref={copy === 0 && repeat === 0 ? sequenceRef : undefined}>
          {phrases.map((phrase, index) => <span className={styles.tickerItem} key={index}><span>{phrase}</span><span className={styles.tickerSeparator}>•</span></span>)}
        </span>)}
      </span>)}
    </div>
  </div>;
}

