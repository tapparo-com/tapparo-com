import { sanityFetch } from "@/sanity/lib/fetch";
import { MENU_QUERY, MENU_PAGE_QUERY } from "@/sanity/lib/queries";
import { SectionMenuHeader } from "@/components/sections/SectionMenuHeader";
import { SectionMenuCategory } from "@/components/sections/SectionMenuCategory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Our menu of focaccia, drinks, and more.",
};

type Allergen = {
  _id: string;
  code: string;
  label: string;
};

type MenuPageData = {
  title: string;
  subtitle?: string;
  allergens: Allergen[];
};

type MenuCategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  tier?: string;
  items: {
    _id: string;
    title: string;
    description?: string;
    pricingType: string;
    price?: number;
    priceVariants?: { _key: string; label: string; price: number }[];
    allergens?: Allergen[];
    image?: any;
  }[];
  extras?: { _key: string; name: string; price: string }[];
};

export default async function MenuPage() {
  const [menuPageData, categories] = await Promise.all([
    sanityFetch<MenuPageData>({
      query: MENU_PAGE_QUERY,
      tags: ["menuPage", "allergen"],
    }),
    sanityFetch<MenuCategory[]>({
      query: MENU_QUERY,
      tags: ["menuCategory", "menuItem", "allergen"],
    }),
  ]);

  const title = menuPageData?.title || "The Menu";
  const subtitle = menuPageData?.subtitle;
  const allergens = menuPageData?.allergens || [];

  return (
    <div className="scroll-smooth">
      <SectionMenuHeader
        title={title}
        subtitle={subtitle}
        allergens={allergens}
        categories={
          categories?.map((c) => ({
            _id: c._id,
            title: c.title,
            slug: c.slug,
          })) || []
        }
      />

      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <SectionMenuCategory
            key={category._id}
            title={category.title}
            slug={category.slug}
            description={category.description}
            items={category.items}
            extras={category.extras}
          />
        ))
      ) : (
        <p className="mx-auto max-w-[1856px] px-4 py-12 text-muted md:px-8">
          Menu coming soon.
        </p>
      )}
    </div>
  );
}
