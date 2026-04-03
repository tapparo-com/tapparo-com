import { sanityFetch } from "@/sanity/lib/fetch";
import { STORIES_QUERY } from "@/sanity/lib/queries";
import { SectionHero } from "@/components/sections/SectionHero";
import { SectionSubhero } from "@/components/sections/SectionSubhero";
import { SectionStoryHighlight } from "@/components/sections/SectionStoryHighlight";
import { SectionImageGrid } from "@/components/sections/SectionImageGrid";
import { SectionQuote } from "@/components/sections/SectionQuote";
import { SectionLargeText } from "@/components/sections/SectionLargeText";
import { SectionGallery } from "@/components/sections/SectionGallery";
import { SectionStories } from "@/components/sections/SectionStories";
import { SectionRichText } from "@/components/sections/SectionRichText";
import { SectionText } from "@/components/sections/SectionText";

type Section = {
  _key: string;
  _type: string;
  [key: string]: any;
};

type SharedData = {
  restaurantName?: string;
  tagline?: string;
  logo?: any;
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

  const stories = needsStories
    ? await sanityFetch<any[]>({
        query: STORIES_QUERY,
        tags: ["post"],
      })
    : null;

  const heroIndex = sections.findIndex((s) => s._type === "sectionHero");
  const heroSection = heroIndex !== -1 ? sections[heroIndex] : null;
  const restSections = heroSection
    ? sections.filter((_, i) => i !== heroIndex)
    : sections;

  return (
    <>
      {heroSection && (
        <SectionHero
          key={heroSection._key}
          restaurantName={shared?.restaurantName || "Tapparo"}
          tagline={shared?.tagline}
          logo={shared?.logo}
          heroImages={heroSection.heroImages}
        />
      )}
      <div className="relative z-10 bg-background">
      {restSections.map((section) => {
        switch (section._type) {
          case "sectionSubhero":
            return (
              <SectionSubhero
                key={section._key}
                label={section.label}
                heading={section.heading}
                image={section.image}
                button={section.button}
                showOpeningHours={section.showOpeningHours}
                openingHours={shared?.openingHours}
              />
            );

          case "sectionStoryHighlight":
            return (
              <SectionStoryHighlight
                key={section._key}
                label={section.label}
                story={section.story}
                titleOverride={section.titleOverride}
                excerptOverride={section.excerptOverride}
                buttonLabel={section.buttonLabel}
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
                author={section.author}
                quote={section.quote}
                image={section.image}
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
                caption={section.caption}
              />
            );

          case "sectionStories":
            return (
              <SectionStories
                key={section._key}
                heading={section.heading}
                posts={stories || []}
                pinnedStoryId={section.pinnedStoryId}
              />
            );

          case "sectionRichText":
            return (
              <SectionRichText
                key={section._key}
                body={section.body}
              />
            );

          case "sectionText":
            return (
              <SectionText
                key={section._key}
                label={section.label}
                body={section.body}
                image={section.image}
                imageFirst={section.imageFirst}
              />
            );

          default:
            return null;
        }
      })}
      </div>
    </>
  );
}
