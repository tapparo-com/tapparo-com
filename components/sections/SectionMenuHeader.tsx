"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/components/menu/Menu.module.css";

type Category = { _id: string; title: string; slug: string };
export function SectionMenuHeader({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.slug);
  const nav = useRef<HTMLElement>(null);
  const chooser = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  useEffect(() => {
    const navigation = nav.current;
    const page = navigation?.closest<HTMLElement>("[data-menu-page]");
    if (!navigation || !page) return;
    // Wrapped category labels can make the sticky bar taller than its default.
    const update = () => page.style.setProperty("--menu-navigation-height", `${navigation.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(update);
    observer.observe(navigation);
    update();
    return () => { observer.disconnect(); page.style.removeProperty("--menu-navigation-height"); };
  }, [categories.length]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const first = categories[0] && document.getElementById(categories[0].slug);
      const anchorClearance = first ? parseFloat(getComputedStyle(first).scrollMarginTop) || 0 : 0;
      const threshold = Math.max((summary.current?.getBoundingClientRect().bottom || 70) + 48, anchorClearance + 1);
      let current = categories[0]?.slug;
      for (const category of categories) {
        const section = document.getElementById(category.slug);
        if (section && section.getBoundingClientRect().top <= threshold) current = category.slug;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [categories]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!chooser.current?.contains(event.target as Node) && chooser.current) chooser.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  if (!categories.length) return null;
  return <nav ref={nav} className={styles.navigation} aria-label="Kategorien der Speisekarte">
    <div className={styles.navigationInner}>
      <details ref={chooser} className={styles.categoryChooser}
        onKeyDown={event => { if (event.key === "Escape" && chooser.current?.open) { event.preventDefault(); chooser.current.open = false; summary.current?.focus(); } }}>
        <summary ref={summary} className={styles.categorySummary}>
          <span>Kategorie wählen</span>
          <span>{categories.find(category => category.slug === active)?.title}</span>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="m4 7 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        </summary>
        <div className={styles.categoryChoices}><div className={styles.categoryChoicesInner}>{categories.map(category => <a key={category._id} href={`#${category.slug}`}
          aria-current={active === category.slug ? "location" : undefined} onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            if (chooser.current) chooser.current.open = false;
            setActive(category.slug);
            // Keep focus on a visible control after collapsing the choices.
            summary.current?.focus({ preventScroll: true });
            // WebKit may cancel a hidden link's default action. Navigate through
            // the native fragment after the new summary height has rendered.
            requestAnimationFrame(() => { window.location.hash = category.slug; });
          }}>{category.title}</a>)}</div></div>
      </details>
    </div>
  </nav>;
}
