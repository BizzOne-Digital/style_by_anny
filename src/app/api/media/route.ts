import { saveMedia } from "@/lib/media";
import { apiSuccess, apiError, ensureDb, adminAuth } from "@/lib/api-utils";

export async function POST(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError("No file provided");
    }

    const alt = (formData.get("alt") as string) || "";
    const result = await saveMedia(file, alt);

    return apiSuccess(result, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return apiError(message);
  }
}
