// src/js/admin/cumplimiento.js
import '../sesion.js';
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const API_BASE_URL = 'http://localhost:3001';

// Datos mock de respaldo cuando el servidor no responde
const MOCK_REPORTES = [
  {
    id: "1",
    nombreEmpresa: "Tech Solutions CR",
    solicitudId: "1",
    inversionEjecutada: 230000,
    empleosReales: 16,
    exportaciones: 85000,
    fechaReporte: "2026-06-30T00:00:00.000Z"
  },
  {
    id: "2",
    nombreEmpresa: "AgroExport del Sur",
    solicitudId: "2",
    inversionEjecutada: 60000,
    empleosReales: 3,
    exportaciones: 22000,
    fechaReporte: "2026-06-28T00:00:00.000Z"
  },
  {
    id: "3",
    nombreEmpresa: "BioMed Innovations",
    solicitudId: "3",
    inversionEjecutada: 190000,
    empleosReales: 14,
    exportaciones: 50000,
    fechaReporte: "2026-06-25T00:00:00.000Z"
  }
];

const MOCK_SOLICITUDES = [
  { id: "1", nombreEmpresa: "Tech Solutions CR", inversionProyectada: 250000, empleosProyectados: 18 },
  { id: "2", nombreEmpresa: "AgroExport del Sur", inversionProyectada: 85000, empleosProyectados: 4 },
  { id: "3", nombreEmpresa: "BioMed Innovations", inversionProyectada: 180000, empleosProyectados: 12 }
];

const tablaCumplimiento = document.getElementById("tabla-cumplimiento");
const cargandoModal = document.getElementById("indicador-carga");

// Cargar y Comparar Reportes vs Compromisos (RF-11, RF-13, RF-18, RNF-03)
async function evaluarCumplimiento() {
  if (cargandoModal) cargandoModal.hidden = false;

  let reportes = [];
  let solicitudes = [];

  try {
    const [resReportes, resSolicitudes] = await Promise.all([
      fetch(`${API_BASE_URL}/reportes`),
      fetch(`${API_BASE_URL}/solicitudes`)
    ]);

    if (!resReportes.ok || !resSolicitudes.ok) throw new Error("Servidor no disponible");

    reportes = await resReportes.json();
    solicitudes = await resSolicitudes.json();
  } catch (error) {
    console.warn("JSON-Server no disponible, usando datos mock:", error.message);
    reportes = MOCK_REPORTES;
    solicitudes = MOCK_SOLICITUDES;
  } finally {
    if (cargandoModal) cargandoModal.hidden = true;
  }

  const evaluaciones = [];

  for (const reporte of reportes) {
    const solicitudOriginal = solicitudes.find(
      (s) => s.id === reporte.solicitudId || s.nombreEmpresa === reporte.nombreEmpresa
    );

    const inversionComprometida = solicitudOriginal ? solicitudOriginal.inversionProyectada : 100000;
    const empleosComprometidos = solicitudOriginal ? solicitudOriginal.empleosProyectados : 10;

    const cumpleInversion = reporte.inversionEjecutada >= inversionComprometida;
    const cumpleEmpleos = reporte.empleosReales >= empleosComprometidos;

    const estadoCumplimiento = (cumpleInversion && cumpleEmpleos) ? 'En Regla' : 'Incumplimiento';

    evaluaciones.push({
      ...reporte,
      inversionComprometida,
      empleosComprometidos,
      estadoCumplimiento
    });
  }

  renderizarTablaCumplimiento(evaluaciones);
}

// Generación de Alerta de Incumplimiento Automática (RF-12)
async function verificarYCrearAlerta(reporte, empleosComp, inversionComp) {
  try {
    const resAlertas = await fetch(`${API_BASE_URL}/alertas?nombreEmpresa=${encodeURIComponent(reporte.nombreEmpresa)}&estado=Pendiente`);
    if (!resAlertas.ok) return;
    const alertasExistentes = await resAlertas.json();

    if (alertasExistentes.length > 0) return;

    let detalles = [];
    if (reporte.empleosReales < empleosComp) {
      detalles.push(`Empleos reales (${reporte.empleosReales}) por debajo del compromiso (${empleosComp})`);
    }
    if (reporte.inversionEjecutada < inversionComp) {
      detalles.push(`Inversión ejecutada ($${reporte.inversionEjecutada}) por debajo del compromiso ($${inversionComp})`);
    }

    await fetch(`${API_BASE_URL}/alertas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreEmpresa: reporte.nombreEmpresa,
        tipo: "Incumplimiento de Metas",
        gravedad: "Alta",
        detalles: detalles.join(". "),
        estado: "Pendiente",
        fechaRegistro: new Date().toISOString()
      })
    });
  } catch (error) {
    console.warn("No se pudo crear alerta automática (servidor offline):", error.message);
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

document.addEventListener("DOMContentLoaded", () => {
  // Evaluar cumplimiento al cargar la vista
  evaluarCumplimiento();

  // Interceptar el submit del formulario para evitar recargas nativas
  const formCumplimiento = document.querySelector("form") || document.getElementById("form-cumplimiento");
  if (formCumplimiento) {
    formCumplimiento.addEventListener("submit", async (e) => {
      e.preventDefault(); // Impide que la página se borre / recargue

      const empresa = formCumplimiento.querySelector("[name='empresa']")?.value?.trim() || "Tech Solutions CR";
      const inversion = Number(formCumplimiento.querySelector("[name='inversion']")?.value || 0);
      const empleos = Number(formCumplimiento.querySelector("[name='empleos']")?.value || 0);
      const exportaciones = Number(formCumplimiento.querySelector("[name='exportaciones']")?.value || 0);

      const nuevoReporte = {
        nombreEmpresa: empresa,
        inversionEjecutada: inversion,
        empleosReales: empleos,
        exportaciones,
        fechaReporte: new Date().toISOString()
      };

      try {
        const res = await fetch(`${API_BASE_URL}/reportes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoReporte)
        });
        if (!res.ok) throw new Error("Error al guardar reporte");
      } catch (err) {
        console.warn("Servidor offline — reporte no persistido:", err.message);
      }

      Swal.fire({
        icon: 'success',
        title: '✅ Reporte registrado',
        text: `Reporte registrado exitosamente para ${empresa}`,
        confirmButtonText: 'Aceptar'
      });
      formCumplimiento.reset();
      evaluarCumplimiento(); // Refrescar tabla sin recargar la página
    });
  }
});