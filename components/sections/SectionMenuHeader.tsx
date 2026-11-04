"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "@/components/menu/Menu.module.css";

type Category = { _id: string; title: string; slug: string };
export function SectionMenuHeader({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.slug);
  const nav = useRef<HTMLElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = (nav.current?.getBoundingClientRect().bottom || 70) + 48;
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
    const container = scroll.current;
    const link = container?.querySelector<HTMLAnchorElement>('[aria-current="location"]');
    if (!container || !link) return;
    const box = container.getBoundingClientRect(), item = link.getBoundingClientRect();
    const offset = item.left < box.left ? item.left - box.left : item.right > box.right ? item.right - box.right : 0;
    if (offset) container.scrollBy({ left: offset, behavior: reduced ? "instant" : "smooth" });
  }, [active, reduced]);
  if (!categories.length) return null;
  return <nav ref={nav} className={styles.navigation} aria-label="Kategorien der Speisekarte">
    <div className={styles.navigationInner}><div ref={scroll} className={styles.categoryScroll}>
      <div className={styles.categoryLinks}>{categories.map(category => <a key={category._id} href={`#${category.slug}`}
        aria-current={active === category.slug ? "location" : undefined} onClick={() => setActive(category.slug)}>{category.title}</a>)}</div>
    </div></div>
  </nav>;
}
