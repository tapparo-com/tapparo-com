import { Reveal } from "@/components/ui/Reveal";

export function SectionPageIntro({
  title,
  description,
  narrow = false,
}: {
  title: string;
  description?: string | null;
  narrow?: boolean;
}) {
  return (
    <header className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-[clamp(32px,_4vw,_64px)] max-[768px]:px-5 [&_*]:min-w-0">
      <div className={narrow ? "mx-auto max-w-156" : undefined}>
        <Reveal>
          <h1 className="text-[30px] leading-[1.1] font-medium tracking-[-.02em] text-pretty wrap-anywhere min-[768px]:text-[38px] min-[1280px]:text-[42px]">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[64ch] text-[16px] leading-[1.75] whitespace-pre-line">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
