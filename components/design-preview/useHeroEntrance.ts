"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

export const INTRO_SESSION_KEY = "tapparo:design-preview:intro:v2";
export const FIRST_ENTRANCE_MS = 2850;
export const RETURN_ENTRANCE_MS = 1150;
export type HeroEntrance = { mode: "idle" | "first" | "return"; run: number };

// Progressive enhancement: no JS means visible content. A failed/late hydration
// also reveals the page instead of leaving it behind an entrance screen.
export const ENTRANCE_BOOTSTRAP = `(function(){var r=document.currentScript.parentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){r.dataset.preparing='true';setTimeout(function(){if(r.dataset.preparing){delete r.dataset.preparing;r.dataset.entryExpired='true'}},1500)}})()`;

export function useHeroEntrance(
  root: RefObject<HTMLDivElement | null>,
  photo: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  const [entrance, setEntrance] = useState<HeroEntrance>({ mode: "idle", run: 0 });
  const started = useRef(false);

  const finish = useCallback(() => {
    if (root.current) delete root.current.dataset.preparing;
    setEntrance(current => current.mode === "idle" ? current : { ...current, mode: "idle" });
  }, [root]);

  const play = useCallback((mode: "first" | "return") => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || reduced) { finish(); return; }
    if (root.current) delete root.current.dataset.preparing;
    started.current = true;
    try { sessionStorage.setItem(INTRO_SESSION_KEY, "true"); } catch { /* Storage is optional. */ }
    setEntrance(current => ({ mode, run: current.run + 1 }));
  }, [finish, reduced, root]);

  useLayoutEffect(() => {
    if (started.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.current?.dataset.entryExpired) {
      started.current = true;
      finish();
      return;
    }
    let first = true;
    try { first = !sessionStorage.getItem(INTRO_SESSION_KEY); } catch { /* Still usable without storage. */ }
    const image = photo.current?.querySelector("img");
    const ready = () => play(first ? "first" : "return");
    if (!first || (image?.complete && image.naturalWidth > 0)) { ready(); return; }
    // The image handoff needs a decoded photograph. On a slow/erroring request,
    // use the short element entrance rather than prolonging the welcome screen.
    const fallback = () => { clearTimeout(timeout); play("return"); };
    const loaded = () => { clearTimeout(timeout); ready(); };
    const timeout = window.setTimeout(fallback, 800);
    image?.addEventListener("load", loaded, { once: true });
    image?.addEventListener("error", fallback, { once: true });
    return () => {
      clearTimeout(timeout);
      image?.removeEventListener("load", loaded);
      image?.removeEventListener("error", fallback);
    };
  }, [finish, photo, play, root]);

  useEffect(() => { if (reduced) finish(); }, [reduced, finish]);

  useEffect(() => {
    if (entrance.mode === "idle") return;
    const timer = window.setTimeout(finish, entrance.mode === "first" ? FIRST_ENTRANCE_MS : RETURN_ENTRANCE_MS);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") finish(); };
    const onVisibility = () => { if (document.hidden) finish(); };
    // Intentional interaction takes priority, and resizing cannot leave an
    // intro photograph travelling towards an outdated layout rectangle.
    window.addEventListener("resize", finish);
    window.addEventListener("wheel", finish, { passive: true });
    window.addEventListener("touchstart", finish, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", finish);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchstart", finish);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [entrance, finish]);

  return { entrance, active: entrance.mode !== "idle", play, finish };
}
