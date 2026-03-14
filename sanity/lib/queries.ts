import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0]{
    restaurantName,
    tagline,
    isComingSoon,
    comingSoonText,
    email,
    phone,
    address,
    openingHours[]{
      _key,
      day,
      hours
    },
    socialLinks[]{
      _key,
      platform,
      url
    },
    seoDefaults{
      title,
      description
    }
  }
`);

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == "home"][0]{
    title,
    body
  }
`);

export const MENU_ITEMS_SAMPLE_QUERY = defineQuery(/* groq */ `
  *[_type == "menuItem"] | order(sortOrder asc)[0...3]{
    _id,
    title,
    description,
    price,
    pricingType,
    priceVariants[]{
      _key,
      label,
      price
    },
    category->{title}
  }
`);

export const MENU_QUERY = defineQuery(/* groq */ `
  *[_type == "menuCategory"] | order(sortOrder asc){
    _id,
    title,
    description,
    "items": *[_type == "menuItem" && references(^._id)] | order(sortOrder asc){
      _id,
      title,
      description,
      pricingType,
      price,
      priceVariants[]{
        _key,
        label,
        price
      },
      dietaryTags,
      image
    }
  }
`);

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
    seo{
      title,
      description
    }
  }
`);

export const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    body,
    seo{
      title,
      description
    }
  }
`);
