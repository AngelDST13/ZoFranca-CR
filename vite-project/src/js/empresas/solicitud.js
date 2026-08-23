// src/js/empresas/solicitud.js
import '../../css/global.css';
import '../../css/components.css';
import '../../css/dashboard.css';
import '../sesion.js';

// Base de datos local mock para la demostración
const empresasBD = {
  "SOL-2026-001": {
    nombre: "Tech Solutions CR",
    sector: "Tecnología",
    inversion: "$1,500,000",
    empleos: "75",
    puntaje: "85",
    estado: "Aprobada",
    analista: "Marta Arroyo"
  },
  "SOL-2026-002": {
    nombre: "DataCore Labs",
    sector: "Servicios",
    inversion: "$2,300,000",
    empleos: "120",
    puntaje: "92",
    estado: "En evaluación",
    analista: "Marta Arroyo"
  },
  "SOL-2026-003": {
    nombre: "BioVida CR",
    sector: "Ciencias de la Vida",
    inversion: "$3,100,000",
    empleos: "200",
    puntaje: "88",
    estado: "Aprobada",
    analista: "Marta Arroyo"
  },
  "SOL-2026-004": {
    nombre: "AgroExport SA",
    sector: "Manufactura",
    inversion: "$980,000",
    empleos: "42",
    puntaje: "58",
    estado: "Revisar",
    analista: "Marta Arroyo"
  },
  "SOL-2026-005": {
    nombre: "Textiles del Este",
    sector: "Manufactura",
    inversion: "$650,000",
    empleos: "30",
    puntaje: "34",
    estado: "Sugerida rechazo",
    analista: "Marta Arroyo"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Capturar ID de la URL
  const params = new URLSearchParams(window.location.search);
  const idSolicitud = params.get("id") || "SOL-2026-001"; // Fallback por defecto

  const datos = empresasBD[idSolicitud] || empresasBD["SOL-2026-001"];

  // 2. Renderizar datos en el HTML si existen las etiquetas correspondientes
  const elNombre = document.querySelector(".empresa-nombre") || document.querySelector("h1");
  const elSector = document.querySelector(".empresa-sector");
  const elInversion = document.querySelector(".empresa-inversion");
  const elEmpleos = document.querySelector(".empresa-empleos");
  const elPuntaje = document.querySelector(".empresa-puntaje");

  if (elNombre) elNombre.textContent = `Empresas / ${datos.nombre}`;
  if (elSector) elSector.textContent = datos.sector;
  if (elInversion) elInversion.textContent = datos.inversion;
  if (elEmpleos) elEmpleos.textContent = datos.empleos;
  if (elPuntaje) elPuntaje.textContent = datos.puntaje;
});