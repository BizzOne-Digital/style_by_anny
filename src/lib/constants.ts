export const BRAND = {
  name: "Plant Style by Anne",
  email: "plantstyleinc@gmail.com",
  phone: "(403) 978-8177",
  tagline: "Beautiful hoyas and curated plants for your home",
} as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export const STOCK_STATUSES = ["in_stock", "out_of_stock", "low_stock"] as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB

export const LOW_STOCK_THRESHOLD = 5;

export const ITEMS_PER_PAGE = 12;
