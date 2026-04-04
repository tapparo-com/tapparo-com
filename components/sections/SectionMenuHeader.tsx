"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TAB_SPRING } from "@/lib/animation";

type Category = {
  _id: string;
  title: string;
  slug: string;
};

type SectionMenuHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
  allergens?: { _id: string; code: string; label: string }[];
  categories: Category[];
};

export function SectionMenuHeader({
  categories,
}: SectionMenuHeaderProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    categories[0]?.slug ?? null
  );
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (categories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveSlug(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(cat.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[65px] z-30 overflow-clip bg-background px-3 pb-5 pt-10 md:px-8 md:pt-20"
    >
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          <div className="md:col-start-2">
            <div className="flex gap-5 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`#${cat.slug}`}
                  className={`relative shrink-0 text-base uppercase leading-7 transition-colors ${
                    activeSlug === cat.slug
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {cat.title}
                  {activeSlug === cat.slug && (
                    <motion.div
                      layoutId="active-menu-tab"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                      transition={prefersReducedMotion ? { duration: 0 } : TAB_SPRING}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
