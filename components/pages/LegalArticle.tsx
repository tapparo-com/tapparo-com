import type { LegalDocument } from "@/lib/content";
import { PostBody } from "@/components/PostBody";
import { formatEditorialDate } from "@/lib/editorial";
import { slugifyTitle } from "@/lib/urls";

export function LegalArticle({ legal }: { legal: LegalDocument }) {
  const body = legal.body || [];
  const first = body[0];
  // The page heading presents an identical leading CMS heading once; all wording is retained.
  const repeatsTitle =
    first?._type === "block" &&
    first.style === "h1" &&
    first.children?.every(
      (child) => child._type === "span" && !child.marks?.length,
    ) &&
    first.children
      .map((child) => child.text)
      .join("")
      .trim() === legal.title.trim();
  const content = repeatsTitle ? body.slice(1) : body;
  const titleId = slugifyTitle(legal.title) || "rechtliches";
  const usedIds = new Set([titleId]);
  const headingIds: Record<string, string> = {};
  const headings = content.flatMap((block) => {
    if (
      block._type !== "block" ||
      !block._key ||
      !block.style ||
      !/^h[1-6]$/.test(block.style)
    )
      return [];
    const label = (block.children || [])
      .map((child) => child.text || "")
      .join("")
      .trim()
      .replace(/^\d+[.)]\s*/, "");
    if (!label) return [];
    const base = slugifyTitle(label) || `abschnitt-${block._key}`;
    let id = base;
    for (let suffix = 2; usedIds.has(id); suffix++) id = `${base}-${suffix}`;
    usedIds.add(id);
    headingIds[block._key] = id;
    return [{ id, label, level: Number(block.style.slice(1)) }];
  });
  const mainLevel = Math.min(...headings.map((heading) => heading.level));
  const links = [
    { id: titleId, label: legal.title },
    ...headings
      .filter(
        (heading) =>
          heading.level === mainLevel ||
          heading.label.toLowerCase() === "kontaktformular",
      )
      .map((heading) => ({
        id: heading.id,
        label:
          heading.label === "Datenschutzerklärung"
            ? "Datenschutz"
            : heading.label,
      })),
  ];
  return (
    <article
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] max-[768px]:px-5 [&_*]:min-w-0"
      data-legal-article
    >
      <header className="mx-auto max-w-156 pt-[clamp(32px,_4vw,_64px)] pb-8">
        <h1
          id={titleId}
          tabIndex={-1}
          className="scroll-mt-25 text-[30px] leading-[1.1] font-medium tracking-[-.02em] text-pretty wrap-anywhere focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[5px] min-[768px]:text-[38px] min-[1280px]:text-[42px]"
        >
          {legal.title}
        </h1>
        {legal.updatedAt && (
          <p className="mt-6 text-[14px] leading-[1.6]">
            Stand:{" "}
            <time dateTime={legal.updatedAt}>
              {formatEditorialDate(legal.updatedAt)}
            </time>
          </p>
        )}
        {links.length > 1 && (
          <nav
            className="mt-5 flex flex-wrap justify-end gap-x-4 gap-y-1 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:text-[14px] [&_a]:leading-[1.5] [&_a]:underline [&_a]:underline-offset-[5px] [&_a:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_a:focus-visible]:outline-offset-[5px] [&_a:hover]:decoration-accent"
            aria-label="Inhalt dieser Seite"
          >
            {links.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
      <div className="mx-auto max-w-156 pb-[clamp(64px,_6vw,_120px)]">
        <PostBody value={content} headingIds={headingIds} />
      </div>
    </article>
  );
}
