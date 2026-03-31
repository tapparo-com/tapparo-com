import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@portabletext/types";

type OpeningHour = {
  _key: string;
  day: string;
  hours: string;
};

type SectionIntroProps = {
  heading?: PortableTextBlock[] | null;
  body?: string | null;
  menuImage?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
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

export function SectionIntro({
  heading,
  body,
  menuImage,
  openingHours,
}: SectionIntroProps) {
  return (
    <section className="mx-auto max-w-[1856px] px-3 py-14 md:px-8 md:py-16 xl:py-20">
      <div className="grid gap-10 md:grid-cols-[2fr_3fr] md:gap-8 xl:gap-12">
        {/* Left: Menu image */}
        {menuImage?.asset && (
          <Link href="/menu" className="group block overflow-hidden border border-foreground">
            <Image
              src={urlFor(menuImage).width(800).height(1000).url()}
              alt={menuImage.alt || "View our menu"}
              width={800}
              height={1000}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder={menuImage.asset.metadata?.lqip ? "blur" : undefined}
              blurDataURL={menuImage.asset.metadata?.lqip || undefined}
            />
          </Link>
        )}

        {/* Right: Text content */}
        <div className="flex flex-col gap-10 md:gap-10 xl:gap-12">
          {/* Heading */}
          {heading && (
            <h2 className="font-sans text-[30px] font-semibold leading-[34px] tracking-[-0.6px] md:text-[34px] md:leading-[38px] xl:text-[42px] xl:leading-[46px] xl:tracking-[-0.84px]">
              <PortableText value={heading} components={headingComponents as any} />
            </h2>
          )}

          {/* CTA button */}
          <div>
            <Link
              href="/menu"
              className="inline-block rounded bg-accent px-8 py-3.5 text-lg font-medium text-white transition-colors hover:bg-accent/90 md:w-auto max-md:w-full max-md:text-center"
            >
              View Menu
            </Link>
          </div>

          {/* Body text */}
          {body && (
            <p className="max-w-lg font-body text-base leading-relaxed text-foreground">
              {body}
            </p>
          )}

          {/* Opening hours */}
          {openingHours && openingHours.length > 0 && (
            <div className="border-t border-foreground/20 pt-6">
              <h3 className="mb-3 font-body text-xs font-medium uppercase tracking-wider text-muted">
                Hours
              </h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1">
                {openingHours.map((row) => (
                  <div key={row._key} className="contents">
                    <dt className="font-body text-sm text-foreground">
                      {row.day}
                    </dt>
                    <dd className="font-body text-sm text-foreground">
                      {row.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
