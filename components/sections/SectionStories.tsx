"use client";

import { useMemo } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { StorySummary } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { StoryCollection } from "@/components/stories/StoryCollection";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";

type Props = {
  heading?: string | null;
  posts: StorySummary[];
  pinnedStoryId?: string | null;
};
export function SectionStories({ heading, posts = [], pinnedStoryId }: Props) {
  const ordered = useMemo(() => {
    const pinned = posts.find((post) => post._id === pinnedStoryId);
    return pinned
      ? [pinned, ...posts.filter((post) => post._id !== pinnedStoryId)]
      : posts;
  }, [posts, pinnedStoryId]);
  if (!ordered.length) return null;
  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pt-[clamp(80px,_9vw,_180px)] pb-[clamp(64px,_8vw,_160px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]"
      data-home-section="stories"
    >
      <Reveal className="section-header mb-[clamp(36px,_5vw,_90px)] flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="text-[clamp(32px,_4vw,_64px)] leading-[1.05] font-medium tracking-[-0.055em] wrap-anywhere">
          {heading || "Stories"}
        </h2>
        <TransitionLink
          href="/stories"
          className="animated-link relative ml-auto inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
        >
          <span>alle stories</span>
          <AnimatedUnderline />
        </TransitionLink>
      </Reveal>
      <StoryCollection posts={ordered} />
    </section>
  );
}
