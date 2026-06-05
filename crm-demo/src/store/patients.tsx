import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalState } from "../lib/useLocalState";
import { patients as seedPatients } from "../data/patients";
import type { Patient } from "../data/types";

interface PatientsContextValue {
  patients: Patient[];
  byId: (id: string) => Patient | undefined;
  addPatient: (p: Patient) => void;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
}

const PatientsContext = createContext<PatientsContextValue | null>(null);

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useLocalState<Patient[]>("pacientes", seedPatients);

  const addPatient = useCallback(
    (p: Patient) => setPatients((prev) => [p, ...prev]),
    [setPatients]
  );

  const updatePatient = useCallback(
    (id: string, patch: Partial<Patient>) =>
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [setPatients]
  );

  const deletePatient = useCallback(
    (id: string) => setPatients((prev) => prev.filter((p) => p.id !== id)),
    [setPatients]
  );

  const byId = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients]
  );

  const value = useMemo(
    () => ({ patients, byId, addPatient, updatePatient, deletePatient }),
    [patients, byId, addPatient, updatePatient, deletePatient]
  );

  return <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>;
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients debe usarse dentro de PatientsProvider");
  return ctx;
}
