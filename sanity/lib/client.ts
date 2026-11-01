import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  perspective: "published",
  apiVersion: "2025-03-01",
  useCdn: process.env.NODE_ENV === "production",
});
