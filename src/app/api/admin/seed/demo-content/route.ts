import { connectDB } from "@/lib/mongodb";
import { seedDemoContent } from "@/lib/seed-demo-content";
import { apiSuccess, apiError, ensureDb, adminOrSeedSecret } from "@/lib/api-utils";

/**
 * POST /api/admin/seed/demo-content
 * Loads beautiful temporary imagery and demo catalog into the CMS/database.
 * Safe to run after initial seed — refreshes images and demo products.
 */
export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminOrSeedSecret(request);
  if (authError) {
    return apiError(
      "Unauthorized. Log in at /admin/login, use the dashboard button, or set SEED_SECRET in .env.local and pass header x-seed-secret.",
      401
    );
  }

  try {
    await connectDB();
    const results = await seedDemoContent("refresh");

    return apiSuccess({
      message: "Demo content loaded — all images are CMS-managed and replaceable from admin.",
      results,
    });
  } catch (error) {
    console.error("Demo content seed error:", error);
    return apiError("Failed to load demo content", 500);
  }
}
