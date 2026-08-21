import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { z } from "zod";
import {
  apiSuccess,
  apiError,
  ensureDb,
  adminAuth,
  parseBody,
} from "@/lib/api-utils";
import { ContactSubmission } from "@/models";

const contactUpdateSchema = z.object({
  id: z.string().min(1),
  read: z.boolean().optional(),
  replied: z.boolean().optional(),
});

export async function GET(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 20);
  const unreadOnly = searchParams.get("unread") === "true";
  const skip = (page - 1) * limit;

  try {
    await connectDB();

    const query: Record<string, boolean> = {};
    if (unreadOnly) {
      query.read = false;
    }

    const [contacts, total] = await Promise.all([
      ContactSubmission.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactSubmission.countDocuments(query),
    ]);

    return apiSuccess({
      items: contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Contacts GET error:", error);
    return apiError("Failed to fetch contacts", 500);
  }
}

export async function PUT(request: Request) {
  const dbError = ensureDb();
  if (dbError) return dbError;

  const { error: authError } = await adminAuth();
  if (authError) return authError;

  const body = await parseBody<unknown>(request);
  const parsed = contactUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Invalid input");
  }

  const { id, read, replied } = parsed.data;

  if (!mongoose.isValidObjectId(id)) {
    return apiError("Contact not found", 404);
  }

  try {
    await connectDB();

    const update: Record<string, boolean> = {};
    if (read !== undefined) update.read = read;
    if (replied !== undefined) update.replied = replied;

    const contact = await ContactSubmission.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!contact) {
      return apiError("Contact not found", 404);
    }

    return apiSuccess(contact);
  } catch (error) {
    console.error("Contacts PUT error:", error);
    return apiError("Failed to update contact", 500);
  }
}
