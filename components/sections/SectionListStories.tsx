import type { StorySummary } from "@/lib/content";
import { StoryCollection } from "@/components/stories/StoryCollection";

export function SectionListStories({ posts }: { posts: StorySummary[] }) {
  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pb-[clamp(80px,_8vw,_160px)] [--story-panel-copy-leading:1.75] [--story-panel-copy-size:16px] [--story-panel-title-leading:1.333333] [--story-panel-title-size:24px] [--story-panel-title-tracking:-.02em] max-[768px]:px-5 [&_*]:min-w-0"
      aria-label="Alle Stories"
      data-stories-overview
    >
      {posts.length ? (
        <StoryCollection posts={posts} batchSize={4} headingLevel={2} />
      ) : (
        <p className="pt-10 pb-20 text-[20px]">
          Hier gibt es bald neue Stories.
        </p>
      )}
    </section>
  );
}
