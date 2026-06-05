import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  FileText,
  Pencil,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  ImagePlus,
  Upload,
  X,
  FileDown,
} from "lucide-react";
import { Card, Badge, Button, Avatar } from "../components/ui";
import { PatientForm } from "../components/PatientForm";
import { usePatients } from "../store/patients";
import { useDocuments } from "../store/documents";
import { useAppointments } from "../store/appointments";
import { money, withCountry, waLink, formatDate, formatDateTime } from "../lib/format";
import { imageToDataUrl, fileToDataUrl } from "../lib/files";
import { procedures } from "../data/procedures";
import { trtById } from "../data/treatments";
import { proById } from "../data/professionals";
import { patientStats } from "../data/metrics";
import type { Patient, PatientTag, DocumentKind } from "../data/types";

const tagTone: Record<PatientTag, "emerald" | "accent" | "slate"> = {
  Activo: "emerald",
  Nuevo: "accent",
  Inactivo: "slate",
};

const tieneAlergias = (a: string) =>
  a.trim() !== "" && a.trim().toLowerCase() !== "ninguna conocida";

export default function PacienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { byId, updatePatient, deletePatient } = usePatients();
  const { forPatient, addDocument, deleteDocument } = useDocuments();
  const { appointments } = useAppointments();
  const [editOpen, setEditOpen] = useState(false);

  const pac = id ? byId(id) : undefined;

  if (!pac) {
    return (
      <div className="animate-fade-in">
        <Button variant="outline" onClick={() => navigate("/pacientes")}>
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <p className="mt-6 text-slate-500">Paciente no encontrado.</p>
      </div>
    );
  }

  const stats = patientStats(pac.id);
  const docs = forPatient(pac.id);
  const fotos = docs.filter((d) => d.tipo === "antes" || d.tipo === "despues");
  const documentos = docs.filter((d) => d.tipo === "documento");
  const alergico = tieneAlergias(pac.alergias);

  const historial = procedures
    .filter((p) => p.pacienteId === pac.id)
    .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
  const proximas = appointments
    .filter((a) => a.pacienteId === pac.id && new Date(a.inicio) >= new Date() && a.estado !== "Cancelada")
    .sort((a, b) => +new Date(a.inicio) - +new Date(b.inicio));

  const handleUpload = async (tipo: DocumentKind, file: File) => {
    const dataUrl = tipo === "documento" ? await fileToDataUrl(file) : await imageToDataUrl(file);
    const ok = addDocument({
      id: `doc-${Date.now()}`,
      pacienteId: pac.id,
      tipo,
      titulo: file.name,
      mime: file.type || "application/octet-stream",
      dataUrl,
      fecha: new Date().toISOString(),
    });
    if (!ok)
      alert(
        "No se pudo guardar el archivo: el almacenamiento local del navegador está lleno. Elimina algún archivo e inténtalo de nuevo."
      );
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar a ${pac.nombre}? Esta acción no se puede deshacer.`)) {
      deletePatient(pac.id);
      navigate("/pacientes");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/pacientes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Pacientes
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" /> Editar
          </Button>
          <Button variant="outline" onClick={handleDelete} className="!text-rose-600 hover:!bg-rose-50">
            <Trash2 className="h-4 w-4" /> Eliminar
          </Button>
        </div>
      </div>

      {/* Alerta de alergias — siempre visible */}
      {alergico ? (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <p className="text-sm font-semibold text-rose-800">Alergias / contraindicaciones</p>
            <p className="text-sm text-rose-700">{pac.alergias}</p>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm text-emerald-800">Sin alergias conocidas registradas.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Izquierda — perfil */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <Avatar name={pac.nombre} size={56} />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-ink">{pac.nombre}</h1>
                <Badge tone={tagTone[pac.etiqueta]} dot>{pac.etiqueta}</Badge>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <Info icon={<Phone className="h-4 w-4" />} value={withCountry(pac.telefono)} />
              <Info icon={<Mail className="h-4 w-4" />} value={pac.email || "—"} />
              <Info icon={<MapPin className="h-4 w-4" />} value={pac.ciudad || "—"} />
              <Info icon={<Calendar className="h-4 w-4" />} value={`Paciente desde ${formatDate(pac.desde)}`} />
            </div>

            <a href={waLink(pac.telefono)} target="_blank" rel="noreferrer" className="mt-5 block">
              <Button className="w-full">
                <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
              </Button>
            </a>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-2xl font-semibold text-ink">{stats.nTratamientos}</p>
              <p className="text-xs text-slate-500">Tratamientos</p>
            </Card>
            <Card className="p-4">
              <p className="text-2xl font-semibold text-ink">{money(stats.totalGastado)}</p>
              <p className="text-xs text-slate-500">Valor total</p>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText className="h-4 w-4 text-slate-400" /> Notas
            </h3>
            <p className="text-sm text-slate-500">{pac.notas || "Sin notas registradas."}</p>
          </Card>
        </div>

        {/* Derecha */}
        <div className="space-y-4 lg:col-span-2">
          {/* Galería antes / después */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Fotos · antes y después</h3>
              <div className="flex gap-2">
                <UploadButton accept="image/*" onPick={(f) => handleUpload("antes", f)}>
                  <ImagePlus className="h-3.5 w-3.5" /> Antes
                </UploadButton>
                <UploadButton accept="image/*" onPick={(f) => handleUpload("despues", f)}>
                  <ImagePlus className="h-3.5 w-3.5" /> Después
                </UploadButton>
              </div>
            </div>
            {fotos.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Aún no hay fotos. Sube imágenes del antes y el después del tratamiento.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {fotos.map((d) => (
                  <div key={d.id} className="group relative overflow-hidden rounded-xl border border-slate-200">
                    <a href={d.dataUrl} target="_blank" rel="noreferrer">
                      <img src={d.dataUrl} alt={d.titulo} className="h-36 w-full object-cover" />
                    </a>
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${
                        d.tipo === "antes" ? "bg-slate-700/80" : "bg-[var(--accent)]"
                      }`}
                    >
                      {d.tipo === "antes" ? "Antes" : "Después"}
                    </span>
                    <button
                      onClick={() => deleteDocument(d.id)}
                      title="Eliminar foto"
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-500 opacity-0 transition hover:text-rose-600 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="truncate bg-white px-2 py-1 text-[11px] text-slate-500">{formatDate(d.fecha)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Documentos */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Documentos</h3>
              <UploadButton accept="image/*,application/pdf,.doc,.docx,.txt" onPick={(f) => handleUpload("documento", f)}>
                <Upload className="h-3.5 w-3.5" /> Subir documento
              </UploadButton>
            </div>
            {documentos.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Sin documentos. Adjunta consentimientos, fichas o informes.
              </p>
            ) : (
              <div className="space-y-2">
                {documentos.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{d.titulo}</p>
                      <p className="text-xs text-slate-400">{formatDate(d.fecha)}</p>
                    </div>
                    <a
                      href={d.dataUrl}
                      download={d.titulo}
                      target="_blank"
                      rel="noreferrer"
                      title="Abrir / descargar"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                    >
                      <FileDown className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => deleteDocument(d.id)}
                      title="Eliminar"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Próximas citas */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink">Próximas citas</h3>
            {proximas.length === 0 ? (
              <p className="text-sm text-slate-400">No tiene citas programadas.</p>
            ) : (
              <div className="space-y-2">
                {proximas.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{trtById(a.tratamientoId)?.nombre}</p>
                      <p className="text-xs text-slate-500">{proById(a.profesionalId)?.nombre}</p>
                    </div>
                    <p className="text-sm text-slate-600">{formatDateTime(a.inicio)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Historial */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink">Historial de procedimientos</h3>
            {historial.length === 0 ? (
              <p className="text-sm text-slate-400">Sin procedimientos registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-4 font-medium">Fecha</th>
                      <th className="py-2 pr-4 font-medium">Tratamiento</th>
                      <th className="py-2 pr-4 font-medium">Profesional</th>
                      <th className="py-2 text-right font-medium">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {historial.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 pr-4 text-slate-500">{formatDate(p.fecha)}</td>
                        <td className="py-2.5 pr-4 font-medium text-ink">{trtById(p.tratamientoId)?.nombre.split(" · ")[0]}</td>
                        <td className="py-2.5 pr-4 text-slate-500">{proById(p.profesionalId)?.nombre}</td>
                        <td className="py-2.5 text-right font-medium text-ink">{money(p.importe)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      <PatientForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={(p: Patient) => updatePatient(p.id, p)}
        initial={pac}
      />
    </div>
  );
}

function Info({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function UploadButton({
  accept,
  onPick,
  children,
}: {
  accept: string;
  onPick: (file: File) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      {children}
    </label>
  );
}
