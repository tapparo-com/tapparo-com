"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { REVEAL_EASE } from "@/lib/animation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";

const TEXT_REVEAL_DURATION = 0.9;

type Props = {
  children?: ReactNode;
  button?: { href: string; label: string };
  openingHours?: { _key: string; day: string; hours: string }[];
};

export function AboutIntroduction({ children, button, openingHours }: Props) {
  const textRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textRef, { once: true, amount: 0.1 });
  const detailsInView = useInView(detailsRef, { once: true, amount: 0.15 });
  const reducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [textFinished, setTextFinished] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!textInView) return;
    // Also completes if the text was already visible on hydration or scroll restore.
    const timer = window.setTimeout(
      () => setTextFinished(true),
      reducedMotion ? 0 : TEXT_REVEAL_DURATION * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [textInView, reducedMotion]);

  // Server HTML stays readable. Keyboard focus and reduced motion reveal everything.
  const immediate = !hydrated || reducedMotion || focused;
  const showText = immediate || textInView;
  // On long mobile paragraphs, wait until the supporting row reaches the viewport.
  const showDetails =
    immediate || ((!children || textFinished) && detailsInView);
  const target = (show: boolean) => ({
    opacity: show ? 1 : 0,
    y: show ? 0 : 24,
  });

  return (
    <div
      className="grid gap-[clamp(32px,_4vw,_72px)]"
      onFocusCapture={() => setFocused(true)}
    >
      {children && (
        <motion.div
          ref={textRef}
          className="editorial-text text-[clamp(30px,_3.35vw,_64px)] leading-[1.2] font-normal tracking-[-0.035em] text-pretty wrap-anywhere max-[768px]:text-[clamp(22px,_4.4vw,_28px)] max-[768px]:leading-[1.4] max-[768px]:tracking-[-0.015em] [&_:is(h2,_h3,_h4)]:text-[1.14em] [&_:is(h2,_h3,_h4)]:leading-[1.15] [&_:is(h2,_h3,_h4)]:font-medium [&_:is(ul,_ol)]:pl-[1.2em] [&_>_*_+_*]:mt-[0.8em] [&_>_p:first-child]:[text-indent:16.666%] max-[768px]:[&_>_p:first-child]:[text-indent:0] [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[0.15em] [&_a:hover]:decoration-accent [&_ol]:list-decimal [&_strong]:[font-weight:inherit] [&_strong]:text-accent [&_ul]:list-disc"
          initial={false}
          animate={target(showText)}
          transition={{
            duration: immediate ? 0 : TEXT_REVEAL_DURATION,
            ease: REVEAL_EASE,
          }}
        >
          {children}
        </motion.div>
      )}
      {button || openingHours?.length ? (
        <div
          ref={detailsRef}
          className="section-about-bottom flex flex-wrap items-start justify-between gap-x-16 gap-y-8 border-t border-solid border-t-border pt-6 max-[768px]:gap-7 [&_>_div]:ml-auto [&_>_div]:max-w-full [&_>_div]:shrink-0 [&_>_div]:text-right [&_a]:max-w-full [&_a]:wrap-anywhere"
        >
          {openingHours?.length ? (
            <motion.dl
              className="section-hours mr-auto w-full max-w-110 text-[15px] leading-[1.5] [&_>_div]:grid [&_>_div]:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] [&_>_div]:gap-3 [&_>_div]:border-b [&_>_div]:border-solid [&_>_div]:border-b-border [&_>_div]:py-[9px] [&_>_div:first-child]:pt-0 [&_dd]:text-right [&_dd]:wrap-anywhere"
              initial={false}
              animate={target(showDetails)}
              transition={{
                duration: immediate ? 0 : 0.65,
                delay: 0,
                ease: REVEAL_EASE,
              }}
            >
              {openingHours.map((row) => (
                <div key={row._key}>
                  <dt>{row.day}</dt>
                  <dd>{row.hours}</dd>
                </div>
              ))}
            </motion.dl>
          ) : null}
          {button && (
            <motion.div
              initial={false}
              animate={target(showDetails)}
              transition={{
                duration: immediate ? 0 : 0.65,
                delay:
                  showDetails && openingHours?.length && !immediate ? 0.18 : 0,
                ease: REVEAL_EASE,
              }}
            >
              <TransitionLink
                href={button.href}
                className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
              >
                <span>{button.label}</span>
                <AnimatedUnderline />
              </TransitionLink>
            </motion.div>
          )}
        </div>
      ) : null}
    </div>
  );
}
