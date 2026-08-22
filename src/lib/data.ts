import { connectDB, isDBConfigured, tryConnectDB } from "@/lib/mongodb";
import {
  normalizeCategoryImage,
  normalizePageSections,
  normalizeProductImage,
  normalizeService,
  normalizeSiteLogo,
} from "@/lib/normalize-media";
import {
  STATIC_SETTINGS,
  getStaticCategories,
  getStaticFeaturedProducts,
  getStaticHomePage,
  getStaticAboutPage,
  getStaticProductBySlug,
  getStaticProducts,
  getStaticServices,
} from "@/lib/static-fallback";
import type { SiteSettingsData } from "@/types";
import type { ProductCardData } from "@/components/shop/ProductCard";
import {
  Product,
  Category,
  SiteSettings,
  Order,
  BlogPost,
  Testimonial,
  ContactSubmission,
  Page,
} from "@/models";

function normalizeSettings<T extends SiteSettingsData>(settings: T): T {
  const logo = normalizeSiteLogo(settings.logo);
  return logo ? { ...settings, logo } : settings;
}

function normalizeProducts<T>(products: T[]): T[] {
  return products.map((product) =>
    normalizeProductImage(product as Parameters<typeof normalizeProductImage>[0])
  ) as T[];
}

function normalizeCategories<T extends { slug: string; image?: string }>(
  categories: T[]
): T[] {
  return categories.map((category) => normalizeCategoryImage(category));
}

async function withDb<T>(fallback: T, query: () => Promise<T>): Promise<T> {
  if (!isDBConfigured()) return fallback;
  try {
    const ok = await tryConnectDB();
    if (!ok) return fallback;
    return await query();
  } catch (error) {
    console.error("[data] MongoDB query failed, using fallback:", error);
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  return withDb(STATIC_SETTINGS, async () => {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return normalizeSettings(JSON.parse(JSON.stringify(settings)));
  });
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  return withDb(getStaticFeaturedProducts(limit), async () => {
    const products = await Product.find({ active: true, featured: true })
      .populate("category", "name slug")
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();
    return normalizeProducts(
      JSON.parse(JSON.stringify(products))
    ) as ProductCardData[];
  });
}

export async function getActiveCategories() {
  return withDb(getStaticCategories(), async () => {
    const categories = await Category.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    return normalizeCategories(JSON.parse(JSON.stringify(categories)));
  });
}

function getStaticProductsResult(filters: {
  category?: string;
  featured?: boolean;
  onSale?: boolean;
  page?: number;
  limit?: number;
}): {
  items: ProductCardData[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
} {
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  let items = getStaticProducts();

  if (filters.category) {
    items = items.filter((p) => p.category?.slug === filters.category);
  }
  if (filters.featured) {
    items = items.filter((p) => p.featured);
  }
  if (filters.onSale) {
    items = items.filter((p) => p.salePrice);
  }

  const total = items.length;
  const skip = (page - 1) * limit;

  return {
    items: items.slice(skip, skip + limit) as ProductCardData[],
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    hasMore: page * limit < total,
  };
}

export async function getProducts(filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: ProductCardData[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}> {
  return withDb(getStaticProductsResult(filters), async () => {
    const query: Record<string, unknown> = { active: true };
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    if (filters.category) {
      const cat = await Category.findOne({ slug: filters.category });
      if (cat) query.category = cat._id;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined)
        (query.price as Record<string, number>).$gte = filters.minPrice;
      if (filters.maxPrice !== undefined)
        (query.price as Record<string, number>).$lte = filters.maxPrice;
    }

    if (filters.featured) query.featured = true;
    if (filters.onSale) query.salePrice = { $exists: true, $ne: null, $gt: 0 };
    if (filters.inStock) query.stockStatus = { $ne: "out_of_stock" };

    let sortOption: Record<string, 1 | -1> = {
      displayOrder: 1,
      createdAt: -1,
    };
    switch (filters.sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "name-asc":
        sortOption = { name: 1 };
        break;
      case "name-desc":
        sortOption = { name: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      items: normalizeProducts(
        JSON.parse(JSON.stringify(products))
      ) as ProductCardData[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  });
}

export async function getProductBySlug(slug: string) {
  return withDb(getStaticProductBySlug(slug), async () => {
    const product = await Product.findOne({ slug, active: true })
      .populate("category", "name slug")
      .lean();
    if (!product) return null;
    return normalizeProductImage(JSON.parse(JSON.stringify(product)));
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
) {
  return withDb([], async () => {
    const products = await Product.find({
      category: categoryId,
      active: true,
      _id: { $ne: excludeId },
    })
      .limit(limit)
      .lean();
    return normalizeProducts(
      JSON.parse(JSON.stringify(products))
    ) as ProductCardData[];
  });
}

export async function getPageBySlug(slug: string) {
  const staticPage =
    slug === "home"
      ? getStaticHomePage()
      : slug === "about"
        ? getStaticAboutPage()
        : null;

  return withDb(staticPage, async () => {
    const page = await Page.findOne({ slug }).lean();
    if (!page) return staticPage;
    const parsed = JSON.parse(JSON.stringify(page));
    if (Array.isArray(parsed.sections)) {
      parsed.sections = normalizePageSections(slug, parsed.sections);
    }
    return parsed;
  });
}

export async function getDashboardStats() {
  const empty = {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    recentOrders: [],
    recentProducts: [],
    blogPosts: 0,
    testimonials: 0,
    unreadContacts: 0,
  };

  return withDb(empty, async () => {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      recentOrders,
      recentProducts,
      blogPosts,
      testimonials,
      contactSubmissions,
      revenueResult,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Product.countDocuments({ stockStatus: "low_stock" }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Product.find().sort({ createdAt: -1 }).limit(5).lean(),
      BlogPost.countDocuments({ published: true }),
      Testimonial.countDocuments({ active: true }),
      ContactSubmission.countDocuments({ read: false }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue: revenueResult[0]?.total || 0,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      recentProducts: JSON.parse(JSON.stringify(recentProducts)),
      blogPosts,
      testimonials,
      unreadContacts: contactSubmissions,
    };
  });
}

export async function getPublishedBlogPosts(page = 1, limit = 9) {
  const empty = { items: [], total: 0, page, totalPages: 0 };
  return withDb(empty, async () => {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      BlogPost.find({ published: true })
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments({ published: true }),
    ]);
    return {
      items: JSON.parse(JSON.stringify(posts)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  });
}

export async function getBlogPostBySlug(slug: string) {
  return withDb(null, async () => {
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  });
}

export async function getActiveTestimonials() {
  return withDb([], async () => {
    const testimonials = await Testimonial.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(testimonials));
  });
}

export async function getActiveFAQs() {
  return withDb([], async () => {
    const { FAQ } = await import("@/models");
    const faqs = await FAQ.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(faqs));
  });
}

export async function getActiveServices() {
  return withDb(getStaticServices(), async () => {
    const { Service } = await import("@/models");
    const services = await Service.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(services)).map(normalizeService);
  });
}

export async function getActivePricingPlans() {
  return withDb([], async () => {
    const { PricingPlan } = await import("@/models");
    const plans = await PricingPlan.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(plans));
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return withDb(null, async () => {
    const order = await Order.findOne({ orderNumber }).lean();
    return order ? JSON.parse(JSON.stringify(order)) : null;
  });
}

export { getEffectivePrice } from "@/lib/utils";

export async function getCategoryBySlug(slug: string) {
  return withDb(
    getStaticCategories().find((c) => c.slug === slug) ?? null,
    async () => {
      const category = await Category.findOne({ slug, active: true }).lean();
      if (!category) return null;
      return normalizeCategoryImage(JSON.parse(JSON.stringify(category)));
    }
  );
}

export async function getRelatedBlogPosts(
  excludeSlug: string,
  category?: string,
  limit = 3
) {
  return withDb([], async () => {
    const query: Record<string, unknown> = {
      published: true,
      slug: { $ne: excludeSlug },
    };
    if (category) query.category = category;

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  });
}

export async function getAllActiveProductSlugs() {
  return withDb(
    getStaticProducts().map((p) => ({ slug: p.slug })),
    async () => {
      const products = await Product.find({ active: true })
        .select("slug updatedAt")
        .lean();
      return JSON.parse(JSON.stringify(products));
    }
  );
}

export async function getAllActiveCategorySlugs() {
  return withDb(
    getStaticCategories().map((c) => ({ slug: c.slug })),
    async () => {
      const categories = await Category.find({ active: true })
        .select("slug updatedAt")
        .lean();
      return JSON.parse(JSON.stringify(categories));
    }
  );
}

export async function getAllPublishedBlogSlugs() {
  return withDb([], async () => {
    const posts = await BlogPost.find({ published: true })
      .select("slug updatedAt")
      .lean();
    return JSON.parse(JSON.stringify(posts));
  });
}

export function getProductStock(product: {
  variants?: Array<{ _id?: string; stock: number }>;
  stockQuantity: number;
  variantId?: string;
}): number {
  if (product.variantId && product.variants) {
    const variant = product.variants.find(
      (v) => v._id?.toString() === product.variantId
    );
    return variant?.stock ?? 0;
  }
  return product.stockQuantity;
}

// Re-export for shop page static fallback when DB down
export { getStaticProducts };
