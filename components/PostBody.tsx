import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { SectionMedia } from "@/components/homepage/SectionMedia";
import styles from "@/components/pages/Pages.module.css";
import { normalizeProseHeadings } from "@/lib/prose-headings";

function headingComponents(ids?: Record<string, string>): NonNullable<PortableTextComponents["block"]> {
  return Object.fromEntries(
    ["h2", "h3", "h4", "h5", "h6"].map(tag => [tag, ({ children, value }: any) => {
      const Heading = tag as "h2" | "h3" | "h4" | "h5" | "h6";
      const id = ids?.[value._key];
      return <Heading id={id} tabIndex={id ? -1 : undefined} data-heading-style={value.originalHeadingStyle || tag}>{children}</Heading>;
    }]),
  );
}

const components: PortableTextComponents = {
  marks: { link: PortableTextLink },
  block: headingComponents(),
  types: {
    image: ({ value }) => value?.asset ? <figure>
      <SectionMedia image={value} natural sizes="(max-width: 663px) calc(100vw - 40px), 624px" />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure> : null,
  },
};

export function PostBody({ value, headingIds }: { value: any[]; headingIds?: Record<string, string> }) {
  return <div className={styles.prose} data-rich-text><PortableText value={normalizeProseHeadings(value)}
    components={headingIds ? { ...components, block: headingComponents(headingIds) } : components} /></div>;
}
