import type { Post } from "@/components/ui/PostCard";
import { StoryPanel } from "@/components/homepage/StoryPanel";
import { Reveal } from "@/components/ui/Reveal";
import { StoriesLink } from "@/components/stories/StoriesLink";
import home from "@/components/homepage/Homepage.module.css";
import styles from "@/components/pages/Pages.module.css";

export function SectionRelatedStories({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return <section className={`${styles.container} ${styles.related}`} aria-label="Weitere Stories" data-related-stories>
    <Reveal className={home.sectionHeader}><h2 className={styles.sectionHeading}>Weitere Stories</h2><StoriesLink /></Reveal>
    <div className={home.storyPanels}>{posts.map(post => <StoryPanel key={post._id} post={post} />)}</div>
  </section>;
}
