"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { lockPageScroll } from "@/lib/scroll-lock";

type Category = { _id: string; title: string; slug: string };
export function SectionMenuHeader({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.slug);
  const nav = useRef<HTMLElement>(null);
  const chooser = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const options = useRef<HTMLDivElement>(null);
  const unlock = useRef<(() => void) | null>(null);
  const closeChooser = useCallback(() => {
    if (chooser.current) chooser.current.open = false;
    unlock.current?.();
    unlock.current = null;
  }, []);
  useEffect(() => {
    const navigation = nav.current;
    const page = navigation?.closest<HTMLElement>("[data-menu-page]");
    if (!navigation || !page) return;
    // Wrapped category labels can make the sticky bar taller than its default.
    const update = () =>
      page.style.setProperty(
        "--menu-navigation-height",
        `${navigation.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(update);
    observer.observe(navigation);
    update();
    return () => {
      observer.disconnect();
      page.style.removeProperty("--menu-navigation-height");
    };
  }, [categories.length]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const first =
        categories[0] && document.getElementById(categories[0].slug);
      const anchorClearance = first
        ? parseFloat(getComputedStyle(first).scrollMarginTop) || 0
        : 0;
      const threshold = Math.max(
        (summary.current?.getBoundingClientRect().bottom || 70) + 48,
        anchorClearance + 1,
      );
      let current = categories[0]?.slug;
      for (const category of categories) {
        const section = document.getElementById(category.slug);
        if (section && section.getBoundingClientRect().top <= threshold)
          current = category.slug;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [categories]);
  useEffect(() => {
    const details = chooser.current;
    const panel = options.current;
    const navigation = nav.current;
    if (!details || !panel || !navigation) return;
    const viewport = window.visualViewport;
    const fitPanel = () => {
      if (!details.open) return;
      const bottom = viewport
        ? viewport.offsetTop + viewport.height
        : window.innerHeight;
      // At the top of the page the chooser is below the page introduction,
      // so its available height is smaller than when the bar is sticky.
      panel.style.setProperty(
        "--menu-available-height",
        `${Math.max(0, bottom - navigation.getBoundingClientRect().bottom)}px`,
      );
    };
    const onToggle = () => {
      if (details.open) {
        fitPanel();
        unlock.current ??= lockPageScroll(panel);
      } else closeChooser();
    };
    const closeOutside = (event: Event) => {
      if (!details.contains(event.target as Node)) closeChooser();
    };
    const observer = new ResizeObserver(fitPanel);
    observer.observe(navigation);
    details.addEventListener("toggle", onToggle);
    document.addEventListener("click", closeOutside);
    window.addEventListener("resize", fitPanel);
    viewport?.addEventListener("resize", fitPanel);
    viewport?.addEventListener("scroll", fitPanel);
    return () => {
      closeChooser();
      observer.disconnect();
      details.removeEventListener("toggle", onToggle);
      document.removeEventListener("click", closeOutside);
      window.removeEventListener("resize", fitPanel);
      viewport?.removeEventListener("resize", fitPanel);
      viewport?.removeEventListener("scroll", fitPanel);
    };
  }, [closeChooser]);
  if (!categories.length) return null;
  return (
    <nav
      ref={nav}
      className="sticky top-[var(--header-height,_0px)] z-[20] border-t border-b border-solid border-t-border border-b-border bg-background [&_a:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_a:focus-visible]:outline-offset-[3px]"
      aria-label="Kategorien der Speisekarte"
    >
      <div className="mx-auto max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-3 max-[768px]:px-5">
        <details
          ref={chooser}
          className="menu-category-chooser mx-auto max-w-156"
          onKeyDown={(event) => {
            if (event.key === "Escape" && chooser.current?.open) {
              event.preventDefault();
              closeChooser();
              summary.current?.focus({ preventScroll: true });
            }
            if (event.key === "Tab" && chooser.current?.open) {
              // Close when keyboard focus leaves. WebKit can briefly focus
              // <main> on a pointer press, before the category link is clicked.
              requestAnimationFrame(() => {
                if (!chooser.current?.contains(document.activeElement))
                  closeChooser();
              });
            }
          }}
        >
          <summary
            ref={summary}
            className="menu-category-summary relative grid min-h-11 cursor-pointer list-none grid-cols-[1fr_auto] gap-x-6 gap-y-1 pr-9 focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[4px] max-[768px]:grid-cols-1 max-[768px]:gap-[2px] [&_>_span:first-child]:self-center [&_>_span:first-child]:text-[13px] [&_>_span:nth-child(2)]:self-center [&_>_span:nth-child(2)]:text-right [&_>_span:nth-child(2)]:text-[16px] [&_>_span:nth-child(2)]:leading-[1.4] [&_>_span:nth-child(2)]:wrap-anywhere max-[768px]:[&_>_span:nth-child(2)]:text-left max-[768px]:[&_>_span:nth-child(2)]:text-[15px] [&_svg]:absolute [&_svg]:top-[calc(50%_-_10px)] [&_svg]:right-0 [&_svg]:[transition:transform_180ms_ease] motion-reduce:[&_svg]:transition-none [&::-webkit-details-marker]:hidden"
          >
            <span>Kategorie wählen</span>
            <span>
              {categories.find((category) => category.slug === active)?.title}
            </span>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
              <path
                d="m4 7 6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </summary>
          <div
            ref={options}
            className="absolute top-full right-0 bottom-auto left-0 max-h-[min(70dvh,_600px,_calc(var(--menu-available-height,_70dvh)_-_max(16px,_env(safe-area-inset-bottom))))] overflow-y-auto overscroll-contain border-b border-solid border-b-border bg-[#eeece9] px-[clamp(20px,_3.4vw,_72px)] pt-3 pb-5 max-[768px]:px-5 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:border-b [&_a]:border-solid [&_a]:border-b-border [&_a]:py-2 [&_a]:text-[16px] [&_a]:leading-[1.4] [&_a]:wrap-anywhere [&_a:hover]:[border-color:var(--color-accent)] [&_a[aria-current='location']]:[border-color:var(--color-accent)] [&_a[aria-current='location']]:font-medium"
          >
            <div className="mx-auto grid max-w-156 grid-cols-2 gap-x-6 gap-y-1 max-[768px]:grid-cols-1">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`#${category.slug}`}
                  aria-current={
                    active === category.slug ? "location" : undefined
                  }
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.button !== 0
                    )
                      return;
                    event.preventDefault();
                    closeChooser();
                    setActive(category.slug);
                    // Keep focus on a visible control after collapsing the choices.
                    summary.current?.focus({ preventScroll: true });
                    // WebKit may cancel a hidden link's default action. Navigate through
                    // the native fragment after the new summary height has rendered.
                    requestAnimationFrame(() => {
                      window.location.hash = category.slug;
                    });
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </details>
      </div>
    </nav>
  );
}
