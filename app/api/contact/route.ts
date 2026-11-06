import { client } from "@/sanity/lib/client";
import { CONTACT_FORM_QUERY } from "@/sanity/lib/contactQuery";
import type { ContactSection } from "@/lib/contact";
import { contactMode } from "@/lib/contact/config";
import { handleContact } from "@/lib/contact/handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleContact(request, {
    mode: contactMode(),
    origin: new URL(request.url).origin,
    getSection: (documentId, sectionKey) =>
      client
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<ContactSection | null>(
          CONTACT_FORM_QUERY,
          { documentId, sectionKey },
          { cache: "no-store" },
        ),
  });
}
