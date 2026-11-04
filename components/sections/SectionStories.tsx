"use client";

import { useMemo } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Post } from "@/components/ui/PostCard";
import { Reveal } from "@/components/ui/Reveal";
import { StoryCollection } from "@/components/stories/StoryCollection";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
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
      <StoryCollection posts={ordered} />
    </section>
  );
}
