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
  defaultSeoTitle: `${BRAND.name} | Plants & Interior Design`,
  defaultSeoDescription: BRAND.tagline,
  footerText: "Bringing plants and interior design together for over 6 years.",
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
          mediaId: imageData.url,
          alt: imageData.alt,
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
      _id: "styling",
      title: "Plant Styling Consultation",
      description:
        "Personalized guidance to select and place plants that complement your interior.",
      image: TEMPORARY_IMAGES.services.styling.url,
      ctaText: "Learn More",
      ctaUrl: "/contact",
    },
    {
      _id: "design",
      title: "Interior Plant Design",
      description:
        "Room-by-room styling that integrates plants into your home's design story.",
      image: TEMPORARY_IMAGES.services.design.url,
      ctaText: "Learn More",
      ctaUrl: "/contact",
    },
    {
      _id: "care",
      title: "Plant Care Guidance",
      description:
        "Support for new and experienced plant owners — care plans tailored to your space.",
      image: TEMPORARY_IMAGES.services.care.url,
      ctaText: "Learn More",
      ctaUrl: "/contact",
    },
  ];
}
