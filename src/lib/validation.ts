import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  orderNumber: z.string().optional(),
  inquiryType: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  compareAtPrice: z.number().optional(),
  salePrice: z.number().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stockQuantity: z.number().min(0).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  careInstructions: z.string().optional(),
  shippingInfo: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
});

export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  shippingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().default("CA"),
  }),
  billingAddress: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      address1: z.string().min(1),
      address2: z.string().optional(),
      city: z.string().min(1),
      province: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().default("CA"),
    })
    .optional(),
  sameAsShipping: z.boolean().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  text: z.string().min(1, "Testimonial text is required"),
  rating: z.number().min(1).max(5).optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
});

export const pricingPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.number().optional(),
  billingPeriod: z.string().optional(),
  features: z.array(z.string()).optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
});
