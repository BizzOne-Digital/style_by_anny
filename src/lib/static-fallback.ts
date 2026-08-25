/**
 * Static fallback content when MongoDB is unreachable.
 * Uses local images from /public/images/demo/ so the site still looks complete.
 */
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  TEMPORARY_IMAGES,
  buildHomepageSections,
  buildAboutSections,
} from "@/lib/temporary-images";
import { BRAND } from "@/lib/constants";
import type { SiteSettingsData } from "@/types";

export const STATIC_SETTINGS: SiteSettingsData = {
  brandName: BRAND.name,
  tagline: BRAND.tagline,
  email: BRAND.email,
  phone: BRAND.phone,
  currency: "CAD",
  lowStockThreshold: 5,
  defaultSeoTitle: `${BRAND.name} | Hoyas & Indoor Plants`,
  defaultSeoDescription: BRAND.tagline,
  footerText: "Sharing a love of hoyas and plants for over 6 years.",
  socialLinks: [],
  logo: TEMPORARY_IMAGES.logo.url,
};

export function getStaticCategories() {
  return DEMO_CATEGORIES.map((cat) => {
    const imageData =
      TEMPORARY_IMAGES.categories[
        cat.slug as keyof typeof TEMPORARY_IMAGES.categories
      ];
    return {
      _id: cat.slug,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: imageData?.url ?? "",
      displayOrder: cat.displayOrder,
      active: true,
    };
  });
}

export function getStaticProducts() {
  return DEMO_PRODUCTS.map((demo) => {
    const imageData = TEMPORARY_IMAGES.products[demo.imageKey];
    const fallback = TEMPORARY_IMAGES.products["hoya-carnosa"];
    return {
      _id: demo.slug,
      name: demo.name,
      slug: demo.slug,
      sku: demo.sku,
      shortDescription: demo.shortDescription,
      price: demo.price,
      salePrice: "salePrice" in demo ? demo.salePrice : null,
      compareAtPrice: "salePrice" in demo ? demo.price : undefined,
      images: [
        {
          mediaId: imageData?.url ?? fallback.url,
          alt: imageData?.alt ?? demo.name,
          order: 0,
        },
      ],
      category: {
        name:
          DEMO_CATEGORIES.find((c) => c.slug === demo.categorySlug)?.name ??
          demo.categorySlug,
        slug: demo.categorySlug,
      },
      stockStatus: "in_stock",
      featured: demo.featured,
      active: true,
      isDemo: true,
    };
  });
}

export function getStaticFeaturedProducts(limit = 8) {
  return getStaticProducts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getStaticHomePage() {
  return {
    slug: "home",
    title: "Home",
    sections: buildHomepageSections(),
  };
}

export function getStaticAboutPage() {
  return {
    slug: "about",
    title: "About",
    sections: buildAboutSections(),
  };
}

export function getStaticProductBySlug(slug: string) {
  return getStaticProducts().find((p) => p.slug === slug) ?? null;
}

export function getStaticServices() {
  return [
    {
      _id: "hoya-care",
      title: "Hoya Care Consultation",
      description:
        "Personalized guidance on watering, light, and care for your hoya collection.",
      image: TEMPORARY_IMAGES.services.styling.url,
      ctaText: "Learn More",
      ctaUrl: "/contact",
    },
    {
      _id: "selection",
      title: "Plant Selection Guidance",
      description:
        "Help choosing the right hoyas and plants for your home and experience level.",
      image: TEMPORARY_IMAGES.services.design.url,
      ctaText: "Learn More",
      ctaUrl: "/contact",
    },
    {
      _id: "care",
      title: "Plant Care Support",
      description:
        "Ongoing support for new and experienced plant owners — tailored to your plants.",
      image: TEMPORARY_IMAGES.services.care.url,
      ctaText: "Learn More",
      ctaUrl: "/contact",
    },
  ];
}
