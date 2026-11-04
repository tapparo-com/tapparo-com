import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { SectionMedia } from "@/components/homepage/SectionMedia";
import styles from "@/components/pages/Pages.module.css";

const components: PortableTextComponents = {
  marks: { link: PortableTextLink },
  block: {
    // The template owns the sole page h1; keep CMS heading text and hierarchy below it.
    h1: ({ children }) => <h2>{children}</h2>,
  },
  types: {
    image: ({ value }) => value?.asset ? <figure>
      <SectionMedia image={value} natural sizes="(max-width: 663px) calc(100vw - 40px), 624px" />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure> : null,
  },
};

export function PostBody({ value }: { value: any[] }) {
  return <div className={styles.prose} data-rich-text><PortableText value={value} components={components} /></div>;
}
