import {
  TEMPORARY_IMAGES,
  DEMO_PRODUCTS,
  buildHomepageSections,
  buildAboutSections,
} from "@/lib/temporary-images";
import { resolveMediaSrc } from "@/lib/media-url";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

/** True when a stored image ref should be replaced with a local demo asset. */
export function needsMediaRewrite(src?: string | null): boolean {
  if (!src?.trim()) return true;

  const value = src.trim();

  if (value.includes("unsplash.com")) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value)) return true;

  // Relative path missing leading slash — breaks on Vercel
  if (
    !value.startsWith("/") &&
    !value.startsWith("http") &&
    !OBJECT_ID_PATTERN.test(value)
  ) {
    return true;
  }

  return false;
}

function rewriteMediaField(src?: string | null): string | undefined {
  if (!src?.trim()) return undefined;
  const resolved = resolveMediaSrc(src);
  return resolved;
}

export function normalizeProductImage<T extends {
  slug: string;
  name?: string;
  images?: { mediaId: string; alt?: string; order?: number }[];
}>(product: T): T {
  const demo = DEMO_PRODUCTS.find((d) => d.slug === product.slug);
  const local = demo
    ? TEMPORARY_IMAGES.products[demo.imageKey]
    : undefined;

  if (local) {
    return {
      ...product,
      images: [{ mediaId: local.url, alt: local.alt, order: 0 }],
    };
  }

  const images = product.images ?? [];
  const primary = images[0];

  if (!primary || needsMediaRewrite(primary.mediaId)) {
    const fallback = TEMPORARY_IMAGES.products["hoya-carnosa"];
    return {
      ...product,
      images: [
        {
          mediaId: fallback.url,
          alt: primary?.alt || product.name || "Plant",
          order: 0,
        },
      ],
    };
  }

  return {
    ...product,
    images: images.map((img) => ({
      ...img,
      mediaId: rewriteMediaField(img.mediaId) ?? img.mediaId,
    })),
  };
}

export function normalizeCategoryImage<T extends { slug: string; image?: string }>(
  category: T
): T {
  const local =
    TEMPORARY_IMAGES.categories[
      category.slug as keyof typeof TEMPORARY_IMAGES.categories
    ];

  if (local) {
    return { ...category, image: local.url };
  }

  const rewritten = rewriteMediaField(category.image);
  return rewritten ? { ...category, image: rewritten } : category;
}

export function normalizeServiceImage<T extends {
  title: string;
  image?: string;
}>(service: T, imageKey?: keyof typeof TEMPORARY_IMAGES.services): T {
  const local = imageKey ? TEMPORARY_IMAGES.services[imageKey] : undefined;

  if (local) {
    return { ...service, image: local.url };
  }

  const rewritten = rewriteMediaField(service.image);
  return rewritten ? { ...service, image: rewritten } : service;
}

const SERVICE_IMAGE_KEYS: Record<
  string,
  keyof typeof TEMPORARY_IMAGES.services
> = {
  "hoya care consultation": "styling",
  "plant selection guidance": "design",
  "plant care support": "care",
};

export function normalizeService<T extends { title: string; image?: string }>(
  service: T
): T {
  const key = SERVICE_IMAGE_KEYS[service.title.toLowerCase()];
  return normalizeServiceImage(service, key);
}

export function normalizePageSections(
  slug: string,
  sections: Array<{ key: string; image?: string; [key: string]: unknown }>
) {
  const defaults =
    slug === "home"
      ? buildHomepageSections()
      : slug === "about"
        ? buildAboutSections()
        : [];

  const defaultByKey = new Map(defaults.map((s) => [s.key, s]));

  return sections.map((section) => {
    const fallback = defaultByKey.get(section.key);
    if (fallback?.image) {
      return { ...section, image: fallback.image };
    }

    const rewritten = rewriteMediaField(section.image);
    return rewritten ? { ...section, image: rewritten } : section;
  });
}

export function normalizeSiteLogo(logo?: string | null): string | undefined {
  if (needsMediaRewrite(logo)) {
    return TEMPORARY_IMAGES.logo.url;
  }
  return rewriteMediaField(logo);
}
