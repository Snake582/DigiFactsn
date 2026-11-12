"use client";

import { useRef, useState } from "react";
import { Database, Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { storage } from "@/lib/storage/storage";
import { seedDemoData } from "@/lib/storage/seed-demo";

export function PreferencesForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDemo, setConfirmDemo] = useState(false);

  function exportData() {
    const blob = new Blob([JSON.stringify(storage.exportAll(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digifact-sauvegarde-${new Date().toLocaleDateString("en-CA")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Sauvegarde téléchargée.");
  }

  async function importData(file?: File) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (typeof data !== "object" || data === null) throw new Error();
      storage.importAll(data as Record<string, unknown>);
      setMessage("Sauvegarde restaurée.");
    } catch {
      setMessage("Fichier invalide : choisissez une sauvegarde DigiFact (.json).");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <Card>
      <CardTitle>Vos données</CardTitle>
      <p className="mb-4 text-sm text-slate-500">
        Tout est enregistré dans ce navigateur. Si vous videz les données du navigateur ou changez d'appareil, elles seront perdues : téléchargez régulièrement une sauvegarde.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={exportData}><Download size={16} /> Télécharger une sauvegarde</Button>
        <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload size={16} /> Restaurer une sauvegarde</Button>
        <Button variant="outline" onClick={() => setConfirmDemo(true)}><Database size={16} /> Charger des données de démo</Button>
        <Button variant="danger" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Tout effacer</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => importData(e.target.files?.[0])} />
      </div>
      {message && <p role="status" className="mt-3 text-sm font-medium text-brand-700">{message}</p>}

      <ConfirmDialog open={confirmReset} title="Tout effacer ?" confirmLabel="Tout effacer"
        description="Clients, produits, factures, reçus et paramètres seront supprimés de cet appareil. Cette action est irréversible."
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => { storage.clearAll(); setConfirmReset(false); setMessage("Toutes les données ont été effacées."); }} />
      <ConfirmDialog open={confirmDemo} title="Charger les données de démo ?" confirmLabel="Charger"
        description="Vos clients, produits, factures et reçus actuels seront remplacés par des exemples. Vos paramètres d'entreprise sont conservés."
        onCancel={() => setConfirmDemo(false)}
        onConfirm={() => { seedDemoData(); setConfirmDemo(false); setMessage("Données de démo chargées."); }} />
    </Card>
  );
}
