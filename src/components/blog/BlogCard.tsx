import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";

export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  publishedAt?: string;
  createdAt?: string;
  category?: string;
}

export interface BlogCardProps {
  post: BlogPostData;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const date = post.publishedAt || post.createdAt;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-accent"
      >
        <MediaImage
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
          {post.category && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-primary">
              {post.category}
            </span>
          )}
          {date && <time dateTime={date}>{formatDate(date)}</time>}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="line-clamp-2 font-heading text-xl text-text transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-text-muted">
            {post.excerpt}
          </p>
        )}

        {post.author && (
          <p className="mt-4 text-xs font-medium text-text-muted">
            By {post.author}
          </p>
        )}
      </div>
    </article>
  );
}
