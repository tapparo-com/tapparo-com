"use client";

import { useState, useMemo } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { PostCard, type Post } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";

type SectionStoriesProps = {
  heading?: string | null;
  posts: Post[];
  pinnedStoryId?: string | null;
};

const INITIAL_COUNT = 4;

export function SectionStories({
  heading,
  posts,
  pinnedStoryId,
}: SectionStoriesProps) {
  // Reorder: pinned story first, then the rest in original (date) order
  const orderedPosts = useMemo(() => {
    if (!pinnedStoryId) return posts;
    const pinned = posts.find((p) => p._id === pinnedStoryId);
    if (!pinned) return posts;
    return [pinned, ...posts.filter((p) => p._id !== pinnedStoryId)];
  }, [posts, pinnedStoryId]);

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visiblePosts = orderedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < orderedPosts.length;

  if (!posts || posts.length === 0) return null;

  return (
    <Reveal>
      <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
        <div className="mx-auto max-w-[1856px]">
          <div className="flex flex-col gap-10 md:grid grid-cols-sidebar md:gap-10">
            {/* Left column: heading + read all link */}
            <div className="shrink-0 md:row-start-1 md:col-start-1">
              <div className="flex flex-col">
                <span className="text-base uppercase text-foreground">
                  {heading || "Our Stories"}
                </span>
                <TransitionLink
                  href="/stories"
                  className="inline-flex items-center gap-1 self-start text-base uppercase text-accent hover:underline"
                >
                  <span>Read all</span>
                  <span>{"->"}</span>
                </TransitionLink>
              </div>
            </div>

            {/* Right column: post grid + load more */}
            <div className="flex flex-col gap-10 md:row-start-1 md:col-start-2">
              <div className="flex flex-col gap-10 xl:flex-row xl:flex-wrap">
                {visiblePosts.map((post) => (
                  <div key={post._id} className="max-w-gutter xl:w-[calc((100%-var(--content-gap))/2)]">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="pt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 2)}
                    className="flex items-center gap-1 text-base uppercase text-accent hover:underline"
                  >
                    <span>Load more stories</span>
                    <span>{"->"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
