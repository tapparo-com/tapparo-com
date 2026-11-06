"use client";

import type { RefObject } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { BrandArtwork, MenuIcon } from "./HeroParts";
import type { SiteData } from "./types";
import styles from "./Hero.module.css";

export function SiteHeader({ brand, open, present, reduced, navigationId, buttonRef, onToggle, onHome }: {
  brand: SiteData["brand"];
  open: boolean;
  present: boolean;
  reduced: boolean;
  navigationId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onHome: () => void;
}) {
  return <header className={styles.siteHeader} aria-label={brand.name}>
    <TransitionLink href="/" className={styles.headerLogo} data-header-control data-header-logo aria-label={`${brand.name} Startseite`} onClick={onHome}>
      <BrandArtwork logo={brand.logo} />
    </TransitionLink>
    <button ref={buttonRef} type="button" className={styles.menuButton} data-header-control onClick={onToggle}
      aria-label={open ? "Navigation schließen" : "Navigation öffnen"} aria-haspopup="dialog" aria-expanded={open} aria-controls={present ? navigationId : undefined}>
      <MenuIcon open={open} reduced={reduced} />
    </button>
  </header>;
}
