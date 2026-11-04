import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { SectionMedia } from "@/components/homepage/SectionMedia";
import styles from "@/components/pages/Pages.module.css";
import { normalizeProseHeadings } from "@/lib/prose-headings";

const heading: NonNullable<PortableTextComponents["block"]> = Object.fromEntries(
  ["h2", "h3", "h4", "h5", "h6"].map(tag => [tag, ({ children, value }: any) => {
    const Heading = tag as "h2" | "h3" | "h4" | "h5" | "h6";
    return <Heading data-heading-style={value.originalHeadingStyle || tag}>{children}</Heading>;
  }]),
);

const components: PortableTextComponents = {
  marks: { link: PortableTextLink },
  block: heading,
  types: {
    image: ({ value }) => value?.asset ? <figure>
      <SectionMedia image={value} natural sizes="(max-width: 663px) calc(100vw - 40px), 624px" />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure> : null,
  },
};

export function PostBody({ value }: { value: any[] }) {
  return <div className={styles.prose} data-rich-text><PortableText value={normalizeProseHeadings(value)} components={components} /></div>;
}
