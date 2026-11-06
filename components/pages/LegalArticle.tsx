import { PostBody } from "@/components/PostBody";
import { formatEditorialDate } from "@/lib/editorial";
import { slugifyTitle } from "@/lib/urls";
import styles from "./Pages.module.css";

export function LegalArticle({ legal }: { legal: { title: string; updatedAt?: string; body?: any[] } }) {
  const body = legal.body || [];
  const first = body[0];
  // The page heading presents an identical leading CMS heading once; all wording is retained.
  const repeatsTitle = first?._type === "block" && first.style === "h1"
    && first.children?.every((child: any) => child._type === "span" && !child.marks?.length)
    && first.children.map((child: any) => child.text).join("").trim() === legal.title.trim();
  const content = repeatsTitle ? body.slice(1) : body;
  const titleId = slugifyTitle(legal.title) || "rechtliches";
  const usedIds = new Set([titleId]);
  const headingIds: Record<string, string> = {};
  const headings = content.flatMap(block => {
    if (block._type !== "block" || !block._key || !/^h[1-6]$/.test(block.style || "")) return [];
    const label = (block.children || []).map((child: any) => child.text || "").join("").trim().replace(/^\d+[.)]\s*/, "");
    if (!label) return [];
    const base = slugifyTitle(label) || `abschnitt-${block._key}`;
    let id = base;
    for (let suffix = 2; usedIds.has(id); suffix++) id = `${base}-${suffix}`;
    usedIds.add(id);
    headingIds[block._key] = id;
    return [{ id, label, level: Number(block.style.slice(1)) }];
  });
  const mainLevel = Math.min(...headings.map(heading => heading.level));
  const links = [
    { id: titleId, label: legal.title },
    ...headings.filter(heading => heading.level === mainLevel || heading.label.toLowerCase() === "kontaktformular")
      .map(heading => ({ id: heading.id, label: heading.label === "Datenschutzerklärung" ? "Datenschutz" : heading.label })),
  ];
  return <article className={styles.container} data-legal-article>
    <header className={`${styles.intro} ${styles.legalIntro}`}>
      <h1 id={titleId} tabIndex={-1} className={styles.title}>{legal.title}</h1>
      {legal.updatedAt && <p className={styles.legalDate}>Stand: <time dateTime={legal.updatedAt}>{formatEditorialDate(legal.updatedAt)}</time></p>}
      {links.length > 1 && <nav className={styles.legalNavigation} aria-label="Inhalt dieser Seite">
        {links.map(link => <a key={link.id} href={`#${link.id}`}>{link.label}</a>)}
      </nav>}
    </header>
    <div className={styles.reading}><PostBody value={content} headingIds={headingIds} /></div>
  </article>;
}
