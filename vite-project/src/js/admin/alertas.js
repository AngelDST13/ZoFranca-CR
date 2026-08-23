// src/js/admin/alertas.js
import '../sesion.js';
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';

const API_BASE_URL = 'http://localhost:3001';

// Datos mock de respaldo cuando el servidor no responde
const MOCK_ALERTAS = [
  {
    id: "1",
    nombreEmpresa: "AgroExport del Sur",
    tipo: "Incumplimiento de Metas",
    gravedad: "Alta",
    detalles: "Empleos reales (3) por debajo del compromiso (4). Inversión ejecutada ($60,000) por debajo del compromiso ($85,000).",
    estado: "Pendiente",
    fechaRegistro: "2026-07-01T10:00:00.000Z"
  },
  {
    id: "2",
    nombreEmpresa: "Tech Solutions CR",
    tipo: "Reporte Tardío",
    gravedad: "Media",
    detalles: "El reporte trimestral Q1 fue presentado con 15 días de retraso.",
    estado: "Pendiente",
    fechaRegistro: "2026-06-15T08:30:00.000Z"
  },
  {
    id: "3",
    nombreEmpresa: "BioMed Innovations",
    tipo: "Incumplimiento de Metas",
    gravedad: "Baja",
    detalles: "Diferencia menor en empleos reportados vs comprometidos.",
    estado: "Resuelta",
    fechaRegistro: "2026-05-20T14:00:00.000Z"
  }
];

let alertasGlobales = [];

// Referencias al DOM
const contenedorAlertas = document.getElementById("contenedor-alertas") || document.getElementById("tabla-alertas");
const filtroGravedad = document.getElementById("filtro-gravedad");
const cargandoModal = document.getElementById("indicador-carga");

// Cargar Alertas desde json-server (RF-12, RF-21)
async function cargarAlertas() {
  if (cargandoModal) cargandoModal.hidden = false;

  try {
    const respuesta = await fetch(`${API_BASE_URL}/alertas`);
    if (!respuesta.ok) throw new Error("Servidor no disponible");
    alertasGlobales = await respuesta.json();
  } catch (error) {
    console.warn("JSON-Server no disponible, usando datos mock:", error.message);
    alertasGlobales = MOCK_ALERTAS;
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
  }

  renderizarAlertas(alertasGlobales);
}

// Renderizar Alertas en la interfaz
function renderizarAlertas(alertas) {
  if (!contenedorAlertas) return;

  const tbody = contenedorAlertas.querySelector("tbody") || contenedorAlertas;
  tbody.innerHTML = "";

  if (alertas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay alertas registradas actualmente.</td></tr>`;
    return;
  }

  alertas.forEach((alerta) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><strong>${alerta.nombreEmpresa || 'Empresa Indefinida'}</strong></td>
      <td>${alerta.tipo || 'Incumplimiento'}</td>
      <td><span class="badge badge--${obtenerClaseGravedad(alerta.gravedad)}">${alerta.gravedad || 'Media'}</span></td>
      <td>${alerta.detalles || 'Sin detalles adicionales'}</td>
      <td>
        <button class="boton boton--secundario boton--sm" data-id="${alerta.id}" ${alerta.estado === 'Resuelta' ? 'disabled' : ''}>
          ${alerta.estado === 'Resuelta' ? '✅ Resuelta' : 'Marcar Resuelta'}
        </button>
      </td>
    `;

    if (alerta.estado !== 'Resuelta') {
      fila.querySelector("button").addEventListener("click", () => resolverAlerta(alerta));
    }

    tbody.appendChild(fila);
  });
}

function obtenerClaseGravedad(gravedad) {
  switch (String(gravedad).toLowerCase()) {
    case 'alta': case 'critica': return 'error';
    case 'media': return 'advertencia';
    default: return 'neutro';
  }
}

// Resolver Alerta y registrar en Trazabilidad (RF-19, RF-21)
async function resolverAlerta(alerta) {
  if (cargandoModal) cargandoModal.hidden = false;

  try {
    const resAlerta = await fetch(`${API_BASE_URL}/alertas/${alerta.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Resuelta", fechaResolucion: new Date().toISOString() })
    });

    if (!resAlerta.ok) throw new Error("No se pudo actualizar la alerta.");

    // Registrar en historial (RF-19)
    await fetch(`${API_BASE_URL}/historial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alertaId: alerta.id,
        empresa: alerta.nombreEmpresa,
        accion: "Alerta Atendida y Resuelta",
        usuario: "Analista de Cumplimiento",
        fecha: new Date().toISOString()
      })
    });

  } catch (error) {
    console.warn("Servidor offline — resolución aplicada solo en UI:", error.message);
    // Actualizar estado en mock local para que la UI refleje el cambio
    const idx = alertasGlobales.findIndex(a => a.id === alerta.id);
    if (idx !== -1) alertasGlobales[idx].estado = "Resuelta";
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
    renderizarAlertas(alertasGlobales);
  }
}

// Filtrado de alertas (RF-20)
if (filtroGravedad) {
  filtroGravedad.addEventListener("change", (e) => {
    const valor = e.target.value;
    if (!valor || valor === 'todas') {
      renderizarAlertas(alertasGlobales);
    } else {
      const filtradas = alertasGlobales.filter(a => String(a.gravedad).toLowerCase() === valor.toLowerCase());
      renderizarAlertas(filtradas);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Cargar alertas desde API o mock
  cargarAlertas();

  // Seguridad: delegación de eventos en botones estáticos del HTML
  // (para tarjetas hardcodeadas en alertas.html, si existen)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    // Botones "Marcar gestionada" en tarjetas estáticas del HTML
    if (btn.textContent.trim().includes("Marcar gestionada") || btn.dataset.accion === "gestionar") {
      e.preventDefault();
      const tarjeta = btn.closest(".tarjeta-alerta") || btn.closest(".tarjeta-panel") || btn.closest("article") || btn.closest("div");
      if (tarjeta) {
        tarjeta.style.opacity = "0.5";
        tarjeta.style.transition = "opacity 0.3s ease";
      }
      btn.textContent = "✓ Gestionada";
      btn.disabled = true;
    }
  });
});