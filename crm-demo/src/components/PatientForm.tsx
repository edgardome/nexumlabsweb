import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui";
import type { Patient, PatientTag } from "../data/types";

export function PatientForm({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: Patient) => void;
  initial?: Patient | null;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [etiqueta, setEtiqueta] = useState<PatientTag>("Nuevo");
  const [alergias, setAlergias] = useState("Ninguna conocida");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (!open) return;
    setNombre(initial?.nombre ?? "");
    setTelefono(initial?.telefono ?? "");
    setEmail(initial?.email ?? "");
    setCiudad(initial?.ciudad ?? "");
    setEtiqueta(initial?.etiqueta ?? "Nuevo");
    setAlergias(initial?.alergias ?? "Ninguna conocida");
    setNotas(initial?.notas ?? "");
  }, [open, initial]);

  const submit = () => {
    if (!nombre.trim()) return;
    const base: Patient = initial
      ? { ...initial }
      : {
          id: `pac-${Date.now()}`,
          desde: new Date().toISOString(),
          ultimaVisita: null,
          nombre: "",
          telefono: "",
          email: "",
          ciudad: "",
          etiqueta: "Nuevo",
          alergias: "",
          notas: "",
        };
    onSubmit({
      ...base,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      ciudad: ciudad.trim(),
      etiqueta,
      alergias: alergias.trim() || "Ninguna conocida",
      notas: notas.trim(),
    });
    onClose();
  };

  const field = "mb-1 block text-xs font-medium text-slate-500";
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Editar paciente" : "Nuevo paciente"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit}>{initial ? "Guardar cambios" : "Crear paciente"}</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={field}>Nombre completo</label>
          <input className={input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellidos" />
        </div>
        <div>
          <label className={field}>Teléfono</label>
          <input className={input} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="612 345 678" />
        </div>
        <div>
          <label className={field}>Ciudad</label>
          <input className={input} value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Madrid" />
        </div>
        <div className="col-span-2">
          <label className={field}>Email</label>
          <input className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="paciente@email.com" />
        </div>
        <div>
          <label className={field}>Etiqueta</label>
          <select className={input} value={etiqueta} onChange={(e) => setEtiqueta(e.target.value as PatientTag)}>
            <option value="Nuevo">Nuevo</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={`${field} text-rose-600`}>⚠ Alergias / contraindicaciones</label>
          <input
            className={`${input} border-rose-200 focus:border-rose-400 focus:ring-rose-100`}
            value={alergias}
            onChange={(e) => setAlergias(e.target.value)}
            placeholder="Ej.: Lidocaína, penicilina, látex…"
          />
        </div>
        <div className="col-span-2">
          <label className={field}>Notas</label>
          <textarea className={`${input} h-20 resize-none`} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Observaciones, preferencias…" />
        </div>
      </div>
    </Modal>
  );
}
