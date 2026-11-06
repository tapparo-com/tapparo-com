"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export const SITE_INTRO_SESSION_KEY = "tapparo:site:intro:v1";
export const FIRST_ENTRANCE_MS = 1800;
export const RETURN_ENTRANCE_MS = 950;
export type HeroEntrance = { mode: "idle" | "first" | "return"; run: number };

// Progressive enhancement: no JS means visible content. A failed/late hydration
// also reveals the page instead of leaving it behind an entrance screen.
export const ENTRANCE_BOOTSTRAP = `(function(){var r=document.currentScript.parentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){r.dataset.preparing='true';setTimeout(function(){if(r.dataset.preparing){delete r.dataset.preparing;r.dataset.entryExpired='true'}},1500)}})()`;
export const WELCOME_BOOTSTRAP = `(function(){var seen=false;try{seen=!!sessionStorage.getItem('${SITE_INTRO_SESSION_KEY}')}catch(e){}if(!seen){${ENTRANCE_BOOTSTRAP}}})()`;

export function useHeroEntrance(
  root: RefObject<HTMLDivElement | null>,
  photo: RefObject<HTMLDivElement | null> | null,
  reduced: boolean,
  sessionKey = SITE_INTRO_SESSION_KEY,
  coveredByTransition = false,
  welcomeEnabled = true,
) {
  const [entrance, setEntrance] = useState<HeroEntrance>({
    mode: "idle",
    run: 0,
  });
  const started = useRef(false);

  const finish = useCallback(() => {
    started.current = true;
    if (root.current) delete root.current.dataset.preparing;
    setEntrance((current) =>
      current.mode === "idle" ? current : { ...current, mode: "idle" },
    );
  }, [root]);

  const play = useCallback(
    (mode: "first" | "return") => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        reduced
      ) {
        finish();
        return;
      }
      if (root.current) delete root.current.dataset.preparing;
      started.current = true;
      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch {
        /* Storage is optional. */
      }
      setEntrance((current) => ({
        mode: mode === "first" && !welcomeEnabled ? "return" : mode,
        run: current.run + 1,
      }));
    },
    [finish, reduced, root, sessionKey, welcomeEnabled],
  );

  useLayoutEffect(() => {
    if (started.current) return;
    // A route cover already reveals this hero. Consume its entrance now so
    // uncovering the page cannot hide the photograph and start a second wipe.
    if (
      coveredByTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.current?.dataset.entryExpired ||
      Math.abs(root.current?.getBoundingClientRect().top || 0) > 1
    ) {
      started.current = true;
      finish();
      return;
    }
    let first = welcomeEnabled;
    try {
      first = welcomeEnabled && !sessionStorage.getItem(sessionKey);
    } catch {
      /* Still usable without storage. */
    }
    // Other landing pages share the first welcome without a photograph or
    // repeat entrance. Home keeps its existing image-readiness/handoff logic.
    if (!photo) {
      if (first) play("first");
      else finish();
      return;
    }
    const image = photo.current?.querySelector("img");
    if (!image) {
      play("return");
      return;
    }
    const ready = () => play(first ? "first" : "return");
    if (!first || (image?.complete && image.naturalWidth > 0)) {
      ready();
      return;
    }
    // The image handoff needs a decoded photograph. On a slow/erroring request,
    // use the short element entrance rather than prolonging the welcome screen.
    let cancelled = false;
    const cleanup = () => {
      cancelled = true;
      clearTimeout(timeout);
      image.removeEventListener("load", loaded);
      image.removeEventListener("error", fallback);
    };
    const settle = (mode: "first" | "return") => {
      if (cancelled) return;
      cleanup();
      if (!started.current) play(mode);
    };
    const fallback = () => settle("return");
    const loaded = () => settle(first ? "first" : "return");
    const timeout = window.setTimeout(fallback, 800);
    image?.addEventListener("load", loaded, { once: true });
    image?.addEventListener("error", fallback, { once: true });
    return cleanup;
  }, [
    finish,
    photo,
    play,
    root,
    sessionKey,
    coveredByTransition,
    welcomeEnabled,
  ]);

  useEffect(() => {
    if (reduced) finish();
  }, [reduced, finish]);

  useEffect(() => {
    if (entrance.mode === "idle") return;
    const timer = window.setTimeout(
      finish,
      entrance.mode === "first" ? FIRST_ENTRANCE_MS : RETURN_ENTRANCE_MS,
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") finish();
    };
    const onVisibility = () => {
      if (document.hidden) finish();
    };
    // Intentional interaction takes priority, and resizing cannot leave an
    // intro photograph travelling towards an outdated layout rectangle.
    window.addEventListener("resize", finish);
    window.addEventListener("wheel", finish, { passive: true });
    window.addEventListener("scroll", finish, { passive: true });
    window.addEventListener("touchstart", finish, { passive: true });
    window.addEventListener("pointerdown", finish, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", finish);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("scroll", finish);
      window.removeEventListener("touchstart", finish);
      window.removeEventListener("pointerdown", finish);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [entrance, finish]);

  return { entrance, active: entrance.mode !== "idle", play, finish };
}
