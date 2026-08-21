import { connectDB } from "@/lib/mongodb";
import { getPublishedBlogPosts } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { blogPostSchema } from "@/lib/validation";
import { BlogPost } from "@/models";

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 9);

  try {
    const result = await getPublishedBlogPosts(page, limit);
    return apiSuccess(result);
  } catch (error) {
    console.error("Blog GET error:", error);
    return apiError("Failed to fetch blog posts", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();

    const existing = await BlogPost.findOne({ slug: parsed.data.slug });
    if (existing) {
      return apiError("A blog post with this slug already exists");
    }

    const postData = {
      ...parsed.data,
      publishedAt: parsed.data.published ? new Date() : undefined,
    };

    const post = await BlogPost.create(postData);
    return apiSuccess(post, 201);
  } catch (error) {
    console.error("Blog POST error:", error);
    return apiError("Failed to create blog post", 500);
  }
}
