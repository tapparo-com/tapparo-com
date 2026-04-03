"use client";

import { useEffect, useState } from "react";

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
                  className={`shrink-0 text-base uppercase leading-7 transition-colors ${
                    activeSlug === cat.slug
                      ? "text-accent underline"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {cat.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
