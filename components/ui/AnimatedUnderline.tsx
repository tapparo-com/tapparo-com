"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Matching path commands let the small hand-drawn bends travel along the line.
const underlines = [
  "M2 7 C20 6 38 5 56 6 S92 7 110 5 S146 7 164 7 S200 5 218 5",
  "M2 6 C20 4 38 7 56 7 S92 6 110 6 S146 4 164 6 S200 7 218 6",
  "M2 7 C20 7 38 6 56 5 S92 7 110 7 S146 6 164 5 S200 6 218 7",
  "M2 6 C20 7 38 7 56 6 S92 5 110 6 S146 7 164 7 S200 4 218 6",
  "M2 7 C20 6 38 5 56 6 S92 7 110 5 S146 7 164 7 S200 5 218 5",
];

export function AnimatedUnderline() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();
  const animate = inView && !reducedMotion;

  return (
    <svg
      ref={ref}
      viewBox="0 0 220 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        initial={false}
        d={underlines[0]}
        animate={{ d: animate ? underlines : underlines[0] }}
        transition={
          animate
            ? { duration: 1.6, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
