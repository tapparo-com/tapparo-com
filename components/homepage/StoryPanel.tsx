import { useId } from "react";
import type { Post } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SectionMedia } from "./SectionMedia";
import { AnimatedUnderline } from "./AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";
import styles from "./Homepage.module.css";

export function StoryPanel({ post }: { post: Post }) {
  const titleId = useId();
  const hasImage = Boolean(post.coverImage?.asset);

  return (
    <article className={styles.storyPanel} data-story-id={post._id}>
      <TransitionLink
        href={pathForSlug(post.slug)}
        className={styles.storyPanelLink}
        aria-labelledby={titleId}
        data-has-image={hasImage}
      >
        {hasImage && (
          <div className={styles.storyPanelMedia}>
            <Reveal mask duration={0.9}>
              <SectionMedia
                image={{ ...post.coverImage, alt: post.coverImage.alt || post.title }}
                ratio={16 / 9}
                sizes="(max-width: 1023px) 100vw, (max-width: 2100px) 46vw, 942px"
              />
            </Reveal>
          </div>
        )}
        <div className={styles.storyPanelCopy}>
          <Reveal className={styles.storyPanelContent} delay={0.1} duration={0.75}>
            <h3 id={titleId} className={styles.storyPanelTitle}>{post.title}</h3>
            {post.excerpt && <p className={styles.storyPanelExcerpt}>{post.excerpt}</p>}
            <div className={styles.storyPanelFooter}>
              {(post.authorName || post.publishedAt) && (
                <div className={styles.storyPanelMeta}>
                  {post.authorName && <span>{post.authorName}</span>}
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric", timeZone: "Europe/Berlin",
                      })}
                    </time>
                  )}
                </div>
              )}
              <span className={`${styles.animatedLink} ${styles.storyPanelRead}`} aria-hidden="true">
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
