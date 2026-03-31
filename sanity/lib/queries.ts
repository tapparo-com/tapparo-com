import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0]{
    restaurantName,
    tagline,
    isComingSoon,
    comingSoonText,
    logo,
    heroImages[]{
      _key,
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    },
    email,
    phone,
    address,
    mapUrl,
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
  *[_type == "homePage"][0]{
    introSection{
      heading,
      body,
      menuImage{
        asset->{_id, url, metadata{lqip, dimensions}},
        alt
      }
    },
    imageGridSection{
      title,
      images[]{
        _key,
        asset->{_id, url, metadata{lqip, dimensions}},
        alt
      }
    },
    quoteSection{
      quote,
      author
    },
    largeTextSection{
      text
    },
    gallerySection{
      images[]{
        _key,
        asset->{_id, url, metadata{lqip, dimensions}},
        alt
      }
    },
    storiesHeading
  }
`);

export const STORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...6]{
    _id,
    title,
    excerpt,
    coverImage,
    publishedAt,
    "slug": slug.current
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

export const MENU_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "menuPage"][0]{
    title,
    subtitle,
    "allergens": *[_type == "allergen"] | order(code asc){ _id, code, label }
  }
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
      priceVariants[]{
        _key,
        label,
        price
      },
      "allergens": allergens[]->{ _id, code, label },
      image
    },
    extras[]{
      _key,
      name,
      price
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
