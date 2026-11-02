"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

export function ScrollToTop() {
  const reduced = useReducedMotion();
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })}
      aria-label="Scroll to top"
      className="absolute bottom-5 right-3 flex size-12 items-center justify-center bg-background/75 backdrop-blur-sm text-accent transition-colors hover:text-accent/80 md:right-8 xl:bottom-20"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 26V6M16 6L6 16M16 6L26 16"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}
