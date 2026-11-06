"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/ui/PageTransition";
import { IntroWelcome } from "./IntroWelcome";
import { SITE_INTRO_SESSION_KEY, WELCOME_BOOTSTRAP, useHeroEntrance } from "./useHeroEntrance";
import styles from "./Hero.module.css";

type Props = { enabled: boolean; artwork?: string | null; reduced: boolean; menuPresent: boolean };

export function SiteIntro(props: Props) {
  const pathname = usePathname();
  const [entryPath] = useState(pathname);
  // The hero owns Home's welcome. This stays mounted for the initial route
  // only, so client navigation cannot introduce another welcome screen.
  if (entryPath === "/" || entryPath === "/home") return null;
  return <PageIntro {...props} entryPath={entryPath} pathname={pathname} />;
}

function PageIntro({ enabled, artwork, reduced, menuPresent, entryPath, pathname }: Props & { entryPath: string; pathname: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { isTransitioning } = usePageTransition();
  const interrupted = isTransitioning || menuPresent || pathname !== entryPath;
  const { entrance, finish } = useHeroEntrance(root, null, reduced, SITE_INTRO_SESSION_KEY, interrupted, enabled);

  useEffect(() => { if (interrupted) finish(); }, [interrupted, finish]);

  return <div ref={root} className={styles.intro} aria-hidden="true" data-site-intro
    data-first-intro={entrance.mode === "first" || undefined} suppressHydrationWarning>
    {enabled && <script dangerouslySetInnerHTML={{ __html: WELCOME_BOOTSTRAP }} />}
    {entrance.mode === "first" && <IntroWelcome artwork={artwork} />}
  </div>;
}
