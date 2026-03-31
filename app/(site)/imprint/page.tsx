import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "imprint" },
    tags: ["page"],
  });

  return {
    title: pageData?.seo?.title || pageData?.title || "Imprint",
    description: pageData?.seo?.description,
  };
}

export default async function ImprintPage() {
  const pageData = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "imprint" },
    tags: ["page"],
  });

  return (
    <>
      {pageData?.title && (
        <header className="mx-auto max-w-[1856px] px-3 pt-12 pb-4 md:px-8 md:pt-16">
          <h1 className="text-4xl font-bold tracking-tight">
            {pageData.title}
          </h1>
        </header>
      )}
      <SectionRenderer sections={pageData?.sections || []} />
    </>
  );
}
