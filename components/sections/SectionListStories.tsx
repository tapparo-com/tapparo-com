"use client";

import { useState } from "react";
import { PostCard, type Post } from "@/components/ui/PostCard";

type SectionListStoriesProps = {
  posts: Post[];
};

function formatMonthYear(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function SectionListStories({ posts }: SectionListStoriesProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const monthLabel = posts[0]?.publishedAt
    ? formatMonthYear(posts[0].publishedAt)
    : "";

  return (
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Month label */}
          <div className="mb-10 md:mb-0 md:col-start-1">
            <span className="text-base uppercase text-foreground">
              {monthLabel}
            </span>
          </div>

          {/* Col-2: Post cards grid */}
          <div className="md:col-start-2">
            <div className="flex flex-col gap-10 xl:flex-row xl:flex-wrap">
              {visiblePosts.map((post) => (
                <div
                  key={post._id}
                  className="max-w-gutter xl:w-[calc((100%-var(--content-gap))/2)]"
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="pt-20">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
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
  );
}
