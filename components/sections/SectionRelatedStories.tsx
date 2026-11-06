import type { StorySummary } from "@/lib/content";
import { StoryPanel } from "@/components/stories/StoryPanel";
import { Reveal } from "@/components/ui/Reveal";
import { StoriesLink } from "@/components/stories/StoriesLink";

export function SectionRelatedStories({ posts }: { posts: StorySummary[] }) {
  if (!posts.length) return null;
  return (
    <section
      className="page-related border-t border-solid border-t-border py-[clamp(64px,_7vw,_140px)] [--story-panel-copy-leading:1.75] [--story-panel-copy-size:16px] [--story-panel-title-leading:1.333333] [--story-panel-title-size:24px] [--story-panel-title-tracking:-0.02em]"
      aria-label="Weitere Stories"
      data-related-stories
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] max-[768px]:px-5 [&_*]:min-w-0">
        <Reveal className="section-header mb-[clamp(36px,_5vw,_90px)] flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="page-section-heading text-[clamp(28px,_3vw,_42px)] leading-[1.1] font-medium tracking-[-.025em]">
            Weitere Stories
          </h2>
          <StoriesLink />
        </Reveal>
        <div className="grid grid-cols-1 gap-x-[clamp(28px,_3.4vw,_72px)] gap-y-[clamp(48px,_4vw,_80px)] min-[1024px]:grid-cols-2">
          {posts.map((post) => (
            <StoryPanel key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
