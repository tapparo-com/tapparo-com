"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Post } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import { StoryPanel } from "@/components/homepage/StoryPanel";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  heading?: string | null;
  posts: Post[];
  pinnedStoryId?: string | null;
};
export function SectionStories({ heading, posts = [], pinnedStoryId }: Props) {
  const ordered = useMemo(() => {
    const pinned = posts.find((post) => post._id === pinnedStoryId);
    return pinned
      ? [pinned, ...posts.filter((post) => post._id !== pinnedStoryId)]
      : posts;
  }, [posts, pinnedStoryId]);
  const [visible, setVisible] = useState(4);
  const [enhanced, setEnhanced] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const listId = useId();
  const list = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<number | null>(null);
  useEffect(() => setEnhanced(true), []);
  useEffect(() => {
    if (pendingFocus.current === null) return;
    const link = list.current?.querySelectorAll<HTMLAnchorElement>("article > a")[pendingFocus.current];
    pendingFocus.current = null;
    link?.focus({ preventScroll: true });
    link?.scrollIntoView({ block: "start" });
  }, [visible]);
  const loadMore = () => {
    const next = Math.min(visible + 2, ordered.length);
    pendingFocus.current = visible;
    setVisible(next);
    setAnnouncement(`${next} von ${ordered.length} Stories angezeigt.`);
  };
  if (!ordered.length) return null;
  return (
    <section
      className={`${styles.section} ${styles.stories}`}
      data-home-section="stories"
    >
      <Reveal className={styles.sectionHeader}>
        <h2 className={styles.title}>{heading || "Stories"}</h2>
        <TransitionLink href="/stories" className={styles.animatedLink}>
          <span>alle stories</span>
          <AnimatedUnderline />
        </TransitionLink>
      </Reveal>
      <div ref={list} id={listId} className={styles.storyPanels}>
        {ordered.slice(0, visible).map((post) => <StoryPanel key={post._id} post={post} />)}
      </div>
      <p className="sr-only" role="status">{announcement}</p>
      {enhanced && visible < ordered.length && (
        <div className={styles.loadMore}>
          <button
            type="button"
            className={styles.animatedLink}
            aria-controls={listId}
            onClick={loadMore}
          >
            <span>mehr stories</span>
            <AnimatedUnderline />
          </button>
        </div>
      )}
      {ordered.length > 4 && (
        <noscript>
          <ul className={styles.storyFallbackLinks} aria-label="Mehr Stories">
            {ordered.slice(4).map(post => (
              <li key={post._id}><a href={pathForSlug(post.slug)}>{post.title}</a></li>
            ))}
          </ul>
        </noscript>
      )}
    </section>
  );
}
