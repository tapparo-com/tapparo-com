"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(update: () => void) {
  const preference = window.matchMedia(query);
  preference.addEventListener("change", update);
  return () => preference.removeEventListener("change", update);
}
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

// Match the server's first render, then track preference changes while open.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
