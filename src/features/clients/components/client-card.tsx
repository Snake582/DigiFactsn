import Link from "next/link";
import { Mail, MapPin, Phone, Trash2 } from "lucide-react";
import type { Client } from "@/types/client.types";

export function ClientCard({ client, onDelete }: { client: Client; onDelete: () => void }) {
  const initials = client.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{initials}</div>
        <div className="min-w-0 flex-1">
          <Link href={`/clients/${client.id}`} className="block truncate font-semibold text-slate-900 hover:text-brand-600">{client.name}</Link>
          {client.company && <p className="truncate text-sm text-slate-500">{client.company}</p>}
        </div>
        <button onClick={onDelete} aria-label={`Supprimer ${client.name}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
        {client.email && <li className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /><span className="truncate">{client.email}</span></li>}
        {client.phone && <li className="flex items-center gap-2"><Phone size={14} className="text-slate-400" />{client.phone}</li>}
        {client.city && <li className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" />{client.city}</li>}
      </ul>
    </div>
  );
}
