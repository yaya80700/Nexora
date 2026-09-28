const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 3;

export function validateAttachments(files) {
  const list = (files || []).filter((f) => f && typeof f === "object" && typeof f.size === "number" && f.size > 0);
  if (list.length > MAX_FILES) throw new Error(`3 fichiers maximum.`);
  for (const file of list) {
    if (file.size > MAX_SIZE) throw new Error(`Le fichier « ${file.name || "sans nom"} » dépasse 10 Mo.`);
    if (!ALLOWED.has(file.type)) throw new Error(`Le type de fichier « ${file.type || "inconnu"} » n'est pas autorisé.`);
  }
  return list;
}

export async function uploadRequestAttachments(supabase, files, userId, requestId, messageId = null, storageOwnerId = userId) {
  const list = validateAttachments(files);
  const uploaded = [];
  try {
    for (const file of list) {
      const original = String(file.name || "fichier").replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = original.includes(".") ? original.split(".").pop().toLowerCase() : "bin";
      const path = `requests/${storageOwnerId}/${requestId}/${messageId ? `messages/${messageId}/` : "initial/"}${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("nexora-attachments").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (error) throw error;
      uploaded.push({ name: original, path, size: file.size, type: file.type || "application/octet-stream" });
    }
    return uploaded;
  } catch (error) {
    if (uploaded.length) {
      await supabase.storage.from("nexora-attachments").remove(uploaded.map((file) => file.path));
    }
    throw error;
  }
}

export const attachmentLimits = { maxFiles: MAX_FILES, maxSize: MAX_SIZE };
