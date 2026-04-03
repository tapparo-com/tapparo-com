type SectionLargeTextProps = {
  text?: string | null;
};

export function SectionLargeText({ text }: SectionLargeTextProps) {
  if (!text) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-24 md:px-8 md:py-[180px]">
      <p className="font-sans text-2xl font-semibold leading-snug md:text-[28px] xl:text-4xl xl:leading-snug">
        {text}
      </p>
    </section>
  );
}
