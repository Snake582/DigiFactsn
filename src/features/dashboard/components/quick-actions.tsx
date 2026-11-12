import Link from "next/link";
import { FileText, Package, Receipt, UserPlus } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

const actions = [
  { href: "/factures/nouvelle", label: "Nouvelle facture", icon: FileText },
  { href: "/clients/nouveau", label: "Nouveau client", icon: UserPlus },
  { href: "/produits/nouveau", label: "Nouveau produit", icon: Package },
  { href: "/recus/nouveau", label: "Nouveau reçu", icon: Receipt },
];

export function QuickActions() {
  return (
    <Card>
      <CardTitle>Actions rapides</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
            <Icon size={20} className="text-brand-600" />
            {label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
