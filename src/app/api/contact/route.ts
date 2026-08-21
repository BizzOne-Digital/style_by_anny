import { connectDB } from "@/lib/mongodb";
import { ContactSubmission } from "@/models";
import { contactSchema } from "@/lib/validation";
import { apiSuccess, apiError, ensureDb, parseBody } from "@/lib/api-utils";

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const body = await parseBody<unknown>(request);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    await connectDB();
    const submission = await ContactSubmission.create(parsed.data);
    return apiSuccess(submission, 201);
  } catch (error) {
    console.error("Contact POST error:", error);
    return apiError("Failed to submit contact form", 500);
  }
}
