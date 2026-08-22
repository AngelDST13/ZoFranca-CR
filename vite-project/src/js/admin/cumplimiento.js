// src/js/admin/cumplimiento.js
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';

const API_BASE_URL = 'http://localhost:3001';

// Control de Sesión
if (window.ZFSesion && typeof window.ZFSesion.requerir === 'function') {
  window.ZFSesion.requerir();
}

const tablaCumplimiento = document.getElementById("tabla-cumplimiento");
const cargandoModal = document.getElementById("indicador-carga");

// Cargar y Comparar Reportes vs Compromisos (RF-11, RF-13, RF-18, RNF-03)
async function evaluarCumplimiento() {
  if (cargandoModal) cargandoModal.hidden = false;

  try {
    // Consulta en paralelo con Promise.all (RF-18)
    const [resReportes, resSolicitudes] = await Promise.all([
      fetch(`${API_BASE_URL}/reportes`),
      fetch(`${API_BASE_URL}/solicitudes`)
    ]);

    if (!resReportes.ok || !resSolicitudes.ok) {
      throw new Error("No se pudieron cargar los reportes de cumplimiento.");
    }

    const reportes = await resReportes.json();
    const solicitudes = await resSolicitudes.json();

    const evaluaciones = [];

    for (const reporte of reportes) {
      // Buscar la solicitud original asociada a la empresa
      const solicitudOriginal = solicitudes.find(
        (s) => s.id === reporte.solicitudId || s.nombreEmpresa === reporte.nombreEmpresa
      );

      const inversionComprometida = solicitudOriginal ? solicitudOriginal.inversionProyectada : 100000;
      const empleosComprometidos = solicitudOriginal ? solicitudOriginal.empleosProyectados : 10;

      const cumpleInversion = reporte.inversionEjecutada >= inversionComprometida;
      const cumpleEmpleos = reporte.empleosReales >= empleosComprometidos;

      const estadoCumplimiento = (cumpleInversion && cumpleEmpleos) ? 'En Regla' : 'Incumplimiento';

      // Si hay incumplimiento, verificar si ya existe una alerta generada o crearla (RF-12, RF-13)
      if (estadoCumplimiento === 'Incumplimiento') {
        await verifocarYCrearAlerta(reporte, empleosComprometidos, inversionComprometida);
      }

      evaluaciones.push({
        ...reporte,
        inversionComprometida,
        empleosComprometidos,
        estadoCumplimiento
      });
    }

    renderizarTablaCumplimiento(evaluaciones);

  } catch (error) {
    console.error("Error evaluando cumplimiento:", error);
    if (tablaCumplimiento) {
      tablaCumplimiento.innerHTML = `<tr><td colspan="6" style="text-align:center;">Error al procesar el resumen de cumplimiento.</td></tr>`;
    }
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
  }
}

// Generación de Alerta de Incumplimiento Automática (RF-12)
async function verifocarYCrearAlerta(reporte, empleosComp, inversionComp) {
  try {
    const resAlertas = await fetch(`${API_BASE_URL}/alertas?nombreEmpresa=${encodeURIComponent(reporte.nombreEmpresa)}&estado=Pendiente`);
    const alertasExistentes = await resAlertas.json();

    // Si ya tiene una alerta activa pendiente, no duplicar
    if (alertasExistentes.length > 0) return;

    let detalles = [];
    if (reporte.empleosReales < empleosComp) {
      detalles.push(`Empleos reales (${reporte.empleosReales}) por debajo del compromiso (${empleosComp})`);
    }
    if (reporte.inversionEjecutada < inversionComp) {
      detalles.push(`Inversión ejecutada ($${reporte.inversionEjecutada}) por debajo del compromiso ($${inversionComp})`);
    }

    const nuevaAlerta = {
      nombreEmpresa: reporte.nombreEmpresa,
      tipo: "Incumplimiento de Metas",
      gravedad: "Alta",
      detalles: detalles.join(". "),
      estado: "Pendiente",
      fechaRegistro: new Date().toISOString()
    };

    await fetch(`${API_BASE_URL}/alertas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaAlerta)
    });

  } catch (error) {
    console.error("Error al crear alerta de incumplimiento:", error);
  }
}

// Renderizado de Resumen Consolidado (RF-14)
function renderizarTablaCumplimiento(lista) {
  if (!tablaCumplimiento) return;

  const tbody = tablaCumplimiento.querySelector("tbody") || tablaCumplimiento;
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay reportes de cumplimiento recibidos.</td></tr>`;
    return;
  }

  lista.forEach((item) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.nombreEmpresa || 'N/A'}</td>
      <td>$${Number(item.inversionEjecutada || 0).toLocaleString()} / <small>$${Number(item.inversionComprometida || 0).toLocaleString()}</small></td>
      <td>${item.empleosReales || 0} / <small>${item.empleosComprometidos || 0}</small></td>
      <td>$${Number(item.exportaciones || 0).toLocaleString()}</td>
      <td>
        <span class="badge badge--${item.estadoCumplimiento === 'En Regla' ? 'exito' : 'error'}">
          ${item.estadoCumplimiento}
        </span>
      </td>
      <td>${new Date(item.fechaReporte || Date.now()).toLocaleDateString()}</td>
    `;
    tbody.appendChild(fila);
  });
}

document.addEventListener("DOMContentLoaded", evaluarCumplimiento);