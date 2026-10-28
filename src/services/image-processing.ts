export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export interface PreparedImage {
  blob: Blob;
  width: number;
  height: number;
}

/** Decode and re-encode raster files; no SVG, HTML or remote upload service. */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choisissez une image JPEG, PNG ou WebP.");
  if (!file.size || file.size > MAX_UPLOAD_BYTES)
    throw new Error("L’image doit peser au maximum 5 Mo.");
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const valid =
    file.type === "image/jpeg"
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : file.type === "image/png"
        ? [137, 80, 78, 71, 13, 10, 26, 10].every(
            (value, index) => bytes[index] === value,
          )
        : String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!valid)
    throw new Error("Ce fichier ne correspond pas au format d’image annoncé.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Cette image est illisible. Choisissez un autre fichier.");
  }
  try {
    if (bitmap.width * bitmap.height > 24_000_000)
      throw new Error(
        "L’image dépasse 24 mégapixels. Réduisez ses dimensions avant de l’ajouter.",
      );
    const ratio = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * ratio));
    const height = Math.max(1, Math.round(bitmap.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("La préparation des images est indisponible.");
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("L’image n’a pas pu être compressée.")),
        "image/webp",
        0.82,
      ),
    );
    if (blob.size > 2 * 1024 * 1024)
      throw new Error(
        "L’image reste trop volumineuse après compression. Choisissez un fichier plus léger.",
      );
    return { blob, width, height };
  } finally {
    bitmap.close();
  }
}
