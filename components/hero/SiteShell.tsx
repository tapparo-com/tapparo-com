"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useOpeningStatus } from "@/lib/opening-hours/useOpeningStatus";
import type { OpeningStatus } from "@/lib/opening-hours";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { lockPageScroll } from "@/lib/scroll-lock";
import { EASE } from "./HeroParts";
import type { SiteData } from "./types";

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

export function SiteShell({
  data,
  children,
}: {
  data: SiteData;
  children: ReactNode;
}) {
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
    visibility();
    setHydrated(true);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuPresent) return;
    const panel = root.current?.querySelector<HTMLElement>(
      "[data-navigation-scroll]",
    );
    if (!panel) return;
    const unlock = lockPageScroll(panel);
    const menuButton = button.current;
    menuButton?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex='0']",
        ) || [],
      ).filter(
        (element) =>
          !element.closest("[inert]") && element.getClientRects().length > 0,
      );
      if (!focusable.length) return;
      // Cycle explicitly: WebKit's default keyboard preference can skip links,
      // otherwise letting focus escape this dialog between its endpoints.
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next =
        current < 0
          ? event.shiftKey
            ? focusable.length - 1
            : 0
          : (current + (event.shiftKey ? -1 : 1) + focusable.length) %
            focusable.length;
      event.preventDefault();
      focusable[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.removeEventListener("keydown", onKey);
      menuButton?.focus({ preventScroll: true });
    };
  }, [menuPresent]);

  return (
    <SiteContext.Provider
      value={{ data, status, reduced, hydrated, visible, menuPresent }}
    >
      <div
        ref={root}
        className="hero-stage site-shell bg-background pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] [font-family:var(--font-instrument-sans),_sans-serif] text-foreground [--header-height:calc(108px_+_env(safe-area-inset-top))] [--page-gutter:32px] max-[1024px]:[--header-height:calc(84px_+_env(safe-area-inset-top))] max-[1024px]:[--page-gutter:20px] [&_:is(a,_button,_select,_textarea,_summary,_input):focus-visible]:[outline:2px_solid_var(--color-accent)] [&_:is(a,_button,_select,_textarea,_summary,_input):focus-visible]:outline-offset-[5px] [&_:is(button,_a,_summary,_select,_textarea)]:[-webkit-tap-highlight-color:transparent] [&_:is(button,_summary)]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[.5] [&[data-entrance='first']]:[--entry-delay:.7s] [&[data-entrance='return']]:[--entry-delay:0s]"
        data-site-shell
        data-reduced-motion={reduced}
        role={menuPresent ? "dialog" : undefined}
        aria-modal={menuPresent || undefined}
        aria-label={menuPresent ? "Hauptnavigation" : undefined}
      >
        <div inert={menuPresent} aria-hidden={menuPresent || undefined}>
          <a
            className="fixed top-2 left-2 z-[120] [transform:translateY(-200%)] bg-background px-3 py-3 focus:[transform:none]"
            href="#main-content"
          >
            Zum Inhalt
          </a>
          <div
            className="hero-page-header h-[var(--header-height)]"
            aria-hidden="true"
          />
          <noscript>
            <nav
              className="flex flex-wrap gap-6 px-6 py-4"
              aria-label="Hauptnavigation"
            >
              {links.map((link) => (
                <a key={link.key} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </noscript>
          {children}
        </div>
        <AnimatePresence
          onExitComplete={() => {
            if (!menuOpen) setMenuPresent(false);
          }}
        >
          {menuOpen && (
            <motion.div
              key="site-navigation"
              id={navigationId}
              className="fixed top-0 right-0 bottom-0 left-0 z-[60] h-dvh bg-background"
              initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              exit={{
                clipPath: "inset(0 0 100% 0)",
                transition: {
                  duration: reduced ? 0 : 0.4,
                  delay: reduced ? 0 : 0.12,
                  ease: EASE,
                },
              }}
            >
              <NavigationContent
                navigation={navigation}
                status={status}
                contact={contact}
                pathname={pathname}
                reduced={reduced}
                onNavigate={() => setMenuOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <SiteHeader
          brand={brand}
          open={menuOpen}
          present={menuPresent}
          reduced={reduced}
          navigationId={navigationId}
          buttonRef={button}
          onHome={() => setMenuOpen(false)}
          onToggle={() => {
            if (menuOpen) setMenuOpen(false);
            else {
              setMenuPresent(true);
              setMenuOpen(true);
            }
          }}
        />
        <SiteIntro
          enabled={data.intro?.enabled !== false}
          artwork={data.intro?.artworkUrl}
          reduced={reduced}
          menuPresent={menuPresent}
        />
      </div>
    </SiteContext.Provider>
  );
}
