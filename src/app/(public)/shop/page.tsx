import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getProducts,
  getActiveCategories,
  getSiteSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Shop",
    description: "Browse our curated collection of hoyas and indoor plants.",
    path: "/shop",
  });
}

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    inStock?: string;
    onSale?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const [settings, categories, result] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
    getProducts({
      search: params.q,
      sort: params.sort,
      inStock: params.inStock === "true",
      onSale: params.onSale === "true",
      page,
      limit: ITEMS_PER_PAGE,
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Shop Plants"
        subtitle="Hand-selected hoyas and plants, grown with care."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-accent" />}>
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>
          <div className="lg:col-span-3 space-y-8">
            <p className="text-sm text-text-muted">
              {result.total} {result.total === 1 ? "product" : "products"}
              {params.q && ` for "${params.q}"`}
            </p>
            <ProductGrid
              products={result.items}
              currency={settings.currency}
            />
            <Pagination
              currentPage={page}
              totalPages={result.totalPages}
              basePath="/shop"
              searchParams={{
                q: params.q,
                sort: params.sort,
                inStock: params.inStock,
                onSale: params.onSale,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
