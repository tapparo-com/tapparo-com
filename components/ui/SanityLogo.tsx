type SanityLogoProps = {
  svgHtml: string;
  alt: string;
  className?: string;
};

export function SanityLogo({ svgHtml, alt, className = "" }: SanityLogoProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
