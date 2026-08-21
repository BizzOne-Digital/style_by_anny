import { NextResponse } from "next/server";
import { isDBConfigured } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data } satisfies ApiResponse<T>, {
    status,
  });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message } satisfies ApiResponse,
    { status }
  );
}

export function unauthorized() {
  return apiError("Unauthorized", 401);
}

export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function ensureDb() {
  if (!isDBConfigured()) {
    return apiError("Database not configured", 503);
  }
  return null;
}

export async function adminAuth(): Promise<
  | { session: { adminId: string; role: string }; error: null }
  | { session: null; error: ReturnType<typeof unauthorized> }
> {
  try {
    const session = await requireAdmin();
    return { session, error: null };
  } catch {
    return { session: null, error: unauthorized() };
  }
}

/** Allow CLI/dev re-seeding when SEED_SECRET header matches .env */
export function verifySeedSecret(request: Request): boolean {
  const secret = process.env.SEED_SECRET;
  if (!secret) return false;
  return request.headers.get("x-seed-secret") === secret;
}

export async function adminOrSeedSecret(
  request: Request
): Promise<
  | { authorized: true; error: null }
  | { authorized: false; error: ReturnType<typeof unauthorized> }
> {
  if (verifySeedSecret(request)) {
    return { authorized: true, error: null };
  }
  const { error } = await adminAuth();
  if (error) return { authorized: false, error };
  return { authorized: true, error: null };
}
