import { urlFor } from "@/sanity/lib/image";

export async function fetchLogoSvg(
  logo: { asset?: { _id: string; url: string } } | null | undefined
): Promise<string | null> {
  if (!logo?.asset) return null;
  try {
    const url = urlFor(logo).url();
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const text = await res.text();
    return text
      .replace(/<svg([^>]*)>/, (_match, attrs) => {
        const withoutDims = attrs
          .replace(/\s*width="[^"]*"/g, "")
          .replace(/\s*height="[^"]*"/g, "");
        return `<svg${withoutDims}>`;
      })
      .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
  } catch {
    return null;
  }
}
