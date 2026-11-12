import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const tones = {
  blue: { card: "bg-brand-50 border-brand-100", icon: "bg-brand-100 text-brand-600" },
  green: { card: "bg-emerald-50 border-emerald-100", icon: "bg-emerald-100 text-emerald-600" },
  orange: { card: "bg-amber-50 border-amber-100", icon: "bg-amber-100 text-amber-600" },
  red: { card: "bg-red-50 border-red-100", icon: "bg-red-100 text-red-600" },
};

interface StatsCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone: keyof typeof tones;
}

export function StatsCard({ label, value, hint, icon: Icon, tone }: StatsCardProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 rounded-2xl border p-5", tones[tone].card)}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-1 truncate text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones[tone].icon)}>
        <Icon size={20} />
      </div>
    </div>
  );
}
