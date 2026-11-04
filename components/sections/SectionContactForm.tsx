import { ContactForm } from "@/components/contact/ContactForm";
import { contactConfigured, contactMode } from "@/lib/contact/config";
import type { ContactSection } from "@/lib/contact";

export function SectionContactForm({ section, documentId }: { section: ContactSection; documentId: string }) {
  const mode = contactMode();
  return <ContactForm section={section} documentId={documentId} mode={mode === "live" && !contactConfigured() ? "disabled" : mode} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />;
}
