import type { ListingPage, StorySummary } from "@/lib/content";
import { absoluteSiteUrl } from "@/lib/urls";
import { sanityFetch } from "@/sanity/lib/fetch";
import { STORIES_QUERY, STORIES_PAGE_QUERY } from "@/sanity/lib/queries";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionListStories } from "@/components/sections/SectionListStories";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<ListingPage | null>({
    query: STORIES_PAGE_QUERY,
    tags: ["storiesPage"],
  });
  return {
    alternates: { canonical: absoluteSiteUrl("/stories") },
    title: data?.seo?.title || "Stories",
    description: data?.seo?.description,
  };
}

export default async function StoriesPage() {
  const [pageData, posts] = await Promise.all([
    sanityFetch<ListingPage | null>({
      query: STORIES_PAGE_QUERY,
      tags: ["storiesPage"],
    }),
    sanityFetch<StorySummary[]>({
      query: STORIES_QUERY,
      tags: ["post"],
    }),
  ]);

  const title = pageData?.title || "Stories";

  return (
    <div className="relative z-10 bg-background">
      <SectionPageIntro title={title} description={pageData?.description} />
      <SectionListStories posts={posts || []} />
    </div>
  );
}
