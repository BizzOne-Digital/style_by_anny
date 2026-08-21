import { connectDB } from "@/lib/mongodb";
import { Product, SiteSettings, Coupon } from "@/models";
import { getEffectivePrice } from "@/lib/utils";
import type { OrderItem } from "@/types";

export interface CouponResult {
  discount: number;
  couponCode: string;
}

export async function applyCoupon(
  code: string | undefined,
  subtotal: number
): Promise<CouponResult> {
  if (!code?.trim()) {
    return { discount: 0, couponCode: "" };
  }

  await connectDB();
  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    active: true,
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    throw new Error("Coupon is not yet active");
  }
  if (coupon.endDate && now > coupon.endDate) {
    throw new Error("Coupon has expired");
  }
  if (coupon.maxUsage != null && coupon.usageCount >= coupon.maxUsage) {
    throw new Error("Coupon usage limit reached");
  }
  if (subtotal < (coupon.minOrderAmount ?? 0)) {
    throw new Error(
      `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`
    );
  }

  let discount =
    coupon.discountType === "percentage"
      ? subtotal * (coupon.discountAmount / 100)
      : coupon.discountAmount;

  discount = Math.min(discount, subtotal);

  return { discount, couponCode: coupon.code };
}

interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export async function validateCartItems(items: CartItemInput[]) {
  await connectDB();
  const settings = await SiteSettings.findOne();
  const validatedItems: OrderItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.active) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    let price = getEffectivePrice(product);
    let stock = product.stockQuantity;
    let variantName = "";
    let sku = product.sku || "";
    let image = product.images?.[0]?.mediaId || "";

    if (item.variantId && product.variants?.length) {
      const variant = product.variants.find(
        (v: { _id?: { toString(): string } }) =>
          v._id?.toString() === item.variantId
      );
      if (!variant) {
        throw new Error(`Variant not found for product: ${product.name}`);
      }
      if (variant.price) price = variant.price;
      stock = variant.stock;
      variantName = variant.name;
      sku = variant.sku || sku;
      if (variant.image) image = variant.image;
    }

    if (stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}${variantName ? ` (${variantName})` : ""}. Available: ${stock}`
      );
    }

    const lineTotal = price * item.quantity;
    subtotal += lineTotal;

    validatedItems.push({
      productId: product._id.toString(),
      variantId: item.variantId || "",
      name: product.name,
      sku,
      variantName,
      price,
      quantity: item.quantity,
      image,
    });
  }

  const shipping = settings?.shippingFlatRate ?? 0;
  const taxRate = settings?.taxRate ?? 0;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + shipping + tax;

  return { items: validatedItems, subtotal, shipping, tax, total };
}

export async function decrementInventory(
  items: Array<{ productId: string; variantId?: string; quantity: number }>
) {
  await connectDB();

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    if (item.variantId && product.variants?.length) {
      const variantIndex = product.variants.findIndex(
        (v: { _id?: { toString(): string } }) =>
          v._id?.toString() === item.variantId
      );
      if (variantIndex > -1) {
        product.variants[variantIndex].stock = Math.max(
          0,
          product.variants[variantIndex].stock - item.quantity
        );
      }
    } else {
      product.stockQuantity = Math.max(
        0,
        product.stockQuantity - item.quantity
      );
    }

    const threshold = (await SiteSettings.findOne())?.lowStockThreshold ?? 5;
    const totalStock =
      product.variants?.length > 0
        ? product.variants.reduce(
            (sum: number, v: { stock: number }) => sum + v.stock,
            0
          )
        : product.stockQuantity;

    if (totalStock <= 0) {
      product.stockStatus = "out_of_stock";
    } else if (totalStock <= threshold) {
      product.stockStatus = "low_stock";
    } else {
      product.stockStatus = "in_stock";
    }

    await product.save();
  }
}
