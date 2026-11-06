"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { REVEAL_EASE } from "@/lib/animation";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function QuoteStatement({
  quote,
  author,
}: {
  quote: string;
  author?: string | null;
}) {
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
    <figure ref={ref} className="self-start">
      <motion.blockquote
        initial={false}
        animate={target}
        transition={{ duration: immediate ? 0 : 0.85, ease: REVEAL_EASE }}
      >
        <span
          className="mb-6 block w-fit text-[clamp(96px,_8vw,_160px)] leading-[0.65] text-accent max-[768px]:mb-5 max-[768px]:text-[80px]"
          aria-hidden="true"
        >
          “
        </span>
        <p className="text-[clamp(28px,_3.3vw,_64px)] leading-[1.18] font-normal tracking-[-0.035em] text-pretty wrap-anywhere whitespace-pre-line max-[768px]:text-[clamp(24px,_4.4vw,_28px)] max-[768px]:leading-[1.35] max-[768px]:tracking-[-0.02em]">
          {quote}
        </p>
      </motion.blockquote>
      {author && (
        <motion.figcaption
          className="mt-[clamp(28px,_3vw,_56px)] text-[clamp(14px,_1.1vw,_18px)] leading-[1.5] wrap-anywhere"
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
