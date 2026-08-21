import { connectDB } from "@/lib/mongodb";
import {
  createSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { apiSuccess, apiError, ensureDb, parseBody } from "@/lib/api-utils";
import { loginSchema } from "@/lib/validation";
import { Admin } from "@/models";

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const body = await parseBody<unknown>(request);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  const { email, password } = parsed.data;

  try {
    await connectDB();
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return apiError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return apiError("Invalid email or password", 401);
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = await createSession(admin._id.toString());
    await setSessionCookie(token);

    return apiSuccess({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Login failed", 500);
  }
}
