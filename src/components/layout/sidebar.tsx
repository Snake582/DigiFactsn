"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DigiFactLogo } from "@/components/brand/digifact-logo";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { APP_VERSION } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-brand-900 px-4 py-6 text-slate-300">
      <Link href="/" className="mb-8 px-2" onClick={onNavigate}>
        <DigiFactLogo variant="light" />
      </Link>
      <nav className="flex-1 space-y-1" aria-label="Navigation principale">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-brand-600 text-white" : "hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <p className="px-2 text-xs leading-relaxed text-slate-400">
        DigiFact v{APP_VERSION}
        <br />
        Données stockées sur cet appareil.
      </p>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
      <SidebarContent />
    </aside>
  );
}
