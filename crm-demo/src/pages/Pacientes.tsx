import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ChevronRight, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { PageHeader, Card, Badge, SearchInput, Select, Avatar, EmptyState, Button } from "../components/ui";
import { PatientForm } from "../components/PatientForm";
import { usePatients } from "../store/patients";
import { money, withCountry, formatDate } from "../lib/format";
import { patientStats } from "../data/metrics";
import type { Patient, PatientTag } from "../data/types";

const tagTone: Record<PatientTag, "emerald" | "accent" | "slate"> = {
  Activo: "emerald",
  Nuevo: "accent",
  Inactivo: "slate",
};

const tieneAlergias = (a: string) =>
  a.trim() !== "" && a.trim().toLowerCase() !== "ninguna conocida";

export default function Pacientes() {
  const navigate = useNavigate();
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return patients
      .filter(
        (p) =>
          (tag === "todos" || p.etiqueta === tag) &&
          (p.nombre.toLowerCase().includes(term) ||
            p.telefono.includes(term) ||
            p.ciudad.toLowerCase().includes(term))
      )
      .map((p) => ({ ...p, ...patientStats(p.id) }));
  }, [q, tag, patients]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Patient) => {
    setEditing(p);
    setFormOpen(true);
  };
  const handleSubmit = (p: Patient) => {
    if (editing) updatePatient(p.id, p);
    else addPatient(p);
  };
  const handleDelete = (p: Patient) => {
    if (window.confirm(`¿Eliminar a ${p.nombre}? Esta acción no se puede deshacer.`)) {
      deletePatient(p.id);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pacientes"
        subtitle={`${patients.length} pacientes registrados.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <SearchInput value={q} onChange={setQ} placeholder="Buscar paciente…" className="w-56" />
            <Select value={tag} onChange={setTag}>
              <option value="todos">Todas las etiquetas</option>
              <option value="Activo">Activo</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Inactivo">Inactivo</option>
            </Select>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Nuevo paciente
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={<Users className="h-6 w-6" />} title="Sin resultados" hint="Prueba con otro nombre o crea un paciente." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Paciente</th>
                  <th className="px-5 py-3 font-medium">Teléfono</th>
                  <th className="px-5 py-3 font-medium">Alergias</th>
                  <th className="px-5 py-3 font-medium">Última visita</th>
                  <th className="px-5 py-3 text-right font-medium">Valor gastado</th>
                  <th className="px-5 py-3 font-medium">Etiqueta</th>
                  <th className="px-5 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/pacientes/${p.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.nombre} size={36} />
                        <div>
                          <p className="font-medium text-ink">{p.nombre}</p>
                          <p className="text-xs text-slate-400">{p.ciudad || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{withCountry(p.telefono)}</td>
                    <td className="px-5 py-3">
                      {tieneAlergias(p.alergias) ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                          <AlertTriangle className="h-3 w-3" /> {p.alergias}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Ninguna</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {p.ultimaVisita ? formatDate(p.ultimaVisita) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-ink">{money(p.totalGastado)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={tagTone[p.etiqueta]} dot>{p.etiqueta}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                          title="Editar"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(p); }}
                          title="Eliminar"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <PatientForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initial={editing} />
    </div>
  );
}
