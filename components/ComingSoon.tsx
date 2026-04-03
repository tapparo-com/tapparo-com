type Props = {
  settings: {
    restaurantName?: string;
    tagline?: string;
    logo?: any;
    comingSoonText?: string;
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
    </main>
  );
}
