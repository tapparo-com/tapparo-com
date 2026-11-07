import { getContentBySlug } from "@/sanity/lib/content";
import type { StorySummary } from "@/lib/content";
import type { HoursSettings } from "@/lib/opening-hours";
import { getHoursRows } from "@/lib/opening-hours";
import { absoluteSiteUrl, pathForSlug, validateSlug } from "@/lib/urls";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BLOG_LIST_QUERY,
  PAGES_SLUGS_QUERY,
  HOURS_QUERY,
  RELATED_STORIES_QUERY,
  LEGAL_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { SectionRenderer } from "@/components/SectionRenderer";
import { StoryArticle } from "@/components/pages/StoryArticle";
import { LegalArticle } from "@/components/pages/LegalArticle";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionRelatedStories } from "@/components/sections/SectionRelatedStories";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [pages, posts, legalPages] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: PAGES_SLUGS_QUERY,
      tags: ["page"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: BLOG_LIST_QUERY,
      tags: ["post"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: LEGAL_SLUGS_QUERY,
      tags: ["legalPage"],
    }),
  ]);

  const slugs = [...(pages ?? []), ...(posts ?? []), ...(legalPages ?? [])]
    .map((entry) => entry.slug?.toLowerCase())
    .filter((slug) => slug && validateSlug(slug, "post") === true);
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (validateSlug(slug, "post") !== true) notFound();

  const content = await getContentBySlug(slug);
  if (!content) return {};
  const document = content.document;
  return {
    alternates: { canonical: absoluteSiteUrl(pathForSlug(slug)) },
    title: document.seo?.title || document.title,
    description:
      content.kind === "post"
        ? document.seo?.description || content.document.excerpt
        : document.seo?.description,
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  if (validateSlug(slug, "post") !== true) notFound();

  const content = await getContentBySlug(slug);
  if (!content) notFound();

  if (content.kind === "page") {
    const page = content.document;
    const hours = await sanityFetch<HoursSettings | null>({
      query: HOURS_QUERY,
      tags: ["settingsHours"],
    });
    return (
      <>
        {page.title && (
          <SectionPageIntro
            title={page.title}
            narrow={page.sections?.some(
              (section) => section._type === "sectionContactForm",
            )}
          />
        )}
        <SectionRenderer
          documentId={page._id}
          sections={page.sections || []}
          openingHours={getHoursRows(hours)}
        />
      </>
    );
  }

  if (content.kind === "post") {
    const post = content.document;
    let relatedPosts: StorySummary[] = [];
    if (post.showRelatedStories !== false) {
      const selected = (post.relatedStories || []).filter(
        (item): item is StorySummary => !!item?.slug,
      );
      relatedPosts = selected.length
        ? selected
        : await sanityFetch<StorySummary[]>({
            query: RELATED_STORIES_QUERY,
            params: { slug },
            tags: ["post"],
          });
    }
    return (
      <>
        <StoryArticle post={post} showBackLink={!relatedPosts.length} />
        {relatedPosts.length ? (
          <SectionRelatedStories posts={relatedPosts} />
        ) : null}
      </>
    );
  }

  return <LegalArticle legal={content.document} />;
}
