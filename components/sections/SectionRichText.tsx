import { PortableText } from "@portabletext/react";

type SectionRichTextProps = {
  body?: any[] | null;
};

export function SectionRichText({ body }: SectionRichTextProps) {
  if (!body) return null;

  return (
    <section className="mx-auto max-w-[1856px] px-3 py-12 md:px-8 md:py-16 xl:py-20">
      <div className="prose prose-neutral mx-auto max-w-3xl">
        <PortableText value={body} />
      </div>
    </section>
  );
}
