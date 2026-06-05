# CRM Clínica Estética — Demo (NexumLabs)

Demo de ventas de un **CRM para clínicas estéticas**. Es una aplicación de una sola
página (SPA) construida solo en el cliente, con **datos ficticios** y persistencia en
`localStorage`. Está pensada para enseñarse en reuniones comerciales: parece un
producto real y terminado, con toda la navegación funcional.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router
- Recharts (gráficas)
- lucide-react (iconos)

## Arrancar en local

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build de producción

```bash
npm run build      # genera la carpeta dist/
npm run preview    # sirve el build localmente para revisarlo
```

## Personalizar la marca por clínica

Toda la personalización vive en un único archivo: **`src/config/clinic.ts`**.
Edita ese objeto y la demo entera (logo, color de acento, moneda, formato de
teléfonos y locale) se adapta:

```ts
export const clinic = {
  nombre: "Clínica Estética Demo",
  iniciales: "CD",        // iniciales del logo
  acento: "#C9A24B",      // color de marca
  moneda: "EUR",          // "COP" | "EUR"
  locale: "es-ES",        // "es-CO" | "es-ES"
  telefonoPais: "+34",    // prefijo por defecto
};
```

Ejemplo para una clínica en Colombia:

```ts
export const clinic = {
  nombre: "Clínica Estética Demo",
  iniciales: "CD",
  acento: "#C9A24B",
  moneda: "COP",
  locale: "es-CO",
  telefonoPais: "+57",
};
```

> Nota: los precios de los tratamientos (`src/data/treatments.ts`) y demás cifras
> están en euros con importes realistas para España. Si cambias a COP tendrás que
> ajustar también esas magnitudes.

> El formateo de moneda y teléfonos lee siempre de aquí, así que no hay que tocar
> nada más para cambiar de país o de marca.

## Estructura del proyecto

```
src/
  config/clinic.ts     → branding configurable por clínica
  lib/                 → formateo (moneda, teléfono, fechas) + persistencia
  data/                → datos mock coherentes entre secciones
  components/          → layout (sidebar + topbar) y UI reutilizable
  pages/               → una página por sección del sidebar
```

## Secciones

Dashboard · Citas · **Calendario** · Tratamientos · Pacientes · Comisiones · Cartera ·
Egresos · Inventario · Procedimientos · **Agente IA** · **Conversaciones** · Reportes

- **Calendario** muestra todas las citas en una rejilla con **vista de día y de
  semana**. Puedes **arrastrar** cualquier cita a otro día u hora para reprogramarla,
  **estirar el borde inferior** del bloque para cambiar su duración, y **hacer clic en
  un hueco libre** para crear una cita en esa fecha/hora. Todo se guarda en un store
  compartido y se refleja al instante en Citas, el Dashboard y la ficha del paciente
  (misma fuente de datos en `localStorage`).
- **Pacientes** permite **crear, editar y eliminar** pacientes. Cada ficha incluye un
  apartado de **alergias / contraindicaciones** destacado (alerta roja siempre visible
  en el detalle) y una sección de **fotos antes/después y documentos**: subes imágenes
  o archivos y se guardan en la base de datos local (`localStorage`); las imágenes se
  reescalan automáticamente para no saturar el almacenamiento.
- **Citas y Calendario** permiten **gestionar una cita haciendo clic** sobre ella:
  cambiar estado, reprogramar, cambiar tratamiento/profesional o eliminarla.
- Desde la topbar tienes un **buscador global** de pacientes y un **panel de
  Configuración** (icono de engranaje) para **rebautizar la clínica al vuelo**
  (nombre, iniciales, color de marca, moneda, idioma y prefijo) y un botón para
  **reiniciar la demo** a su estado inicial entre reuniones.
- **Conversaciones** es la sección estrella y funciona de verdad: solicitudes de
  cita generadas por el agente, traspaso a humano (silenciar/reactivar agente) y
  respuesta al cliente, todo persistido en `localStorage`. Cada solicitud incluye un
  botón **"Agendar cita"** que la crea en el calendario (emparejando paciente y
  tratamiento automáticamente) y cierra el flujo lead → agenda.
- **Agente IA** es una maqueta visual: el chat de prueba responde con mensajes
  predefinidos, **no** llama a ninguna IA real.
- Los cambios que hagas durante la demo (crear una cita, responder un chat, tomar
  una conversación) se guardan en `localStorage` y sobreviven a recargas.

> Para reiniciar la demo a su estado original, borra el `localStorage` del sitio
> desde las herramientas de desarrollador del navegador.

## Desplegar en Cloudflare Pages

1. Sube el repositorio a GitHub/GitLab.
2. En Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
3. Configura el build:
   - **Framework preset:** `Vite` (o ninguno)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cloudflare publica el sitio estático.

Como es una SPA con React Router, ya se incluye `public/_redirects` con
`/* /index.html 200` para que las rutas internas funcionen al recargar.

---

Hecho por **NexumLabs**. Datos y cifras son ficticios, solo para demostración.
