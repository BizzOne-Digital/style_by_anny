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
import { Coupon } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const couponUpdateSchema = z.object({
  code: z.string().min(1).optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountAmount: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  active: z.boolean().optional(),
  maxUsage: z.number().min(1).optional().nullable(),
});

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Coupon not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = couponUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    const updateData: Record<string, unknown> = { ...parsed.data };

    if (parsed.data.code) {
      updateData.code = parsed.data.code.toUpperCase();
      const existing = await Coupon.findOne({
        code: updateData.code as string,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("A coupon with this code already exists");
      }
    }

    if (parsed.data.startDate !== undefined) {
      updateData.startDate = parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : null;
    }
    if (parsed.data.endDate !== undefined) {
      updateData.endDate = parsed.data.endDate
        ? new Date(parsed.data.endDate)
        : null;
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return apiError("Coupon not found", 404);
    }

    return apiSuccess(coupon);
  } catch (error) {
    console.error("Coupon PUT error:", error);
    return apiError("Failed to update coupon", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Coupon not found", 404);
  }

  try {
    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return apiError("Coupon not found", 404);
    }

    return apiSuccess({ message: "Coupon deleted" });
  } catch (error) {
    console.error("Coupon DELETE error:", error);
    return apiError("Failed to delete coupon", 500);
  }
}
