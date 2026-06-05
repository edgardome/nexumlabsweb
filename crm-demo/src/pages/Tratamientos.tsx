import { useMemo, useState } from "react";
import { Clock, Sparkles } from "lucide-react";
import { PageHeader, Card, Badge, SearchInput, EmptyState } from "../components/ui";
import { money } from "../lib/format";
import { treatments } from "../data/treatments";
import type { TreatmentCategory } from "../data/types";

const categorias: ("Todas" | TreatmentCategory)[] = [
  "Todas",
  "Toxina botulínica",
  "Rellenos",
  "Bioestimulación",
  "Hilos tensores",
  "Facial",
  "Láser",
];

const catTone: Record<TreatmentCategory, "accent" | "violet" | "blue" | "emerald" | "amber"> = {
  "Toxina botulínica": "accent",
  Rellenos: "violet",
  Bioestimulación: "emerald",
  "Hilos tensores": "blue",
  Facial: "amber",
  Láser: "blue",
};

export default function Tratamientos() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"Todas" | TreatmentCategory>("Todas");

  const list = useMemo(() => {
    const term = q.toLowerCase();
    return treatments.filter(
      (t) =>
        (cat === "Todas" || t.categoria === cat) &&
        (t.nombre.toLowerCase().includes(term) || t.descripcion.toLowerCase().includes(term))
    );
  }, [q, cat]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tratamientos"
        subtitle="Catálogo de procedimientos estéticos y tarifas."
        actions={<SearchInput value={q} onChange={setQ} placeholder="Buscar tratamiento…" className="w-64" />}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              cat === c
                ? "bg-ink text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Card className="p-6">
          <EmptyState icon={<Sparkles className="h-6 w-6" />} title="Sin tratamientos" hint="Ajusta la búsqueda o el filtro." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Card key={t.id} className="flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  <Sparkles className="h-5 w-5" />
                </span>
                <Badge tone={catTone[t.categoria]}>{t.categoria}</Badge>
              </div>
              <h3 className="text-base font-semibold leading-snug text-ink">{t.nombre}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500">{t.descripcion}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {t.duracionMin} min
                </span>
                <span className="text-lg font-semibold text-ink">{money(t.precio)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
