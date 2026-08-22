// src/js/admin/admin.js
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';

const API_BASE_URL = 'http://localhost:3001';

// Control de Sesión
if (window.ZFSesion && typeof window.ZFSesion.requerir === 'function') {
  window.ZFSesion.requerir();
}

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

  // Evaluación de Inversión (hasta 50 pts)
  if (solicitud.inversionProyectada >= minInversion) {
    puntaje += 50;
  } else {
    puntaje += Math.round((solicitud.inversionProyectada / minInversion) * 50);
  }

  // Evaluación de Empleos (hasta 50 pts)
  if (solicitud.empleosProyectados >= minEmpleos) {
    puntaje += 50;
  } else {
    puntaje += Math.round((solicitud.empleosProyectados / minEmpleos) * 50);
  }

  // Clasificación sugerida por IA
  let sugerencia = "Rechazada";
  if (puntaje >= 80) {
    sugerencia = "Recomendada";
  } else if (puntaje >= 50) {
    sugerencia = "Revisar";
  }

  return { puntaje, sugerencia };
}

// 2. Cargar Solicitudes y Zonas Francas en Paralelo con Promise.all (RF-18, RNF-03)
async function cargarDatosDashboard() {
  if (cargandoModal) cargandoModal.hidden = false;

  try {
    // Peticiones paralelas asíncronas
    const [resSolicitudes, resZonas] = await Promise.all([
      fetch(`${API_BASE_URL}/solicitudes`),
      fetch(`${API_BASE_URL}/zonasFrancas`)
    ]);

    if (!resSolicitudes.ok || !resZonas.ok) {
      throw new Error("Fallo al obtener los datos del servidor.");
    }

    solicitudesGlobales = await resSolicitudes.json();
    zonasFrancasGlobales = await resZonas.json();

    renderizarTabla(solicitudesGlobales);

  } catch (error) {
    // Feedback amigable de errores (RF-16, RNF-05)
    console.error("Error al cargar datos:", error);
    alert("No se pudieron cargar las solicitudes. Por favor asegúrate de que json-server esté iniciado.");
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
  }
}

// 3. Renderizar la Tabla de Solicitudes en el DOM
function renderizarTabla(solicitudes) {
  if (!tablaSolicitudes) return;

  const tbody = tablaSolicitudes.querySelector("tbody") || tablaSolicitudes;
  tbody.innerHTML = "";

  if (solicitudes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay solicitudes registradas.</td></tr>`;
    return;
  }

  solicitudes.forEach((solicitud) => {
    // Evaluar con la primera zona franca o criterios por defecto
    const zf = zonasFrancasGlobales[0];
    const evaluacion = evaluarSolicitudConIA(solicitud, zf);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${solicitud.nombreEmpresa || 'N/A'}</td>
      <td>${solicitud.sector || 'N/A'}</td>
      <td>$${Number(solicitud.inversionProyectada || 0).toLocaleString()}</td>
      <td>${solicitud.empleosProyectados || 0}</td>
      <td>
        <span class="badge badge--${obtenerClaseEstado(solicitud.estado)}">
          ${solicitud.estado || 'Pendiente'}
        </span>
        <br>
        <small>IA: ${evaluacion.sugerencia} (${evaluacion.puntaje} pts)</small>
      </td>
      <td>
        <button class="boton boton--secundario boton--sm" data-id="${solicitud.id}">
          Evaluar / Decidir
        </button>
      </td>
    `;

    // Asignar evento para abrir modal de decisión
    const botonEvaluar = fila.querySelector("button");
    botonEvaluar.addEventListener("click", () => abrirModalDecision(solicitud, evaluacion));

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

// 4. Modal y Toma de Decisión Humana (RF-17, HU-05)
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

// Listeners para cerrar modal
document.querySelectorAll("[data-cierra-modal]").forEach((b) => b.addEventListener("click", cerrarModal));

// 5. Procesar Decisión Final del Analista (RF-17, RF-19, RF-21)
if (formularioDecision) {
  formularioDecision.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!solicitudSeleccionada) return;

    const datosFormulario = new FormData(formularioDecision);
    const nuevaDecision = datosFormulario.get("decision"); // Ej: Aprobada, Rechazada, En Revisión
    const justificacion = datosFormulario.get("justificacion") || "Sin justificación adicional.";

    if (cargandoModal) cargandoModal.hidden = false;

    try {
      // Actualizar el estado de la solicitud en db.json (RF-21)
      const resSolicitud = await fetch(`${API_BASE_URL}/solicitudes/${solicitudSeleccionada.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevaDecision,
          justificacionAnalista: justificacion,
          fechaDecision: new Date().toISOString()
        })
      });

      if (!resSolicitud.ok) throw new Error("Error al actualizar la solicitud.");

      // Registrar trazabilidad en el historial (RF-19)
      await fetch(`${API_BASE_URL}/historial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitudId: solicitudSeleccionada.id,
          empresa: solicitudSeleccionada.nombreEmpresa,
          accion: `Decisión Final: ${nuevaDecision}`,
          usuario: "Analista Humano",
          justificacion: justificacion,
          fecha: new Date().toISOString()
        })
      });

      cerrarModal();
      await cargarDatosDashboard(); // Recargar la tabla con datos actualizados

    } catch (error) {
      console.error("Error al guardar decisión:", error);
      alert("No se pudo guardar la decisión final. Intente nuevamente.");
    } finally {
      if (cargandoModal) cargandoModal.hidden = true;
    }
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", cargarDatosDashboard);