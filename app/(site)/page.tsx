import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SITE_SETTINGS_QUERY,
  HOME_PAGE_QUERY,
  STORIES_QUERY,
} from "@/sanity/lib/queries";
import { SectionHero } from "@/components/sections/SectionHero";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { SectionImageGrid } from "@/components/sections/SectionImageGrid";
import { SectionQuote } from "@/components/sections/SectionQuote";
import { SectionLargeText } from "@/components/sections/SectionLargeText";
import { SectionGallery } from "@/components/sections/SectionGallery";
import { SectionStories } from "@/components/sections/SectionStories";

type SiteSettings = {
  restaurantName: string;
  tagline: string;
  logo?: { asset?: { _id: string; url: string } };
  heroImages?: any[];
  address: string;
  phone: string;
  openingHours?: { _key: string; day: string; hours: string }[];
};

type HomePageData = {
  introSection?: {
    heading?: any[];
    body?: string;
    menuImage?: any;
  };
  imageGridSection?: {
    title?: string;
    images?: any[];
  };
  quoteSection?: {
    quote?: string;
    author?: string;
  };
  largeTextSection?: {
    text?: string;
  };
  gallerySection?: {
    images?: any[];
  };
  storiesHeading?: string;
};

type Post = {
  _id: string;
  title: string;
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  slug: string;
};

export default async function HomePage() {
  const [settings, homePage, posts] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
    sanityFetch<HomePageData>({
      query: HOME_PAGE_QUERY,
      tags: ["homePage"],
    }),
    sanityFetch<Post[]>({
      query: STORIES_QUERY,
      tags: ["post"],
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings?.restaurantName || "Tapparo",
    description: settings?.tagline,
    ...(settings?.address && { address: settings.address }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.openingHours &&
      settings.openingHours.length > 0 && {
        openingHours: settings.openingHours.map(
          (entry) => `${entry.day} ${entry.hours}`
        ),
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionHero
        restaurantName={settings?.restaurantName || "Tapparo"}
        tagline={settings?.tagline}
        logo={settings?.logo}
        heroImages={settings?.heroImages}
      />

      <SectionIntro
        heading={homePage?.introSection?.heading}
        body={homePage?.introSection?.body}
        menuImage={homePage?.introSection?.menuImage}
        openingHours={settings?.openingHours}
      />

      <SectionImageGrid
        title={homePage?.imageGridSection?.title}
        images={homePage?.imageGridSection?.images}
      />

      <SectionQuote
        quote={homePage?.quoteSection?.quote}
        author={homePage?.quoteSection?.author}
      />

      <SectionLargeText text={homePage?.largeTextSection?.text} />

      <SectionGallery images={homePage?.gallerySection?.images} />

      <SectionStories
        heading={homePage?.storiesHeading}
        posts={posts || []}
      />
    </>
  );
}
