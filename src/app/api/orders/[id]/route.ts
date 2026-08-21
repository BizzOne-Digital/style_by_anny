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
import { ORDER_STATUSES } from "@/lib/constants";
import { Order } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const orderUpdateSchema = z.object({
  orderStatus: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  notes: z.string().optional(),
});

export async function GET(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Order not found", 404);
  }

  try {
    await connectDB();
    const order = await Order.findById(id).lean();

    if (!order) {
      return apiError("Order not found", 404);
    }

    return apiSuccess(order);
  } catch (error) {
    console.error("Order GET error:", error);
    return apiError("Failed to fetch order", 500);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Order not found", 404);
  }

  const body = await parseBody<unknown>(request);
  const parsed = orderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return apiError("Order not found", 404);
    }

    return apiSuccess(order);
  } catch (error) {
    console.error("Order PUT error:", error);
    return apiError("Failed to update order", 500);
  }
}
