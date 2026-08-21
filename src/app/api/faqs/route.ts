import { connectDB } from "@/lib/mongodb";
import { getActiveFAQs } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { faqSchema } from "@/lib/validation";
import { FAQ } from "@/models";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  try {
    const faqs = await getActiveFAQs();
    return apiSuccess(faqs);
  } catch (error) {
    console.error("FAQs GET error:", error);
    return apiError("Failed to fetch FAQs", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const faq = await FAQ.create(parsed.data);
    return apiSuccess(faq, 201);
  } catch (error) {
    console.error("FAQs POST error:", error);
    return apiError("Failed to create FAQ", 500);
  }
}
