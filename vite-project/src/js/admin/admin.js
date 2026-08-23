// src/js/admin/admin.js
import '../sesion.js';
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';

const API_BASE_URL = 'http://localhost:3001';

// Datos de respaldo para que la UI siempre funcione sin backend activo
const DATOS_MOCK_SOLICITUDES = [
  {
    id: "1",
    nombreEmpresa: "Tech Solutions CR",
    sector: "Tecnología",
    inversionProyectada: 250000,
    empleosProyectados: 18,
    estado: "Pendiente"
  },
  {
    id: "2",
    nombreEmpresa: "AgroExport del Sur",
    sector: "Agroindustria",
    inversionProyectada: 85000,
    empleosProyectados: 4,
    estado: "Revisar"
  }
];

const DATOS_MOCK_ZONAS = [
  { id: "zf-1", nombre: "Zona Franca Central", inversionMinima: 100000, empleosMinimos: 5 }
];

// Inicialización de datos de perfil
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = JSON.parse(localStorage.getItem("zf_usuario"));
  if (usuarioActivo) {
    const elNombre = document.querySelector(".info-usuario strong");
    const elRol = document.querySelector(".info-usuario small");
    if (elNombre) elNombre.textContent = usuarioActivo.nombre;
    if (elRol) elRol.textContent = usuarioActivo.rol === "analista" ? "Analista Senior" : "Empresa Solicitante";
  }

  // Control de Sesión Seguro
  if (typeof window !== "undefined" && window.ZFSesion && typeof window.ZFSesion.requerir === 'function') {
    window.ZFSesion.requerir();
  }

  cargarDatosDashboard();
});

// Variables Globales
let solicitudesGlobales = [];
let zonasFrancasGlobales = [];
let solicitudSeleccionada = null;

// Referencias al DOM
const tablaSolicitudes = document.getElementById("tabla-solicitudes");
const modalDecision = document.getElementById("modal-decision");
const formularioDecision = document.getElementById("formulario-decision");
const empresaModalLabel = document.getElementById("modal-empresa");
const cargandoModal = document.getElementById("indicador-carga");

// 1. Motor de Evaluación de IA (Servicio Asistido) (RF-10)
function evaluarSolicitudConIA(solicitud, zonaFranca) {
  const minInversion = zonaFranca ? zonaFranca.inversionMinima : 100000;
  const minEmpleos = zonaFranca ? zonaFranca.empleosMinimos : 5;

  let puntaje = 0;

  if (solicitud.inversionProyectada >= minInversion) {
    puntaje += 50;
  } else {
    puntaje += Math.round((solicitud.inversionProyectada / minInversion) * 50);
  }

  if (solicitud.empleosProyectados >= minEmpleos) {
    puntaje += 50;
  } else {
    puntaje += Math.round((solicitud.empleosProyectados / minEmpleos) * 50);
  }

  let sugerencia = "Rechazada";
  if (puntaje >= 80) {
    sugerencia = "Recomendada";
  } else if (puntaje >= 50) {
    sugerencia = "Revisar";
  }

  return { puntaje, sugerencia };
}

// 2. Cargar Solicitudes y Zonas Francas
async function cargarDatosDashboard() {
  if (cargandoModal) cargandoModal.hidden = false;

  try {
    const [resSolicitudes, resZonas] = await Promise.all([
      fetch(`${API_BASE_URL}/solicitudes`),
      fetch(`${API_BASE_URL}/zonasFrancas`)
    ]);

    if (!resSolicitudes.ok || !resZonas.ok) {
      throw new Error("Servidor API no disponible");
    }

    solicitudesGlobales = await resSolicitudes.json();
    zonasFrancasGlobales = await resZonas.json();

  } catch (error) {
    console.warn("Fallo de conexión con API. Cargando datos locales de respaldo:", error);
    solicitudesGlobales = DATOS_MOCK_SOLICITUDES;
    zonasFrancasGlobales = DATOS_MOCK_ZONAS;
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
    renderizarTabla(solicitudesGlobales);
  }
}

// 3. Renderizar Tabla en el DOM
function renderizarTabla(solicitudes) {
  if (!tablaSolicitudes) return;

  const tbody = tablaSolicitudes.querySelector("tbody") || tablaSolicitudes;
  tbody.innerHTML = "";

  if (!solicitudes || solicitudes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #64748b;">No hay solicitudes registradas.</td></tr>`;
    return;
  }

  solicitudes.forEach((solicitud) => {
    const zf = zonasFrancasGlobales[0];
    const evaluacion = evaluarSolicitudConIA(solicitud, zf);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;"><strong>${solicitud.nombreEmpresa || 'N/A'}</strong></td>
      <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">${solicitud.sector || 'N/A'}</td>
      <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">$${Number(solicitud.inversionProyectada || 0).toLocaleString()}</td>
      <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">${solicitud.empleosProyectados || 0}</td>
      <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">
        <span class="badge badge--${obtenerClaseEstado(solicitud.estado)}">
          ${solicitud.estado || 'Pendiente'}
        </span>
        <br>
        <small style="color: #64748b;">IA: ${evaluacion.sugerencia} (${evaluacion.puntaje} pts)</small>
      </td>
      <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">
        <button class="btn-evaluar" data-id="${solicitud.id}" style="padding: 0.4rem 0.8rem; background: #0f2c59; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Evaluar / Decidir
        </button>
      </td>
    `;

    const botonEvaluar = fila.querySelector("button");
    if (botonEvaluar) {
      botonEvaluar.addEventListener("click", () => abrirModalDecision(solicitud, evaluacion));
    }

    tbody.appendChild(fila);
  });
}

function obtenerClaseEstado(estado) {
  switch (estado) {
    case 'Aprobada': case 'Recomendada': return 'exito';
    case 'Revisar': case 'Pendiente': return 'advertencia';
    case 'Rechazada': return 'error';
    default: return 'neutro';
  }
}

// 4. Modal y Decisiones
function abrirModalDecision(solicitud, evaluacion) {
  solicitudSeleccionada = solicitud;

  if (empresaModalLabel) {
    empresaModalLabel.textContent = `${solicitud.nombreEmpresa} (Sugerencia IA: ${evaluacion.sugerencia} - ${evaluacion.puntaje} pts)`;
  }

  if (modalDecision) modalDecision.hidden = false;
}

const cerrarModal = () => {
  if (modalDecision) modalDecision.hidden = true;
  solicitudSeleccionada = null;
};

document.querySelectorAll("[data-cierra-modal]").forEach((b) => b.addEventListener("click", cerrarModal));

// 5. Procesar Decisión
if (formularioDecision) {
  formularioDecision.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!solicitudSeleccionada) return;

    const datosFormulario = new FormData(formularioDecision);
    const nuevaDecision = datosFormulario.get("decision");
    const justificacion = datosFormulario.get("justificacion") || "Sin justificación adicional.";

    try {
      await fetch(`${API_BASE_URL}/solicitudes/${solicitudSeleccionada.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevaDecision,
          justificacionAnalista: justificacion,
          fechaDecision: new Date().toISOString()
        })
      });
    } catch (e) {
      // Actualización local si json-server no está disponible
      solicitudSeleccionada.estado = nuevaDecision;
    }

    cerrarModal();
    renderizarTabla(solicitudesGlobales);
  });
}