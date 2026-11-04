"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { REVEAL_EASE } from "@/lib/animation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./Homepage.module.css";

export function QuoteStatement({ quote, author }: { quote: string; author?: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Keep the server-rendered quote readable without JavaScript.
  const immediate = !hydrated || reducedMotion;
  const shown = immediate || inView;
  const target = { opacity: shown ? 1 : 0, y: shown ? 0 : 24 };

  return (
    <figure ref={ref} className={styles.quoteCopy}>
      <motion.blockquote
        initial={false}
        animate={target}
        transition={{ duration: immediate ? 0 : 0.85, ease: REVEAL_EASE }}
      >
        <span className={styles.quoteMark} aria-hidden="true">“</span>
        <p className={styles.quoteText}>{quote}</p>
      </motion.blockquote>
      {author && (
        <motion.figcaption
          className={styles.attribution}
          initial={false}
          animate={target}
          transition={{
            duration: immediate ? 0 : 0.65,
            delay: shown && !immediate ? 0.55 : 0,
            ease: REVEAL_EASE,
          }}
        >
          {author}
        </motion.figcaption>
      )}
    </figure>
  );
}
