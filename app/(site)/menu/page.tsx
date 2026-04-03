import { sanityFetch } from "@/sanity/lib/fetch";
import { MENU_PAGE_QUERY, ALLERGENS_QUERY } from "@/sanity/lib/queries";
import { SectionMenuHeader } from "@/components/sections/SectionMenuHeader";
import { SectionMenuCategory } from "@/components/sections/SectionMenuCategory";
import { SectionAllergensLegend } from "@/components/sections/SectionAllergensLegend";

export const metadata = {
  title: "Menu",
};

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

  const categories = menuData?.categories || [];

  return (
    <div className="relative z-10 bg-background">
      <SectionMenuHeader categories={categories} />

      {categories.filter(Boolean).map((category: any) => (
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
