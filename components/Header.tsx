import Link from "next/link";

type Props = {
  restaurantName?: string;
};

export function Header({ restaurantName }: Props) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {restaurantName || "Tapparo"}
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Menu
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
