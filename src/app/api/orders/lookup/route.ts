import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models";
import { apiSuccess, apiError, parseBody } from "@/lib/api-utils";
import { z } from "zod";

const lookupSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<unknown>(request);
    if (!body) return apiError("Invalid request body");

    const parsed = lookupSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed");
    }

    await connectDB();
    const order = await Order.findOne({
      orderNumber: parsed.data.orderNumber,
      email: parsed.data.email.toLowerCase(),
    }).lean();

    if (!order) {
      return apiError("Order not found. Please check your order number and email.", 404);
    }

    return apiSuccess({
      orderNumber: order.orderNumber,
      email: order.email,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items,
    });
  } catch (error) {
    console.error("Order lookup error:", error);
    return apiError("Failed to look up order", 500);
  }
}
