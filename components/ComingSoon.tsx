import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  settings: {
    restaurantName?: string;
    logoSvg?: string | null;
    supportingLogoTagline?: { asset?: { _id: string; url: string } } | null;
    comingSoonBody?: any[];
    address?: string;
    socialLinks?: { _id: string; label: string; url: string }[];
  };
};

export function ComingSoon({ settings }: Props) {
  return (
    <main className="selection-invert flex min-h-svh items-center bg-accent px-3 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Label */}
          <div className="mb-8 md:mb-0 md:col-start-1">
            <span className="text-base uppercase text-background/70">
              Coming soon
            </span>
          </div>

          {/* Col-2: Content + Logo */}
          <div className="md:col-start-2">
            <Reveal>
              <div className="flex max-w-gutter flex-col gap-[60px]">
                {/* Supporting logo with tagline */}
                {settings.supportingLogoTagline?.asset && (
                  <div className="relative w-48 h-28 md:w-64">
                    <Image
                      src={urlFor(settings.supportingLogoTagline)
                        .width(512)
                        .url()}
                      alt={settings.restaurantName || ""}
                      fill
                      className="object-contain object-left-top
                      "
                    />
                  </div>
                )}

                {settings.comingSoonBody &&
                  settings.comingSoonBody.length > 0 && (
                    <div className="text-section-heading font-medium text-background">
                      <PortableText value={settings.comingSoonBody} />
                    </div>
                  )}

                <div className="flex flex-col gap-5">
                  {settings.address && (
                    <p className="text-base uppercase font-medium leading-7 text-background whitespace-pre-line">
                      {settings.address}
                    </p>
                  )}

                  {settings.socialLinks &&
                    settings.socialLinks.length > 0 && (
                      <div className="flex gap-5">
                        {settings.socialLinks.map((link) => (
                          <a
                            key={link._id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base uppercase font-medium leading-7 text-background transition-colors hover:text-background/70"
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
