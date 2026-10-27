const MAX_DIMENSION = 1920;
const QUALITY = 0.82;

// GIFs could be animated and PDFs aren't images, so only these get re-encoded.
const COMPRESSIBLE_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Downscales images to MAX_DIMENSION and re-encodes them as WebP.
 * Returns the original file if compression doesn't make it smaller.
 */
export async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE_TYPES.includes(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );
    // Safari falls back to PNG when WebP encoding isn't supported.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}
