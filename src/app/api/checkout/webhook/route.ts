import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { getStripe } from "@/lib/stripe";
import { decrementInventory } from "@/lib/order-utils";
import { Order, Coupon } from "@/models";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook signature verification failed";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectDB();

      const orderId = session.metadata?.orderId;
      if (!orderId) {
        return NextResponse.json({ received: true });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json({ received: true });
      }

      if (order.paymentStatus === "paid") {
        return NextResponse.json({ received: true });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.stripeSessionId = session.id;
      order.stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || "";

      await order.save();

      await decrementInventory(
        order.items.map((item: (typeof order.items)[number]) => ({
          productId: item.productId.toString(),
          variantId: item.variantId || undefined,
          quantity: item.quantity,
        }))
      );

      if (order.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.couponCode },
          { $inc: { usageCount: 1 } }
        );
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      return NextResponse.json(
        { error: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
