import { NavLink } from "react-router-dom";
import { clinic } from "../config/clinic";
import { navItems } from "./nav";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-ink text-slate-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-ink"
          style={{ background: clinic.acento }}
        >
          {clinic.iniciales}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">{clinic.nombre}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            CRM
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                    style={{ background: clinic.acento }}
                  />
                )}
                <item.icon
                  className="h-[18px] w-[18px] shrink-0"
                  style={isActive ? { color: clinic.acento } : undefined}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge === "estrella" && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink"
                    style={{ background: clinic.acento }}
                  >
                    Live
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-[11px] text-slate-500">
          Powered by <span className="text-slate-300">NexumLabs</span>
        </p>
      </div>
    </div>
  );
}
