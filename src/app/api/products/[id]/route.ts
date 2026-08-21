import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { productSchema } from "@/lib/validation";
import { Product } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Product not found", 404);
  }

  try {
    await connectDB();
    const product = await Product.findOne({ _id: id, active: true })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess(product);
  } catch (error) {
    console.error("Product GET error:", error);
    return apiError("Failed to fetch product", 500);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Product not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const existing = await Product.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("A product with this slug already exists");
      }
    }

    const product = await Product.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess(product);
  } catch (error) {
    console.error("Product PUT error:", error);
    return apiError("Failed to update product", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Product not found", 404);
  }

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess({ message: "Product deleted" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return apiError("Failed to delete product", 500);
  }
}
