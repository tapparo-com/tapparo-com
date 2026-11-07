import type {
  MenuPage as MenuPageContent,
  MenuCategory,
  MenuItem,
  Allergen,
} from "@/lib/content";
import { absoluteSiteUrl } from "@/lib/urls";
import { sanityFetch } from "@/sanity/lib/fetch";
import { MENU_PAGE_QUERY, ALLERGENS_QUERY } from "@/sanity/lib/queries";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionMenuHeader } from "@/components/sections/SectionMenuHeader";
import { SectionMenuCategory } from "@/components/sections/SectionMenuCategory";
import { SectionAllergensLegend } from "@/components/sections/SectionAllergensLegend";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<MenuPageContent | null>({
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
    sanityFetch<MenuPageContent | null>({
      query: MENU_PAGE_QUERY,
      tags: ["menuPage", "menuCategory", "allergen"],
    }),
    sanityFetch<Allergen[]>({
      query: ALLERGENS_QUERY,
      tags: ["allergen"],
    }),
  ]);

  const categories = (menuData?.categories || []).filter(
    (category): category is MenuCategory => !!category?.slug,
  );

  return (
    <div
      className="relative z-10 bg-background [--menu-anchor-clearance:calc(var(--header-height,_0px)_+_var(--menu-navigation-height)_+_24px)] [--menu-navigation-height:70px]"
      data-menu-page
    >
      <SectionPageIntro
        narrow
        title={menuData?.title || "Speisekarte"}
        description={menuData?.description}
      />
      <SectionMenuHeader categories={categories} />

      {categories.map((category) => (
        <SectionMenuCategory
          key={category._id}
          title={category.title}
          slug={category.slug}
          description={category.description}
          items={(category.items || []).filter(
            (item): item is MenuItem => !!item,
          )}
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
