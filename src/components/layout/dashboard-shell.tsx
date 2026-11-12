"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { Header } from "./header";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64">
      <Sidebar />
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Header onMenu={() => setMenuOpen(true)} />
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
