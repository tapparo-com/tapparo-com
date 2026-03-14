type Props = {
  settings: {
    restaurantName: string;
    tagline: string;
    comingSoonText: string;
    socialLinks?: { _key: string; platform: string; url: string }[];
  };
};

export function ComingSoon({ settings }: Props) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
        {settings.restaurantName}
      </h1>
      <p className="mt-4 text-lg text-muted sm:text-xl">{settings.tagline}</p>
      {settings.comingSoonText && (
        <p className="mt-8 max-w-md text-muted">{settings.comingSoonText}</p>
      )}
      {settings.socialLinks && settings.socialLinks.length > 0 && (
        <nav className="mt-12 flex gap-6">
          {settings.socialLinks.map((link) => (
            <a
              key={link._key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
            >
              {link.platform}
            </a>
          ))}
        </nav>
      )}
    </main>
  );
}
