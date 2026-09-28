export function text(value, max, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized.length > max ? normalized.slice(0, max) : normalized || fallback;
}

export function safeHttpUrl(value, { allowRelative = false } = {}) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (allowRelative && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function safePageKey(value, allowed) {
  const key = String(value ?? "").trim();
  return allowed.has(key) ? key : "";
}
