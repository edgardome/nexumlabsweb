import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader, Card, Select, Avatar, EmptyState } from "../components/ui";
import { money, formatDate } from "../lib/format";
import { procedures } from "../data/procedures";
import { pacById } from "../data/patients";
import { trtById } from "../data/treatments";
import { professionals, proById } from "../data/professionals";
import { MONTHS_ES } from "../data/metrics";

export default function Procedimientos() {
  const [pro, setPro] = useState("todos");
  const [mes, setMes] = useState("todos");

  const meses = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { value: `${d.getFullYear()}-${d.getMonth()}`, label: `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}` };
    });
  }, []);

  const rows = useMemo(
    () =>
      procedures.filter((p) => {
        if (pro !== "todos" && p.profesionalId !== pro) return false;
        if (mes !== "todos") {
          const d = new Date(p.fecha);
          if (`${d.getFullYear()}-${d.getMonth()}` !== mes) return false;
        }
        return true;
      }),
    [pro, mes]
  );

  const total = rows.reduce((s, p) => s + p.importe, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Procedimientos"
        subtitle="Histórico de procedimientos realizados."
        actions={
          <div className="flex gap-2">
            <Select value={pro} onChange={setPro}>
              <option value="todos">Todos los profesionales</option>
              {professionals.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </Select>
            <Select value={mes} onChange={setMes}>
              <option value="todos">Todos los meses</option>
              {meses.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:max-w-md">
        <Card className="p-4">
          <p className="text-2xl font-semibold text-ink">{rows.length}</p>
          <p className="text-xs text-slate-500">Procedimientos</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-semibold text-ink">{money(total)}</p>
          <p className="text-xs text-slate-500">Importe total</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={<ClipboardList className="h-6 w-6" />} title="Sin procedimientos" hint="Ajusta los filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Paciente</th>
                  <th className="px-5 py-3 font-medium">Tratamiento</th>
                  <th className="px-5 py-3 font-medium">Profesional</th>
                  <th className="px-5 py-3 text-right font-medium">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((p) => {
                  const pac = pacById(p.pacienteId);
                  const pr = proById(p.profesionalId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-500">{formatDate(p.fecha)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={pac?.nombre ?? "?"} size={30} />
                          <span className="font-medium text-ink">{pac?.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{trtById(p.tratamientoId)?.nombre.split(" · ")[0]}</td>
                      <td className="px-5 py-3 text-slate-500">{pr?.nombre}</td>
                      <td className="px-5 py-3 text-right font-medium text-ink">{money(p.importe)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
