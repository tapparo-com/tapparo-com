import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type SectionQuoteProps = {
  author?: string | null;
  quote?: string | null;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
};

export function SectionQuote({ author, quote, image }: SectionQuoteProps) {
  if (!quote) return null;

  return (
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="pb-20 md:grid grid-cols-sidebar md:gap-10">
          {/* Right column (col-2): image + quote side by side on xl, stacked on sm */}
          <blockquote className="md:col-start-2">
            <div className="flex flex-col gap-[60px] xl:flex-row xl:items-center xl:gap-10">
              {/* Image — desktop only, left side */}
              {image?.asset && (
                <div className="hidden max-w-gutter xl:block xl:flex-1">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={urlFor(image).width(624).height(624).url()}
                      alt={image.alt || ""}
                      fill
                      sizes="(max-width: 1280px) 100vw, 624px"
                      className="object-cover"
                      placeholder={
                        image.asset.metadata?.lqip ? "blur" : undefined
                      }
                      blurDataURL={image.asset.metadata?.lqip || undefined}
                    />
                  </div>
                </div>
              )}

              {/* Text: author + quote */}
              <div className="flex max-w-gutter flex-col gap-[60px] xl:flex-1">
                {author && (
                  <cite className="text-base uppercase not-italic text-accent">
                    {author}
                  </cite>
                )}
                <p className="text-section-heading font-sans font-medium text-foreground">
                  {quote}
                </p>

                {/* Image — sm/md only, below text */}
                {image?.asset && (
                  <div className="max-w-gutter xl:hidden">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={urlFor(image).width(624).height(624).url()}
                        alt={image.alt || ""}
                        fill
                        className="object-cover"
                        placeholder={
                          image.asset.metadata?.lqip ? "blur" : undefined
                        }
                        blurDataURL={image.asset.metadata?.lqip || undefined}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
