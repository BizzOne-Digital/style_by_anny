import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { apiSuccess, apiError, ensureDb, adminOrSeedSecret } from "@/lib/api-utils";
import { seedDemoContent } from "@/lib/seed-demo-content";
import { Admin, SiteSettings } from "@/models";

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const adminEmail = process.env.ADMIN_EMAIL || "admin@plantstylebyanne.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return apiError(
      "ADMIN_PASSWORD environment variable is required for seeding"
    );
  }

  try {
    await connectDB();
    const adminCount = await Admin.countDocuments();

    // First run: no admin yet — allow without login.
    // After that: require admin session OR SEED_SECRET header.
    if (adminCount > 0) {
      const { error: authError } = await adminOrSeedSecret(request);
      if (authError) {
        return apiError(
          "Unauthorized. Log in at /admin/login, use the dashboard button, or set SEED_SECRET in .env.local and pass header x-seed-secret.",
          401
        );
      }
    }

    const results: Record<string, string> = {};

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        name: "Anne",
      });
      results.admin = "created";
    } else {
      results.admin = "already exists";
    }

    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create({});
      results.settings = "created";
    } else {
      results.settings = "already exists";
    }

    const demoResults = await seedDemoContent("refresh");
    results.categories = demoResults.categories;
    results.products = demoResults.products;
    results.homepage = demoResults.homepage;
    results.aboutPage = demoResults.aboutPage;
    results.services = demoResults.services;
    results.settingsLogo = demoResults.settings;

    return apiSuccess({
      message: "Seed completed with temporary demo imagery and catalog",
      results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return apiError("Failed to seed database", 500);
  }
}
