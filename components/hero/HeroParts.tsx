"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { OpeningStatus } from "@/lib/opening-hours";
import { ORDER_PATH } from "@/lib/ordering";
import {
  resolveHeroSecondaryLink,
  type HeroSecondaryLink,
} from "@/lib/hero-links";
import type { SiteData } from "./types";
import { REVEAL_EASE, HERO_CROSSFADE } from "@/lib/animation";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";

export const ASSETS = "/brand/";
export const EASE = REVEAL_EASE;
export const CROSSFADE_SECONDS = HERO_CROSSFADE;

// Original Figma strokes: translate/rotate these same lines into a handdrawn cross.
const MENU_STROKES = [
  "M4.1875 7.00369C5.49983 6.95714 8.89143 7.36277 12.3757 7.53643C15.5579 7.69503 18.6742 7.2468 20.5135 7.30314C22.0679 7.35076 23.0223 7.42668 26.2735 7.61995C27.0445 7.67687 27.4045 7.74437 27.6799 7.77913C27.9553 7.8139 28.1353 7.8139 28.3207 7.8139",
  "M4.14258 16.1384C4.23257 16.1384 6.21367 16.0245 9.57255 15.8856C11.85 15.7915 14.5996 15.9066 17.9462 15.8135C20.4604 15.9015 22.4265 16.1289 24.06 16.2985C24.7935 16.3335 25.3334 16.2645 26.0235 16.1926",
  "M4 24.3076C4.22497 24.3976 4.74581 24.6014 7.32786 24.9636C9.49336 25.2674 13.4419 25.4155 15.7288 25.5199C19.3104 25.6835 20.581 25.233 21.9922 25.0025C23.6529 24.9084 24.6312 24.9747 25.1411 25.0769C25.4036 25.1117 25.6735 25.1117 26.2244 25.2481",
];

export function MenuIcon({
  open,
  reduced,
}: {
  open: boolean;
  reduced: boolean;
}) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      {MENU_STROKES.map((stroke, index) => (
        <motion.g
          key={stroke}
          initial={false}
          animate={{
            y: open ? [8.6, 0, -9.2][index] : 0,
            opacity: open && index === 1 ? 0 : 1,
          }}
          transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
        >
          <motion.path
            d={stroke}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
            initial={false}
            animate={{
              rotate: open ? [45, 0, -45][index] : 0,
              scaleX: open && index === 1 ? 0.6 : 1,
            }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

export function BrandArtwork({ logo }: { logo?: string | null }) {
  if (logo)
    return (
      <span className="hero-artwork block h-full w-full [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img]:[object-position:left_center]">
        {/* CMS SVG artwork keeps its intrinsic ratio inside the shared logo frame. */}
        <img src={logo} alt="" />
      </span>
    );
  return (
    <picture className="hero-artwork block h-full w-full [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img]:[object-position:left_center]">
      <source
        media="(min-width: 1024px)"
        srcSet={`${ASSETS}logo-desktop.svg`}
      />
      <img src={`${ASSETS}logo-mobile.svg`} alt="" width={180} height={66} />
    </picture>
  );
}

export function OrderingLink() {
  return (
    <TransitionLink
      href={ORDER_PATH}
      className="animated-link hero-action-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
    >
      <span>jetzt bestellen</span>
      <AnimatedUnderline />
    </TransitionLink>
  );
}

export function HeroChoices({
  secondaryLink,
}: {
  secondaryLink?: HeroSecondaryLink | null;
}) {
  const link = resolveHeroSecondaryLink(secondaryLink);
  return (
    <div className="hero-choices mt-6 flex flex-wrap items-start gap-x-7 gap-y-3 max-[1024px]:mt-[14px] max-[1024px]:gap-x-5 max-[1024px]:gap-y-2 [@media_(max-height:_600px)_and_(min-width:_1024px)]:mt-6">
      <OrderingLink />
      {link && (
        <TransitionLink
          href={link.href}
          className="animated-link hero-action-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
        >
          <span>{link.label}</span>
          <AnimatedUnderline />
        </TransitionLink>
      )}
    </div>
  );
}

export function StatusDetails({
  status,
  contact,
}: {
  status: OpeningStatus;
  contact: SiteData["contact"];
}) {
  const address = contact?.address?.replace(/\s*\n\s*/g, ", ");
  return (
    <div className="hero-status-details text-center text-[15px] leading-[1.45] tracking-[-.08px] max-[1024px]:text-[14px] [&_>_p:first-child]:flex [&_>_p:first-child]:items-center [&_>_p:first-child]:justify-center [&_>_p:first-child]:gap-2 [&_a:hover]:underline [&_a:hover]:underline-offset-[4px]">
      <p aria-live="polite">
        <span
          className="h-[9px] w-[9px] flex-[0_0_9px] rounded-full bg-[#6B4443] [&[data-open='true']]:bg-[#5ACF00] [&[data-status='unknown']]:bg-[#74716C]"
          data-open={status === "open"}
          data-status={status}
        />
        <span>
          {status === "open"
            ? "Gerade offen"
            : status === "closed"
              ? "Gerade geschlossen"
              : "Öffnungszeiten prüfen"}
        </span>
      </p>
      {address &&
        (contact?.mapUrl ? (
          <a
            href={contact.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-address"
          >
            {address}
          </a>
        ) : (
          <p className="hero-address">{address}</p>
        ))}
    </div>
  );
}

export function HeroTicker({
  phrases,
  stopped,
  reduced = false,
}: {
  phrases: string[];
  stopped: boolean;
  reduced?: boolean;
}) {
  const windowRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLSpanElement>(null);
  const [track, setTrack] = useState({ repeats: 4, duration: 80 });

  useEffect(() => {
    const windowElement = windowRef.current,
      sequence = sequenceRef.current;
    if (!windowElement || !sequence) return;
    // Each identical half must fill the viewport, even with one short CMS phrase.
    const update = () => {
      const width = Math.max(1, sequence.getBoundingClientRect().width);
      const repeats = Math.max(1, Math.ceil(windowElement.clientWidth / width));
      const duration = (width * repeats) / 24;
      setTrack((current) =>
        current.repeats === repeats && current.duration === duration
          ? current
          : { repeats, duration },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(windowElement);
    observer.observe(sequence);
    update();
    return () => observer.disconnect();
  }, [phrases]);

  return (
    <div
      ref={windowRef}
      className="hero-ticker w-full flex-none overflow-hidden text-left text-[clamp(24px,_2.25vw,_30px)] leading-[1.4] tracking-[-.025em] text-accent max-[1024px]:text-[24px]"
      data-static={reduced}
      role="region"
      aria-label="Tapparo in Worten"
    >
      <p className="sr-only">{phrases.join(", ")}</p>
      <div
        className="hero-ticker-track flex w-max [animation:ticker_80s_linear_infinite] motion-reduce:animate-none"
        aria-hidden="true"
        style={{
          animationPlayState: stopped ? "paused" : "running",
          animationDuration: `${track.duration}s`,
        }}
      >
        {[0, 1].map((copy) => (
          <span className="hero-ticker-copy flex flex-none" key={copy}>
            {Array.from({ length: track.repeats }, (_, repeat) => (
              <span
                className="hero-ticker-sequence flex flex-none"
                key={repeat}
                ref={copy === 0 && repeat === 0 ? sequenceRef : undefined}
              >
                {phrases.map((phrase, index) => (
                  <span
                    className="hero-ticker-item flex flex-none items-center gap-2 pr-2 whitespace-nowrap"
                    key={index}
                  >
                    <span>{phrase}</span>
                    <span className="flex-none">•</span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
