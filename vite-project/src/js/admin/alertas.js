// src/js/admin/alertas.js
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';

const API_BASE_URL = 'http://localhost:3001';

// Control de Sesión
if (window.ZFSesion && typeof window.ZFSesion.requerir === 'function') {
  window.ZFSesion.requerir();
}

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
    if (!respuesta.ok) throw new Error("Error al obtener las alertas.");

    alertasGlobales = await respuesta.json();
    renderizarAlertas(alertasGlobales);

  } catch (error) {
    console.error("Error cargando alertas:", error);
    if (contenedorAlertas) {
      contenedorAlertas.innerHTML = `<div class="alerta alerta--error">No se pudieron cargar las alertas. Verifique la conexión con el servidor.</div>`;
    }
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
  }
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
        <button class="boton boton--secundario boton--sm" data-id="${alerta.id}">
          ${alerta.estado === 'Resuelta' ? 'Resuelta' : 'Marcar Resuelta'}
        </button>
      </td>
    `;

    const botonResolver = fila.querySelector("button");
    if (alerta.estado === 'Resuelta') {
      botonResolver.disabled = true;
    } else {
      botonResolver.addEventListener("click", () => resolverAlerta(alerta));
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
    // 1. Actualizar estado de la alerta
    const resAlerta = await fetch(`${API_BASE_URL}/alertas/${alerta.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Resuelta", fechaResolucion: new Date().toISOString() })
    });

    if (!resAlerta.ok) throw new Error("No se pudo actualizar la alerta.");

    // 2. Registrar en historial de auditoría (RF-19)
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

    await cargarAlertas();

  } catch (error) {
    console.error("Error al resolver alerta:", error);
    alert("No se pudo actualizar el estado de la alerta.");
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
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

document.addEventListener("DOMContentLoaded", cargarAlertas);