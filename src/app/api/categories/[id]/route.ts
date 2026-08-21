import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { categorySchema } from "@/lib/validation";
import { Category } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Category not found", 404);
  }

  try {
    await connectDB();
    const category = await Category.findOne({ _id: id, active: true }).lean();

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiSuccess(category);
  } catch (error) {
    console.error("Category GET error:", error);
    return apiError("Failed to fetch category", 500);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Category not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const existing = await Category.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("A category with this slug already exists");
      }
    }

    const category = await Category.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiSuccess(category);
  } catch (error) {
    console.error("Category PUT error:", error);
    return apiError("Failed to update category", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Category not found", 404);
  }

  try {
    await connectDB();
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return apiError("Category not found", 404);
    }

    return apiSuccess({ message: "Category deleted" });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return apiError("Failed to delete category", 500);
  }
}
