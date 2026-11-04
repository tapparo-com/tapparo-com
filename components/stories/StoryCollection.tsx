"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Post } from "@/components/ui/PostCard";
import { StoryPanel } from "@/components/homepage/StoryPanel";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";
import styles from "@/components/homepage/Homepage.module.css";

export function StoryCollection({ posts, batchSize = 2, headingLevel = 3 }: { posts: Post[]; batchSize?: number; headingLevel?: 2 | 3 }) {
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

  return <>
    <div ref={list} id={listId} className={styles.storyPanels}>
      {posts.slice(0, visible).map(post => <StoryPanel key={post._id} post={post} headingLevel={headingLevel} />)}
    </div>
    <p className="sr-only" role="status">{announcement}</p>
    {enhanced && visible < posts.length && <div className={styles.loadMore}>
      <button type="button" className={styles.animatedLink} aria-controls={listId} onClick={() => {
        const next = Math.min(visible + batchSize, posts.length);
        pendingFocus.current = visible;
        setVisible(next);
        setAnnouncement(`${next} von ${posts.length} Stories angezeigt.`);
      }}><span>mehr stories</span><AnimatedUnderline /></button>
    </div>}
    {posts.length > 4 && <noscript><ul className={styles.storyFallbackLinks} aria-label="Mehr Stories">
      {posts.slice(4).map(post => <li key={post._id}><a href={pathForSlug(post.slug)}>{post.title}</a></li>)}
    </ul></noscript>}
  </>;
}
