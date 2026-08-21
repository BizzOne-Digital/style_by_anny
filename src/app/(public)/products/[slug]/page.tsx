import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getSiteSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductCareInfo } from "@/components/product/ProductCareInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductStructuredData } from "@/components/product/ProductStructuredData";
import { resolveAbsoluteMediaUrl } from "@/lib/media-url";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, product] = await Promise.all([
    getSiteSettings(),
    getProductBySlug(slug),
  ]);
  if (!product)
    return buildMetadata(settings, { title: "Product Not Found", noIndex: true });
  return buildMetadata(settings, {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/products/${slug}`,
    image: product.images?.[0]
      ? resolveAbsoluteMediaUrl(product.images[0].mediaId)
      : undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [settings, relatedProducts] = await Promise.all([
    getSiteSettings(),
    product.category
      ? getRelatedProducts(product.category._id, product._id, 4)
      : Promise.resolve([]),
  ]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ];
  if (product.category) {
    breadcrumbItems.push({
      label: product.category.name,
      href: `/shop/${product.category.slug}`,
    });
  }
  breadcrumbItems.push({ label: product.name });

  return (
    <>
      <ProductStructuredData product={product} brandName={settings.brandName} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />
          <ProductInfo product={product} currency={settings.currency} />
        </div>
        <ProductCareInfo product={product} />
        <RelatedProducts
          products={relatedProducts}
          currency={settings.currency}
        />
      </div>
    </>
  );
}
