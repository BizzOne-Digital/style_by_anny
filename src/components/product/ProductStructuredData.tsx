import { getSiteUrl } from "@/lib/seo";
import { getEffectivePrice } from "@/lib/utils";
import { resolveAbsoluteMediaUrl } from "@/lib/media-url";

interface ProductStructuredDataProps {
  product: {
    name: string;
    slug: string;
    shortDescription?: string;
    price: number;
    salePrice?: number | null;
    images?: Array<{ mediaId: string; alt?: string }>;
    sku?: string;
    stockStatus: string;
  };
  brandName: string;
}

export function ProductStructuredData({
  product,
  brandName,
}: ProductStructuredDataProps) {
  const price = getEffectivePrice(product);
  const image = product.images?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.name,
    sku: product.sku || undefined,
    brand: { "@type": "Brand", name: brandName },
    image: image
      ? resolveAbsoluteMediaUrl(image.mediaId, getSiteUrl())
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/products/${product.slug}`,
      priceCurrency: "CAD",
      price: price.toFixed(2),
      availability:
        product.stockStatus === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
