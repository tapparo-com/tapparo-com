/** The public site uses lowercase, single-segment slugs and no trailing slash. */
export const SLUG_MAX_LENGTH = 96;
export const ROUTE_TYPES = ["page", "post", "legalPage"] as const;
export const SLUG_TYPES = [...ROUTE_TYPES, "menuCategory"] as const;
export const RESERVED_SLUGS = new Set([
  "home", "menu", "stories", "order", "design-preview", "studio", "api", "_next", "_vercel",
  "favicon.ico", "robots.txt", "sitemap.xml", "manifest.webmanifest",
  "icon", "apple-icon", "opengraph-image", "twitter-image",
]);

/** Only generate new slugs with this function; do not rewrite existing URLs with it. */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH).replace(/-+$/g, "");
}

export function validateSlug(slug: string | undefined, type: string): true | string {
  if (!slug) return "A slug is required.";
  if (slug.length > SLUG_MAX_LENGTH) return `Use at most ${SLUG_MAX_LENGTH} characters.`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Use lowercase letters a–z, numbers, and single hyphens only (no spaces or slashes).";
  }
  if (type !== "menuCategory" && RESERVED_SLUGS.has(slug) && !(type === "page" && slug === "home")) {
    return `“${slug}” is reserved for a built-in route. Choose another slug.`;
  }
  return true;
}

export function publishedDocumentId(id: string): string {
  return id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");
}

/** Returns the original path for infrastructure/assets; never changes query strings. */
export function canonicalPublicPath(pathname: string): string {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
  // Studio IDs, APIs, and asset filenames can be case-sensitive.
  if (/^\/*(?:studio|api|_next|_vercel)(?:\/|$)/i.test(decoded) || decoded.includes(".")) {
    return pathname;
  }
  // Decode only URL-safe ASCII slug characters. Keep escaped separators escaped.
  const path = pathname
    .replace(/%([0-9a-f]{2})/gi, (encoded, hex: string) => {
      const character = String.fromCharCode(parseInt(hex, 16));
      return /^[a-z0-9_-]$/i.test(character) ? character : encoded.toUpperCase();
    })
    .replace(/%[0-9A-F]{2}|[^%]+|%/g, (part) => part.startsWith("%") ? part : part.toLowerCase())
    .replace(/\/+/g, "/")
    .replace(/\/+$/, "") || "/";
  return path === "/home" ? "/" : path;
}

export function pathForSlug(slug: string): string {
  return canonicalPublicPath(`/${slug.replace(/^\/+/, "")}`);
}

export function siteOrigin(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tapparo.com");
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) site URL without credentials.");
  }
  return url.origin;
}

export function absoluteSiteUrl(path = "/"): string {
  // Assign the pathname instead of resolving a relative URL: it cannot change the host.
  const url = new URL(siteOrigin());
  url.pathname = canonicalPublicPath(`/${path.replace(/^\/+/, "")}`);
  return url.href;
}

/** Normalize CMS-authored internal links while preserving external URLs and fragments. */
export function normalizeInternalHref(href: string): string {
  if (href.startsWith("/") && !href.startsWith("//")) {
    const suffixIndex = href.search(/[?#]/);
    const path = suffixIndex < 0 ? href : href.slice(0, suffixIndex);
    return canonicalPublicPath(path) + (suffixIndex < 0 ? "" : href.slice(suffixIndex));
  }
  if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      if (url.origin === siteOrigin() && !url.username && !url.password) {
        url.pathname = canonicalPublicPath(url.pathname);
        return url.href;
      }
    } catch {
      // An invalid authored URL must not prevent the surrounding content rendering.
      return href;
    }
  }
  return href;
}
