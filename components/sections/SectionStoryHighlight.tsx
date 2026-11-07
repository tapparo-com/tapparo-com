import type { ContentImage } from "@/lib/content";
import { pathForSlug } from "@/lib/urls";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionMedia } from "@/components/ui/SectionMedia";

type Props = {
  label?: string | null;
  story?: {
    title: string;
    excerpt?: string | null;
    coverImage?: ContentImage | null;
    slug: string;
  } | null;
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
}: Props) {
  if (!story) return null;
  const title = titleOverride || story.title,
    excerpt = excerptOverride || story.excerpt,
    href = pathForSlug(story.slug);
  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-[clamp(64px,_8vw,_160px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]"
      data-home-section="story-highlight"
    >
      {label && (
        <Reveal className="section-header mb-[clamp(36px,_5vw,_90px)] flex flex-wrap items-baseline justify-between gap-6">
          <p className="[font-family:var(--font-space-grotesk),_sans-serif] text-[13px] leading-[1.4] font-medium tracking-[0.06em] uppercase">
            {label}
          </p>
        </Reveal>
      )}
      <div
        className="grid grid-cols-[minmax(0,_1.4fr)_minmax(0,_1fr)] items-center gap-[clamp(32px,_6vw,_120px)] max-[768px]:grid-cols-1 max-[768px]:gap-10 [&[data-has-image='false']]:max-w-250 [&[data-has-image='false']]:grid-cols-[1fr]"
        data-has-image={!!story.coverImage?.asset}
      >
        {story.coverImage?.asset && (
          <Reveal mask>
            <TransitionLink href={href} aria-label={title}>
              <SectionMedia image={story.coverImage} ratio={4 / 5} />
            </TransitionLink>
          </Reveal>
        )}
        <Reveal className="grid gap-6 [&_h2]:text-[clamp(32px,_4vw,_72px)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em]">
          <h2>
            <TransitionLink href={href}>{title}</TransitionLink>
          </h2>
          {excerpt && (
            <p className="mt-[18px] max-w-[65ch] text-[16px] leading-[1.55]">
              {excerpt}
            </p>
          )}
          {buttonLabel && (
            <TransitionLink
              className="inline-flex w-fit items-center gap-7 border-b border-solid border-b-current px-0 py-2 text-[16px] leading-[1.4] text-accent [transition:color_0.2s_ease] hover:text-foreground focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&::after]:text-[22px] [&::after]:leading-[1] [&::after]:[content:'↗']"
              href={href}
            >
              {buttonLabel}
            </TransitionLink>
          )}
        </Reveal>
      </div>
    </section>
  );
}
