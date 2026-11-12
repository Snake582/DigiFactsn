import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DigiFactsn - Votre facturation, simplifiée",
  description:
    "Créez, gérez et suivez vos factures directement dans le navigateur. Sans inscription, 100 % gratuit, stockage local et PDF intégré.",
    icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#1553f5" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
