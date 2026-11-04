export type ContactMode = "disabled" | "demo" | "live";
export function contactMode(env: Readonly<Record<string, string | undefined>> = process.env): ContactMode {
  const preview = env.NEXT_PUBLIC_SANITY_DATASET === "development" && env.VERCEL_ENV !== "production";
  if (preview && (env.CONTACT_DELIVERY_MODE === "demo" || (!env.CONTACT_DELIVERY_MODE && env.NODE_ENV === "development"))) return "demo";
  // Real delivery is explicitly enabled only on production; previews cannot email the owner.
  if (env.CONTACT_DELIVERY_MODE === "live" && env.VERCEL_ENV === "production" && env.NEXT_PUBLIC_SANITY_DATASET === "production") return "live";
  return "disabled";
}
export function contactConfigured(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return ["RESEND_API_KEY", "CONTACT_FROM", "TURNSTILE_SECRET_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "CONTACT_RATE_LIMIT_SECRET"].every(key => !!env[key]?.trim());
}
