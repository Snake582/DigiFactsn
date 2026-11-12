"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Field, fieldBase, type FieldProps } from "./input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldProps>(
  ({ label, error, hint, className, id, children, ...props }, ref) => {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <Field label={label} error={error} hint={hint} htmlFor={fieldId}>
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={cn(fieldBase, "appearance-auto", error ? "border-red-400" : "border-slate-300", className)}
          {...props}
        >
          {children}
        </select>
      </Field>
    );
  },
);
Select.displayName = "Select";
