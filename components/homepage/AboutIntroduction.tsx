"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { REVEAL_EASE } from "@/lib/animation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AnimatedUnderline } from "./AnimatedUnderline";
import styles from "./Homepage.module.css";

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
  const showDetails = immediate || ((!children || textFinished) && detailsInView);
  const target = (show: boolean) => ({ opacity: show ? 1 : 0, y: show ? 0 : 24 });

  return (
    <div className={styles.aboutCopy} onFocusCapture={() => setFocused(true)}>
      {children && (
        <motion.div
          ref={textRef}
          className={`${styles.richText} ${styles.aboutText}`}
          initial={false}
          animate={target(showText)}
          transition={{ duration: immediate ? 0 : TEXT_REVEAL_DURATION, ease: REVEAL_EASE }}
        >
          {children}
        </motion.div>
      )}
      {(button || openingHours?.length) ? (
        <div ref={detailsRef} className={styles.aboutBottom}>
          {openingHours?.length ? (
            <motion.dl
              className={styles.hours}
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
              transition={{ duration: immediate ? 0 : 0.65, delay: showDetails && openingHours?.length && !immediate ? 0.18 : 0, ease: REVEAL_EASE }}
            >
              <TransitionLink href={button.href} className={styles.animatedLink}>
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
