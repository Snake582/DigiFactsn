import { cn } from "@/lib/utils/cn";

interface LogoProps {
  variant?: "dark" | "light";
  showTagline?: boolean;
  className?: string;
}

export function DigiFactMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M6 4h18c11 0 18 8 18 20s-7 20-18 20H6z" fill="#1553F5" />
      <path d="M14 14h13M14 22h9M14 30h6" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function DigiFactLogo({ variant = "dark", showTagline = false, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <DigiFactMark />
      <span className="leading-none">
        <span className={cn("block text-2xl font-extrabold tracking-tight", variant === "dark" ? "text-brand-900" : "text-white")}>
          Digi<span className={variant === "dark" ? "text-brand-600" : "text-brand-400"}>Fact</span>
        </span>
        {showTagline && <span className="mt-1 block text-xs text-slate-500">Votre facturation, simplifiée.</span>}
      </span>
    </span>
  );
}
