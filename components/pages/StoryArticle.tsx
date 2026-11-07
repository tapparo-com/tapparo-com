import { PostBody } from "@/components/PostBody";
import { SectionMedia } from "@/components/ui/SectionMedia";
import type { StoryDocument } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { StoriesLink } from "@/components/stories/StoriesLink";
import { formatEditorialDate } from "@/lib/editorial";

export function StoryArticle({
  post,
  showBackLink = true,
}: {
  post: StoryDocument;
  showBackLink?: boolean;
}) {
  return (
    <article
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pt-[clamp(32px,_4vw,_64px)] pb-[clamp(64px,_6vw,_120px)] max-[768px]:px-5 [&_*]:min-w-0"
      data-story-article
    >
      <div
        className="mx-auto grid max-w-328 grid-cols-2 grid-rows-[auto_minmax(0,_1fr)] items-start gap-x-16 [grid-template-areas:'heading_cover'_'body_cover'] max-[1280px]:max-w-156 max-[1280px]:grid-cols-1 max-[1280px]:grid-rows-[auto] max-[1280px]:[grid-template-areas:'heading'_'cover'_'body'] [&[data-has-image='false']]:max-w-156 [&[data-has-image='false']]:grid-cols-1 [&[data-has-image='false']]:[grid-template-areas:'heading'_'body']"
        data-has-image={!!post.coverImage?.asset}
      >
        <header className="pb-10 [grid-area:heading]">
          <Reveal>
            <h1 className="text-[30px] leading-[1.1] font-medium tracking-[-.02em] text-pretty wrap-anywhere min-[768px]:text-[38px] min-[1280px]:text-[42px]">
              {post.title}
            </h1>
            {(post.author?.name || post.publishedAt) && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[14px] leading-[1.5]">
                {post.author?.name && <span>{post.author.name}</span>}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {formatEditorialDate(post.publishedAt)}
                  </time>
                )}
              </div>
            )}
          </Reveal>
        </header>
        {post.coverImage?.asset && (
          <div className="[grid-area:cover] max-[1280px]:mb-10 [@media_(min-width:_1280px)_and_(min-height:_800px)]:sticky [@media_(min-width:_1280px)_and_(min-height:_800px)]:top-25">
            <Reveal mask duration={0.9} delay={0.1}>
              <SectionMedia
                image={{
                  ...post.coverImage,
                  alt: post.coverImage.alt ?? post.title,
                }}
                ratio={1}
                sizes="(max-width: 663px) calc(100vw - 40px), (max-width: 1279px) 624px, (max-width: 1399px) 45vw, 624px"
                priority
              />
            </Reveal>
          </div>
        )}
        <div className="[grid-area:body]">
          {post.body?.length ? <PostBody value={post.body} /> : null}
          {showBackLink && (
            <div className="mt-10 mb-0 flex justify-end">
              <StoriesLink />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
