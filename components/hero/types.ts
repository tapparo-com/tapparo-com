import type { HoursSettings } from "@/lib/opening-hours";
import type { SanityHeroImage } from "@/lib/hero-images";

export type SiteData = {
  brand: { name: string; logo: string | null; tagline?: string };
  intro?: { enabled?: boolean; artworkUrl?: string | null } | null;
  navigationHero?: { image?: SanityHeroImage | null; tickerPhrases?: string[] } | null;
  contact: { address?: string; mapUrl?: string } | null;
  hours: HoursSettings | null;
  navigation: {
    pageLinks?: { _key: string; label: string; slug: string }[];
    socialLinks?: { _id: string; label: string; url: string }[];
    phone?: string | null;
  } | null;
};

export type HeroImage = {
  id: string;
  src: string;
  alt: string;
  position?: string;
  aspectRatio?: number;
};
