import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { clinic, loadClinicOverrides } from "./config/clinic";
import "./index.css";

// Hidrata la marca personalizada (si la hay) antes de pintar nada.
loadClinicOverrides();

// Aplica el color de acento de la clínica como variable CSS global.
const root = document.documentElement;
root.style.setProperty("--accent", clinic.acento);
root.style.setProperty("--accent-soft", `${clinic.acento}1a`);
document.title = `CRM · ${clinic.nombre}`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/crmdemo">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
