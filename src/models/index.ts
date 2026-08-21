import mongoose, { Schema, models, model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    lastLogin: Date,
  },
  { timestamps: true }
);

export const Admin = models.Admin || model("Admin", AdminSchema);

const MediaSchema = new Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    alt: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Media = models.Media || model("Media", MediaSchema);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ active: 1, displayOrder: 1 });

export const Category = models.Category || model("Category", CategorySchema);

const ProductVariantSchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, default: "" },
  price: { type: Number },
  stock: { type: Number, default: 0 },
  image: { type: String, default: "" },
});

const ProductImageSchema = new Schema({
  mediaId: { type: String, required: true },
  alt: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    salePrice: { type: Number },
    images: [ProductImageSchema],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String }],
    variants: [ProductVariantSchema],
    stockQuantity: { type: Number, default: 0 },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "low_stock"],
      default: "in_stock",
    },
    isDemo: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    specifications: { type: Map, of: String, default: {} },
    careInstructions: { type: String, default: "" },
    shippingInfo: { type: String, default: "" },
    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: "cm" },
    },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    difficultyLevel: { type: String, default: "" },
    lightRequirements: { type: String, default: "" },
    wateringInfo: { type: String, default: "" },
    careLevel: { type: String, default: "" },
    suitableRoom: { type: String, default: "" },
    plantSize: { type: String, default: "" },
    petSafety: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ name: "text", tags: "text", sku: "text" });
ProductSchema.index({ active: 1, featured: 1 });
ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ price: 1 });

export const Product = models.Product || model("Product", ProductSchema);

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: String, default: "" },
  name: { type: String, required: true },
  sku: { type: String, default: "" },
  variantName: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: "" },
});

const AddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String, default: "" },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: "CA" },
});

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    stripeSessionId: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },
    couponCode: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ email: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = models.Order || model("Order", OrderSchema);

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

export const Customer = models.Customer || model("Customer", CustomerSchema);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    ctaText: { type: String, default: "Learn More" },
    ctaUrl: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = models.Service || model("Service", ServiceSchema);

const PageSectionSchema = new Schema({
  key: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  ctaText: { type: String, default: "" },
  ctaUrl: { type: String, default: "" },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  data: { type: Schema.Types.Mixed, default: {} },
});

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    sections: [PageSectionSchema],
  },
  { timestamps: true }
);

export const Page = models.Page || model("Page", PageSchema);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    author: { type: String, default: "Anne" },
    category: { type: String, default: "" },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ published: 1, publishedAt: -1 });
BlogPostSchema.index({ title: "text", content: "text", tags: "text" });

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);

const TestimonialSchema = new Schema(
  {
    customerName: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5 },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial =
  models.Testimonial || model("Testimonial", TestimonialSchema);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQ = models.FAQ || model("FAQ", FAQSchema);

const PricingPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number },
    billingPeriod: { type: String, default: "one-time" },
    features: [{ type: String }],
    ctaText: { type: String, default: "Get Started" },
    ctaUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PricingPlan =
  models.PricingPlan || model("PricingPlan", PricingPlanSchema);

const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    orderNumber: { type: String, default: "" },
    inquiryType: { type: String, default: "" },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactSubmission =
  models.ContactSubmission || model("ContactSubmission", ContactSubmissionSchema);

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountAmount: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    maxUsage: { type: Number },
  },
  { timestamps: true }
);

export const Coupon = models.Coupon || model("Coupon", CouponSchema);

const SiteSettingsSchema = new Schema(
  {
    brandName: { type: String, default: "Plant & Style by Anne" },
    tagline: {
      type: String,
      default: "Incorporating plants and interior design at home",
    },
    email: { type: String, default: "plantstyleinc@gmail.com" },
    phone: { type: String, default: "(403) 978-8177" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    currency: { type: String, default: "CAD" },
    lowStockThreshold: { type: Number, default: 5 },
    defaultSeoTitle: {
      type: String,
      default: "Plant & Style by Anne | Plants & Interior Design",
    },
    defaultSeoDescription: {
      type: String,
      default:
        "Discover beautifully curated plants and styling services that bring nature into your home with elegance.",
    },
    footerText: {
      type: String,
      default: "Bringing plants and interior design together for over 6 years.",
    },
    socialLinks: [
      {
        platform: String,
        url: { type: String, default: "" },
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    shippingFlatRate: { type: Number },
    taxRate: { type: Number },
    primaryColor: { type: String, default: "#4A2C6E" },
    accentColor: { type: String, default: "#E8E0F0" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export type IProduct = mongoose.InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type ICategory = mongoose.InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};
export type IOrder = mongoose.InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};
