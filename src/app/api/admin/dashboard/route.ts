import { getDashboardStats } from "@/lib/data";
import { apiSuccess, apiError, ensureDb, adminAuth } from "@/lib/api-utils";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  try {
    const stats = await getDashboardStats();
    return apiSuccess(stats);
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return apiError("Failed to fetch dashboard stats", 500);
  }
}
