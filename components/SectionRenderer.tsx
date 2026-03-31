import { sanityFetch } from "@/sanity/lib/fetch";
import { STORIES_QUERY, ALLERGENS_QUERY, MENU_QUERY } from "@/sanity/lib/queries";
import { SectionHero } from "@/components/sections/SectionHero";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { SectionImageGrid } from "@/components/sections/SectionImageGrid";
import { SectionQuote } from "@/components/sections/SectionQuote";
import { SectionLargeText } from "@/components/sections/SectionLargeText";
import { SectionGallery } from "@/components/sections/SectionGallery";
import { SectionStories } from "@/components/sections/SectionStories";
import { SectionMenuHeader } from "@/components/sections/SectionMenuHeader";
import { SectionMenuCategory } from "@/components/sections/SectionMenuCategory";
import { SectionRichText } from "@/components/sections/SectionRichText";

type Section = {
  _key: string;
  _type: string;
  [key: string]: any;
};

type SharedData = {
  restaurantName?: string;
  openingHours?: { _key: string; day: string; hours: string }[];
};

type Props = {
  sections: Section[];
  shared?: SharedData;
};

export async function SectionRenderer({ sections, shared }: Props) {
  if (!sections || sections.length === 0) return null;

  // Pre-fetch data needed by dynamic sections
  const needsStories = sections.some((s) => s._type === "sectionStories");
  const needsMenu = sections.some((s) => s._type === "sectionMenuCategories");
  const needsAllergens = sections.some((s) => s._type === "sectionMenuHeader");

  const [stories, allergens, menuCategories] = await Promise.all([
    needsStories
      ? sanityFetch<any[]>({
          query: STORIES_QUERY,
          params: {
            count:
              sections.find((s) => s._type === "sectionStories")?.count ?? 6,
          },
          tags: ["post"],
        })
      : null,
    needsAllergens
      ? sanityFetch<any[]>({
          query: ALLERGENS_QUERY,
          tags: ["allergen"],
        })
      : null,
    needsMenu
      ? sanityFetch<any[]>({
          query: MENU_QUERY,
          tags: ["menuCategory", "menuItem", "allergen"],
        })
      : null,
  ]);

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "sectionHero":
            return (
              <SectionHero
                key={section._key}
                restaurantName={shared?.restaurantName || "Tapparo"}
                tagline={section.tagline}
                logo={section.logo}
                heroImages={section.heroImages}
              />
            );

          case "sectionIntro":
            return (
              <SectionIntro
                key={section._key}
                heading={section.heading}
                body={section.body}
                menuImage={section.menuImage}
                openingHours={shared?.openingHours}
              />
            );

          case "sectionMoodImages":
            return (
              <SectionImageGrid
                key={section._key}
                title={section.title}
                images={section.images}
              />
            );

          case "sectionQuote":
            return (
              <SectionQuote
                key={section._key}
                quote={section.quote}
                author={section.author}
              />
            );

          case "sectionLargeText":
            return (
              <SectionLargeText
                key={section._key}
                text={section.text}
              />
            );

          case "sectionGallery":
            return (
              <SectionGallery
                key={section._key}
                images={section.images}
              />
            );

          case "sectionStories":
            return (
              <SectionStories
                key={section._key}
                heading={section.heading}
                posts={stories || []}
              />
            );

          case "sectionRichText":
            return (
              <SectionRichText
                key={section._key}
                body={section.body}
              />
            );

          case "sectionMenuHeader":
            return (
              <SectionMenuHeader
                key={section._key}
                title={section.title}
                subtitle={section.subtitle}
                allergens={allergens || []}
                categories={
                  menuCategories?.map((c: any) => ({
                    _id: c._id,
                    title: c.title,
                    slug: c.slug,
                  })) || []
                }
              />
            );

          case "sectionMenuCategories":
            return (
              <div key={section._key}>
                {menuCategories?.map((category: any) => (
                  <SectionMenuCategory
                    key={category._id}
                    title={category.title}
                    slug={category.slug}
                    description={category.description}
                    items={category.items}
                    extras={category.extras}
                  />
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
