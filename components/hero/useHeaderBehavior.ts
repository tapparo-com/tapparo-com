"use client";

import { useEffect, type RefObject } from "react";

/** Contrast follows known image regions, without reading pixels or blend modes. */
export function useHeaderBehavior(
  root: RefObject<HTMLDivElement | null>,
  pathname: string,
  menuPresent: boolean,
) {
  useEffect(() => {
    const shell = root.current;
    if (!shell) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero =
        pathname === "/"
          ? shell.querySelector<HTMLElement>("[data-site-hero]")
          : null;
      const logo = shell.querySelector<HTMLElement>("[data-header-logo]");
      if (logo) {
        const visible =
          menuPresent || !hero || hero.getBoundingClientRect().bottom <= 0;
        logo.dataset.visible = String(visible);
        logo.inert = !visible;
      }
      for (const control of shell.querySelectorAll<HTMLElement>(
        "[data-header-control]",
      )) {
        const rect = control.getBoundingClientRect();
        const points = [0.15, 0.5, 0.85];
        const imagePoints = points.filter((x) =>
          document
            .elementsFromPoint(
              rect.left + rect.width * x,
              rect.top + rect.height / 2,
            )
            .some((element) =>
              element.closest("[data-content-image], [data-hero-photo]"),
            ),
        ).length;
        const overImage = !menuPresent && imagePoints > points.length / 2;
        control.dataset.overImage = String(overImage);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(shell, { subtree: true, childList: true });
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(shell);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [root, pathname, menuPresent]);
}
