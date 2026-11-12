import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { ClientList } from "@/features/clients/components/client-list";

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        description="Ajoutez, modifiez et retrouvez vos clients."
        actions={<Link href="/clients/nouveau" className={buttonClasses()}><Plus size={16} /> Nouveau client</Link>}
      />
      <ClientList />
    </>
  );
}
