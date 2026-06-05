import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

interface ToastContextValue {
  toast: (text: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (text: string, kind: ToastKind = "success") => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, kind, text }]);
      window.setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const cfg = {
    success: { icon: CheckCircle2, color: "text-emerald-600", ring: "ring-emerald-100" },
    error: { icon: AlertTriangle, color: "text-rose-600", ring: "ring-rose-100" },
    info: { icon: Info, color: "text-blue-600", ring: "ring-blue-100" },
  }[toast.kind];
  const Icon = cfg.icon;
  return (
    <div
      className={`pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg ring-1 ${cfg.ring}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.color}`} />
      <p className="flex-1 text-sm text-ink">{toast.text}</p>
      <button onClick={onClose} className="text-slate-300 transition hover:text-slate-500">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx.toast;
}
