"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { seedDemoData } from "@/lib/storage/seed-demo";

/** Charge des données d'exemple puis ouvre le tableau de bord. */
export function DemoButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={buttonClasses({ variant: "outline", size: "lg", className })}
      onClick={() => {
        seedDemoData();
        router.push("/dashboard");
      }}
    >
      <Play size={16} className="fill-current" /> Voir la démo
    </button>
  );
}
