"use client";

import { motion } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { OpeningStatus } from "@/lib/opening-hours";
import { EASE, StatusDetails } from "./HeroParts";
import { getMenuLinks } from "./navigation";
import type { SiteData } from "./types";

export function NavigationContent({
  navigation,
  status,
  contact,
  pathname,
  reduced,
  onNavigate,
}: {
  navigation: SiteData["navigation"];
  status: OpeningStatus;
  contact: SiteData["contact"];
  pathname: string;
  reduced: boolean;
  onNavigate: () => void;
}) {
  const links = getMenuLinks(navigation);
  return (
    <div className="flex h-full overflow-y-auto overscroll-contain px-[var(--page-gutter)] pt-[calc(var(--header-height)_+_12px)] pb-12 max-[1024px]:pb-7">
      <div className="mx-auto my-auto w-full max-w-190 text-center">
        <nav
          aria-label="Hauptnavigation"
          className="flex flex-col items-center gap-[10px] [&_>_div]:max-w-full [&_>_div]:flex-none [&_a]:block [&_a]:min-h-11 [&_a]:max-w-full [&_a]:text-[clamp(44px,_4.8vw,_72px)] [&_a]:leading-[1.08] [&_a]:tracking-[-.045em] [&_a]:wrap-anywhere [&_a]:[transition:color_.2s_ease] motion-reduce:[&_a]:transition-none max-[1024px]:[&_a]:text-[clamp(34px,_9.5vw,_48px)] [&_a:hover]:text-accent [&_a[aria-current='page']]:text-accent"
        >
          {links.map((link, index) => (
            <motion.div
              key={link.key}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0 : 0.4,
                delay: reduced ? 0 : 0.08 + index * 0.045,
                ease: EASE,
              }}
            >
              <TransitionLink
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-current={
                  !link.external && pathname === link.href ? "page" : undefined
                }
                onClick={(event) => {
                  if (
                    !link.external &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                  )
                    onNavigate();
                }}
              >
                {link.label}
              </TransitionLink>
            </motion.div>
          ))}
        </nav>
        <motion.div
          className="mt-8 flex flex-col items-center max-[1024px]:mt-7"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.4,
            delay: reduced ? 0 : 0.22,
            ease: EASE,
          }}
        >
          {navigation?.phone && (
            <a
              className="mb-3 inline-flex min-h-11 items-center text-[16px] hover:underline hover:underline-offset-[4px]"
              href={`tel:${navigation.phone.replace(/[^+\d]/g, "")}`}
            >
              {navigation.phone}
            </a>
          )}
          <StatusDetails status={status} contact={contact} />
        </motion.div>
      </div>
    </div>
  );
}
