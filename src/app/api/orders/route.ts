import { connectDB } from "@/lib/mongodb";
import { generateOrderNumber } from "@/lib/utils";
import {
  validateCartItems,
  applyCoupon,
} from "@/lib/order-utils";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { checkoutSchema } from "@/lib/validation";
import { Order } from "@/models";
import type { Address } from "@/types";

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
  const status = searchParams.get("status");
  const skip = (page - 1) * limit;

  try {
    await connectDB();

    const query: Record<string, string> = {};
    if (status) {
      query.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return apiSuccess({
      items: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return apiError("Failed to fetch orders", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const body = await parseBody<unknown>(request);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  const data = parsed.data;

  try {
    await connectDB();

    const cart = await validateCartItems(data.items);
    const { discount, couponCode } = await applyCoupon(
      data.couponCode,
      cart.subtotal
    );

    const billingAddress: Address =
      data.sameAsShipping !== false || !data.billingAddress
        ? data.shippingAddress
        : data.billingAddress;

    const total = cart.subtotal + cart.shipping + cart.tax - discount;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      email: data.email,
      phone: data.phone || "",
      items: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      discount,
      total,
      paymentStatus: "pending",
      orderStatus: "pending",
      shippingAddress: data.shippingAddress,
      billingAddress,
      couponCode,
      notes: data.notes || "",
    });

    return apiSuccess(order, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return apiError(message);
  }
}
