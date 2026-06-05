import { useMemo, useState } from "react";
import { Package, AlertTriangle, CalendarClock } from "lucide-react";
import { PageHeader, Card, Badge, SearchInput } from "../components/ui";
import { formatDate } from "../lib/format";
import { inventory, stockBajo } from "../data/inventory";

const diasParaCaducar = (iso: string) => Math.round((new Date(iso).getTime() - Date.now()) / 86400000);

export default function Inventario() {
  const [q, setQ] = useState("");
  const [soloBajo, setSoloBajo] = useState(false);

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return inventory.filter(
      (i) =>
        (!soloBajo || stockBajo(i)) &&
        (i.producto.toLowerCase().includes(term) || i.proveedor.toLowerCase().includes(term))
    );
  }, [q, soloBajo]);

  const bajos = inventory.filter(stockBajo).length;
  const porCaducar = inventory.filter((i) => diasParaCaducar(i.caducidad) < 120).length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Inventario"
        subtitle="Control de stock, mínimos y caducidades."
        actions={<SearchInput value={q} onChange={setQ} placeholder="Buscar producto…" className="w-64" />}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-2xl font-semibold text-ink">{inventory.length}</p>
          <p className="text-xs text-slate-500">Productos en inventario</p>
        </Card>
        <button onClick={() => setSoloBajo((v) => !v)} className="text-left">
          <Card className={`p-4 transition ${soloBajo ? "ring-2 ring-rose-300" : "hover:shadow-md"}`}>
            <p className="text-2xl font-semibold text-rose-600">{bajos}</p>
            <p className="text-xs text-slate-500">Con stock bajo {soloBajo && "· filtrando"}</p>
          </Card>
        </button>
        <Card className="p-4">
          <p className="text-2xl font-semibold text-amber-600">{porCaducar}</p>
          <p className="text-xs text-slate-500">Próximos a caducar</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 text-center font-medium">Stock</th>
                <th className="px-5 py-3 text-center font-medium">Mínimo</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 font-medium">Caducidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((i) => {
                const bajo = stockBajo(i);
                const dias = diasParaCaducar(i.caducidad);
                return (
                  <tr key={i.id} className={`hover:bg-slate-50 ${bajo ? "bg-rose-50/40" : ""}`}>
                    <td className="px-5 py-3 font-medium text-ink">{i.producto}</td>
                    <td className="px-5 py-3 text-slate-500">{i.categoria}</td>
                    <td className="px-5 py-3 text-center">
                      {bajo ? (
                        <Badge tone="rose" dot>{i.stock} {i.unidad}</Badge>
                      ) : (
                        <span className="font-medium text-ink">{i.stock} <span className="text-xs font-normal text-slate-400">{i.unidad}</span></span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-500">{i.stockMinimo}</td>
                    <td className="px-5 py-3 text-slate-500">{i.proveedor}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 ${dias < 120 ? "text-amber-600" : "text-slate-500"}`}>
                        {dias < 120 && <CalendarClock className="h-3.5 w-3.5" />}
                        {formatDate(i.caducidad)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {bajos > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {bajos} {bajos === 1 ? "producto está" : "productos están"} por debajo del stock mínimo. Considera reabastecer pronto.
        </div>
      )}

      {rows.length === 0 && (
        <Card className="mt-4 p-6">
          <div className="flex flex-col items-center py-8 text-center text-slate-400">
            <Package className="mb-2 h-6 w-6" />
            <p className="text-sm">Sin productos que coincidan.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
