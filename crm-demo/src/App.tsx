import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Layout } from "./components/Layout";
import { ToastProvider } from "./store/toast";
import { PatientsProvider } from "./store/patients";
import { DocumentsProvider } from "./store/documents";
import { AppointmentsProvider } from "./store/appointments";

// Carga diferida por ruta para reducir el bundle inicial.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Citas = lazy(() => import("./pages/Citas"));
const Calendario = lazy(() => import("./pages/Calendario"));
const Tratamientos = lazy(() => import("./pages/Tratamientos"));
const Pacientes = lazy(() => import("./pages/Pacientes"));
const PacienteDetalle = lazy(() => import("./pages/PacienteDetalle"));
const Comisiones = lazy(() => import("./pages/Comisiones"));
const Cartera = lazy(() => import("./pages/Cartera"));
const Egresos = lazy(() => import("./pages/Egresos"));
const Inventario = lazy(() => import("./pages/Inventario"));
const Procedimientos = lazy(() => import("./pages/Procedimientos"));
const AgenteIA = lazy(() => import("./pages/AgenteIA"));
const Conversaciones = lazy(() => import("./pages/Conversaciones"));
const Reportes = lazy(() => import("./pages/Reportes"));

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center text-slate-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PatientsProvider>
        <DocumentsProvider>
          <AppointmentsProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Outlet />
                    </Suspense>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="citas" element={<Citas />} />
                  <Route path="calendario" element={<Calendario />} />
                  <Route path="tratamientos" element={<Tratamientos />} />
                  <Route path="pacientes" element={<Pacientes />} />
                  <Route path="pacientes/:id" element={<PacienteDetalle />} />
                  <Route path="comisiones" element={<Comisiones />} />
                  <Route path="cartera" element={<Cartera />} />
                  <Route path="egresos" element={<Egresos />} />
                  <Route path="inventario" element={<Inventario />} />
                  <Route path="procedimientos" element={<Procedimientos />} />
                  <Route path="agente-ia" element={<AgenteIA />} />
                  <Route path="conversaciones" element={<Conversaciones />} />
                  <Route path="reportes" element={<Reportes />} />
                  <Route path="*" element={<Dashboard />} />
                </Route>
              </Route>
            </Routes>
          </AppointmentsProvider>
        </DocumentsProvider>
      </PatientsProvider>
    </ToastProvider>
  );
}
