import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validation";
import { Service } from "@/models";

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
    return apiError("Service not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const service = await Service.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess(service);
  } catch (error) {
    console.error("Service PUT error:", error);
    return apiError("Failed to update service", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Service not found", 404);
  }

  try {
    await connectDB();
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return apiError("Service not found", 404);
    }

    return apiSuccess({ message: "Service deleted" });
  } catch (error) {
    console.error("Service DELETE error:", error);
    return apiError("Failed to delete service", 500);
  }
}
