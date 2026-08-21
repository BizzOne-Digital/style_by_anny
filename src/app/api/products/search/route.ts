import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, ensureDb } from "@/lib/api-utils";
import { Product } from "@/models";

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);

  if (!q) {
    return apiError("Search query is required");
  }

  try {
    await connectDB();
    const products = await Product.find(
      { active: true, $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .populate("category", "name slug")
      .lean();

    return apiSuccess({ items: products, query: q });
  } catch (error) {
    console.error("Product search error:", error);
    return apiError("Search failed", 500);
  }
}
