import { NextRequest } from "next/server";
import { apiSuccess, apiError, parseBody } from "@/lib/api-utils";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<unknown>(request);
    if (!body) return apiError("Invalid request body");

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Validation failed");
    }

    // Newsletter subscriptions can be integrated with a mailing service later
    return apiSuccess({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter error:", error);
    return apiError("Failed to subscribe", 500);
  }
}
