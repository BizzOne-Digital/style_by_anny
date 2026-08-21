import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiError, ensureDb, unauthorized } from "@/lib/api-utils";
import { Admin } from "@/models";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const session = await getSession();
  if (!session) {
    return unauthorized();
  }

  try {
    await connectDB();
    const admin = await Admin.findById(session.adminId)
      .select("-passwordHash")
      .lean();

    if (!admin) {
      return unauthorized();
    }

    return apiSuccess(admin);
  } catch (error) {
    console.error("Auth me error:", error);
    return apiError("Failed to fetch session", 500);
  }
}
