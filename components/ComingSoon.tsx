import type { ContentImage, TextBlock, SocialLink } from "@/lib/content";
import { PortableTextLink } from "@/components/ui/PortableTextLink";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  settings: {
    restaurantName?: string | null;
    logoSvg?: string | null;
    supportingLogoTagline?: ContentImage | null;
    comingSoonBody?: TextBlock[] | null;
    address?: string | null;
    socialLinks?: SocialLink[] | null;
  };
};

export function ComingSoon({ settings }: Props) {
  return (
    <main className="selection-invert flex min-h-svh items-center bg-accent px-3 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1856px]">
        <div className="grid-cols-[288px_minmax(0,1fr)] min-[1280px]:grid-cols-[320px_minmax(0,1fr)] md:grid md:gap-10">
          {/* Col-1: Label */}
          <div className="mb-8 md:col-start-1 md:mb-0">
            <span className="text-base text-background/70 uppercase">
              Coming soon
            </span>
          </div>

          {/* Col-2: Content + Logo */}
          <div className="md:col-start-2">
            <Reveal>
              <div className="flex max-w-[var(--reading-max-width)] flex-col gap-[60px]">
                {/* Supporting logo with tagline */}
                {settings.supportingLogoTagline?.asset && (
                  <div className="relative h-28 w-48 md:w-64">
                    <Image
                      src={urlFor(settings.supportingLogoTagline)
                        .width(512)
                        .url()}
                      alt={settings.restaurantName || ""}
                      fill
                      className="object-contain object-left-top"
                    />
                  </div>
                )}

                {settings.comingSoonBody &&
                  settings.comingSoonBody.length > 0 && (
                    <div className="text-[26px] leading-[1.1] font-medium tracking-[-0.52px] text-background min-[768px]:text-[30px] min-[768px]:tracking-[-0.62px] min-[1280px]:text-[38px] min-[1280px]:tracking-[-0.84px]">
                      <PortableText
                        value={settings.comingSoonBody}
                        components={{ marks: { link: PortableTextLink } }}
                      />
                    </div>
                  )}

                <div className="flex flex-col gap-5">
                  {settings.address && (
                    <p className="text-base leading-7 font-medium whitespace-pre-line text-background uppercase">
                      {settings.address}
                    </p>
                  )}

                  {settings.socialLinks && settings.socialLinks.length > 0 && (
                    <div className="flex gap-5">
                      {settings.socialLinks.map((link) => (
                        <a
                          key={link._id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base leading-7 font-medium text-background uppercase transition-colors hover:text-background/70"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
