"use client";

import { useEffect, useState } from "react";
import { urlFor } from "@/sanity/lib/image";

type SanityLogoProps = {
  logo: { asset?: { _id: string; url: string } };
  alt: string;
  className?: string;
};

export function SanityLogo({ logo, alt, className = "" }: SanityLogoProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (!logo?.asset) return;
    const url = urlFor(logo).url();

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        // Strip width/height from root <svg> so it scales with CSS,
        // and replace any fill colors with currentColor
        const cleaned = text
          .replace(/<svg([^>]*)>/, (match, attrs) => {
            const withoutDims = attrs
              .replace(/\s*width="[^"]*"/g, "")
              .replace(/\s*height="[^"]*"/g, "");
            return `<svg${withoutDims}>`;
          })
          .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
        setSvgContent(cleaned);
      })
      .catch(() => {});
  }, [logo]);

  if (!svgContent) return null;

  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
