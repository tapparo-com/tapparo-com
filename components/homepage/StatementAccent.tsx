"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function StatementAccent({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Finish within 45% of the viewport, independent of the text's length.
    offset: ["start 0.9", "start 0.45"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["-5%", "105%"]);

  return (
    <motion.p
      ref={ref}
      className="statement-accent"
      style={
        {
          "--statement-fill": !hydrated || reducedMotion ? "105%" : fill,
        } as CSSProperties
      }
    >
      {text}
    </motion.p>
  );
}
