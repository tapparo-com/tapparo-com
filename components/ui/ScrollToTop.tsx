"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import styles from "@/components/homepage/Homepage.module.css";

export function ScrollToTop() {
  const reduced = useReducedMotion();
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })}
      aria-label="Nach oben"
      className={styles.animatedLink}
    >
      <span>nach oben</span>
      <AnimatedUnderline />
    </button>
  );
}
