import type { Metadata } from "next";
import { getPublishedBlogPosts, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Blog",
    description: "Hoya care tips, plant stories, and growing advice.",
    path: "/blog",
  });
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const { items, totalPages } = await getPublishedBlogPosts(page, 9);

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Blog"
        subtitle="Hoya care tips, plant stories, and advice from Anne."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <BlogGrid posts={items} currentPage={page} totalPages={totalPages} />
      </div>
    </>
  );
}
