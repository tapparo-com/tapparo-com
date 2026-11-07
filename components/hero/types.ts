import type { ContactSettings, NavigationSettings } from "@/lib/content";
import type { HoursSettings } from "@/lib/opening-hours";

export type SiteData = {
  brand: { name: string; logo: string | null; tagline?: string | null };
  intro?: { enabled?: boolean | null; artworkUrl?: string | null } | null;
  contact: ContactSettings | null;
  hours: HoursSettings | null;
  navigation: NavigationSettings | null;
};
