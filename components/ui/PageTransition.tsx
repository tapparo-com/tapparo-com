"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PAGE_TRANSITION_DURATION, REVEAL_EASE } from "@/lib/animation";

type PageTransitionContextType = {
  navigateTo: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateTo: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pendingHref = useRef<string | null>(null);

  const navigateTo = useCallback(
    (href: string) => {
      if (prefersReducedMotion) {
        router.push(href);
        return;
      }
      pendingHref.current = href;
      setIsTransitioning(true);
    },
    [router, prefersReducedMotion]
  );

  // When overlay is fully visible, navigate
  const handleAnimationComplete = useCallback(() => {
    if (isTransitioning && pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
    }
  }, [isTransitioning, router]);

  // When pathname changes, fade overlay out
  useEffect(() => {
    if (isTransitioning) {
      // Small delay to let the new page render beneath the overlay
      const timeout = setTimeout(() => setIsTransitioning(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageTransitionContext.Provider value={{ navigateTo }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="page-transition-overlay"
            className="fixed inset-0 z-[100] bg-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: PAGE_TRANSITION_DURATION, ease: REVEAL_EASE }}
            onAnimationComplete={handleAnimationComplete}
          />
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
