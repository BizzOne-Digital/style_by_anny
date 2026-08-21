import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { pricingPlanSchema } from "@/lib/validation";
import { PricingPlan } from "@/models";

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
    return apiError("Pricing plan not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = pricingPlanSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const plan = await PricingPlan.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return apiError("Pricing plan not found", 404);
    }

    return apiSuccess(plan);
  } catch (error) {
    console.error("Pricing PUT error:", error);
    return apiError("Failed to update pricing plan", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Pricing plan not found", 404);
  }

  try {
    await connectDB();
    const plan = await PricingPlan.findByIdAndDelete(id);

    if (!plan) {
      return apiError("Pricing plan not found", 404);
    }

    return apiSuccess({ message: "Pricing plan deleted" });
  } catch (error) {
    console.error("Pricing DELETE error:", error);
    return apiError("Failed to delete pricing plan", 500);
  }
}
