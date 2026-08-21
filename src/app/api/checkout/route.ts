import { connectDB } from "@/lib/mongodb";
import { generateOrderNumber } from "@/lib/utils";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/seo";
import { validateCartItems, applyCoupon } from "@/lib/order-utils";
import {
  apiSuccess,
  apiError,
  ensureDb,
  parseBody,
} from "@/lib/api-utils";
import { checkoutSchema } from "@/lib/validation";
import { Order } from "@/models";
import type { Address } from "@/types";

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

    if (isStripeConfigured()) {
      const stripe = getStripe();
      if (!stripe) {
        return apiSuccess({ order, checkoutUrl: null });
      }

      const settings = await getSiteSettings();
      const currency = (settings.currency || "CAD").toLowerCase();
      const appUrl = getSiteUrl();

      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.variantName
              ? `${item.name} (${item.variantName})`
              : item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      if (cart.tax > 0) {
        lineItems.push({
          price_data: {
            currency,
            product_data: { name: "Tax" },
            unit_amount: Math.round(cart.tax * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: data.email,
        line_items: lineItems,
        ...(cart.shipping > 0
          ? {
              shipping_options: [
                {
                  shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                      amount: Math.round(cart.shipping * 100),
                      currency,
                    },
                    display_name: "Shipping",
                  },
                },
              ],
            }
          : {}),
        ...(discount > 0
          ? {
              discounts: [
                {
                  coupon: (
                    await stripe.coupons.create({
                      amount_off: Math.round(discount * 100),
                      currency,
                      duration: "once",
                      name: couponCode || "Order discount",
                    })
                  ).id,
                },
              ],
            }
          : {}),
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
        },
        success_url: `${appUrl}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${appUrl}/checkout?cancelled=true`,
      });

      order.stripeSessionId = session.id;
      await order.save();

      return apiSuccess({
        order,
        checkoutUrl: session.url,
      });
    }

    return apiSuccess({ order, checkoutUrl: null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return apiError(message);
  }
}
