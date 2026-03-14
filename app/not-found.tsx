import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-muted">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-accent hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
