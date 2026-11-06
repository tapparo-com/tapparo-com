"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useOpeningStatus } from "@/lib/opening-hours/useOpeningStatus";
import type { OpeningStatus } from "@/lib/opening-hours";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASE } from "./HeroParts";
import type { SiteData } from "./types";
import styles from "./Hero.module.css";
import { SiteHeader } from "./SiteHeader";
import { NavigationContent } from "./NavigationContent";
import { useHeaderBehavior } from "./useHeaderBehavior";
import { getMenuLinks } from "./navigation";
import { SiteIntro } from "./SiteIntro";

type SiteContextValue = {
  data: SiteData;
  status: OpeningStatus;
  reduced: boolean;
  hydrated: boolean;
  visible: boolean;
  menuPresent: boolean;
};
const SiteContext = createContext<SiteContextValue | null>(null);
export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("Hero sections require the site shell.");
  return site;
}

export function SiteShell({ data, children }: { data: SiteData; children: ReactNode }) {
  const pathname = usePathname();
  const navigationId = useId();
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPresent, setMenuPresent] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const status = useOpeningStatus(data.hours);
  const { brand, contact, navigation } = data;
  useHeaderBehavior(root, pathname, menuPresent);
  const links = getMenuLinks(navigation);

  useEffect(() => {
    const visibility = () => setVisible(!document.hidden);
    visibility(); setHydrated(true);
    document.addEventListener("visibilitychange", visibility);
    return () => { document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuPresent) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    button.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(root.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']") || [])
        .filter(element => !element.closest("[inert]") && element.getClientRects().length > 0);
      if (!focusable.length) return;
      // Cycle explicitly: WebKit's default keyboard preference can skip links,
      // otherwise letting focus escape this dialog between its endpoints.
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = current < 0 ? (event.shiftKey ? focusable.length - 1 : 0)
        : (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      button.current?.focus({ preventScroll: true });
    };
  }, [menuPresent]);

  return <SiteContext.Provider value={{ data, status, reduced, hydrated, visible, menuPresent }}>
    <div ref={root} className={`${styles.preview} ${styles.siteShell}`} data-site-shell data-reduced-motion={reduced}
      role={menuPresent ? "dialog" : undefined} aria-modal={menuPresent || undefined} aria-label={menuPresent ? "Hauptnavigation" : undefined}>
      <div className={styles.viewportOutline} aria-hidden="true" />
      <div inert={menuPresent} aria-hidden={menuPresent || undefined}>
        <a className={styles.skipLink} href="#main-content">Zum Inhalt</a>
        <div className={styles.pageHeader} aria-hidden="true" />
        <noscript><nav className={styles.fallbackNavigation} aria-label="Hauptnavigation">{links.map(link => <a key={link.key} href={link.href}>{link.label}</a>)}</nav></noscript>
        {children}
      </div>
      <AnimatePresence onExitComplete={() => { if (!menuOpen) setMenuPresent(false); }}>
        {menuOpen && <motion.div key="site-navigation" id={navigationId} className={styles.navigation}
          initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.12, ease: EASE } }}>
          <NavigationContent navigation={navigation} status={status} contact={contact} pathname={pathname} reduced={reduced} onNavigate={() => setMenuOpen(false)} />
        </motion.div>}
      </AnimatePresence>
      <SiteHeader brand={brand} open={menuOpen} present={menuPresent} reduced={reduced} navigationId={navigationId} buttonRef={button}
        onHome={() => setMenuOpen(false)} onToggle={() => { if (menuOpen) setMenuOpen(false); else { setMenuPresent(true); setMenuOpen(true); } }} />
      <SiteIntro enabled={data.intro?.enabled !== false} artwork={data.intro?.artworkUrl} reduced={reduced} menuPresent={menuPresent} />
    </div>
  </SiteContext.Provider>;
}
