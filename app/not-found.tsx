import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BRAND_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function NotFound() {
  const brand = await sanityFetch<any>({
    query: BRAND_QUERY,
    tags: ["settingsBrand"],
  });

  return (
    <main className="flex min-h-svh items-center bg-accent px-3 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Label */}
          <div className="mb-8 md:mb-0 md:col-start-1">
            <span className="text-base uppercase text-background/70">
              Not found
            </span>
          </div>

          {/* Col-2: Text + Image */}
          <div className="md:col-start-2">
            <div className="flex flex-col gap-[60px] xl:flex-row xl:items-start xl:gap-10">
              {/* Text */}
              <div className="flex max-w-gutter flex-col gap-[60px] xl:flex-1">
                <p className="text-section-heading font-medium text-background">
                  We didn&apos;t find the page you were looking for.{" "}
                  <Link href="/" className="underline">
                    Visit the home page.
                  </Link>
                </p>
              </div>

              {/* Supporting logo */}
              {brand?.supportingLogo?.asset && (
                <div className="max-w-gutter xl:flex-1">
                  <div className="relative aspect-square w-48 md:w-64">
                    <Image
                      src={urlFor(brand.supportingLogo).width(512).url()}
                      alt=""
                      fill
                      className="object-contain object-left-bottom"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
