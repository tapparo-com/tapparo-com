"use client";

import { pathForSlug } from "@/lib/urls";
import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import {
  MENU_OVERLAY_DURATION,
  MENU_OVERLAY_STAGGER,
  REVEAL_EASE,
} from "@/lib/animation";

type HeaderNav = {
  pageLinks?: { _key: string; label: string; slug: string }[];
  socialLinks?: { _id: string; label: string; url: string }[];
  showPhone?: boolean;
  phone?: string | null;
};

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  headerNav?: HeaderNav | null;
};

const linkClass =
  "font-sans text-[30px] font-medium tracking-tight text-foreground transition-colors hover:text-accent";

export function MenuOverlay({ isOpen, onClose, headerNav }: MenuOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const allLinks = [
    ...(headerNav?.pageLinks?.map((item) => ({
      key: item._key,
      content: (
        <TransitionLink
          href={pathForSlug(item.slug)}
          onClick={onClose}
          className={linkClass}
        >
          {item.label}
        </TransitionLink>
      ),
    })) || []),
    ...(headerNav?.socialLinks?.map((link) => ({
      key: link._id,
      content: (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {link.label}
        </a>
      ),
    })) || []),
    ...(headerNav?.phone
      ? [
          {
            key: "phone",
            content: (
              <a
                href={`tel:${headerNav.phone.replace(/\s/g, "")}`}
                className={linkClass}
              >
                {headerNav.phone}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="menu-overlay"
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : MENU_OVERLAY_DURATION,
            ease: REVEAL_EASE,
          }}
        >
          <nav className="flex flex-col items-center gap-4">
            {allLinks.map((link, i) => (
              <motion.div
                key={link.key}
                initial={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : MENU_OVERLAY_DURATION,
                  ease: REVEAL_EASE,
                  delay: prefersReducedMotion
                    ? 0
                    : MENU_OVERLAY_STAGGER * i,
                }}
              >
                {link.content}
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
