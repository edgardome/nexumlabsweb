import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Receipt } from "lucide-react";
import { PageHeader, Card, Badge } from "../components/ui";
import { money, moneyCompact, formatDate } from "../lib/format";
import { expenses } from "../data/expenses";
import { chartPalette } from "../data/metrics";
import type { ExpenseCategory } from "../data/types";

const catTone: Record<ExpenseCategory, "blue" | "violet" | "amber" | "emerald" | "slate"> = {
  Insumos: "blue",
  Nómina: "violet",
  Alquiler: "amber",
  Marketing: "emerald",
  Servicios: "slate",
};

export default function Egresos() {
  const now = new Date();
  const delMes = useMemo(
    () =>
      expenses
        .filter((e) => {
          const d = new Date(e.fecha);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const total = delMes.reduce((s, e) => s + e.importe, 0);

  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of delMes) map.set(e.categoria, (map.get(e.categoria) ?? 0) + e.importe);
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [delMes]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Egresos" subtitle="Registro de gastos de la clínica este mes." />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium text-slate-500">Total egresos del mes</p>
          <p className="mt-1 text-3xl font-semibold text-ink">{money(total)}</p>
          <p className="mt-1 text-xs text-slate-400">{delMes.length} movimientos registrados</p>
          <div className="mt-4 space-y-2">
            {porCategoria.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartPalette[i % chartPalette.length] }} />
                <span className="flex-1 text-slate-600">{c.name}</span>
                <span className="font-medium text-ink">{money(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ink">Gasto por categoría</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={porCategoria} margin={{ left: -8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => moneyCompact(v)} tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" width={60} />
              <Tooltip
                formatter={(v: number) => [money(v), "Gasto"]}
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                {porCategoria.map((_, i) => (
                  <Cell key={i} fill={chartPalette[i % chartPalette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 font-medium">Descripción</th>
                <th className="px-5 py-3 text-right font-medium">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {delMes.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-500">{formatDate(e.fecha)}</td>
                  <td className="px-5 py-3"><Badge tone={catTone[e.categoria]}>{e.categoria}</Badge></td>
                  <td className="px-5 py-3 font-medium text-ink">{e.proveedor}</td>
                  <td className="px-5 py-3 text-slate-500">{e.descripcion}</td>
                  <td className="px-5 py-3 text-right font-medium text-ink">{money(e.importe)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Receipt className="h-3.5 w-3.5" /> Datos de demostración · cifras ficticias
      </div>
    </div>
  );
}
