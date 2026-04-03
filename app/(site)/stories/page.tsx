import { sanityFetch } from "@/sanity/lib/fetch";
import { STORIES_QUERY } from "@/sanity/lib/queries";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionListStories } from "@/components/sections/SectionListStories";

export const metadata = {
  title: "Stories",
};

export default async function StoriesPage() {
  const posts = await sanityFetch<any[]>({
    query: STORIES_QUERY,
    tags: ["post"],
  });

  return (
    <div className="relative z-10 bg-background">
      <SectionPageIntro title="Stories" />
      {posts && posts.length > 0 && <SectionListStories posts={posts} />}
    </div>
  );
}
