import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "gray" | "blue" | "green" | "orange" | "red";

const tones: Record<BadgeTone, string> = {
  gray: "bg-slate-100 text-slate-700",
  blue: "bg-brand-50 text-brand-700",
  green: "bg-emerald-50 text-emerald-700",
  orange: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export function Badge({ tone = "gray", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
