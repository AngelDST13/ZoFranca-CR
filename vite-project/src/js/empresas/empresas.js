// src/js/empresas/empresas.js
import '../sesion.js';
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const API_BASE_URL = 'http://localhost:3001';

const usuarioActivo = JSON.parse(localStorage.getItem("zf_usuario"));
if (usuarioActivo) {
  const elNombre = document.querySelector(".info-usuario strong");
  const elRol = document.querySelector(".info-usuario small");
  if (elNombre) elNombre.textContent = usuarioActivo.nombre;
  if (elRol) elRol.textContent = usuarioActivo.rol === "analista" ? "Analista Senior" : "Empresa Solicitante";
}

// Control de Sesión
if (window.ZFSesion && typeof window.ZFSesion.requerir === 'function') {
  window.ZFSesion.requerir();
}

// Navegación Lateral y Menú Responsive
const botonMenu = document.getElementById("boton-menu");
const barraLateral = document.getElementById("barra-lateral");
const fondoMenu = document.getElementById("fondo-menu");

if (botonMenu && barraLateral && fondoMenu) {
  function alternarMenu(abierto) {
    barraLateral.classList.toggle("barra-lateral--abierta", abierto);
    fondoMenu.classList.toggle("fondo-menu--visible", abierto);
    botonMenu.setAttribute("aria-expanded", String(abierto));
  }

  botonMenu.addEventListener("click", () => {
    alternarMenu(!barraLateral.classList.contains("barra-lateral--abierta"));
  });

  fondoMenu.addEventListener("click", () => alternarMenu(false));
}

// Lógica de Modales
const modal = document.getElementById("modal-decision");
if (modal) {
  const empresaModal = document.getElementById("modal-empresa");

  document.querySelectorAll("[data-abre-modal]").forEach((boton) => {
    boton.addEventListener("click", () => {
      if (empresaModal && boton.dataset.empresa) {
        empresaModal.textContent = boton.dataset.empresa;
      }
      modal.hidden = false;
      const primeraOpcion = modal.querySelector('input[name="decision"]');
      if (primeraOpcion) primeraOpcion.focus();
    });
  });

  const cerrarModal = () => { modal.hidden = true; };

  document.querySelectorAll("[data-cierra-modal]").forEach((boton) => {
    boton.addEventListener("click", cerrarModal);
  });

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modal.hidden) cerrarModal();
  });
}

// Manejo Asíncrono del Formulario de Solicitud/Reporte (RF-08, RF-09, RF-11, RF-12, RF-13, RF-15, RF-16)
const formularioSolicitud = document.getElementById("formulario-solicitud");
const cargandoModal = document.getElementById("indicador-carga");

if (formularioSolicitud) {
  formularioSolicitud.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const botonSubmit = formularioSolicitud.querySelector('button[type="submit"]');
    if (botonSubmit) botonSubmit.disabled = true;
    if (cargandoModal) cargandoModal.hidden = false;

    // Extraer datos del formulario
    const datosFormulario = new FormData(formularioSolicitud);
    const nuevaSolicitud = {
      nombreEmpresa: datosFormulario.get("nombreEmpresa") || "Empresa Sin Nombre",
      sector: datosFormulario.get("sector") || "General",
      inversionProyectada: Number(datosFormulario.get("inversionProyectada")) || 0,
      empleosProyectados: Number(datosFormulario.get("empleosProyectados")) || 0,
      estado: "Pendiente",
      resultadoIA: "Pendiente de evaluación",
      puntajeIA: 0,
      fechaRegistro: new Date().toISOString()
    };

    try {
      // 1. Guardado asíncrono en db.json a través de fetch (RF-09)
      const respuesta = await fetch(`${API_BASE_URL}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaSolicitud)
      });

      if (!respuesta.ok) throw new Error("Error al guardar la solicitud en el servidor.");

      const solicitudGuardada = await respuesta.json();

      // 2. Trazabilidad: Registrar en el historial (RF-19, RF-21)
      await fetch(`${API_BASE_URL}/historial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitudId: solicitudGuardada.id,
          accion: "Solicitud Registrada",
          usuario: "Empresa Solicitante",
          fecha: new Date().toISOString()
        })
      });

      // Redirección con ID para detalle de solicitud
      window.location.href = `detalle-solicitud.html?id=${solicitudGuardada.id}`;

    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo completar el registro de la solicitud. Verifique que el servidor backend esté en ejecución.',
        confirmButtonText: 'Cerrar'
      });
    } finally {
      if (botonSubmit) botonSubmit.disabled = false;
      if (cargandoModal) cargandoModal.hidden = true;
    }
  });
}