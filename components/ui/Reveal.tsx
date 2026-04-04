"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { REVEAL_DURATION, REVEAL_EASE, REVEAL_OFFSET } from "@/lib/animation";

type RevealProps = {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
};

const offsets = {
  up: { x: 0, y: REVEAL_OFFSET },
  left: { x: -REVEAL_OFFSET, y: 0 },
  right: { x: REVEAL_OFFSET, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = REVEAL_DURATION,
  className,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const { x, y } = offsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration, ease: REVEAL_EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
