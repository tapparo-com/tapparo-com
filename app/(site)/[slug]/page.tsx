import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PAGE_BY_SLUG_QUERY,
  BLOG_POST_QUERY,
  BLOG_LIST_QUERY,
  PAGES_SLUGS_QUERY,
  BRAND_QUERY,
  HOURS_QUERY,
  RELATED_STORIES_QUERY,
  LEGAL_PAGE_QUERY,
  LEGAL_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { fetchLogoSvg } from "@/sanity/lib/fetchSvg";
import { SectionRenderer } from "@/components/SectionRenderer";
import { PostBody } from "@/components/PostBody";
import { SectionRelatedStories } from "@/components/sections/SectionRelatedStories";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
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

  return [
    ...(pages ?? []).map((p) => ({ slug: p.slug })),
    ...(posts ?? []).map((p) => ({ slug: p.slug })),
    ...(legalPages ?? []).map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Try CMS page first
  const page = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["page"],
  });

  if (page) {
    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description,
    };
  }

  // Try blog post
  const post = await sanityFetch<any>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  if (post) {
    return {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    };
  }

  // Try legal page
  const legal = await sanityFetch<any>({
    query: LEGAL_PAGE_QUERY,
    params: { slug },
    tags: ["legalPage"],
  });

  if (legal) {
    return {
      title: legal.seo?.title || legal.title,
      description: legal.seo?.description,
    };
  }

  return {};
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  // "home" is served at / only — block /home
  if (slug === "home") notFound();

  // --- Try CMS page ---
  const [page, brand, hours] = await Promise.all([
    sanityFetch<any>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slug },
      tags: ["page"],
    }),
    sanityFetch<any>({ query: BRAND_QUERY, tags: ["settingsBrand"] }),
    sanityFetch<any>({ query: HOURS_QUERY, tags: ["settingsHours"] }),
  ]);

  if (page) {
    return (
      <>
        {page.title && slug !== "menu" && (
          <header className="mx-auto max-w-[1856px] px-3 pt-12 pb-4 md:px-8 md:pt-16">
            <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
          </header>
        )}
        <SectionRenderer
          sections={page.sections || []}
          shared={{
            restaurantName: brand?.restaurantName,
            tagline: brand?.tagline,
            logoSvg: await fetchLogoSvg(brand?.logo),
            openingHours: hours?.openingHours,
          }}
        />
      </>
    );
  }

  // --- Try blog post ---
  const post = await sanityFetch<any>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  // Fetch related stories when enabled (default: true)
  let relatedPosts: any[] | null = null;
  if (post && post.showRelatedStories !== false) {
    relatedPosts = post.relatedStories?.length
      ? post.relatedStories
      : await sanityFetch<any[]>({
          query: RELATED_STORIES_QUERY,
          params: { slug },
          tags: ["post"],
        });
  }

  if (post) {
    return (
      <div className="relative z-10 bg-background">
        {/* Article */}
        <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
          <div className="mx-auto max-w-[1856px]">
            <div className="md:grid grid-cols-sidebar md:gap-10">
              {/* Col-1: Author + Date (md+) */}
              <div className="hidden md:flex md:col-start-1 flex-col gap-7">
                {post.author?.name && (
                  <div className="flex flex-col">
                    <span className="text-base text-muted">Author</span>
                    <span className="text-base uppercase text-foreground">
                      {post.author.name}
                    </span>
                  </div>
                )}
                {post.publishedAt && (
                  <div className="flex flex-col">
                    <span className="text-base text-muted">Published</span>
                    <span className="text-base uppercase text-muted">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Col-2: Article content */}
              <div className="md:col-start-2">
                <div className="flex flex-col gap-[60px] xl:flex-row xl:gap-10">
                  {/* Text column */}
                  <div className="flex max-w-gutter flex-col gap-[60px] xl:flex-1">
                    {/* Title block */}
                    <div className="flex flex-col gap-7">
                      <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.6px] text-foreground md:text-[38px] md:tracking-[-0.84px] xl:text-[42px]">
                        {post.title}
                      </h1>

                      {/* Cover image (mobile + tablet) */}
                      {post.coverImage && (
                        <div className="relative aspect-square overflow-hidden xl:hidden">
                          <Image
                            src={urlFor(post.coverImage)
                              .width(624)
                              .height(624)
                              .url()}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 624px"
                            className="object-cover"
                            priority
                          />
                        </div>
                      )}

                      {/* Author + Date inline (mobile only) */}
                      <div className="flex items-center gap-4 md:hidden">
                        {post.author?.name && (
                          <span className="text-base uppercase text-foreground">
                            {post.author.name}
                          </span>
                        )}
                        {post.publishedAt && (
                          <time className="text-base uppercase text-muted">
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    {post.body && <PostBody value={post.body} />}
                  </div>

                  {/* Cover image column (desktop only) */}
                  {post.coverImage && (
                    <div className="hidden max-w-gutter xl:block xl:flex-1">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={urlFor(post.coverImage)
                            .width(624)
                            .height(624)
                            .url()}
                          alt={post.title}
                          fill
                          sizes="624px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Stories */}
        {relatedPosts && relatedPosts.length > 0 && (
          <SectionRelatedStories posts={relatedPosts} />
        )}
      </div>
    );
  }

  // --- Try legal page ---
  const legal = await sanityFetch<any>({
    query: LEGAL_PAGE_QUERY,
    params: { slug },
    tags: ["legalPage"],
  });

  if (legal) {
    return (
      <div className="relative z-10 bg-background">
        <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
          <div className="mx-auto max-w-[1856px]">
            <div className="md:grid grid-cols-sidebar md:gap-10">
              {/* Col-1: Updated date (md+) */}
              {legal.updatedAt && (
                <div className="hidden md:flex md:col-start-1 flex-col">
                  <span className="text-base text-muted">Updated</span>
                  <span className="text-base uppercase text-muted">
                    {formatDate(legal.updatedAt)}
                  </span>
                </div>
              )}

              {/* Col-2: Title + Body */}
              <div className="md:col-start-2">
                <div className="flex max-w-gutter flex-col gap-[60px]">
                  <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.6px] text-foreground md:text-[38px] md:tracking-[-0.84px] xl:text-[42px]">
                    {legal.title}
                  </h1>
                  {legal.body && <PostBody value={legal.body} />}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  notFound();
}
