import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/lib/data";
import { z } from "zod";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { SiteSettings } from "@/models";
import type { SiteSettingsData } from "@/types";

const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().default(""),
  active: z.boolean().default(true),
  order: z.number().default(0),
});

const settingsUpdateSchema = z.object({
  brandName: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  currency: z.string().optional(),
  lowStockThreshold: z.number().min(0).optional(),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  footerText: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  shippingFlatRate: z.number().min(0).optional(),
  taxRate: z.number().min(0).optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

function toPublicSettings(settings: SiteSettingsData) {
  return {
    brandName: settings.brandName,
    tagline: settings.tagline,
    email: settings.email,
    phone: settings.phone,
    logo: settings.logo,
    favicon: settings.favicon,
    currency: settings.currency,
    defaultSeoTitle: settings.defaultSeoTitle,
    defaultSeoDescription: settings.defaultSeoDescription,
    footerText: settings.footerText,
    socialLinks: settings.socialLinks?.filter((link) => link.active) ?? [],
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
  };
}

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  try {
    const settings = await getSiteSettings();
    return apiSuccess(toPublicSettings(settings));
  } catch (error) {
    console.error("Settings GET error:", error);
    return apiError("Failed to fetch settings", 500);
  }
}

export async function PUT(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = settingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(parsed.data);
    } else {
      Object.assign(settings, parsed.data);
      await settings.save();
    }

    return apiSuccess(settings);
  } catch (error) {
    console.error("Settings PUT error:", error);
    return apiError("Failed to update settings", 500);
  }
}
