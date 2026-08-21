import type { Metadata } from "next";
import type { SiteSettingsData } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plantstylebyanne.com";

export function getSiteUrl(): string {
  return SITE_URL;
}

export function buildMetadata(
  settings: SiteSettingsData,
  overrides?: {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
    noIndex?: boolean;
  }
): Metadata {
  const title = overrides?.title
    ? `${overrides.title} | ${settings.brandName}`
    : settings.defaultSeoTitle;
  const description =
    overrides?.description || settings.defaultSeoDescription;
  const url = overrides?.path ? `${SITE_URL}${overrides.path}` : SITE_URL;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url,
      siteName: settings.brandName,
      locale: "en_CA",
      type: "website",
      ...(overrides?.image ? { images: [{ url: overrides.image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(overrides?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
