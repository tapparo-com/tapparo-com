type SectionQuoteProps = {
  quote?: string | null;
  author?: string | null;
};

export function SectionQuote({ quote, author }: SectionQuoteProps) {
  if (!quote) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-3 pt-12 pb-24 md:px-8 md:pt-12 md:pb-[180px] xl:pb-[180px]">
      <blockquote>
        {/* Desktop/Tablet: author inline before quote */}
        <div className="hidden md:block">
          <p className="font-sans text-[28px] font-semibold leading-snug xl:text-4xl xl:leading-snug">
            {author && (
              <cite className="not-italic text-[#CF3717]">
                {author}
                {" — "}
              </cite>
            )}
            {quote}
          </p>
        </div>
        {/* Mobile: stacked */}
        <div className="md:hidden text-center">
          <p className="font-sans text-2xl font-semibold leading-snug">
            {quote}
          </p>
          {author && (
            <footer className="mt-4">
              <cite className="font-sans text-[15px] font-normal uppercase not-italic text-[#CF3717]">
                {author}
              </cite>
            </footer>
          )}
        </div>
      </blockquote>
    </section>
  );
}
