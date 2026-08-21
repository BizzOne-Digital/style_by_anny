import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { blogPostSchema } from "@/lib/validation";
import { BlogPost } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Blog post not found", 404);
  }

  try {
    await connectDB();
    const post = await BlogPost.findOne({ _id: id, published: true }).lean();

    if (!post) {
      return apiError("Blog post not found", 404);
    }

    return apiSuccess(post);
  } catch (error) {
    console.error("Blog GET error:", error);
    return apiError("Failed to fetch blog post", 500);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Blog post not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const existing = await BlogPost.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("A blog post with this slug already exists");
      }
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.published === true) {
      const current = await BlogPost.findById(id);
      if (current && !current.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return apiError("Blog post not found", 404);
    }

    return apiSuccess(post);
  } catch (error) {
    console.error("Blog PUT error:", error);
    return apiError("Failed to update blog post", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Blog post not found", 404);
  }

  try {
    await connectDB();
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return apiError("Blog post not found", 404);
    }

    return apiSuccess({ message: "Blog post deleted" });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return apiError("Failed to delete blog post", 500);
  }
}
