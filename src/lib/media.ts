import { connectDB } from "@/lib/mongodb";
import { Media } from "@/models";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";

export {
  getMediaUrl,
  resolveMediaSrc,
  resolveAbsoluteMediaUrl,
  isExternalMedia,
} from "@/lib/media-url";

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Allowed: JPG, PNG, WEBP, GIF";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "File too large. Maximum size is 8MB";
  }
  return null;
}

export async function saveMedia(
  file: File,
  alt = ""
): Promise<{ id: string; filename: string }> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  await connectDB();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const media = await Media.create({
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    data: buffer,
    alt,
  });

  return { id: media._id.toString(), filename };
}

export async function deleteMedia(id: string): Promise<boolean> {
  await connectDB();
  const result = await Media.findByIdAndDelete(id);
  return !!result;
}

export async function getMediaById(id: string) {
  await connectDB();
  return Media.findById(id).lean();
}
