export function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Génère le prochain numéro, ex. FAC-2026-0007. */
export function nextDocumentNumber(prefix: string, existing: string[], year = new Date().getFullYear()) {
  const safe = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${safe}-${year}-(\\d+)$`);
  let max = 0;
  for (const number of existing) {
    const match = pattern.exec(number);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return `${prefix}-${year}-${String(max + 1).padStart(4, "0")}`;
}
