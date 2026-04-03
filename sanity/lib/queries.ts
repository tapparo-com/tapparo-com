import { defineQuery } from "next-sanity";

// --- Shared image fragment ---
const imageFields = /* groq */ `asset->{_id, url, metadata{lqip, dimensions}}, alt`;

// --- Site Settings (split across 5 documents) ---
export const BRAND_QUERY = defineQuery(/* groq */ `
  *[_type == "settingsBrand"][0]{
    restaurantName,
    tagline,
    logo
  }
`);

export const CONTACT_QUERY = defineQuery(/* groq */ `
  *[_type == "settingsContact"][0]{
    email,
    phone,
    address,
    mapUrl
  }
`);

export const HOURS_QUERY = defineQuery(/* groq */ `
  *[_type == "settingsHours"][0]{
    openingHours[]{ _key, day, hours }
  }
`);

export const SOCIAL_QUERY = defineQuery(/* groq */ `
  *[_type == "socialLink"]{ _id, label, url }
`);

export const SEO_QUERY = defineQuery(/* groq */ `
  *[_type == "settingsSeo"][0]{
    isComingSoon,
    comingSoonText,
    metaTitle,
    metaDescription
  }
`);

// --- Navigation ---
export const HEADER_NAV_QUERY = defineQuery(/* groq */ `
  *[_type == "navigationHeader"][0]{
    pageLinks[]{
      _key,
      label,
      "slug": page->slug.current
    },
    socialLinks[]->{ _id, label, url },
    showPhone,
    "phone": select(
      showPhone == true => *[_type == "settingsContact"][0].phone,
      null
    )
  }
`);

export const FOOTER_NAV_QUERY = defineQuery(/* groq */ `
  *[_type == "navigationFooter"][0]{
    pageLinks[]{
      _key,
      label,
      "slug": page->slug.current
    },
    socialLinks[]->{ _id, label, url },
    showPhone,
    showEmail
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
        heroImages[]{ _key, ${imageFields} }
      },
      _type == "sectionSubhero" => {
        label,
        heading,
        image{ ${imageFields} },
        "button": button[0]{
          label,
          "slug": page->slug.current,
          variant
        },
        showOpeningHours
      },
      _type == "sectionStoryHighlight" => {
        label,
        titleOverride,
        excerptOverride,
        "story": story->{
          title,
          excerpt,
          coverImage{ ${imageFields} },
          "slug": slug.current
        },
        buttonLabel
      },
      _type == "sectionMoodImages" => {
        title,
        images[]{ _key, ${imageFields} }
      },
      _type == "sectionQuote" => {
        author,
        quote,
        image{ ${imageFields} }
      },
      _type == "sectionLargeText" => {
        text
      },
      _type == "sectionGallery" => {
        images[]{ _key, ${imageFields} },
        caption
      },
      _type == "sectionStories" => {
        heading,
        "pinnedStoryId": pinnedStory->_id
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
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    excerpt,
    coverImage,
    publishedAt,
    "slug": slug.current,
    "authorName": author->name
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
