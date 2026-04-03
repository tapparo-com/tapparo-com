import { sanityFetch } from "@/sanity/lib/fetch";
import { STORIES_QUERY, STORIES_PAGE_QUERY } from "@/sanity/lib/queries";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionListStories } from "@/components/sections/SectionListStories";

export const metadata = {
  title: "Stories",
};

export default async function StoriesPage() {
  const [pageData, posts] = await Promise.all([
    sanityFetch<any>({
      query: STORIES_PAGE_QUERY,
      tags: ["storiesPage"],
    }),
    sanityFetch<any[]>({
      query: STORIES_QUERY,
      tags: ["post"],
    }),
  ]);

  const title = pageData?.title || "Stories";

  return (
    <div className="relative z-10 bg-background">
      <SectionPageIntro title={title} description={pageData?.description} />
      {posts && posts.length > 0 && <SectionListStories posts={posts} />}
    </div>
  );
}
