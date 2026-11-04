"use client";

import { useEffect, useRef, type RefObject } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { BrandArtwork } from "./HeroParts";
import type { SiteData } from "./types";
import styles from "./Hero.module.css";

export function ScrollHeader({ scope, brand, pathname, reduced }: {
  scope: RefObject<HTMLDivElement | null>;
  brand: SiteData["brand"];
  pathname: string;
  reduced: boolean;
}) {
  const header = useRef<HTMLElement>(null);
  const dock = useRef<HTMLSpanElement>(null);
  const travelling = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = header.current, target = dock.current, artwork = travelling.current;
    const page = scope.current;
    if (!shell || !target || !artwork || !page || pathname !== "/") return;
    let dispose = () => {};
    let connectedSource: HTMLElement | null = null;
    // App Router can stream the page after the persistent shell has mounted.
    // Reconnect only when a new hero replaces it, including CMS image changes.
    const connect = () => {
      const hero = scope.current?.querySelector<HTMLElement>("[data-section-page][data-has-leading-hero='true'] [data-site-hero]");
      const source = hero?.querySelector<HTMLElement>("[data-hero-logo]");
      if ((source || null) === connectedSource) return;
      dispose();
      connectedSource = source || null;
      if (!hero || !source) return;
      const originalVisibility = source.style.visibility;
      let frame = 0;
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const update = () => {
        frame = 0;
        const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        const logoTop = from.top + window.scrollY;
        const start = Math.max(heroRect.top + window.scrollY, logoTop - window.innerHeight * 0.55);
        const end = Math.max(start + 160, heroRect.bottom + window.scrollY - to.bottom - 14);
        const progress = clamp((window.scrollY - start) / (end - start));
        const active = reduced ? progress === 1 : progress > 0;
        const t = reduced ? 1 : progress * progress * (3 - 2 * progress);
        const mix = (a: number, b: number) => a + (b - a) * t;
        // Rise and shrink before settling into the top-left header position.
        const rise = clamp(progress * 2);
        const vertical = reduced ? 1 : rise * rise * (3 - 2 * rise);
        const top = logoTop - start + (to.top - (logoTop - start)) * vertical;
        const sourceFocused = document.activeElement === source;
        const copyFocused = artwork.contains(document.activeElement);

        // Keep the source in normal flow, so resize, reverse scrolling and restoration
        // always measure the original layout instead of the animated copy.
        source.style.visibility = active ? "hidden" : originalVisibility;
        shell.style.visibility = active ? "visible" : "hidden";
        shell.setAttribute("aria-hidden", String(!active));
        shell.dataset.scrollProgress = progress.toFixed(3);
        shell.dataset.docked = String(progress === 1);
        artwork.style.width = `${from.width + (to.width - from.width) * vertical}px`;
        artwork.style.height = `${from.height + (to.height - from.height) * vertical}px`;
        artwork.style.transform = `translate3d(${mix(from.left, to.left)}px, ${top}px, 0)`;
        if (active && sourceFocused) artwork.querySelector("a")?.focus({ preventScroll: true });
        else if (!active && copyFocused) source.focus({ preventScroll: true });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      const observer = new ResizeObserver(schedule);
      observer.observe(hero);
      observer.observe(source);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      window.visualViewport?.addEventListener("resize", schedule);
      update();
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.visualViewport?.removeEventListener("resize", schedule);
        source.style.visibility = originalVisibility;
        shell.style.visibility = "hidden";
        shell.setAttribute("aria-hidden", "true");
      };
    };
    const contentObserver = new MutationObserver(connect);
    contentObserver.observe(page, { childList: true, subtree: true });
    connect();
    return () => { contentObserver.disconnect(); dispose(); };
  }, [scope, brand.logo, pathname, reduced]);

  return <header ref={header} className={styles.scrollHeader} aria-label={brand.name} aria-hidden="true" data-scroll-header>
    <span ref={dock} className={styles.logoDock} aria-hidden="true" />
    <div ref={travelling} className={styles.travellingLogo}>
      <TransitionLink href="/" aria-label={`${brand.name} Startseite`}><BrandArtwork logo={brand.logo} /></TransitionLink>
    </div>
  </header>;
}
