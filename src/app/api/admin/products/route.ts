import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, ensureDb, adminAuth } from "@/lib/api-utils";
import { Product } from "@/models";

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
  const search = searchParams.get("search")?.trim();
  const active = searchParams.get("active");
  const skip = (page - 1) * limit;

  try {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (active === "true") query.active = true;
    if (active === "false") query.active = false;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return apiSuccess({
      items: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return apiError("Failed to fetch products", 500);
  }
}
