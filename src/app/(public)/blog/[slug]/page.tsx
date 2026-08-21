import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getSiteSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { resolveAbsoluteMediaUrl } from "@/lib/media-url";
import { MediaImage } from "@/components/MediaImage";
import { BlogGrid } from "@/components/blog/BlogGrid";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, post] = await Promise.all([
    getSiteSettings(),
    getBlogPostBySlug(slug),
  ]);
  if (!post) return buildMetadata(settings, { title: "Post Not Found", noIndex: true });
  return buildMetadata(settings, {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}`,
    image: post.featuredImage
      ? resolveAbsoluteMediaUrl(post.featuredImage)
      : undefined,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(slug, post.category, 3);

  return (
    <article>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          {post.category && (
            <p className="mt-6 text-sm uppercase tracking-widest text-primary">
              {post.category}
            </p>
          )}
          <h1 className="mt-2 font-heading text-4xl text-text sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.author && <span>By {post.author}</span>}
          </div>
        </div>
      </div>

      {post.featuredImage && (
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-accent shadow-card">
            <MediaImage
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {post.excerpt && (
          <p className="text-xl leading-relaxed text-text-muted">{post.excerpt}</p>
        )}
        <div
          className="prose-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {relatedPosts.length > 0 && (
        <div className="border-t border-border bg-accent/20 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl text-text">Related Posts</h2>
            <div className="mt-8">
              <BlogGrid
                posts={relatedPosts}
                currentPage={1}
                totalPages={1}
                basePath={`/blog/${slug}`}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
