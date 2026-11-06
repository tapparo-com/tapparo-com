"use client";

import type { RefObject } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { BrandArtwork, MenuIcon } from "./HeroParts";
import type { SiteData } from "./types";

export function SiteHeader({
  brand,
  open,
  present,
  reduced,
  navigationId,
  buttonRef,
  onToggle,
  onHome,
}: {
  brand: SiteData["brand"];
  open: boolean;
  present: boolean;
  reduced: boolean;
  navigationId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onHome: () => void;
}) {
  return (
    <header
      className="hero-site-header pointer-events-none fixed top-0 right-0 bottom-auto left-0 z-[63] h-[var(--header-height)] before:absolute before:inset-x-0 before:top-0 before:h-[env(safe-area-inset-top)] before:bg-background before:content-['']"
      aria-label={brand.name}
    >
      <TransitionLink
        href="/"
        className="hero-header-logo pointer-events-auto absolute top-[calc(var(--page-gutter)_+_env(safe-area-inset-top))] left-[max(var(--page-gutter),_env(safe-area-inset-left))] h-11 w-40 [transition:opacity_.18s_ease,_visibility_.18s_ease] motion-reduce:transition-none max-[1024px]:w-[146px]"
        data-header-control
        data-header-logo
        aria-label={`${brand.name} Startseite`}
        onClick={onHome}
      >
        <BrandArtwork logo={brand.logo} />
      </TransitionLink>
      <button
        ref={buttonRef}
        type="button"
        className="pointer-events-auto absolute top-[calc(var(--page-gutter)_+_env(safe-area-inset-top))] right-[max(var(--page-gutter),_env(safe-area-inset-right))] grid h-11 w-11 place-items-center [&_svg]:overflow-visible [&[data-over-image='true']]:text-white [&[data-over-image='true']]:[filter:drop-shadow(0_1px_2px_#0008)]"
        data-header-control
        onClick={onToggle}
        aria-label={open ? "Navigation schließen" : "Navigation öffnen"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={present ? navigationId : undefined}
      >
        <MenuIcon open={open} reduced={reduced} />
      </button>
    </header>
  );
}
