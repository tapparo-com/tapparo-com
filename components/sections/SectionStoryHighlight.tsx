import { pathForSlug } from "@/lib/urls";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Reveal } from "@/components/ui/Reveal";
import {
  SectionMedia,
  type SectionImage,
} from "@/components/homepage/SectionMedia";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  label?: string | null;
  story?: {
    title: string;
    excerpt?: string;
    coverImage?: SectionImage | null;
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
    <section className={styles.section} data-home-section="story-highlight">
      {label && (
        <Reveal className={styles.sectionHeader}>
          <p className={styles.label}>{label}</p>
        </Reveal>
      )}
      <div
        className={styles.highlightGrid}
        data-has-image={!!story.coverImage?.asset}
      >
        {story.coverImage?.asset && (
          <Reveal mask>
            <TransitionLink href={href} aria-label={title}>
              <SectionMedia image={story.coverImage} ratio={4 / 5} />
            </TransitionLink>
          </Reveal>
        )}
        <Reveal className={styles.highlightCopy}>
          <h2>
            <TransitionLink href={href}>{title}</TransitionLink>
          </h2>
          {excerpt && <p className={styles.storyExcerpt}>{excerpt}</p>}
          {buttonLabel && (
            <TransitionLink className={styles.link} href={href}>
              {buttonLabel}
            </TransitionLink>
          )}
        </Reveal>
      </div>
    </section>
  );
}
