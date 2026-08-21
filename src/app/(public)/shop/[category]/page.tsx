import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getCategoryBySlug,
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

interface CategoryShopPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    inStock?: string;
    onSale?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryShopPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const [settings, category] = await Promise.all([
    getSiteSettings(),
    getCategoryBySlug(slug),
  ]);
  if (!category) return buildMetadata(settings, { title: "Category Not Found", noIndex: true });
  return buildMetadata(settings, {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
    path: `/shop/${slug}`,
  });
}

export default async function CategoryShopPage({
  params,
  searchParams,
}: CategoryShopPageProps) {
  const { category: slug } = await params;
  const queryParams = await searchParams;
  const page = Math.max(1, parseInt(queryParams.page || "1", 10) || 1);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [settings, categories, result] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
    getProducts({
      category: slug,
      search: queryParams.q,
      sort: queryParams.sort,
      inStock: queryParams.inStock === "true",
      onSale: queryParams.onSale === "true",
      page,
      limit: ITEMS_PER_PAGE,
    }),
  ]);

  const basePath = `/shop/${slug}`;

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title={category.name}
        subtitle={category.description || `Browse our ${category.name} collection.`}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-accent" />}>
              <ProductFilters categories={categories} basePath={basePath} />
            </Suspense>
          </aside>
          <div className="lg:col-span-3 space-y-8">
            <p className="text-sm text-text-muted">
              {result.total} {result.total === 1 ? "product" : "products"}
            </p>
            <ProductGrid
              products={result.items}
              currency={settings.currency}
              emptyMessage={`No products found in ${category.name}.`}
            />
            <Pagination
              currentPage={page}
              totalPages={result.totalPages}
              basePath={basePath}
              searchParams={{
                q: queryParams.q,
                sort: queryParams.sort,
                inStock: queryParams.inStock,
                onSale: queryParams.onSale,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
