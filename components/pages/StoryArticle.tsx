import { PostBody } from "@/components/PostBody";
import { SectionMedia, type SectionImage } from "@/components/homepage/SectionMedia";
import { Reveal } from "@/components/ui/Reveal";
import { StoriesLink } from "@/components/stories/StoriesLink";
import { formatEditorialDate } from "@/lib/editorial";
import styles from "./Pages.module.css";

type Article = {
  title: string;
  publishedAt?: string;
  author?: { name?: string } | null;
  coverImage?: SectionImage | null;
  body?: any[];
};

export function StoryArticle({ post, showBackLink = true }: { post: Article; showBackLink?: boolean }) {
  return <article className={`${styles.container} ${styles.article}`} data-story-article>
    <div className={styles.articleLayout} data-has-image={!!post.coverImage?.asset}>
      <header className={styles.articleHead}>
        <Reveal>
          <h1 className={styles.title}>{post.title}</h1>
          {(post.author?.name || post.publishedAt) && <div className={styles.metadata}>
            {post.author?.name && <span>{post.author.name}</span>}
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatEditorialDate(post.publishedAt)}</time>}
          </div>}
        </Reveal>
      </header>
      {post.coverImage?.asset && <div className={styles.articleCover}>
        <Reveal mask duration={.9} delay={.1}>
          <SectionMedia image={{ ...post.coverImage, alt: post.coverImage.alt ?? post.title }} ratio={1}
            sizes="(max-width: 663px) calc(100vw - 40px), (max-width: 1279px) 624px, (max-width: 1399px) 45vw, 624px" priority />
        </Reveal>
      </div>}
      <div className={styles.articleBody}>
        {post.body?.length ? <PostBody value={post.body} /> : null}
        {showBackLink && <div className={styles.back}><StoriesLink /></div>}
      </div>
    </div>
  </article>;
}
