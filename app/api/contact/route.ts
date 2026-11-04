import { client } from "@/sanity/lib/client";
import { CONTACT_FORM_QUERY } from "@/sanity/lib/contactQuery";
import type { ContactSection } from "@/lib/contact";
import { contactConfigured, contactMode } from "@/lib/contact/config";
import { handleContact } from "@/lib/contact/handler";
import { createContactProviders } from "@/lib/contact/providers";
import { siteOrigin } from "@/lib/urls";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const selected = contactMode();
  const mode = selected === "live" && !contactConfigured() ? "disabled" : selected;
  const providers = mode === "live" ? createContactProviders() : {
    limit: async () => {}, verify: async () => false,
    deliver: async () => { throw new Error("Delivery is disabled outside production"); },
  };
  return handleContact(request, {
    mode, origin: mode === "demo" ? new URL(request.url).origin : siteOrigin(),
    getSection: (documentId, sectionKey) => client.withConfig({ useCdn: false, perspective: "published" }).fetch<ContactSection | null>(CONTACT_FORM_QUERY, { documentId, sectionKey }, { cache: "no-store" }),
    ...providers,
  });
}
