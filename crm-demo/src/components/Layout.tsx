import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Bell, Settings } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./GlobalSearch";
import { SettingsModal } from "./SettingsModal";
import { Avatar } from "./ui";
import { clinic } from "../config/clinic";
import { navItems } from "./nav";

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const current =
    navItems.find((n) => n.to === location.pathname)?.label ??
    (location.pathname.startsWith("/pacientes") ? "Pacientes" : "CRM");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo en escritorio */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar />
      </aside>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 animate-fade-in">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
            <span className="font-medium text-slate-600">{clinic.nombre}</span>
            <span>/</span>
            <span className="text-slate-500">{current}</span>
          </div>

          <div className="ml-auto hidden md:block">
            <GlobalSearch />
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            title="Configuración"
            className="relative ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:ml-0"
          >
            <Settings className="h-5 w-5" />
          </button>

          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2.5 hover:bg-slate-100">
            <Avatar name="Daniela Ortiz" size={32} />
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium text-ink">Daniela Ortiz</p>
              <p className="text-[11px] text-slate-400">Recepción</p>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
