import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { z } from "zod";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { Page } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const pageUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sections: z
    .array(
      z.object({
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
      })
    )
    .optional(),
});

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Page not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = pageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const existing = await Page.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("A page with this slug already exists");
      }
    }

    const page = await Page.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!page) {
      return apiError("Page not found", 404);
    }

    return apiSuccess(page);
  } catch (error) {
    console.error("Page PUT error:", error);
    return apiError("Failed to update page", 500);
  }
}
