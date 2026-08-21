export interface ProductVariant {
  _id?: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  image?: string;
}

export interface ProductImage {
  mediaId: string;
  alt?: string;
  order: number;
}

export interface ProductSpecifications {
  [key: string]: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  variantName?: string;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface PageSection {
  key: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  visible?: boolean;
  order?: number;
  data?: Record<string, unknown>;
}

export interface SocialLink {
  platform: string;
  url: string;
  active: boolean;
  order: number;
}

export interface SiteSettingsData {
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  logo?: string;
  favicon?: string;
  currency: string;
  lowStockThreshold: number;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  footerText: string;
  socialLinks: SocialLink[];
  shippingFlatRate?: number;
  taxRate?: number;
  primaryColor?: string;
  accentColor?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export type OrderStatus = (typeof import("@/lib/constants").ORDER_STATUSES)[number];
export type PaymentStatus = (typeof import("@/lib/constants").PAYMENT_STATUSES)[number];
