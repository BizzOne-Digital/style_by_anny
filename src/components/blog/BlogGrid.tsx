import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogCard, type BlogPostData } from "@/components/blog/BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

export type { BlogPostData };

export interface BlogGridProps {
  posts: BlogPostData[];
  currentPage?: number;
  totalPages?: number;
  basePath?: string;
  className?: string;
  emptyMessage?: string;
}

export function BlogGrid({
  posts,
  currentPage = 1,
  totalPages = 1,
  basePath = "/blog",
  className,
  emptyMessage = "Check back soon for hoya care tips and plant advice.",
}: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No posts yet"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
          className="mt-12"
        />
      )}
    </div>
  );
}
