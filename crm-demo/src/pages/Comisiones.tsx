import { useMemo, useState } from "react";
import { PageHeader, Card, Select, Avatar } from "../components/ui";
import { money } from "../lib/format";
import { commissionsForMonth, MONTHS_ES } from "../data/metrics";

export default function Comisiones() {
  const [monthsAgo, setMonthsAgo] = useState(0);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { value: String(i), label: `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}` };
    });
  }, []);

  const rows = commissionsForMonth(monthsAgo);
  const totalGenerado = rows.reduce((s, r) => s + r.generado, 0);
  const totalComision = rows.reduce((s, r) => s + r.comision, 0);
  const totalProc = rows.reduce((s, r) => s + r.nTratamientos, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Comisiones"
        subtitle="Liquidación de comisiones por profesional."
        actions={
          <Select value={String(monthsAgo)} onChange={(v) => setMonthsAgo(Number(v))}>
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Procedimientos realizados" value={String(totalProc)} />
        <SummaryCard label="Importe generado" value={money(totalGenerado)} />
        <SummaryCard label="Comisión a pagar" value={money(totalComision)} accent />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Profesional</th>
                <th className="px-5 py-3 text-center font-medium">Tratamientos</th>
                <th className="px-5 py-3 text-right font-medium">Importe generado</th>
                <th className="px-5 py-3 text-center font-medium">% comisión</th>
                <th className="px-5 py-3 text-right font-medium">Comisión a pagar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((r) => (
                <tr key={r.profesional.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.profesional.nombre} color={r.profesional.color} size={36} />
                      <div>
                        <p className="font-medium text-ink">{r.profesional.nombre}</p>
                        <p className="text-xs text-slate-400">{r.profesional.rol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-slate-600">{r.nTratamientos}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{money(r.generado)}</td>
                  <td className="px-5 py-4 text-center text-slate-600">{r.profesional.comisionPct}%</td>
                  <td className="px-5 py-4 text-right font-semibold text-ink">{money(r.comision)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-100 bg-slate-50/60 font-semibold text-ink">
                <td className="px-5 py-3">Total</td>
                <td className="px-5 py-3 text-center">{totalProc}</td>
                <td className="px-5 py-3 text-right">{money(totalGenerado)}</td>
                <td className="px-5 py-3" />
                <td className="px-5 py-3 text-right text-[var(--accent)]">{money(totalComision)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ? "text-[var(--accent)]" : "text-ink"}`}>{value}</p>
    </Card>
  );
}
