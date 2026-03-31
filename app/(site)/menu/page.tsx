import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Our menu of focaccia, drinks, and more.",
};

export default async function MenuPage() {
  const pageData = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "menu" },
    tags: ["page", "menuCategory", "menuItem", "allergen"],
  });

  return (
    <div className="scroll-smooth">
      <SectionRenderer sections={pageData?.sections || []} />
    </div>
  );
}
