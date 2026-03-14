import Link from "next/link";

type Props = {
  settings?: {
    restaurantName: string;
    email: string;
    phone: string;
    address: string;
    openingHours?: { _key: string; day: string; hours: string }[];
    socialLinks?: { _key: string; platform: string; url: string }[];
  };
};

export function Footer({ settings }: Props) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-3">
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Contact
            </h3>
            <div className="mt-4 space-y-2 text-sm text-muted">
              {settings?.email && <p>{settings.email}</p>}
              {settings?.phone && <p>{settings.phone}</p>}
              {settings?.address && (
                <p className="whitespace-pre-line">{settings.address}</p>
              )}
            </div>
          </div>

          {/* Hours */}
          {settings?.openingHours && settings.openingHours.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest">
                Hours
              </h3>
              <div className="mt-4 space-y-1 text-sm text-muted">
                {settings.openingHours.map((entry) => (
                  <p key={entry._key}>
                    <span className="font-medium text-foreground">
                      {entry.day}
                    </span>{" "}
                    {entry.hours}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Links
            </h3>
            <div className="mt-4 space-y-2 text-sm text-muted">
              {settings?.socialLinks?.map((link) => (
                <p key={link._key}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {link.platform}
                  </a>
                </p>
              ))}
              <p>
                <Link
                  href="/imprint"
                  className="transition-colors hover:text-foreground"
                >
                  Imprint
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()}{" "}
          {settings?.restaurantName || "Tapparo"}
        </p>
      </div>
    </footer>
  );
}
