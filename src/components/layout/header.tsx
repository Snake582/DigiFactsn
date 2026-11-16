"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { buttonClasses } from "@/components/ui/button";

export function Header({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white/90 px-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button onClick={onMenu} aria-label="Ouvrir le menu" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
          <Menu size={22} />
        </button>
        <span className="truncate font-semibold text-slate-900">{current?.label ?? "DigiFact"}</span>
      </div>
      <Link href="/factures/nouvelle" className={buttonClasses({ size: "md" })}>
        <Plus size={16} /> <span className="hidden sm:inline">Nouvelle facture</span><span className="sm:hidden">Facture</span>
      </Link>
    </header>
  );
}
