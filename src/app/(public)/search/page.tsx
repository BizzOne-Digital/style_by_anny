import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const settings = await getSiteSettings();
  const params = await searchParams;
  const query = params.q || "";
  return buildMetadata(settings, {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `Search results for "${query}"`
      : "Search our plant collection.",
    path: "/search",
    noIndex: true,
  });
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const [settings, result] = await Promise.all([
    getSiteSettings(),
    query
      ? getProducts({ search: query, page, limit: ITEMS_PER_PAGE })
      : Promise.resolve({ items: [], total: 0, page: 1, totalPages: 0, hasMore: false }),
  ]);

  return (
    <>
      <PageHeader
        title={query ? `Results for "${query}"` : "Search"}
        subtitle={
          query
            ? `${result.total} ${result.total === 1 ? "result" : "results"} found`
            : "Enter a search term to find plants."
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {query ? (
          <Suspense>
            <div className="space-y-8">
              <ProductGrid
                products={result.items}
                currency={settings.currency}
                emptyMessage={`No results found for "${query}". Try a different search term.`}
              />
              <Pagination
                currentPage={page}
                totalPages={result.totalPages}
                basePath="/search"
                searchParams={{ q: query }}
              />
            </div>
          </Suspense>
        ) : (
          <p className="text-center text-text-muted">
            Use the search icon in the header or add ?q=your+search to the URL.
          </p>
        )}
      </div>
    </>
  );
}
