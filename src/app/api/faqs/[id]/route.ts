import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { faqSchema } from "@/lib/validation";
import { FAQ } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("FAQ not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = faqSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      return apiError("FAQ not found", 404);
    }

    return apiSuccess(faq);
  } catch (error) {
    console.error("FAQ PUT error:", error);
    return apiError("Failed to update FAQ", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("FAQ not found", 404);
  }

  try {
    await connectDB();
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return apiError("FAQ not found", 404);
    }

    return apiSuccess({ message: "FAQ deleted" });
  } catch (error) {
    console.error("FAQ DELETE error:", error);
    return apiError("Failed to delete FAQ", 500);
  }
}
