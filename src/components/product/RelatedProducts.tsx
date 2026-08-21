import { ProductGrid } from "@/components/shop/ProductGrid";

interface RelatedProductsProps {
  products: Array<{
    _id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    images?: Array<{ mediaId: string; alt?: string }>;
    shortDescription?: string;
    stockStatus?: string;
    category?: { name: string; slug: string };
  }>;
  currency?: string;
}

export function RelatedProducts({ products, currency = "CAD" }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="font-heading text-3xl text-text">You May Also Like</h2>
      <div className="mt-8">
        <ProductGrid products={products} currency={currency} />
      </div>
    </section>
  );
}
