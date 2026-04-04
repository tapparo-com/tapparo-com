import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-7 text-foreground">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="pt-7 text-2xl font-medium leading-8 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-7 text-xl font-medium leading-7 text-foreground">
        {children}
      </h3>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="max-w-gutter py-8">
          <Image
            src={urlFor(value).width(1248).url()}
            alt={value.alt || ""}
            width={624}
            height={400}
            className="h-auto w-full"
          />
        </figure>
      );
    },
  },
};

export function PostBody({ value }: { value: any[] }) {
  return (
    <div className="flex flex-col gap-5">
      <PortableText value={value} components={components} />
    </div>
  );
}
