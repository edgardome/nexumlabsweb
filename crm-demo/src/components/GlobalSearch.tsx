import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { usePatients } from "../store/patients";
import { Avatar } from "./ui";
import { withCountry } from "../lib/format";

export function GlobalSearch() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return patients
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(term) ||
          p.telefono.includes(term) ||
          p.ciudad.toLowerCase().includes(term)
      )
      .slice(0, 6);
  }, [q, patients]);

  const go = (id: string) => {
    setQ("");
    setFocused(false);
    navigate(`/pacientes/${id}`);
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          blurTimer.current = window.setTimeout(() => setFocused(false), 120);
        }}
        placeholder="Buscar paciente…"
        className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-soft)]"
      />
      {focused && q.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">Sin coincidencias</p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => {
                  if (blurTimer.current) window.clearTimeout(blurTimer.current);
                }}
                onClick={() => go(p.id)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-50"
              >
                <Avatar name={p.nombre} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{p.nombre}</p>
                  <p className="truncate text-xs text-slate-400">{withCountry(p.telefono)} · {p.ciudad}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
