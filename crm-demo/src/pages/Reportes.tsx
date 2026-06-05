import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Download, Calendar, TrendingUp, Target, Award, Users } from "lucide-react";
import { PageHeader, Card, Button, Badge } from "../components/ui";
import { money, moneyCompact } from "../lib/format";
import {
  revenueByMonth,
  revenueByTreatment,
  occupancyByProfessional,
  accent,
  chartPalette,
} from "../data/metrics";

// Conversión de leads a citas (datos de demostración por mes).
const conversion = [
  { label: "Ene", leads: 84, citas: 41 },
  { label: "Feb", leads: 96, citas: 52 },
  { label: "Mar", leads: 110, citas: 61 },
  { label: "Abr", leads: 102, citas: 58 },
  { label: "May", leads: 128, citas: 74 },
  { label: "Jun", leads: 121, citas: 70 },
];

export default function Reportes() {
  const revenue = revenueByMonth();
  const porTratamiento = revenueByTreatment(6);
  const ocupacion = occupancyByProfessional();
  const totalConv = conversion.reduce((s, c) => s + c.citas, 0);
  const totalLeads = conversion.reduce((s, c) => s + c.leads, 0);
  const tasaConv = Math.round((totalConv / totalLeads) * 100);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reportes"
        subtitle="Indicadores de desempeño de la clínica."
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4" /> Últimos 6 meses
            </Button>
            <Button onClick={() => alert("Exportación simulada — demo")}>
              <Download className="h-4 w-4" /> Exportar
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Mini icon={TrendingUp} tone="#7FB7A3" label="Ingresos 6 meses" value={moneyCompact(revenue.reduce((s, r) => s + r.ingresos, 0))} />
        <Mini icon={Target} tone="#6C8CBF" label="Conversión leads→citas" value={`${tasaConv}%`} />
        <Mini icon={Award} tone="#C9A24B" label="Tratamiento top" value={porTratamiento[0]?.name ?? "—"} />
        <Mini icon={Users} tone="#B58BB0" label="Citas atendidas" value={String(totalConv)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink">Ingresos por periodo</h2>
          <p className="mb-3 text-xs text-slate-400">Evolución mensual</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenue} margin={{ left: -8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => moneyCompact(v)} tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" width={60} />
              <Tooltip formatter={(v: number) => [money(v), "Ingresos"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Line type="monotone" dataKey="ingresos" stroke={accent} strokeWidth={2.5} dot={{ r: 3, fill: accent }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Conversión de leads a citas</h2>
            <Badge tone="emerald">{tasaConv}% promedio</Badge>
          </div>
          <p className="mb-3 text-xs text-slate-400">Leads captados vs. citas agendadas</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversion} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="leads" name="Leads" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={16} />
              <Bar dataKey="citas" name="Citas" fill={accent} radius={[6, 6, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink">Tratamientos más rentables</h2>
          <p className="mb-3 text-xs text-slate-400">Ingresos acumulados por tratamiento</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={porTratamiento} margin={{ left: 40, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => moneyCompact(v)} tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="#64748b" width={90} />
              <Tooltip formatter={(v: number) => [money(v), "Ingresos"]} cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="ingresos" radius={[0, 6, 6, 0]} barSize={18}>
                {porTratamiento.map((_, i) => (
                  <Cell key={i} fill={chartPalette[i % chartPalette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink">Ocupación por profesional</h2>
          <p className="mb-3 text-xs text-slate-400">Procedimientos realizados (6 meses)</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ocupacion} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="procedimientos" radius={[6, 6, 0, 0]} barSize={56}>
                {ocupacion.map((o, i) => (
                  <Cell key={i} fill={o.color ?? chartPalette[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, tone, label, value }: { icon: any; tone: string; label: string; value: string }) {
  return (
    <Card className="p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${tone}1f`, color: tone }}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-3 truncate text-xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </Card>
  );
}
