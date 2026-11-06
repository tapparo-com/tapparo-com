import { useId } from "react";
import type { StorySummary } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SectionMedia } from "@/components/ui/SectionMedia";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";

export function StoryPanel({
  post,
  headingLevel = 3,
}: {
  post: StorySummary;
  headingLevel?: 2 | 3;
}) {
  const titleId = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const hasImage = Boolean(post.coverImage?.asset);

  return (
    <article
      className="border-t border-solid border-t-border pt-6"
      data-story-id={post._id}
    >
      <TransitionLink
        href={pathForSlug(post.slug)}
        className="story-link flex h-full scroll-mt-6 flex-col gap-7 focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px]"
        aria-labelledby={titleId}
        data-has-image={hasImage}
      >
        {hasImage && (
          <div className="story-media">
            <Reveal mask duration={0.9}>
              <SectionMedia
                image={{
                  ...post.coverImage,
                  alt: post.coverImage?.alt || post.title,
                }}
                ratio={16 / 9}
                sizes="(max-width: 1023px) 100vw, (max-width: 2100px) 46vw, 942px"
              />
            </Reveal>
          </div>
        )}
        <div className="story-copy flex flex-1 flex-col">
          <Reveal className="flex flex-1 flex-col" delay={0.1} duration={0.75}>
            <Heading
              id={titleId}
              className="story-title text-[length:var(--story-panel-title-size,_clamp(28px,_2.2vw,_44px))] leading-[var(--story-panel-title-leading,_1.05)] font-medium tracking-[var(--story-panel-title-tracking,_-0.045em)] text-pretty wrap-anywhere max-[768px]:text-[length:var(--story-panel-title-size,_clamp(32px,_7.5vw,_52px))]"
            >
              {post.title}
            </Heading>
            {post.excerpt && (
              <p className="mt-6 max-w-[58ch] text-[length:var(--story-panel-copy-size,_clamp(16px,_1.05vw,_18px))] leading-[var(--story-panel-copy-leading,_1.55)] wrap-anywhere whitespace-pre-line">
                {post.excerpt}
              </p>
            )}
            <div className="mt-auto flex flex-col gap-x-6 gap-y-3 pt-6 min-[1280px]:min-h-18 min-[1280px]:flex-row min-[1280px]:items-center min-[1280px]:justify-between">
              {(post.authorName || post.publishedAt) && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] leading-[1.5] wrap-anywhere">
                  {post.authorName && <span>{post.authorName}</span>}
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("de-DE", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "Europe/Berlin",
                      })}
                    </time>
                  )}
                </div>
              )}
              <span
                className="animated-link relative ml-auto flex min-h-11 w-fit max-w-full shrink-0 items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
                aria-hidden="true"
              >
                <span>story lesen</span>
                <AnimatedUnderline />
              </span>
            </div>
          </Reveal>
        </div>
      </TransitionLink>
    </article>
  );
}
