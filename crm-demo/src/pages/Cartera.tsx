import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import { PageHeader, Card, Badge, Select, Avatar, EmptyState } from "../components/ui";
import { money } from "../lib/format";
import { receivables, receivableStatus, diasVencimiento, saldo } from "../data/receivables";
import { pacById } from "../data/patients";
import type { ReceivableStatus } from "../data/types";

const tone: Record<ReceivableStatus, "emerald" | "amber" | "rose"> = {
  "Al día": "emerald",
  "Por vencer": "amber",
  Vencido: "rose",
};

export default function Cartera() {
  const [filtro, setFiltro] = useState("todos");

  const rows = useMemo(
    () =>
      receivables
        .map((r) => ({ ...r, estado: receivableStatus(r), dias: diasVencimiento(r), pendiente: saldo(r) }))
        .filter((r) => filtro === "todos" || r.estado === filtro)
        .sort((a, b) => a.dias - b.dias),
    [filtro]
  );

  const totalPendiente = receivables.reduce((s, r) => s + saldo(r), 0);
  const totalVencido = receivables
    .filter((r) => receivableStatus(r) === "Vencido")
    .reduce((s, r) => s + saldo(r), 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Cartera"
        subtitle="Cuentas por cobrar y planes de pago."
        actions={
          <Select value={filtro} onChange={setFiltro}>
            <option value="todos">Todos los estados</option>
            <option value="Al día">Al día</option>
            <option value="Por vencer">Por vencer</option>
            <option value="Vencido">Vencido</option>
          </Select>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500">Total por cobrar</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{money(totalPendiente)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500">Cartera vencida</p>
          <p className="mt-1 text-2xl font-semibold text-rose-600">{money(totalVencido)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={<Wallet className="h-6 w-6" />} title="Sin cuentas en este estado" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Paciente</th>
                  <th className="px-5 py-3 font-medium">Concepto</th>
                  <th className="px-5 py-3 text-right font-medium">Saldo</th>
                  <th className="px-5 py-3 font-medium">Plan de pago</th>
                  <th className="px-5 py-3 font-medium">Vencimiento</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r) => {
                  const pac = pacById(r.pacienteId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={pac?.nombre ?? "?"} size={34} />
                          <span className="font-medium text-ink">{pac?.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{r.concepto}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-ink">{money(r.pendiente)}</td>
                      <td className="px-5 py-3.5 text-slate-500">{r.plan}</td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {r.dias < 0 ? (
                          <span className="text-rose-600">{Math.abs(r.dias)} d vencido</span>
                        ) : (
                          <span>en {r.dias} d</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={tone[r.estado]} dot>{r.estado}</Badge>
                      </td>
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
