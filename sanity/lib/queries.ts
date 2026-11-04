import { defineQuery } from "next-sanity";

// --- Shared image fragment ---
const imageFields = /* groq */ `asset->{_id, url, metadata{lqip, dimensions}}, alt, crop, hotspot`;

// --- Site Settings ---
export const PAGE_INTRO_QUERY = defineQuery(/* groq */ `
  *[_id == "settingsPageIntro"][0]{
    enabled,
    "artworkUrl": artwork.asset->url
  }
`);

export const BRAND_QUERY = defineQuery(/* groq */ `
  *[_type == "settingsBrand"][0]{
    restaurantName,
    tagline,
    logo,
    supportingLogo{ asset->{_id, url} },
    supportingLogoTagline{ asset->{_id, url} }
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
    openingHours[]{ _key, day, hours },
    weeklySchedule,
    closedOnPublicHolidays,
    dateExceptions[]{ _key, date, closed, periods[]{ _key, start, end, nextDay } },
    temporaryClosures[]{ _key, startDate, endDate }
  }
`);


export const SEO_QUERY = defineQuery(/* groq */ `
  *[_type == "settingsSeo"][0]{
    isComingSoon,
    comingSoonBody,
    comingSoonShowAddress,
    comingSoonSocialLinks[]->{ _id, label, url },
    titleTemplate,
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
      "slug": select(
        page->_type == "menuPage" => "menu",
        page->_type == "storiesPage" => "stories",
        lower(page->slug.current)
      )
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
      "slug": select(
        page->_type == "menuPage" => "menu",
        page->_type == "storiesPage" => "stories",
        lower(page->slug.current)
      )
    },
    socialLinks[]->{ _id, label, url },
    showPhone,
    showEmail
  }
`);

// --- Page by slug (page builder) ---
export const PAGE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && lower(slug.current) == $slug][0]{
    _id,
    title,
    sections[]{
      _key,
      _type,
      _type == "sectionHero" => {
        tickerPhrases,
        imageDuration,
        heroImages[defined(asset)]{ _key, ${imageFields} }
      },
      _type == "sectionSubhero" => {
        label,
        heading,
        image{ ${imageFields} },
        secondaryImage{ ${imageFields} },
        "button": button[0]{
          label,
          "slug": select(
            page->_type == "menuPage" => "menu",
            page->_type == "storiesPage" => "stories",
            lower(page->slug.current)
          ),
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
          "slug": lower(slug.current)
        },
        buttonLabel
      },
      _type == "sectionMoodImages" => {
        title,
        images[defined(asset)]{ _key, ${imageFields} }
      },
      _type == "sectionQuote" => {
        author,
        quote,
        image{ ${imageFields} },
        secondaryImage{ ${imageFields} }
      },
      _type == "sectionLargeText" => {
        text
      },
      _type == "sectionGallery" => {
        images[defined(asset)]{ _key, ${imageFields} },
        caption
      },
      _type == "sectionStories" => {
        heading,
        "pinnedStoryId": pinnedStory->_id
      },
      _type == "sectionText" => {
        label,
        body,
        image{ ${imageFields} },
        secondaryImage{ ${imageFields} },
        imageFirst
      },
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
    "slug": lower(slug.current),
    "authorName": author->name
  }
`);

// --- Menu data ---
export const ALLERGENS_QUERY = defineQuery(/* groq */ `
  *[_type == "allergen"] | order(code asc){ _id, code, label }
`);

export const MENU_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "menuPage"][0]{
    title,
    description,
    seo{ title, description },
    categories[]->{
      _id,
      title,
      "slug": lower(slug.current),
      description,
      "items": items[@->available != false]->{
        _id,
        title,
        description,
        pricingType,
        price,
        priceVariants[]{ _key, label, price },
        "allergens": allergens[]->{ _id, code, label }
      },
      extras[]{ _key, name, price },
      images[defined(asset)]{ _key, asset->{_id, url}, alt }
    }
  }
`);

// --- Stories page ---
export const STORIES_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "storiesPage"][0]{
    title,
    description,
    seo{ title, description }
  }
`);

// --- Related stories (excludes current post) ---
export const RELATED_STORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && lower(slug.current) != $slug && defined(slug.current)] | order(publishedAt desc)[0...2]{
    _id,
    title,
    excerpt,
    coverImage,
    publishedAt,
    "slug": lower(slug.current),
    "authorName": author->name
  }
`);

// --- Legal pages ---
export const LEGAL_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "legalPage" && lower(slug.current) == $slug][0]{
    _id,
    title,
    "slug": lower(slug.current),
    body,
    updatedAt,
    seo{ title, description }
  }
`);

export const LEGAL_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "legalPage" && defined(slug.current)]{ _updatedAt, "slug": lower(slug.current) }
`);

// --- Page slugs (for static params + sitemap) ---
export const PAGES_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && defined(slug.current) && lower(slug.current) != "home"]{ _updatedAt, "slug": lower(slug.current) }
`);

// --- Blog ---
export const BLOG_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    _updatedAt,
    title,
    "slug": lower(slug.current),
    excerpt,
    coverImage,
    publishedAt
  }
`);

export const BLOG_POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && lower(slug.current) == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": lower(slug.current),
    excerpt,
    body,
    coverImage,
    publishedAt,
    author->{name, image},
    showRelatedStories,
    "relatedStories": relatedStories[]->{
      _id,
      title,
      excerpt,
      coverImage,
      publishedAt,
      "slug": lower(slug.current),
      "authorName": author->name
    },
    seo{ title, description }
  }
`);
