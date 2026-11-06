"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { StorySummary } from "@/lib/content";
import { StoryPanel } from "@/components/stories/StoryPanel";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";

export function StoryCollection({
  posts,
  batchSize = 2,
  headingLevel = 3,
}: {
  posts: StorySummary[];
  batchSize?: number;
  headingLevel?: 2 | 3;
}) {
  const [visible, setVisible] = useState(4);
  const [enhanced, setEnhanced] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const listId = useId();
  const list = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<number | null>(null);
  useEffect(() => setEnhanced(true), []);
  useEffect(() => {
    if (pendingFocus.current === null) return;
    const link =
      list.current?.querySelectorAll<HTMLAnchorElement>("article > a")[
        pendingFocus.current
      ];
    pendingFocus.current = null;
    link?.focus({ preventScroll: true });
    link?.scrollIntoView({ block: "start" });
  }, [visible]);

  return (
    <>
      <div
        ref={list}
        id={listId}
        className="grid grid-cols-1 gap-x-[clamp(28px,_3.4vw,_72px)] gap-y-[clamp(48px,_4vw,_80px)] min-[1024px]:grid-cols-2"
      >
        {posts.slice(0, visible).map((post) => (
          <StoryPanel key={post._id} post={post} headingLevel={headingLevel} />
        ))}
      </div>
      <p className="sr-only" role="status">
        {announcement}
      </p>
      {enhanced && visible < posts.length && (
        <div className="mt-16 flex justify-end [&_button]:cursor-pointer">
          <button
            type="button"
            className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
            aria-controls={listId}
            onClick={() => {
              const next = Math.min(visible + batchSize, posts.length);
              pendingFocus.current = visible;
              setVisible(next);
              setAnnouncement(`${next} von ${posts.length} Stories angezeigt.`);
            }}
          >
            <span>mehr stories</span>
            <AnimatedUnderline />
          </button>
        </div>
      )}
      {posts.length > 4 && (
        <noscript>
          <ul
            className="mt-12 grid gap-5 text-[18px] leading-[1.4] wrap-anywhere [&_a]:underline [&_a]:underline-offset-[4px] [&_a:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_a:focus-visible]:outline-offset-[6px]"
            aria-label="Mehr Stories"
          >
            {posts.slice(4).map((post) => (
              <li key={post._id}>
                <a href={pathForSlug(post.slug)}>{post.title}</a>
              </li>
            ))}
          </ul>
        </noscript>
      )}
    </>
  );
}
