import { PostBody } from "@/components/PostBody";
import { formatEditorialDate } from "@/lib/editorial";
import styles from "./Pages.module.css";

export function LegalArticle({ legal }: { legal: { title: string; updatedAt?: string; body?: any[] } }) {
  const body = legal.body || [];
  const first = body[0];
  // The page heading presents an identical leading CMS heading once; all wording is retained.
  const repeatsTitle = first?._type === "block" && first.style === "h1"
    && first.children?.every((child: any) => child._type === "span" && !child.marks?.length)
    && first.children.map((child: any) => child.text).join("").trim() === legal.title.trim();
  return <article className={styles.container} data-legal-article>
    <header className={`${styles.intro} ${styles.legalIntro}`}>
      <h1 className={styles.title}>{legal.title}</h1>
      {legal.updatedAt && <p className={styles.legalDate}>Stand: <time dateTime={legal.updatedAt}>{formatEditorialDate(legal.updatedAt)}</time></p>}
    </header>
    <div className={styles.reading}><PostBody value={repeatsTitle ? body.slice(1) : body} /></div>
  </article>;
}
