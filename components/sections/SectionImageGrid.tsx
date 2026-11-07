import type { ContentImage } from "@/lib/content";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionMedia } from "@/components/ui/SectionMedia";

type Props = {
  title?: string | null;
  images?: (ContentImage & { _key: string })[] | null;
};
export function SectionImageGrid({ title, images }: Props) {
  const selected = (images || []).filter((image) => image.asset);
  if (!title && !selected.length) return null;
  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-[clamp(64px,_8vw,_160px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]"
      data-home-section="mood-images"
    >
      {title && (
        <Reveal className="section-header mb-[clamp(36px,_5vw,_90px)] flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="text-[clamp(48px,_7vw,_140px)] leading-[0.98] font-medium tracking-[-0.055em] wrap-anywhere">
            {title}
          </h2>
        </Reveal>
      )}
      <div>
        {selected.map((image, index) => {
          const width = image.asset?.metadata?.dimensions?.width;
          return (
            <figure
              className="section-gallery-figure w-full only:justify-self-center max-[768px]:col-[1] max-[768px]:row-[auto] max-[768px]:mt-0 max-[768px]:w-[78%] max-[768px]:[outline:none] max-[768px]:only:w-full min-[768px]:only:col-[2_/_12] min-[768px]:only:row-[auto] min-[768px]:only:w-[min(100%,_900px)] min-[768px]:[&:nth-child(1):not(:only-child)]:col-[1_/_7] min-[768px]:[&:nth-child(1):not(:only-child)]:row-[1] [&:nth-child(2)]:z-[1] max-[768px]:[&:nth-child(2)]:w-full max-[768px]:[&:nth-child(2)]:justify-self-end min-[768px]:[&:nth-child(2)]:col-[6_/_-1] min-[768px]:[&:nth-child(2)]:row-[1] min-[768px]:[&:nth-child(2)]:mt-[clamp(120px,_18vw,_360px)] [&:nth-child(3)]:z-[2] [&:nth-child(3)]:justify-self-center max-[768px]:[&:nth-child(3)]:w-[64%] max-[768px]:[&:nth-child(3)]:justify-self-center min-[768px]:[&:nth-child(3)]:col-[2_/_5] min-[768px]:[&:nth-child(3)]:row-[2] min-[768px]:[&:nth-child(3)]:-mt-16 min-[768px]:[&:nth-child(3)]:w-[min(100%,_320px)] min-[768px]:[&:nth-child(3)]:[outline:8px_solid_var(--color-background)] [&[data-small='true']]:max-w-[var(--source-width)]"
              key={image._key}
              data-small={!!width && width < 480}
              style={
                { "--source-width": `${width || 1600}px` } as CSSProperties
              }
            >
              <Reveal mask delay={(index % 3) * 0.08}>
                <SectionMedia image={image} natural />
              </Reveal>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
