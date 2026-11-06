import Link from "next/link";
import Image from "next/image";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BRAND_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type Brand = {
  restaurantName?: string;
  logo?: { asset?: { _ref: string } };
  supportingLogo?: { asset?: { _id: string; url: string } };
};

function FallbackLockup({ name = "Tapparo" }: { name?: string }) {
  return (
    <div className="relative aspect-[1070_/_1392] w-[min(100%,_300px)] max-[768px]:max-w-[170px]">
      <Image
        src="/brand/intro-lockup.svg"
        alt={name}
        fill
        priority
        sizes="(max-width: 767px) 170px, 300px"
      />
    </div>
  );
}

export default async function NotFound() {
  const brand = await sanityFetch<Brand | null>({
    query: BRAND_QUERY,
    tags: ["settingsBrand"],
  }).catch(() => null);
  const name = brand?.restaurantName || "Tapparo";
  return (
    <main
      className="selection-invert not-found-page grid min-h-svh items-center bg-accent px-[clamp(24px,_5vw,_104px)] py-[clamp(40px,_7vw,_120px)] text-foreground [&_a:focus-visible]:[outline:2px_solid_var(--color-foreground)] [&_a:focus-visible]:outline-offset-[8px]"
      id="main-content"
      tabIndex={-1}
    >
      <div className="mx-auto grid w-full max-w-400 grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)] items-center gap-[clamp(48px,_7vw,_140px)] max-[768px]:grid-cols-1 max-[768px]:gap-10">
        <div className="not-found-content">
          <p className="mb-[clamp(28px,_4vw,_56px)] text-[15px] leading-[1.5] max-[768px]:mb-6 max-[768px]:text-[14px]">
            404 — Diese Seite gibt’s leider nicht.
          </p>
          <h1 className="text-[clamp(48px,_5.5vw,_88px)] leading-[1.05] font-medium tracking-[-.045em] text-background max-[768px]:text-[clamp(36px,_7.5vw,_54px)]">
            Suchst du nach
            <br />
            Focaccia?
          </h1>
          <Link
            href="/menu"
            className="animated-link not-found-menu-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
          >
            <span>Zur Speisekarte</span>
            <AnimatedUnderline />
          </Link>
          <Link
            href="/"
            className="mt-[clamp(32px,_4vw,_56px)] block w-fit py-3 text-[16px] leading-[1.5] underline decoration-[1px] underline-offset-[5px] hover:decoration-[2px] max-[768px]:mt-6"
          >
            oder zurück zur Startseite
          </Link>
        </div>
        <div className="grid justify-items-center gap-8 max-[768px]:row-[1] max-[768px]:gap-5 [&_img]:object-contain">
          {brand?.supportingLogo?.asset ? (
            <>
              <div className="relative aspect-[265_/_333] w-[min(100%,_360px)] max-[1280px]:max-w-70 max-[768px]:max-w-40">
                <Image
                  src={brand.supportingLogo.asset.url}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 767px) 160px, (max-width: 1279px) 280px, 360px"
                />
              </div>
              <div className="relative aspect-[752_/_208] w-[min(100%,_280px)] max-[768px]:max-w-[170px] [&_img]:[filter:brightness(0)_invert(1)]">
                <Image
                  src={
                    brand.logo?.asset
                      ? urlFor(brand.logo).url()
                      : "/brand/logo-desktop.svg"
                  }
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 767px) 170px, 280px"
                />
              </div>
            </>
          ) : (
            <FallbackLockup name={name} />
          )}
        </div>
      </div>
    </main>
  );
}
