import { connectDB } from "@/lib/mongodb";
import { getPageBySlug } from "@/lib/data";
import { z } from "zod";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { Page } from "@/models";

const pageSectionSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  visible: z.boolean().optional(),
  order: z.number().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

const pageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sections: z.array(pageSectionSchema).optional(),
});

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();

  if (!slug) {
    return apiError("Slug query parameter is required");
  }

  try {
    const page = await getPageBySlug(slug);
    if (!page) {
      return apiError("Page not found", 404);
    }

    return apiSuccess(page);
  } catch (error) {
    console.error("Pages GET error:", error);
    return apiError("Failed to fetch page", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    const existing = await Page.findOne({ slug: parsed.data.slug });
    if (existing) {
      return apiError("A page with this slug already exists");
    }

    const page = await Page.create(parsed.data);
    return apiSuccess(page, 201);
  } catch (error) {
    console.error("Pages POST error:", error);
    return apiError("Failed to create page", 500);
  }
}
