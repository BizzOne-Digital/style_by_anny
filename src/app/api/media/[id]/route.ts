import { NextResponse } from "next/server";
import { deleteMedia, getMediaById } from "@/lib/media";
import { apiSuccess, apiError, ensureDb, adminAuth } from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { id } = await params;

  try {
    const media = await getMediaById(id);
    if (!media) {
      return apiError("Media not found", 404);
    }

    return new NextResponse(Buffer.from(media.data), {
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": media.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Media GET error:", error);
    return apiError("Failed to fetch media", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  try {
    const deleted = await deleteMedia(id);
    if (!deleted) {
      return apiError("Media not found", 404);
    }

    return apiSuccess({ message: "Media deleted" });
  } catch (error) {
    console.error("Media DELETE error:", error);
    return apiError("Failed to delete media", 500);
  }
}
