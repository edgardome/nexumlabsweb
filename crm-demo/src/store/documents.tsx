import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalState } from "../lib/useLocalState";
import type { ClinicDocument } from "../data/types";

// Imagen de muestra (SVG) para que la galería no esté vacía en la demo.
function sampleImage(label: string, from: string, to: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='600' height='800' fill='url(#g)'/><circle cx='300' cy='320' r='150' fill='rgba(255,255,255,0.18)'/><text x='300' y='730' font-family='system-ui,sans-serif' font-size='44' fill='rgba(255,255,255,0.9)' text-anchor='middle' font-weight='700'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const consentimiento =
  "data:text/plain;charset=utf-8," +
  encodeURIComponent(
    "CONSENTIMIENTO INFORMADO\n\nProcedimiento: Bótox (toxina botulínica)\nPaciente: Camila Torres\n\nDeclaro haber sido informada de los beneficios, riesgos y cuidados del procedimiento y doy mi consentimiento.\n\nFirma: ____________________\n\n(Documento de muestra · demo)"
  );

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const seedDocuments: ClinicDocument[] = [
  { id: "doc-1", pacienteId: "pac-9", tipo: "antes", titulo: "Frente y entrecejo · antes", mime: "image/svg+xml", dataUrl: sampleImage("ANTES", "#b08968", "#7f5539"), fecha: daysAgo(40) },
  { id: "doc-2", pacienteId: "pac-9", tipo: "despues", titulo: "Frente y entrecejo · 15 días", mime: "image/svg+xml", dataUrl: sampleImage("DESPUÉS", "#c9a24b", "#9c7a2e"), fecha: daysAgo(25) },
  { id: "doc-3", pacienteId: "pac-9", tipo: "documento", titulo: "Consentimiento informado.txt", mime: "text/plain", dataUrl: consentimiento, fecha: daysAgo(40) },
];

interface DocumentsContextValue {
  documents: ClinicDocument[];
  forPatient: (pacienteId: string) => ClinicDocument[];
  addDocument: (d: ClinicDocument) => boolean;
  deleteDocument: (id: string) => void;
}

const DocumentsContext = createContext<DocumentsContextValue | null>(null);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useLocalState<ClinicDocument[]>("documentos", seedDocuments);

  const addDocument = useCallback(
    (d: ClinicDocument) => {
      try {
        // Comprueba que cabe en localStorage antes de confirmar.
        const next = [d, ...documents];
        localStorage.setItem("nexum-crm:documentos", JSON.stringify(next));
        setDocuments(next);
        return true;
      } catch {
        return false; // cuota de almacenamiento superada
      }
    },
    [documents, setDocuments]
  );

  const deleteDocument = useCallback(
    (id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id)),
    [setDocuments]
  );

  const forPatient = useCallback(
    (pacienteId: string) =>
      documents
        .filter((d) => d.pacienteId === pacienteId)
        .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)),
    [documents]
  );

  const value = useMemo(
    () => ({ documents, forPatient, addDocument, deleteDocument }),
    [documents, forPatient, addDocument, deleteDocument]
  );

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

export function useDocuments() {
  const ctx = useContext(DocumentsContext);
  if (!ctx) throw new Error("useDocuments debe usarse dentro de DocumentsProvider");
  return ctx;
}
