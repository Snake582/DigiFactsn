import { PageHeader } from "@/components/layout/page-header";
import { CompanyForm } from "@/features/settings/components/company-form";
import { PreferencesForm } from "@/features/settings/components/preferences-form";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Paramètres" description="Ces informations apparaissent sur vos factures et vos reçus." />
      <div className="max-w-4xl space-y-6">
        <CompanyForm />
        <PreferencesForm />
      </div>
    </>
  );
}
