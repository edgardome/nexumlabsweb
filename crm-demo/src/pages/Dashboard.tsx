import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  UserPlus,
  Gauge,
  PhoneMissed,
  AlertTriangle,
  Package,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card, Badge, Avatar } from "../components/ui";
import { money, moneyCompact, formatDayShort, formatTime } from "../lib/format";
import {
  revenueByMonth,
  topProcedures,
  totalRevenueThisMonth,
  newPatientsThisMonth,
  chartPalette,
  accent,
} from "../data/metrics";
import { useAppointments } from "../store/appointments";
import { usePatients } from "../store/patients";
import { trtById } from "../data/treatments";
import { proById } from "../data/professionals";
import { inventory, stockBajo } from "../data/inventory";
import { receivables, receivableStatus, saldo } from "../data/receivables";
import { seedConversations } from "../data/conversations";

const isSameDay = (iso: string, ref: Date) => {
  const d = new Date(iso);
  return (
    d.getDate() === ref.getDate() &&
    d.getMonth() === ref.getMonth() &&
    d.getFullYear() === ref.getFullYear()
  );
};

const statusTone = {
  Confirmada: "emerald",
  Pendiente: "amber",
  Cancelada: "rose",
  Realizada: "blue",
} as const;

export default function Dashboard() {
  const { appointments } = useAppointments();
  const { byId: pacById } = usePatients();
  const now = new Date();
  const citasHoy = appointments.filter((a) => isSameDay(a.inicio, now));
  const proximas = appointments
    .filter((a) => new Date(a.inicio) >= new Date(now.getTime() - 3600000) && a.estado !== "Cancelada")
    .sort((a, b) => +new Date(a.inicio) - +new Date(b.inicio))
    .slice(0, 6);

  const stockBajoItems = inventory.filter(stockBajo);
  const carteraVencida = receivables.filter((r) => receivableStatus(r) === "Vencido");
  const leadsSinContactar = seedConversations.filter(
    (c) => c.solicitud && !c.solicitudAtendida
  ).length;

  const ocupacion = 78;

  const kpis = [
    { label: "Citas hoy", value: String(citasHoy.length), icon: Calendar, tone: accent, sub: `${citasHoy.filter((c) => c.estado === "Confirmada").length} confirmadas` },
    { label: "Ingresos del mes", value: moneyCompact(totalRevenueThisMonth()), icon: TrendingUp, tone: "#7FB7A3", sub: "+12% vs. mes anterior" },
    { label: "Pacientes nuevos", value: String(newPatientsThisMonth()), icon: UserPlus, tone: "#6C8CBF", sub: "este mes" },
    { label: "Tasa de ocupación", value: `${ocupacion}%`, icon: Gauge, tone: "#B58BB0", sub: "agenda semanal" },
    { label: "Leads sin contactar", value: String(leadsSinContactar), icon: PhoneMissed, tone: "#D89B6C", sub: "requieren atención" },
  ];

  const revenue = revenueByMonth();
  const topProc = topProcedures(5);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Buen día, Daniela 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Esto es lo que está pasando hoy en la clínica.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${k.tone}1f`, color: k.tone }}
              >
                <k.icon className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              {k.value}
            </p>
            <p className="text-xs font-medium text-slate-500">{k.label}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* Gráficas */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink">Ingresos por mes</h2>
              <p className="text-xs text-slate-400">Últimos 6 meses</p>
            </div>
            <Badge tone="emerald" dot>
              Tendencia al alza
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue} margin={{ left: -10, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="gIng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => moneyCompact(v)} tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" width={70} />
              <Tooltip
                formatter={(v: number) => [money(v), "Ingresos"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
              />
              <Area type="monotone" dataKey="ingresos" stroke={accent} strokeWidth={2.5} fill="url(#gIng)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Procedimientos top</h2>
          <p className="text-xs text-slate-400">Más solicitados</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={topProc} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3}>
                {topProc.map((_, i) => (
                  <Cell key={i} fill={chartPalette[i % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Próximas citas + alertas */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Próximas citas</h2>
            <Link to="/citas" className="text-xs font-medium text-[var(--accent)] hover:underline">
              Ver agenda →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {proximas.map((a) => {
              const pac = pacById(a.pacienteId);
              const trt = trtById(a.tratamientoId);
              const pro = proById(a.profesionalId);
              return (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <Avatar name={pac?.nombre ?? "?"} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{pac?.nombre}</p>
                    <p className="truncate text-xs text-slate-500">
                      {trt?.nombre.split(" · ")[0]} · {pro?.nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink">
                      {formatDayShort(a.inicio)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatTime(a.inicio)}
                    </p>
                  </div>
                  <Badge tone={statusTone[a.estado]}>{a.estado}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Alertas</h2>
          <div className="space-y-3">
            <AlertRow
              icon={<Package className="h-4 w-4" />}
              tone="rose"
              title={`${stockBajoItems.length} productos con stock bajo`}
              detail={stockBajoItems.slice(0, 2).map((i) => i.producto.split(" ·")[0]).join(", ")}
              to="/inventario"
            />
            <AlertRow
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="amber"
              title={`${carteraVencida.length} cuentas vencidas`}
              detail={money(carteraVencida.reduce((s, r) => s + saldo(r), 0)) + " por cobrar"}
              to="/cartera"
            />
            <AlertRow
              icon={<Clock className="h-4 w-4" />}
              tone="blue"
              title={`${leadsSinContactar} leads sin atender`}
              detail="Solicitudes nuevas del agente IA"
              to="/conversaciones"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AlertRow({
  icon,
  tone,
  title,
  detail,
  to,
}: {
  icon: React.ReactNode;
  tone: "rose" | "amber" | "blue";
  title: string;
  detail: string;
  to: string;
}) {
  const bg = { rose: "bg-rose-50 text-rose-600", amber: "bg-amber-50 text-amber-600", blue: "bg-blue-50 text-blue-600" }[tone];
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="truncate text-xs text-slate-500">{detail}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-[var(--accent)]" />
    </Link>
  );
}
