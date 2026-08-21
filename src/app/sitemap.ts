import type { MetadataRoute } from "next";
import {
  getAllActiveProductSlugs,
  getAllActiveCategorySlugs,
  getAllPublishedBlogSlugs,
} from "@/lib/data";
import { tryConnectDB } from "@/lib/mongodb";
import {
  getStaticCategories,
  getStaticProducts,
} from "@/lib/static-fallback";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages = [
    "",
    "/about",
    "/services",
    "/contact",
    "/pricing",
    "/blog",
    "/testimonials",
    "/faq",
    "/shop",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const dbOk = await tryConnectDB();

  const [products, categories, blogPosts] = dbOk
    ? await Promise.all([
        getAllActiveProductSlugs(),
        getAllActiveCategorySlugs(),
        getAllPublishedBlogSlugs(),
      ])
    : [
        getStaticProducts().map((p) => ({ slug: p.slug })),
        getStaticCategories().map((c) => ({ slug: c.slug })),
        [],
      ];

  const productPages = products.map(
    (p: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const categoryPages = categories.map(
    (c: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/shop/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const blogPages = blogPosts.map(
    (p: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
