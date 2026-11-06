import { ORDER_PATH } from "@/lib/ordering";
import { pathForSlug } from "@/lib/urls";
import type { SiteData } from "./types";

/** The ordering destination stays fixed until the planned CMS refactor. */
export function getMenuLinks(navigation: SiteData["navigation"]) {
  const pages = (navigation?.pageLinks || []).filter(link => link.slug).map(link => ({
    key: `page:${link._key}`, label: link.label, href: pathForSlug(link.slug), external: false,
  }));
  const homeIndex = pages.findIndex(link => link.href === "/");
  pages.splice(homeIndex + 1, 0, { key: "tapparo:order", label: "Jetzt bestellen", href: ORDER_PATH, external: false });
  return [...pages, ...(navigation?.socialLinks || []).map(link => ({
    key: `social:${link._id}`, label: link.label, href: link.url, external: true,
  }))];
}
