import type { RichText, RichTextImage } from "@/lib/content";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableTextLink } from "@/components/ui/PortableTextLink";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextComponentProps,
  type PortableTextTypeComponentProps,
} from "@portabletext/react";
import { SectionMedia } from "@/components/ui/SectionMedia";

import { normalizeProseHeadings } from "@/lib/prose-headings";

function headingComponents(
  ids?: Record<string, string>,
): NonNullable<PortableTextComponents["block"]> {
  return Object.fromEntries(
    ["h2", "h3", "h4", "h5", "h6"].map((tag) => [
      tag,
      ({
        children,
        value,
      }: PortableTextComponentProps<
        PortableTextBlock & { originalHeadingStyle?: string }
      >) => {
        const Heading = tag as "h2" | "h3" | "h4" | "h5" | "h6";
        const id = value._key ? ids?.[value._key] : undefined;
        return (
          <Heading
            id={id}
            tabIndex={id ? -1 : undefined}
            data-heading-style={value.originalHeadingStyle || tag}
          >
            {children}
          </Heading>
        );
      },
    ]),
  );
}

const components: PortableTextComponents = {
  marks: { link: PortableTextLink },
  block: headingComponents(),
  types: {
    image: ({ value }: PortableTextTypeComponentProps<RichTextImage>) =>
      value?.asset ? (
        <figure>
          <SectionMedia
            image={value}
            natural
            sizes="(max-width: 663px) calc(100vw - 40px), 624px"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ) : null,
  },
};

export function PostBody({
  value,
  headingIds,
}: {
  value: RichText;
  headingIds?: Record<string, string>;
}) {
  return (
    <div
      className="text-[16px] leading-[1.75] wrap-anywhere [&_:is([data-heading-style='h1'],_[data-heading-style='h2'])]:text-[24px] [&_:is([data-heading-style='h1'],_[data-heading-style='h2'])]:leading-[1.333333] [&_:is([data-heading-style='h4'],_[data-heading-style='h5'],_[data-heading-style='h6'])]:text-[1.1em] [&_:is(h2,h3,h4,h5,h6)]:mt-[2em] [&_:is(h2,h3,h4,h5,h6)]:scroll-mt-25 [&_:is(h2,h3,h4,h5,h6)]:leading-[1.2] [&_:is(h2,h3,h4,h5,h6)]:font-medium [&_:is(h2,h3,h4,h5,h6)]:tracking-[-.035em] [&_:is(ul,ol)]:pl-[1.3em] [&_>_*_+_*]:mt-[1.25em] [&_>_:first-child]:mt-0 [&_[data-heading-style='h3']]:text-[20px] [&_[data-heading-style='h3']]:leading-[1.4] [&_[id]:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_[id]:focus-visible]:outline-offset-[5px] [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[.18em] [&_a:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_a:focus-visible]:outline-offset-[4px] [&_a:hover]:decoration-accent [&_blockquote]:border-l-[2px] [&_blockquote]:border-solid [&_blockquote]:border-l-accent [&_blockquote]:pl-[clamp(20px,_3vw,_40px)] [&_blockquote]:text-[1.15em] [&_figcaption]:mt-3 [&_figcaption]:text-[14px] [&_figcaption]:leading-[1.5] [&_figure]:my-[2em] [&_li_+_li]:mt-[.4em] [&_li_>_:is(ul,ol)]:mt-[.4em] [&_ol]:list-decimal [&_p]:whitespace-pre-line [&_ul]:list-disc"
      data-rich-text
    >
      <PortableText
        value={normalizeProseHeadings(value)}
        components={
          headingIds
            ? { ...components, block: headingComponents(headingIds) }
            : components
        }
      />
    </div>
  );
}
