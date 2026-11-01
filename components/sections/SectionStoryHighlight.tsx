import { pathForSlug } from "@/lib/urls";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { urlFor } from "@/sanity/lib/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";

type Story = {
  title: string;
  excerpt?: string;
  coverImage?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
  slug: string;
};

type SectionStoryHighlightProps = {
  label?: string | null;
  story?: Story | null;
  titleOverride?: string | null;
  excerptOverride?: string | null;
  buttonLabel?: string | null;
};

export function SectionStoryHighlight({
  label,
  story,
  titleOverride,
  excerptOverride,
  buttonLabel,
}: SectionStoryHighlightProps) {
  if (!story) return null;

  const title = titleOverride || story.title;
  const excerpt = excerptOverride || story.excerpt;
  const storyHref = pathForSlug(story.slug);
  const coverImage = story.coverImage;

  return (
    <Reveal>
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="flex flex-col gap-10 pb-20 md:grid grid-cols-sidebar md:gap-10">
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
            <div className="flex flex-col gap-[60px] xl:flex-row xl:items-start xl:gap-10">
              {/* Text column */}
              <div className="flex max-w-gutter flex-col gap-[60px] xl:flex-1">
                {/* Title + inline image for md/sm */}
                <div className="flex flex-col gap-7">
                  {title && (
                    <h2 className="text-section-heading font-sans font-medium text-foreground">
                      {title}
                    </h2>
                  )}

                  {/* Image — shown on md/sm only */}
                  {coverImage?.asset && (
                    <TransitionLink href={storyHref} className="group xl:hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={urlFor(coverImage).width(624).height(624).url()}
                          alt={coverImage.alt || title || ""}
                          fill
                          sizes="(max-width: 768px) 100vw, 624px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholder={
                            coverImage.asset.metadata?.lqip ? "blur" : undefined
                          }
                          blurDataURL={
                            coverImage.asset.metadata?.lqip || undefined
                          }
                        />
                      </div>
                    </TransitionLink>
                  )}
                </div>

                {/* Excerpt + button */}
                <div className="flex flex-col gap-5">
                  {excerpt && (
                    <p className="text-base leading-7 text-foreground">
                      {excerpt}
                    </p>
                  )}

                  {buttonLabel && (
                    <div className="pt-10">
                      <ButtonLink
                        href={storyHref}
                        label={buttonLabel}
                        variant="outline"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Image column — visible on desktop only */}
              {coverImage?.asset && (
                <TransitionLink
                  href={storyHref}
                  className="group hidden max-w-gutter xl:block xl:flex-1"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={urlFor(coverImage).width(624).height(624).url()}
                      alt={coverImage.alt || title || ""}
                      fill
                      sizes="624px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder={
                        coverImage.asset.metadata?.lqip ? "blur" : undefined
                      }
                      blurDataURL={
                        coverImage.asset.metadata?.lqip || undefined
                      }
                    />
                  </div>
                </TransitionLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </Reveal>
  );
}
