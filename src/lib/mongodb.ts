import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastError: Error | null;
  lastAttempt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  lastError: null,
  lastAttempt: 0,
};
global.mongooseCache = cached;

const RETRY_COOLDOWN_MS = 15_000;
const HARD_CONNECT_TIMEOUT_MS = 5_000;

const connectionOptions = {
  dbName: process.env.MONGODB_DB || "plant_style",
  bufferCommands: false,
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 5_000,
  socketTimeoutMS: 30_000,
  // Helps on Windows networks with IPv6/DNS issues
  family: 4 as const,
};

function markConnectionFailed(error: Error) {
  cached.lastError = error;
  cached.lastAttempt = Date.now();
  cached.promise = null;
  cached.conn = null;
}

async function connectWithHardTimeout(): Promise<typeof mongoose> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      connectDB(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("MongoDB connection timed out")),
          HARD_CONNECT_TIMEOUT_MS
        );
      }),
    ]);
  } catch (error) {
    markConnectionFailed(
      error instanceof Error ? error : new Error("MongoDB unavailable")
    );
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function isDBConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function getLastDbError(): Error | null {
  return cached.lastError;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  const now = Date.now();
  if (
    cached.lastError &&
    now - cached.lastAttempt < RETRY_COOLDOWN_MS
  ) {
    throw cached.lastError;
  }

  if (!cached.promise) {
    cached.lastAttempt = now;
    cached.promise = mongoose
      .connect(MONGODB_URI, connectionOptions)
      .then((conn) => {
        cached.lastError = null;
        return conn;
      })
      .catch((error: Error) => {
        cached.lastError = error;
        cached.promise = null;
        console.error("[MongoDB] Connection failed:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/** Returns true if DB is reachable; false if not (does not throw). */
export async function tryConnectDB(): Promise<boolean> {
  if (!isDBConfigured()) return false;
  if (cached.conn) return true;

  if (cached.lastError && Date.now() - cached.lastAttempt < RETRY_COOLDOWN_MS) {
    return false;
  }

  try {
    await connectWithHardTimeout();
    return true;
  } catch {
    return false;
  }
}
