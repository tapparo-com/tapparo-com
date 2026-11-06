import { pathForSlug } from "./urls";

export type HeroSecondaryLink = {
  enabled?: boolean | null;
  label?: string | null;
  slug?: string | null;
};

export function resolveHeroSecondaryLink(link?: HeroSecondaryLink | null) {
  // Incomplete or unresolved CMS links stay hidden without a substitute destination.
  if (link?.enabled !== true || !link.label?.trim() || !link.slug) return null;
  return { label: link.label, href: pathForSlug(link.slug) };
}
