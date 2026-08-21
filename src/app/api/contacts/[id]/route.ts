import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
} from "@/lib/api-utils";
import { ContactSubmission } from "@/models";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Contact not found", 404);
  }

  try {
    await connectDB();
    const contact = await ContactSubmission.findByIdAndDelete(id);

    if (!contact) {
      return apiError("Contact not found", 404);
    }

    return apiSuccess({ message: "Contact deleted" });
  } catch (error) {
    console.error("Contact DELETE error:", error);
    return apiError("Failed to delete contact", 500);
  }
}
