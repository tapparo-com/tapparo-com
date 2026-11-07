import type { QueryParams } from "next-sanity";
import { client } from "./client";

const isDev = process.env.NODE_ENV === "development";

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: isDev ? { revalidate: 0 } : { revalidate, tags },
  });
}
