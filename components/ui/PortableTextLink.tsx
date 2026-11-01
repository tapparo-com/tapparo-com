import type { PortableTextMarkComponentProps } from "@portabletext/react";
import { normalizeInternalHref } from "@/lib/urls";

export function PortableTextLink({ children, value }: PortableTextMarkComponentProps) {
  return <a href={normalizeInternalHref(value?.href || "")}>{children}</a>;
}
