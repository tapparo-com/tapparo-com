import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

type PageData = {
  _id: string;
  title: string;
  body?: any[];
  seo?: { title?: string; description?: string };
} | null;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { slug: "imprint" },
    tags: ["page"],
  });

  return {
    title: page?.seo?.title || "Imprint — Tapparo",
    description: page?.seo?.description,
  };
}

export default async function ImprintPage() {
  const page = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { slug: "imprint" },
    tags: ["page"],
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">
        {page?.title || "Imprint"}
      </h1>
      {page?.body && (
        <div className="prose prose-neutral mt-8 max-w-none">
          <PortableText value={page.body} />
        </div>
      )}
    </div>
  );
}
