import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./ui";
import { clinic, saveClinic } from "../config/clinic";

const PRESETS = ["#C9A24B", "#1F6F66", "#B5547C", "#3C6CB4", "#7E5BB0", "#0F1419"];

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [nombre, setNombre] = useState(clinic.nombre);
  const [iniciales, setIniciales] = useState(clinic.iniciales);
  const [acento, setAcento] = useState(clinic.acento);
  const [moneda, setMoneda] = useState(clinic.moneda);
  const [locale, setLocale] = useState(clinic.locale);
  const [telefonoPais, setTelefonoPais] = useState(clinic.telefonoPais);

  const guardar = () => {
    saveClinic({ nombre, iniciales, acento, moneda, locale, telefonoPais });
    window.location.reload();
  };

  const reiniciar = () => {
    if (!window.confirm("¿Reiniciar la demo? Se borrarán los cambios (citas, pacientes, fotos, chats) y volverá al estado inicial.")) return;
    ["citas", "conversaciones-es", "pacientes", "documentos"].forEach((k) =>
      localStorage.removeItem(`nexum-crm:${k}`)
    );
    window.location.reload();
  };

  const field = "mb-1 block text-xs font-medium text-slate-500";
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configuración de la clínica"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" onClick={reiniciar} className="!text-rose-600 hover:!bg-rose-50">
            <RotateCcw className="h-4 w-4" /> Reiniciar demo
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={guardar}>Guardar y aplicar</Button>
          </div>
        </div>
      }
    >
      <p className="mb-4 text-xs text-slate-500">
        Personaliza la marca para cada clínica. Al guardar, la demo se recarga y aplica los cambios en todas las secciones.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={field}>Nombre de la clínica</label>
          <input className={input} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div>
          <label className={field}>Iniciales (logo)</label>
          <input className={input} value={iniciales} maxLength={3} onChange={(e) => setIniciales(e.target.value.toUpperCase())} />
        </div>
        <div>
          <label className={field}>Prefijo telefónico</label>
          <input className={input} value={telefonoPais} onChange={(e) => setTelefonoPais(e.target.value)} placeholder="+34" />
        </div>
        <div className="col-span-2">
          <label className={field}>Color de marca</label>
          <div className="flex items-center gap-2">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setAcento(c)}
                className={`h-8 w-8 rounded-full ring-2 transition ${acento.toLowerCase() === c.toLowerCase() ? "ring-slate-400" : "ring-transparent hover:ring-slate-200"}`}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
            <input
              type="color"
              value={acento}
              onChange={(e) => setAcento(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white"
            />
          </div>
        </div>
        <div>
          <label className={field}>Moneda</label>
          <select className={input} value={moneda} onChange={(e) => setMoneda(e.target.value as typeof moneda)}>
            <option value="EUR">EUR (€)</option>
            <option value="COP">COP ($)</option>
          </select>
        </div>
        <div>
          <label className={field}>Idioma / formato</label>
          <select className={input} value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)}>
            <option value="es-ES">Español (España)</option>
            <option value="es-CO">Español (Colombia)</option>
          </select>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        Nota: los importes de la demo están pensados en euros. Si cambias a COP, las cifras seguirán
        siendo las mismas (conviene ajustar los precios en los datos para ese mercado).
      </div>
    </Modal>
  );
}
