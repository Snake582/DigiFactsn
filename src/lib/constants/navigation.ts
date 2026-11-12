import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Receipt as ReceiptIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Factures", href: "/factures", icon: FileText },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Produits & Services", href: "/produits", icon: Package },
  { label: "Reçus", href: "/recus", icon: ReceiptIcon },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];
