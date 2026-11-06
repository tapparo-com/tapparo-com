"use client";

import { useEffect, type RefObject } from "react";

/** Contrast follows known image regions, without reading pixels or blend modes. */
export function useHeaderBehavior(root: RefObject<HTMLDivElement | null>, pathname: string, menuPresent: boolean) {
  useEffect(() => {
    const shell = root.current;
    if (!shell) return;
    let frame = 0, previousY = window.scrollY, distance = 0, direction = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY, delta = y - previousY;
      previousY = y;
      if (delta) {
        const next = Math.sign(delta);
        distance = next === direction ? distance + Math.abs(delta) : Math.abs(delta);
        direction = next;
      }
      const hero = shell.querySelector<HTMLElement>("[data-site-hero]");
      const beyondHeader = hero ? hero.getBoundingClientRect().bottom < 80 : y > 120;
      if (!beyondHeader || menuPresent) shell.dataset.reading = "false";
      else if (distance >= 12) shell.dataset.reading = String(direction > 0);

      for (const control of shell.querySelectorAll<HTMLElement>("[data-header-control]")) {
        const rect = control.getBoundingClientRect();
        const points = [0.15, 0.5, 0.85];
        const imagePoints = points.filter(x => document.elementsFromPoint(rect.left + rect.width * x, rect.top + rect.height / 2)
          .some(element => element.closest("[data-content-image], [data-hero-photo]"))).length;
        const overImage = !menuPresent && imagePoints > points.length / 2;
        control.dataset.overImage = String(overImage);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new MutationObserver(schedule);
    observer.observe(shell, { subtree: true, childList: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      delete shell.dataset.reading;
    };
  }, [root, pathname, menuPresent]);
}
