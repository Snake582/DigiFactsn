"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

/** Menu déroulant de la page d'accueil, visible uniquement sous 1024 px. */
export function LandingMobileNav({ links }: { links: string[][] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="rounded-lg p-2 text-slate-700 hover:bg-brand-50"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <nav aria-label="Sections de la page" className="absolute inset-x-0 top-full border-b border-brand-100 bg-white px-4 py-3 shadow-lg">
          <ul className="mx-auto max-w-7xl space-y-1">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-brand-50">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
