"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SidebarContent } from "./sidebar";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
        <SidebarContent onNavigate={onClose} />
        <button onClick={onClose} aria-label="Fermer le menu" className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-300 hover:bg-white/10">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
