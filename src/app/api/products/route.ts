import { connectDB } from "@/lib/mongodb";
import { getProducts } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { productSchema } from "@/lib/validation";
import { Product } from "@/models";

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { searchParams } = new URL(request.url);

  try {
    const result = await getProducts({
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      featured: searchParams.get("featured") === "true",
      onSale: searchParams.get("onSale") === "true",
      inStock: searchParams.get("inStock") === "true",
      sort: searchParams.get("sort") || undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      limit: searchParams.get("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
    });

    return apiSuccess(result);
  } catch (error) {
    console.error("Products GET error:", error);
    return apiError("Failed to fetch products", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    const existing = await Product.findOne({ slug: parsed.data.slug });
    if (existing) {
      return apiError("A product with this slug already exists");
    }

    const product = await Product.create(parsed.data);
    return apiSuccess(product, 201);
  } catch (error) {
    console.error("Products POST error:", error);
    return apiError("Failed to create product", 500);
  }
}
