import type { PortableTextBlock } from "@portabletext/types";
import type { ContactSection } from "@/lib/contact";
import type { HeroSecondaryLink } from "@/lib/hero-links";

/** Shapes returned by the published-content GROQ projections. Optional CMS fields can be null. */
export type ContentImage = {
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  } | null;
  alt?: string | null;
  fit?: "cover" | "contain" | null;
  crop?: { left: number; right: number; top: number; bottom: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
};
export type KeyedContentImage = ContentImage & { _key: string };
export type TextBlock = PortableTextBlock & {
  _type: "block";
  originalHeadingStyle?: string;
};
export type RichTextImage = ContentImage & {
  _type: "image";
  _key: string;
  caption?: string | null;
};
export type RichText = (TextBlock | RichTextImage)[];
export type ContentSeo = { title?: string | null; description?: string | null };

export type StorySummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: ContentImage | null;
  publishedAt?: string | null;
  authorName?: string | null;
};
export type StoryDocument = StorySummary & {
  body?: RichText | null;
  author?: { name?: string | null; image?: ContentImage | null } | null;
  showRelatedStories?: boolean | null;
  relatedStories?: (StorySummary | null)[] | null;
  seo?: ContentSeo | null;
};
export type LegalDocument = {
  _id: string;
  title: string;
  slug: string;
  body?: RichText | null;
  updatedAt?: string | null;
  seo?: ContentSeo | null;
};
type Section<Type extends string, Fields> = {
  _key: string;
  _type: Type;
} & Fields;
export type PageSection =
  | Section<
      "sectionHero",
      {
        heroImages?: KeyedContentImage[] | null;
        tickerPhrases?: string[] | null;
        imageDuration?: number | null;
        description?: string | null;
        secondaryLink?: HeroSecondaryLink | null;
      }
    >
  | Section<
      "sectionSubhero",
      {
        label?: string | null;
        heading?: TextBlock[] | null;
        image?: ContentImage | null;
        secondaryImage?: ContentImage | null;
        button?: {
          label: string;
          slug?: string | null;
          variant?: "filled" | "outline" | null;
        } | null;
        showOpeningHours?: boolean | null;
      }
    >
  | Section<
      "sectionStoryHighlight",
      {
        label?: string | null;
        story?: Pick<
          StorySummary,
          "title" | "excerpt" | "coverImage" | "slug"
        > | null;
        titleOverride?: string | null;
        excerptOverride?: string | null;
        buttonLabel?: string | null;
      }
    >
  | Section<
      "sectionMoodImages",
      { title?: string | null; images?: KeyedContentImage[] | null }
    >
  | Section<
      "sectionQuote",
      {
        author?: string | null;
        quote?: string | null;
        image?: ContentImage | null;
        secondaryImage?: ContentImage | null;
      }
    >
  | Section<"sectionLargeText", { text?: string | null }>
  | Section<
      "sectionGallery",
      { images?: KeyedContentImage[] | null; caption?: string | null }
    >
  | Section<
      "sectionStories",
      { heading?: string | null; pinnedStoryId?: string | null }
    >
  | Section<
      "sectionText",
      {
        label?: string | null;
        body?: TextBlock[] | null;
        image?: ContentImage | null;
        secondaryImage?: ContentImage | null;
        imageFirst?: boolean | null;
        contactAction?: {
          label?: string | null;
          slug?: string | null;
          reason?: string | null;
        } | null;
      }
    >
  | ContactSection;

export type PageDocument = {
  _id: string;
  title: string;
  sections?: PageSection[] | null;
  seo?: ContentSeo | null;
};
export type ListingPage = {
  title?: string | null;
  description?: string | null;
  seo?: ContentSeo | null;
};
export type Allergen = { _id: string; code: string; label: string };
export type MenuItem = {
  _id: string;
  title: string;
  description?: string | null;
  pricingType: "fixed" | "variants";
  price?: number | null;
  priceVariants?: { _key: string; label: string; price: number }[] | null;
  allergens?: (Allergen | null)[] | null;
};
export type MenuCategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  items?: (MenuItem | null)[] | null;
  extras?: { _key: string; name: string; price: string }[] | null;
  images?: KeyedContentImage[] | null;
};
export type MenuPage = ListingPage & {
  categories?: (MenuCategory | null)[] | null;
};
export type BrandSettings = {
  restaurantName?: string | null;
  tagline?: string | null;
  logo?: ContentImage | null;
  supportingLogo?: ContentImage | null;
  supportingLogoTagline?: ContentImage | null;
};
export type ContactSettings = {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  mapUrl?: string | null;
};
export type PageLink = { _key: string; label: string; slug: string };
export type SocialLink = { _id: string; label: string; url: string };
export type NavigationSettings = {
  pageLinks?: PageLink[] | null;
  socialLinks?: SocialLink[] | null;
  phone?: string | null;
  showPhone?: boolean | null;
  showEmail?: boolean | null;
};
export type SeoSettings = {
  isComingSoon?: boolean | null;
  comingSoonBody?: TextBlock[] | null;
  comingSoonShowAddress?: boolean | null;
  comingSoonSocialLinks?: SocialLink[] | null;
  titleTemplate?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

/** Clearing a CMS array returns null; preserve authored order and omit blank phrases. */
export function normalizeTickerPhrases(
  phrases?: readonly string[] | null,
): string[] {
  return (phrases ?? [])
    .filter((phrase) => typeof phrase === "string" && phrase.trim())
    .map((phrase) => phrase.trim());
}

export type ResolvedContent =
  | { kind: "page"; document: PageDocument }
  | { kind: "post"; document: StoryDocument }
  | { kind: "legal"; document: LegalDocument };
export type ContentLookup = {
  page: (slug: string) => Promise<PageDocument | null>;
  post: (slug: string) => Promise<StoryDocument | null>;
  legal: (slug: string) => Promise<LegalDocument | null>;
};

/** Keep route and metadata resolution in the same page → story → legal order. */
export async function resolveContent(
  slug: string,
  lookup: ContentLookup,
): Promise<ResolvedContent | null> {
  const page = await lookup.page(slug);
  if (page) return { kind: "page", document: page };
  const post = await lookup.post(slug);
  if (post) return { kind: "post", document: post };
  const legal = await lookup.legal(slug);
  return legal ? { kind: "legal", document: legal } : null;
}
