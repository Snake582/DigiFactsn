import type { ZodError } from "zod";
import type { FieldErrors } from "@/types/common.types";

/** Transforme une erreur Zod en { "champ": "message" } (premier message par champ). */
export function zodErrors(error: ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
