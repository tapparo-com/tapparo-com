import { sanityFetch } from "@/sanity/lib/fetch";
import { MENU_QUERY } from "@/sanity/lib/queries";
import { MenuSection } from "@/components/MenuSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Our menu of focaccia, drinks, and more.",
};

type MenuCategory = {
  _id: string;
  title: string;
  description?: string;
  items: {
    _id: string;
    title: string;
    description?: string;
    pricingType: string;
    price?: number;
    priceVariants?: { _key: string; label: string; price: number }[];
    dietaryTags?: string[];
    image?: any;
  }[];
};

export default async function MenuPage() {
  const categories = await sanityFetch<MenuCategory[]>({
    query: MENU_QUERY,
    tags: ["menuCategory", "menuItem"],
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Menu</h1>
      {categories && categories.length > 0 ? (
        <div className="mt-12 divide-y divide-border">
          {categories.map((category) => (
            <MenuSection
              key={category._id}
              title={category.title}
              description={category.description}
              items={category.items}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">Menu coming soon.</p>
      )}
    </div>
  );
}
