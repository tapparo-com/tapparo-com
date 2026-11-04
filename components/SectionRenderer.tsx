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
import { SectionText } from "@/components/sections/SectionText";
import { SectionContactForm } from "@/components/sections/SectionContactForm";
import type { ContactSection } from "@/lib/contact";

type Section = {
  _key: string;
  _type: string;
  [key: string]: any;
};

type SharedData = {
  restaurantName?: string;
  tagline?: string;
  logoSvg?: string | null;
  openingHours?: { _key: string; day: string; hours: string }[];
};

type Props = {
  sections: Section[];
  documentId?: string;
  shared?: SharedData;
};

export async function SectionRenderer({ sections, shared, documentId }: Props) {
  if (!sections || sections.length === 0) return null;

  // Pre-fetch data needed by dynamic sections
  const needsStories = sections.some((s) => s._type === "sectionStories");

  const stories = needsStories
    ? await sanityFetch<any[]>({
        query: STORIES_QUERY,
        tags: ["post"],
      })
    : null;

  return (
    <div data-section-page data-has-leading-hero={sections[0]?._type === "sectionHero"}>
      {sections.map((section) => {
        switch (section._type) {
          case "sectionContactForm":
            return documentId ? <SectionContactForm key={section._key} documentId={documentId} section={section as ContactSection} /> : null;
          case "sectionHero":
            return <SectionHero key={section._key} heroImages={section.heroImages} tickerPhrases={section.tickerPhrases} imageDuration={section.imageDuration} />;
          case "sectionSubhero":
            return (
              <SectionSubhero
                key={section._key}
                label={section.label}
                heading={section.heading}
                image={section.image}
                secondaryImage={section.secondaryImage}
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
                secondaryImage={section.secondaryImage}
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

          case "sectionText":
            return (
              <SectionText
                key={section._key}
                contactAction={section.contactAction}
                label={section.label}
                body={section.body}
                image={section.image}
                secondaryImage={section.secondaryImage}
                imageFirst={section.imageFirst}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
