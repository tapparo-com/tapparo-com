import { ContactForm } from "@/components/contact/ContactForm";
import { contactConfigured, contactMode } from "@/lib/contact/config";
import type { ContactSection } from "@/lib/contact";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CONTACT_QUERY } from "@/sanity/lib/queries";

export async function SectionContactForm({ section, documentId }: { section: ContactSection; documentId: string }) {
  const mode = contactMode();
  const contact = await sanityFetch<{ email?: string } | null>({ query: CONTACT_QUERY, tags: ["settingsContact"] });
  return <ContactForm section={section} documentId={documentId} mode={mode === "live" && !contactConfigured() ? "disabled" : mode}
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} contactEmail={contact?.email?.trim() || undefined} />;
}
