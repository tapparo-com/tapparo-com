import { absoluteSiteUrl } from "@/lib/urls";
import { sanityFetch } from "@/sanity/lib/fetch";
import { MENU_PAGE_QUERY, ALLERGENS_QUERY } from "@/sanity/lib/queries";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionMenuHeader } from "@/components/sections/SectionMenuHeader";
import { SectionMenuCategory } from "@/components/sections/SectionMenuCategory";
import { SectionAllergensLegend } from "@/components/sections/SectionAllergensLegend";
import styles from "@/components/menu/Menu.module.css";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>({
    query: MENU_PAGE_QUERY,
    tags: ["menuPage"],
  });
  return {
    alternates: { canonical: absoluteSiteUrl("/menu") },
    title: data?.seo?.title || "Speisekarte",
    description: data?.seo?.description,
  };
}

export default async function MenuPage() {
  const [menuData, allergens] = await Promise.all([
    sanityFetch<any>({
      query: MENU_PAGE_QUERY,
      tags: ["menuPage", "menuCategory", "allergen"],
    }),
    sanityFetch<any[]>({
      query: ALLERGENS_QUERY,
      tags: ["allergen"],
    }),
  ]);

  const categories = (menuData?.categories || []).filter((category: any) => category?.slug);

  return (
    <div className={`relative z-10 bg-background ${styles.page}`} data-menu-page>
      <SectionPageIntro
        narrow
        title={menuData?.title || "Speisekarte"}
        description={menuData?.description}
      />
      <SectionMenuHeader categories={categories} />

      {categories.map((category: any) => (
        <SectionMenuCategory
          key={category._id}
          title={category.title}
          slug={category.slug}
          description={category.description}
          items={(category.items || []).filter(Boolean)}
          extras={category.extras}
          images={category.images}
        />
      ))}

      {allergens && allergens.length > 0 && (
        <SectionAllergensLegend allergens={allergens} />
      )}
    </div>
  );
}
