"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useOpeningStatus } from "@/lib/opening-hours/useOpeningStatus";
import type { OpeningStatus } from "@/lib/opening-hours";
import { pathForSlug } from "@/lib/urls";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { BrandArtwork, EASE, MenuArtwork, MenuIcon, OrderingLink, StatusDetails } from "./HeroParts";
import type { SiteData } from "./types";
import styles from "./Hero.module.css";

type SiteContextValue = {
  data: SiteData;
  status: OpeningStatus;
  reduced: boolean;
  hydrated: boolean;
  visible: boolean;
  menuPresent: boolean;
  setEntrance: (mode: string) => void;
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
  const [entrance, setEntrance] = useState("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPresent, setMenuPresent] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const status = useOpeningStatus(data.hours);
  const { brand, contact, navigation } = data;
  const links = [
    ...(navigation?.pageLinks || []).filter(link => link.slug).map(link => ({ key: link._key, label: link.label, href: pathForSlug(link.slug), external: false })),
    ...(navigation?.socialLinks || []).map(link => ({ key: link._id, label: link.label, href: link.url, external: true })),
  ];

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
      const focusable = Array.from(root.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") || [])
        .filter(element => !element.closest("[inert]") && element.getClientRects().length > 0);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      button.current?.focus({ preventScroll: true });
    };
  }, [menuPresent]);

  return <SiteContext.Provider value={{ data, status, reduced, hydrated, visible, menuPresent, setEntrance }}>
    <div ref={root} className={`${styles.preview} ${styles.siteShell}`} data-site-shell data-reduced-motion={reduced} data-entrance={entrance}
      role={menuPresent ? "dialog" : undefined} aria-modal={menuPresent || undefined} aria-label={menuPresent ? "Hauptnavigation" : undefined}>
      <div className={styles.viewportOutline} aria-hidden="true" />
      <div inert={menuPresent} aria-hidden={menuPresent || undefined}>
        <a className={styles.skipLink} href="#main-content">Zum Inhalt</a>
        <header className={styles.pageHeader}>
          <TransitionLink href="/" aria-label={`${brand.name} Startseite`}><BrandArtwork logo={brand.logo} /></TransitionLink>
        </header>
        <noscript><nav className={styles.fallbackNavigation} aria-label="Hauptnavigation">{links.map(link => <a key={link.key} href={link.href}>{link.label}</a>)}</nav></noscript>
        {children}
      </div>
      <AnimatePresence onExitComplete={() => { if (!menuOpen) setMenuPresent(false); }}>
        {menuOpen && <motion.div key="site-navigation" id={navigationId} className={styles.navigation}
          initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.12, ease: EASE } }}>
          <div className={`${styles.viewportLayout} ${styles.navigationLayout}`}>
            <TransitionLink href="/" className={styles.menuLogo} aria-label={`${brand.name} Startseite`} onClick={() => setMenuOpen(false)}>
              <MenuArtwork reduced={reduced} delay={0.1}><BrandArtwork logo={brand.logo} /></MenuArtwork>
            </TransitionLink>
            <motion.nav aria-label="Hauptnavigation" className={styles.menuLinks} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.15 }}>
              {links.map((link, index) => <motion.div key={link.key}
                initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.08 + index * 0.05 }}>
                <TransitionLink href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}
                  aria-current={!link.external && pathname === link.href ? "page" : undefined}
                  onClick={event => { if (!link.external && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setMenuOpen(false); }}>{link.label}</TransitionLink>
              </motion.div>)}
              {navigation?.phone && <a className={styles.menuPhone} href={`tel:${navigation.phone.replace(/[^+\d]/g, "")}`}>{navigation.phone}</a>}
            </motion.nav>
            <div className={styles.order}><MenuArtwork reduced={reduced} delay={0.24}><OrderingLink /></MenuArtwork></div>
            <motion.div className={styles.details} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.18 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15 } }}>
              <StatusDetails status={status} contact={contact} />
            </motion.div>
          </div>
        </motion.div>}
      </AnimatePresence>
      <div className={styles.menuShell}>
        <button ref={button} type="button" className={styles.menuButton}
          onClick={() => { if (menuOpen) setMenuOpen(false); else { setMenuPresent(true); setMenuOpen(true); } }}
          aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"} aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls={menuPresent ? navigationId : undefined}>
          <MenuIcon open={menuOpen} reduced={reduced} />
        </button>
      </div>
    </div>
  </SiteContext.Provider>;
}
