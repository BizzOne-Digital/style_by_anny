import { connectDB } from "@/lib/mongodb";
import { getActivePricingPlans } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { pricingPlanSchema } from "@/lib/validation";
import { PricingPlan } from "@/models";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  try {
    const plans = await getActivePricingPlans();
    return apiSuccess(plans);
  } catch (error) {
    console.error("Pricing GET error:", error);
    return apiError("Failed to fetch pricing plans", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = pricingPlanSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const plan = await PricingPlan.create(parsed.data);
    return apiSuccess(plan, 201);
  } catch (error) {
    console.error("Pricing POST error:", error);
    return apiError("Failed to create pricing plan", 500);
  }
}
