"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ClientForm } from "@/features/clients/components/client-form";
import { clientService } from "@/features/clients/services/client.service";

export default function NewClientPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Nouveau client" />
      <Card className="max-w-3xl">
        <ClientForm
          cancelHref="/clients"
          onSubmit={(values) => { clientService.create(values); router.push("/clients"); }}
        />
      </Card>
    </>
  );
}
