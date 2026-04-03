import { PortableText } from "@portabletext/react";
import { SanityLogo } from "@/components/ui/SanityLogo";

type Props = {
  settings: {
    restaurantName?: string;
    logo?: any;
    comingSoonBody?: any[];
    socialLinks?: { _id: string; label: string; url: string }[];
  };
};

export function ComingSoon({ settings }: Props) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-accent px-6 text-center">
      <div className="flex flex-col items-center gap-[60px]">
        {settings.logo?.asset ? (
          <SanityLogo
            logo={settings.logo}
            alt={settings.restaurantName || "Logo"}
            className="h-16 w-auto text-background sm:h-20 [&_svg]:h-full [&_svg]:w-auto"
          />
        ) : (
          <span className="text-4xl font-bold text-background">
            {settings.restaurantName}
          </span>
        )}

        {settings.comingSoonBody && settings.comingSoonBody.length > 0 && (
          <div className="max-w-gutter text-section-heading font-medium text-background">
            <PortableText value={settings.comingSoonBody} />
          </div>
        )}

        {settings.socialLinks && settings.socialLinks.length > 0 && (
          <div className="flex gap-5">
            {settings.socialLinks.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[30px] font-medium tracking-tight text-background transition-colors hover:text-background/70"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
