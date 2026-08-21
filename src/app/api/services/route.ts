import { connectDB } from "@/lib/mongodb";
import { getActiveServices } from "@/lib/data";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validation";
import { Service } from "@/models";

export async function GET() {
  const dbError = ensureDb();
  if (dbError) return dbError;

  try {
    const services = await getActiveServices();
    return apiSuccess(services);
  } catch (error) {
    console.error("Services GET error:", error);
    return apiError("Failed to fetch services", 500);
  }
}

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const service = await Service.create(parsed.data);
    return apiSuccess(service, 201);
  } catch (error) {
    console.error("Services POST error:", error);
    return apiError("Failed to create service", 500);
  }
}
