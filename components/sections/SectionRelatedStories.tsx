import { PostCard, type Post } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";

type SectionRelatedStoriesProps = {
  posts: Post[];
};

export function SectionRelatedStories({ posts }: SectionRelatedStoriesProps) {
  return (
    <Reveal>
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Label */}
          <div className="mb-10 md:mb-0 md:col-start-1">
            <span className="text-base uppercase text-foreground">
              Other Stories
            </span>
          </div>

          {/* Col-2: Post cards */}
          <div className="md:col-start-2">
            <div className="flex flex-col gap-[60px] xl:flex-row xl:gap-10">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="max-w-gutter xl:w-[calc((100%-var(--content-gap))/2)]"
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </Reveal>
  );
}
