/** Aperçu décoratif du tableau de bord pour la page d'accueil. */
export function HeroMockup() {
  const stats = [
    ["Chiffre d'affaires", "1 250 000 FCFA", "bg-brand-50 border-brand-100"],
    ["Factures payées", "980 000 FCFA", "bg-emerald-50 border-emerald-100"],
    ["En attente", "220 000 FCFA", "bg-amber-50 border-amber-100"],
    ["En retard", "50 000 FCFA", "bg-red-50 border-red-100"],
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl pb-8">
      <div className="overflow-hidden rounded-2xl border-[6px] border-slate-800 bg-white shadow-2xl shadow-brand-600/20">
        <div className="flex">
          <div className="hidden w-28 shrink-0 space-y-2 bg-brand-900 p-3 text-[10px] text-slate-300 sm:block">
            <p className="mb-3 text-xs font-bold text-white">Digi<span className="text-brand-400">Fact</span></p>
            <p className="rounded-md bg-brand-600 px-2 py-1.5 text-white">Dashboard</p>
            {["Factures", "Clients", "Produits", "Reçus", "Paramètres"].map((l) => <p key={l} className="px-2 py-1">{l}</p>)}
          </div>
          <div className="flex-1 space-y-3 p-4">
            <p className="text-sm font-bold text-slate-900">Tableau de bord</p>
            <div className="grid grid-cols-2 gap-2">
              {stats.map(([label, value, cls]) => (
                <div key={label} className={`rounded-lg border p-2 ${cls}`}>
                  <p className="text-[9px] text-slate-500">{label}</p>
                  <p className="text-[11px] font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <svg viewBox="0 0 300 80" className="w-full">
              <path d="M0 60 L50 48 L100 54 L150 32 L200 40 L250 22 L300 14 L300 80 L0 80Z" fill="#1553f5" fillOpacity=".1" />
              <path d="M0 60 L50 48 L100 54 L150 32 L200 40 L250 22 L300 14" fill="none" stroke="#1553f5" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1 w-36 -rotate-6 rounded-lg border border-slate-200 bg-white p-3 shadow-xl sm:-left-6 sm:w-44">
        <p className="text-[10px] font-extrabold text-slate-900">FACTURE</p>
        <div className="mt-2 space-y-1">{[80, 60, 70, 50].map((w) => <div key={w} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}</div>
        <p className="mt-3 rounded bg-brand-600 px-2 py-1 text-[9px] font-bold text-white">Total : 1 230 000 FCFA</p>
      </div>
    </div>
  );
}
