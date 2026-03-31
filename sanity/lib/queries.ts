import { defineQuery } from "next-sanity";

// --- Shared image fragment ---
const imageFields = /* groq */ `asset->{_id, url, metadata{lqip, dimensions}}, alt`;

// --- Site Settings (layout, footer) ---
export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0]{
    restaurantName,
    tagline,
    isComingSoon,
    comingSoonText,
    logo,
    email,
    phone,
    address,
    mapUrl,
    openingHours[]{ _key, day, hours },
    socialLinks[]{ _key, platform, url },
    seoDefaults{ title, description }
  }
`);

// --- Page by slug (page builder) ---
export const PAGE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    sections[]{
      _key,
      _type,
      _type == "sectionHero" => {
        logo,
        heroImages[]{ _key, ${imageFields} },
        tagline
      },
      _type == "sectionIntro" => {
        heading,
        body,
        menuImage{ ${imageFields} }
      },
      _type == "sectionMoodImages" => {
        title,
        images[]{ _key, ${imageFields} }
      },
      _type == "sectionQuote" => {
        quote,
        author
      },
      _type == "sectionLargeText" => {
        text
      },
      _type == "sectionGallery" => {
        images[]{ _key, ${imageFields} }
      },
      _type == "sectionStories" => {
        heading,
        count
      },
      _type == "sectionRichText" => {
        body
      },
      _type == "sectionMenuHeader" => {
        title,
        subtitle
      },
      _type == "sectionMenuCategories" => {
        ...
      }
    },
    seo{ title, description }
  }
`);

// --- Stories (blog posts for stories section) ---
export const STORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$count]{
    _id,
    title,
    excerpt,
    coverImage,
    publishedAt,
    "slug": slug.current
  }
`);

// --- Menu data ---
export const ALLERGENS_QUERY = defineQuery(/* groq */ `
  *[_type == "allergen"] | order(code asc){ _id, code, label }
`);

export const MENU_QUERY = defineQuery(/* groq */ `
  *[_type == "menuCategory"] | order(sortOrder asc){
    _id,
    title,
    "slug": slug.current,
    description,
    tier,
    "items": *[_type == "menuItem" && references(^._id) && available != false] | order(sortOrder asc){
      _id,
      title,
      description,
      pricingType,
      price,
      priceVariants[]{ _key, label, price },
      "allergens": allergens[]->{ _id, code, label },
      image
    },
    extras[]{ _key, name, price }
  }
`);

// --- Page slugs (for static params + sitemap) ---
export const PAGES_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current != "home"]{ "slug": slug.current }
`);

// --- Blog ---
export const BLOG_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt
  }
`);

export const BLOG_POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    coverImage,
    publishedAt,
    author->{name, image},
    seo{ title, description }
  }
`);
