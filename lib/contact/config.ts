export type ContactMode = "disabled" | "demo";
export function contactMode(
  env: Readonly<Record<string, string | undefined>> = process.env,
): ContactMode {
  const development =
    env.NEXT_PUBLIC_SANITY_DATASET === "development" &&
    env.VERCEL_ENV !== "production";
  if (
    development &&
    (env.CONTACT_DELIVERY_MODE === "demo" ||
      (!env.CONTACT_DELIVERY_MODE && env.NODE_ENV === "development"))
  )
    return "demo";
  return "disabled";
}
