import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { testimonialSchema } from "@/lib/validation";
import { Testimonial } from "@/models";

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
    return apiError("Testimonial not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess(testimonial);
  } catch (error) {
    console.error("Testimonial PUT error:", error);
    return apiError("Failed to update testimonial", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Testimonial not found", 404);
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return apiError("Testimonial not found", 404);
    }

    return apiSuccess({ message: "Testimonial deleted" });
  } catch (error) {
    console.error("Testimonial DELETE error:", error);
    return apiError("Failed to delete testimonial", 500);
  }
}
