"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useRef } from "react";

type Post = {
  _id: string;
  title: string;
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  slug: string;
};

type SectionStoriesProps = {
  heading?: string | null;
  posts: Post[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SectionStories({ heading, posts }: SectionStoriesProps) {
  const scrollRef = useRef<HTMLUListElement>(null);

  if (!posts || posts.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 400;
    el.scrollBy({
      left: direction === "right" ? cardWidth + 32 : -(cardWidth + 32),
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-[1856px] px-3 py-24 md:px-8 xl:py-24">
      {/* Desktop: 2-col grid (label+arrows left, cards right) */}
      <div className="xl:grid xl:grid-cols-[280px_1fr] xl:gap-8">
        {/* Left column — heading + arrows */}
        <div className="mb-8 flex items-center justify-between xl:mb-0 xl:flex-col xl:items-start xl:justify-start xl:gap-6">
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-foreground">
            {heading || "OUR STORIES"}
          </h2>
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous stories"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              &larr;
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next stories"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* Right column — card carousel */}
        <ul
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto md:gap-8"
          role="list"
        >
          {posts.map((post) => (
            <li
              key={post._id}
              className="w-[342px] shrink-0 snap-start md:w-[500px] xl:w-[624px]"
            >
              <article>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={urlFor(post.coverImage)
                          .width(624)
                          .height(780)
                          .url()}
                        alt={post.title}
                        width={624}
                        height={780}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#A0A0A0]" />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="max-w-[520px] font-sans text-base text-foreground">
                      <span className="font-semibold">{post.title}</span>
                      {post.excerpt && <span> — {post.excerpt}</span>}
                    </p>
                    <span className="mt-3 inline-block text-sm font-medium uppercase text-[#CF3717]">
                      Read more
                    </span>
                    <footer className="mt-3 flex items-center gap-4">
                      {post.publishedAt && (
                        <time
                          dateTime={post.publishedAt}
                          className="font-sans text-xs text-muted"
                        >
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                      <span className="font-sans text-xs uppercase text-muted">
                        2 minute read
                      </span>
                    </footer>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
