import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalState } from "../lib/useLocalState";
import { appointments as seedAppointments } from "../data/appointments";
import type { Appointment } from "../data/types";

interface AppointmentsContextValue {
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  /** Mueve una cita a una nueva fecha/hora (usado por el calendario al arrastrar). */
  moveAppointment: (id: string, newStartISO: string) => void;
}

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  // Misma clave de localStorage que ya usaba la demo → datos persistentes y compartidos.
  const [appointments, setAppointments] = useLocalState<Appointment[]>(
    "citas",
    seedAppointments
  );

  const addAppointment = useCallback(
    (a: Appointment) => setAppointments((prev) => [...prev, a]),
    [setAppointments]
  );

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Appointment>) =>
      setAppointments((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [setAppointments]
  );

  const deleteAppointment = useCallback(
    (id: string) => setAppointments((prev) => prev.filter((c) => c.id !== id)),
    [setAppointments]
  );

  const moveAppointment = useCallback(
    (id: string, newStartISO: string) =>
      setAppointments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, inicio: newStartISO } : c))
      ),
    [setAppointments]
  );

  const value = useMemo(
    () => ({ appointments, addAppointment, updateAppointment, deleteAppointment, moveAppointment }),
    [appointments, addAppointment, updateAppointment, deleteAppointment, moveAppointment]
  );

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments debe usarse dentro de AppointmentsProvider");
  return ctx;
}
