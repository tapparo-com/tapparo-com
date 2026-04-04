import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { PortableTextBlock } from "@portabletext/types";

type ImageAsset = {
  asset?: { _id: string; url: string; metadata?: { lqip?: string } };
  alt?: string;
};

function ImageBlock({
  image,
  href,
  className,
}: {
  image: ImageAsset;
  href?: string;
  className?: string;
}) {
  const inner = (
    <div className="group relative aspect-[730/1015] overflow-hidden">
      <Image
        src={urlFor(image).width(730).height(1015).url()}
        alt={image.alt || ""}
        fill
        sizes="(max-width: 1280px) 100vw, 624px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        placeholder={image.asset?.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image.asset?.metadata?.lqip || undefined}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}

type OpeningHour = {
  _key: string;
  day: string;
  hours: string;
};

type SectionSubheroProps = {
  label?: string | null;
  heading?: PortableTextBlock[] | null;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
  button?: {
    label: string;
    slug?: string | null;
    variant?: "filled" | "outline" | null;
  } | null;
  showOpeningHours?: boolean;
  openingHours?: OpeningHour[] | null;
};

const headingComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <span>{children}</span>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <span className="text-accent">{children}</span>
    ),
  },
};

export function SectionSubhero({
  label,
  heading,
  image,
  button,
  showOpeningHours,
  openingHours,
}: SectionSubheroProps) {
  const buttonHref = button?.slug
    ? button.slug === "home"
      ? "/"
      : `/${button.slug}`
    : undefined;

  return (
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        {/* Desktop/Tablet: grid with label sidebar. Mobile: stacked. */}
        <div className="flex flex-col gap-16 md:grid grid-cols-sidebar md:gap-10">
          {/* Left column: section label */}
          {label && (
            <div className="shrink-0 md:row-start-1 md:col-start-1">
              <span className="text-base uppercase text-foreground">
                {label}
              </span>
            </div>
          )}

          {/* Right column: content */}
          <div className="md:row-start-1 md:col-start-2">
            {/* Desktop: text + image side by side. Tablet/Mobile: stacked. */}
            <div className="flex flex-col gap-[60px] xl:flex-row xl:items-start xl:gap-10">
              {/* Text column */}
              <div className="flex max-w-gutter flex-col gap-[60px] xl:flex-1">
                {/* Heading */}
                {heading && (
                  <h2 className="text-section-heading font-sans font-medium text-foreground">
                    <PortableText
                      value={heading}
                      components={headingComponents as any}
                    />
                  </h2>
                )}

                {/* Image — shown on md/sm only (stacked in content flow) */}
                {image?.asset && (
                  <ImageBlock
                    image={image}
                    href={buttonHref}
                    className="max-w-gutter xl:hidden"
                  />
                )}

                {/* CTA button */}
                {button?.label && buttonHref && (
                  <div>
                    <ButtonLink
                      href={buttonHref}
                      label={button.label}
                      variant={button.variant || "filled"}
                    />
                  </div>
                )}

                {/* Opening hours */}
                {showOpeningHours &&
                  openingHours &&
                  openingHours.length > 0 && (
                    <dl>
                      {openingHours.map((row) => (
                        <div
                          key={row._key}
                          className="flex gap-2 font-sans text-2xl font-medium leading-8 text-foreground"
                        >
                          <dt className="w-[152px]">{row.day}</dt>
                          <dd className="whitespace-nowrap">{row.hours}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
              </div>

              {/* Image column — visible on desktop only */}
              {image?.asset && (
                <ImageBlock
                  image={image}
                  href={buttonHref}
                  className="hidden max-w-gutter xl:block xl:flex-1"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
