import {
  LayoutDashboard,
  Calendar,
  CalendarRange,
  Sparkles,
  Users,
  Percent,
  Wallet,
  Receipt,
  Package,
  ClipboardList,
  Bot,
  MessageSquare,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: "estrella";
}

export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/citas", label: "Citas", icon: Calendar },
  { to: "/calendario", label: "Calendario", icon: CalendarRange },
  { to: "/tratamientos", label: "Tratamientos", icon: Sparkles },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/comisiones", label: "Comisiones", icon: Percent },
  { to: "/cartera", label: "Cartera", icon: Wallet },
  { to: "/egresos", label: "Egresos", icon: Receipt },
  { to: "/inventario", label: "Inventario", icon: Package },
  { to: "/procedimientos", label: "Procedimientos", icon: ClipboardList },
  { to: "/agente-ia", label: "Agente IA", icon: Bot },
  { to: "/conversaciones", label: "Conversaciones", icon: MessageSquare, badge: "estrella" },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
];
