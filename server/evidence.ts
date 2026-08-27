import { storagePut } from "./storage";

const allowedMimeTypes = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain"]);
const MAX_FILE_BYTES = 7 * 1024 * 1024;

export function validateEvidenceFile(input: { fileName: string; mimeType: string; dataBase64: string }) {
  if (!allowedMimeTypes.has(input.mimeType)) throw new Error("Unsupported evidence file type");
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._ -]{0,119}$/.test(input.fileName)) throw new Error("Invalid evidence file name");
  if (!/^[A-Za-z0-9+/=]+$/.test(input.dataBase64)) throw new Error("Invalid evidence encoding");
  const bytes = Buffer.from(input.dataBase64, "base64");
  if (!bytes.length || bytes.length > MAX_FILE_BYTES) throw new Error("Evidence file must be between 1 byte and 7 MB");
  return bytes;
}

export async function storeEvidenceFile(userId: number, projectId: string, input: { fileName: string; mimeType: string; dataBase64: string }) {
  const bytes = validateEvidenceFile(input);
  const safeName = input.fileName.replace(/\s+/g, "-");
  return storagePut(`ux-academy/evidence/${userId}/${projectId}/${safeName}`, bytes, input.mimeType);
}
