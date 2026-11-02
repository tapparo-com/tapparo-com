"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { PAGE_TRANSITION_DURATION, COVER_EASE } from "@/lib/animation";

type Options = { replace?: boolean; scroll?: boolean };
type Destination = { href: string; options: Options };
const PageTransitionContext = createContext<{
  navigateTo?: (href: string, options?: Options) => void;
  isTransitioning: boolean;
}>({ isTransitioning: false });

export function usePageTransition() { return useContext(PageTransitionContext); }

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "cover" | "waiting" | "reveal">("idle");
  const [pending, startTransition] = useTransition();
  const destination = useRef<Destination | null>(null);
  const origin = useRef(pathname);
  const dispatched = useRef(false);
  const navigate = useCallback(({ href, options }: Destination) => {
    startTransition(() => { if (options.replace) router.replace(href, { scroll: options.scroll }); else router.push(href, { scroll: options.scroll }); });
  }, [router]);
  const reset = useCallback(() => { destination.current = null; dispatched.current = false; setPhase("idle"); }, []);
  const navigateTo = useCallback((href: string, options: Options = {}) => {
    if (reduced) { navigate({ href, options }); return; }
    destination.current = { href, options };
    dispatched.current = false;
    origin.current = pathname;
    setPhase("cover");
  }, [navigate, pathname, reduced]);

  useEffect(() => {
    if (phase !== "waiting" || pending || !dispatched.current) return;
    // Also uncover after an error or cancelled navigation that kept the old path.
    const timer = setTimeout(() => setPhase("reveal"), 50);
    return () => clearTimeout(timer);
  }, [phase, pending, pathname]);
  useEffect(() => {
    if (phase === "idle") return;
    // A failed/hanging request can never leave the navigation hidden indefinitely.
    const timer = setTimeout(reset, 8000);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") reset(); };
    const onVisibility = () => { if (document.hidden) reset(); };
    window.addEventListener("popstate", reset);
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { clearTimeout(timer); window.removeEventListener("popstate", reset); document.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVisibility); };
  }, [phase, reset]);
  useEffect(() => {
    if (!reduced) return;
    if (destination.current && !dispatched.current) navigate(destination.current);
    reset();
  }, [reduced, navigate, reset]);

  return <PageTransitionContext.Provider value={{ navigateTo, isTransitioning: phase !== "idle" }}>
    {children}
    <AnimatePresence>
      {phase !== "idle" && <motion.div key="page-transition" data-page-transition={phase} aria-hidden="true"
        className="fixed inset-0 z-[100] bg-accent" initial={{ y: "100%" }} animate={{ y: phase === "reveal" ? "-100%" : "0%" }}
        transition={{ duration: reduced ? 0 : PAGE_TRANSITION_DURATION, ease: COVER_EASE }}
        onAnimationComplete={() => {
          if (phase === "cover" && destination.current && !dispatched.current) {
            dispatched.current = true; setPhase("waiting"); navigate(destination.current);
          } else if (phase === "reveal") {
            if (pathname !== origin.current && !location.hash) document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
            reset();
          }
        }} />}
    </AnimatePresence>
  </PageTransitionContext.Provider>;
}
