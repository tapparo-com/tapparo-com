import type { Post } from "@/components/ui/PostCard";
import { StoryCollection } from "@/components/stories/StoryCollection";
import styles from "@/components/pages/Pages.module.css";

export function SectionListStories({ posts }: { posts: Post[] }) {
  return <section className={`${styles.container} ${styles.stories}`} aria-label="Alle Stories" data-stories-overview>
    {posts.length ? <StoryCollection posts={posts} batchSize={4} /> : <p className={styles.empty}>Hier gibt es bald neue Stories.</p>}
  </section>;
}
