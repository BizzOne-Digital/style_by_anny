import { connectDB } from "@/lib/mongodb";
import { getActiveTestimonials } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { testimonialSchema } from "@/lib/validation";
import { Testimonial } from "@/models";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  try {
    const testimonials = await getActiveTestimonials();
    return apiSuccess(testimonials);
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return apiError("Failed to fetch testimonials", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.create(parsed.data);
    return apiSuccess(testimonial, 201);
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return apiError("Failed to create testimonial", 500);
  }
}
