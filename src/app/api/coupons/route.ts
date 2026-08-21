import { connectDB } from "@/lib/mongodb";
import { applyCoupon } from "@/lib/order-utils";
import { z } from "zod";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { Coupon } from "@/models";

const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  discountType: z.enum(["percentage", "fixed"]),
  discountAmount: z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  active: z.boolean().optional(),
  maxUsage: z.number().min(1).optional(),
});

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { searchParams } = new URL(request.url);
  const validate = searchParams.get("validate") === "true";
  const code = searchParams.get("code")?.trim();
  const subtotal = Number(searchParams.get("subtotal")) || 0;

  if (validate) {
    if (!code) {
      return apiError("Coupon code is required");
    }

    try {
      const result = await applyCoupon(code, subtotal);
      return apiSuccess({
        valid: true,
        code: result.couponCode,
        discount: result.discount,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid coupon";
      return apiSuccess({ valid: false, error: message });
    }
  }

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return apiSuccess(coupons);
  } catch (error) {
    console.error("Coupons GET error:", error);
    return apiError("Failed to fetch coupons", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    const existing = await Coupon.findOne({
      code: parsed.data.code.toUpperCase(),
    });
    if (existing) {
      return apiError("A coupon with this code already exists");
    }

    const coupon = await Coupon.create({
      ...parsed.data,
      code: parsed.data.code.toUpperCase(),
      startDate: parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : undefined,
      endDate: parsed.data.endDate
        ? new Date(parsed.data.endDate)
        : undefined,
    });

    return apiSuccess(coupon, 201);
  } catch (error) {
    console.error("Coupons POST error:", error);
    return apiError("Failed to create coupon", 500);
  }
}
