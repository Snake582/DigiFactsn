"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/cn";

export interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const fieldBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export function Field({
  label,
  error,
  hint,
  htmlFor,
  children,
}: FieldProps & { htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={cn(fieldBase, error ? "border-red-400" : "border-slate-300", className)}
          {...props}
        />
      </Field>
    );
  },
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, error, hint, className, id, rows = 3, ...props }, ref) => {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={!!error}
        className={cn(fieldBase, error ? "border-red-400" : "border-slate-300", className)}
        {...props}
      />
    </Field>
  );
});
Textarea.displayName = "Textarea";
