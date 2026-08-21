import { connectDB } from "@/lib/mongodb";
import { getActiveCategories } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { categorySchema } from "@/lib/validation";
import { Category } from "@/models";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  try {
    const categories = await getActiveCategories();
    return apiSuccess(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return apiError("Failed to fetch categories", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    const existing = await Category.findOne({ slug: parsed.data.slug });
    if (existing) {
      return apiError("A category with this slug already exists");
    }

    const category = await Category.create(parsed.data);
    return apiSuccess(category, 201);
  } catch (error) {
    console.error("Categories POST error:", error);
    return apiError("Failed to create category", 500);
  }
}
