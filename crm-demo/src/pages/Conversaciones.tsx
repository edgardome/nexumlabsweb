import { useMemo, useState } from "react";
import {
  Send,
  ExternalLink,
  CalendarPlus,
  UserCog,
  Bot,
  Phone,
  CheckCheck,
  Search,
} from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { Badge, Button, Avatar } from "../components/ui";
import { AppointmentForm } from "../components/AppointmentForm";
import type { AppointmentDefaults } from "../components/AppointmentForm";
import { useLocalState } from "../lib/useLocalState";
import { useAppointments } from "../store/appointments";
import { usePatients } from "../store/patients";
import { useToast } from "../store/toast";
import { seedConversations } from "../data/conversations";
import { treatments } from "../data/treatments";
import type { Conversation, ChatMessage } from "../data/types";
import { waLink, withCountry, formatTimeAgo, formatDateTime, formatTime } from "../lib/format";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export default function Conversaciones() {
  const [convs, setConvs] = useLocalState<Conversation[]>("conversaciones-es", seedConversations);
  const { addAppointment } = useAppointments();
  const { patients } = usePatients();
  const toast = useToast();
  const [activeId, setActiveId] = useState(seedConversations[0].id);
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [agendaDefaults, setAgendaDefaults] = useState<AppointmentDefaults>({});

  const ordered = useMemo(
    () => [...convs].sort((a, b) => +new Date(b.ultimaActividad) - +new Date(a.ultimaActividad)),
    [convs]
  );

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return ordered.filter(
      (c) =>
        c.telefono.toLowerCase().includes(term) ||
        (c.nombre ?? "").toLowerCase().includes(term) ||
        (c.solicitud?.procedimiento ?? "").toLowerCase().includes(term)
    );
  }, [ordered, q]);

  const active = convs.find((c) => c.id === activeId) ?? convs[0];

  const update = (id: string, patch: Partial<Conversation>) =>
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const toggleAgente = () =>
    update(active.id, { agenteSilenciado: !active.agenteSilenciado });

  const enviar = () => {
    const texto = draft.trim();
    if (!texto) return;
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      rol: "humano",
      texto,
      hora: new Date().toISOString(),
    };
    update(active.id, {
      mensajes: [...active.mensajes, msg],
      ultimaActividad: msg.hora,
      agenteSilenciado: true, // al responder, toma la conversación
      solicitudAtendida: true,
    });
    setDraft("");
  };

  const abrirAgenda = () => {
    const sol = active.solicitud;
    // Empareja paciente por teléfono y tratamiento por el procedimiento de interés.
    const tel = onlyDigits(active.telefono);
    const pac = patients.find((p) => onlyDigits(withCountry(p.telefono)) === tel);
    let trtId: string | undefined;
    if (sol) {
      const proc = sol.procedimiento.toLowerCase();
      const first = proc.split(" ")[0];
      trtId = treatments.find(
        (t) => t.nombre.toLowerCase().includes(first) || proc.includes(t.nombre.split(" ")[0].toLowerCase())
      )?.id;
    }
    setAgendaDefaults({ pacienteId: pac?.id, tratamientoId: trtId });
    setAgendaOpen(true);
  };

  const onAgendar = (a: Parameters<typeof addAppointment>[0]) => {
    addAppointment(a);
    update(active.id, { solicitudAtendida: true });
    toast("Cita agendada y añadida al calendario");
  };

  const noLeidas = convs.filter((c) => c.solicitud && !c.solicitudAtendida).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Conversaciones</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bandeja de WhatsApp gestionada por el agente IA.
          </p>
        </div>
        {noLeidas > 0 && <Badge tone="rose" dot>{noLeidas} solicitudes sin atender</Badge>}
      </div>

      <div className="grid h-[calc(100vh-220px)] min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
        {/* Lista */}
        <div className="flex min-h-0 flex-col border-r border-slate-100">
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar conversación…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--accent)] focus:bg-white"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((c) => {
              const pendiente = c.solicitud && !c.solicitudAtendida;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-start gap-3 border-b border-slate-50 p-3 text-left transition ${
                    c.id === active.id ? "bg-[var(--accent-soft)]" : "hover:bg-slate-50"
                  }`}
                >
                  <Avatar name={c.nombre ?? "?"} size={42} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-ink">
                        {c.nombre ?? "No proporcionado"}
                      </p>
                      <span className="shrink-0 text-[11px] text-slate-400">{formatTimeAgo(c.ultimaActividad)}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{c.telefono}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {pendiente ? (
                        <Badge tone="rose" dot>Solicitud nueva</Badge>
                      ) : c.agenteSilenciado ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400"><UserCog className="h-3 w-3" /> Humano</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400"><Bot className="h-3 w-3" /> Agente</span>
                      )}
                      <span className="text-[11px] text-slate-300">· {c.mensajes.length} msj</span>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">Sin conversaciones.</p>
            )}
          </div>
        </div>

        {/* Hilo */}
        <div className="flex min-h-0 flex-col">
          {/* Header del hilo */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <Avatar name={active.nombre ?? "?"} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{active.nombre ?? "No proporcionado"}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Phone className="h-3 w-3" /> {active.telefono}
              </p>
            </div>
            <a
              href={waLink(active.telefono)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Abrir chat
            </a>
          </div>

          {/* Banner agente/humano */}
          <div
            className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${
              active.agenteSilenciado ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {active.agenteSilenciado ? (
                <><UserCog className="h-4 w-4" /> Tomado por humano — agente silenciado</>
              ) : (
                <><Bot className="h-4 w-4" /> Atendido automáticamente por el agente IA</>
              )}
            </span>
            <button
              onClick={toggleAgente}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                active.agenteSilenciado
                  ? "bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
                  : "bg-white text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50"
              }`}
            >
              {active.agenteSilenciado ? "Reactivar agente" : "Tomar conversación"}
            </button>
          </div>

          {/* Mensajes */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#ECE5DD]/30 p-4">
            {active.solicitud && (
              <SolicitudCard conv={active} onAgendar={abrirAgenda} />
            )}
            {active.mensajes.map((m) => (
              <div key={m.id} className={`flex ${m.rol === "cliente" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                    m.rol === "cliente"
                      ? "rounded-bl-sm bg-white text-ink"
                      : m.rol === "humano"
                      ? "rounded-br-sm bg-[#DCF8C6] text-ink"
                      : "rounded-br-sm bg-[#D6E9FF] text-ink"
                  }`}
                >
                  {m.rol !== "cliente" && (
                    <p className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                      {m.rol === "humano" ? <><UserCog className="h-3 w-3" /> Equipo</> : <><Bot className="h-3 w-3" /> Agente IA</>}
                    </p>
                  )}
                  <p>{m.texto}</p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                    {formatTime(m.hora)}
                    {m.rol !== "cliente" && <CheckCheck className="h-3 w-3 text-sky-500" />}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Responder */}
          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviar()}
              placeholder="Responder al cliente…"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
            <Button onClick={enviar} className="!rounded-full !px-4">
              <Send className="h-4 w-4" /> Enviar
            </Button>
          </div>
        </div>
      </div>

      <AppointmentForm
        open={agendaOpen}
        onClose={() => setAgendaOpen(false)}
        onSave={onAgendar}
        defaults={agendaDefaults}
      />
    </div>
  );
}

function SolicitudCard({ conv, onAgendar }: { conv: Conversation; onAgendar: () => void }) {
  const s = conv.solicitud!;
  return (
    <div className="mx-auto max-w-md rounded-2xl border-2 border-[var(--accent)]/40 bg-white p-4 shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
          <CalendarPlus className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-ink">Nueva solicitud de cita</p>
          <p className="text-[11px] text-slate-400">Generada por el agente IA</p>
        </div>
        {!conv.solicitudAtendida && <span className="ml-auto"><Badge tone="rose" dot>Pendiente</Badge></span>}
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Cliente" value={conv.telefono} />
        <Row
          label="Abrir chat"
          value={
            <a href={waLink(conv.telefono)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-[var(--accent)] hover:underline">
              {waLink(conv.telefono).replace("https://", "")} <ExternalLink className="h-3 w-3" />
            </a>
          }
        />
        <Row label="Nombre" value={conv.nombre ?? "No proporcionado"} />
        <Row label="Procedimiento de interés" value={<span className="font-medium text-ink">{s.procedimiento}</span>} />
        <div>
          <dt className="text-xs font-medium text-slate-400">Resumen de conversación</dt>
          <dd className="mt-0.5 rounded-lg bg-slate-50 p-2.5 text-sm leading-relaxed text-slate-600">{s.resumen}</dd>
        </div>
        <Row label="Solicitud recibida" value={formatDateTime(s.recibida)} />
      </dl>

      <p className="mt-3 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-xs font-medium text-ink">
        Por favor revisar disponibilidad y contactar al cliente.
      </p>

      <Button onClick={onAgendar} className="mt-3 w-full !py-2 !text-xs">
        <CalendarCheck className="h-3.5 w-3.5" /> Agendar cita en el calendario
      </Button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-xs font-medium text-slate-400">{label}</dt>
      <dd className="text-right text-sm text-slate-700">{value}</dd>
    </div>
  );
}
