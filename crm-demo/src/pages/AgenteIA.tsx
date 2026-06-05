import { useRef, useState, useEffect } from "react";
import {
  Bot,
  Send,
  MessageSquare,
  UserCheck,
  CalendarCheck,
  Zap,
  Clock,
  BookOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHeader, Card, Badge } from "../components/ui";
import { clinic } from "../config/clinic";

interface Msg {
  rol: "cliente" | "agente";
  texto: string;
}

// Respuestas guionizadas — NO hay IA real detrás.
const guion: string[] = [
  "¡Hola! 😊 Soy el asistente virtual de la clínica. Puedo darte información sobre nuestros tratamientos y ayudarte a agendar una valoración. ¿Qué procedimiento te interesa?",
  "El Bótox es ideal para suavizar líneas de expresión en frente, entrecejo y patas de gallo. El precio depende de las zonas a tratar y lo define el médico en la valoración. ¿Te gustaría agendar una cita de valoración? 💛",
  "¡Perfecto! Tenemos disponibilidad esta semana en horario de mañana y tarde. ¿Qué día te queda mejor? Así reservo tu espacio con la Dra. Catalina.",
  "Excelente, dejo registrada tu solicitud de cita ✨ Un miembro del equipo te confirmará la hora por este mismo chat. ¿Hay algo más en lo que pueda ayudarte?",
];

const stats = [
  { label: "Conversaciones gestionadas", value: "1.284", icon: MessageSquare, tone: "#6C8CBF", sub: "últimos 30 días" },
  { label: "Leads capturados", value: "342", icon: UserCheck, tone: "#7FB7A3", sub: "+18% vs. mes anterior" },
  { label: "Citas agendadas", value: "176", icon: CalendarCheck, tone: "#C9A24B", sub: "por el agente" },
  { label: "Tasa de respuesta", value: "98%", icon: Zap, tone: "#B58BB0", sub: "< 1 min promedio" },
];

const faqs = [
  "Precios y zonas de aplicación de Bótox",
  "Diferencia entre relleno labial 0.5 ml y 1 ml",
  "Cuidados antes y después de cada procedimiento",
  "Horarios de atención y ubicación de la sede",
  "Formas de pago y planes de financiación",
];

export default function AgenteIA() {
  const [activo, setActivo] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([{ rol: "agente", texto: guion[0] }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const stepRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { rol: "cliente", texto: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = guion[Math.min(stepRef.current, guion.length - 1)];
      stepRef.current += 1;
      setTyping(false);
      setMsgs((m) => [...m, { rol: "agente", texto: reply }]);
    }, 1300);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Agente IA"
        subtitle="Configuración y supervisión del asistente virtual de WhatsApp."
        actions={<Badge tone="slate">Vista previa</Badge>}
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${s.tone}1f`, color: s.tone }}>
              <s.icon className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-3 text-2xl font-semibold text-ink">{s.value}</p>
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Configuración */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink">Estado del agente</h2>
                  <p className="text-xs text-slate-400">Atención automática por WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setActivo((a) => !a)}
                className={`relative h-7 w-12 rounded-full transition ${activo ? "bg-[var(--accent)]" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${activo ? "left-6" : "left-1"}`} />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge tone={activo ? "emerald" : "slate"} dot>{activo ? "Agente activo" : "Agente pausado"}</Badge>
              <span className="text-xs text-slate-400">Canal: WhatsApp Business · {clinic.telefonoPais}</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink">Configuración del agente</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ConfigField label="Nombre del agente" value="Aura · Asistente de la clínica" />
              <ConfigField label="Tono / personalidad" value="Cálido, cercano y profesional" />
              <ConfigField label="Horario de atención" value="24/7 (respuesta inmediata)" icon={<Clock className="h-4 w-4" />} />
              <ConfigField label="Idioma" value="Español (España)" />
            </div>

            <div className="mt-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <BookOpen className="h-4 w-4" /> Base de conocimiento
              </p>
              <div className="flex flex-wrap gap-2">
                {faqs.map((f) => (
                  <span key={f} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)]" /> Regla de escalado a humano
              </p>
              <p className="text-sm text-slate-500">
                Cuando el cliente solicita agendar o pregunta por disponibilidad concreta, el agente genera una
                <span className="font-medium text-ink"> solicitud de cita</span> y notifica al equipo para traspaso a un humano.
              </p>
            </div>
          </Card>
        </div>

        {/* Probar agente */}
        <div className="lg:col-span-2">
          <Card className="flex h-full flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-ink px-4 py-3 text-white">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold">Probar agente</span>
              <Badge tone="emerald" dot>en línea</Badge>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#ECE5DD]/40 p-4" style={{ minHeight: 360, maxHeight: 460 }}>
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.rol === "cliente" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                      m.rol === "cliente" ? "rounded-br-sm bg-[#DCF8C6] text-ink" : "rounded-bl-sm bg-white text-ink"
                    }`}
                  >
                    {m.texto}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                    <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                    <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                    <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Escribe un mensaje de prueba…"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
              <button
                onClick={send}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:brightness-105"
                style={{ background: "var(--accent)" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Demostración visual · las respuestas del chat de prueba están predefinidas.
      </p>
    </div>
  );
}

function ConfigField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-ink">
        {icon && <span className="text-slate-400">{icon}</span>}
        {value}
      </div>
    </div>
  );
}
