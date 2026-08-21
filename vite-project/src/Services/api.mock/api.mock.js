export const zonasFrancas = [
  {
    id: 1,
    nombre: "Zona Franca Metropolitana",
    inversion_minima: 1000000,
    empleos_minimos: 50,
    sectores_permitidos: ["Tecnología", "Manufactura", "Servicios", "Ciencias de la Vida"],
    estado: "activa"
  }
];

export const solicitudes = [
  {
    id: 1,
    codigo: "SOL-2026-001",
    empresa: "Tech Solutions CR",
    sector: "Tecnología",
    inversion: 1500000,
    empleos: 75,
    zona_franca_id: 1,
    estado: "aprobada",
    puntaje_ia: 85,
    fecha_solicitud: "2026-08-20"
  },
  {
    id: 2,
    codigo: "SOL-2026-002",
    empresa: "DataCore Labs",
    sector: "Servicios",
    inversion: 2300000,
    empleos: 120,
    zona_franca_id: 1,
    estado: "pendiente",
    puntaje_ia: 92,
    fecha_solicitud: "2026-08-20"
  },
  {
    id: 3,
    codigo: "SOL-2026-003",
    empresa: "BioVida CR",
    sector: "Ciencias de la Vida",
    inversion: 3100000,
    empleos: 200,
    zona_franca_id: 1,
    estado: "aprobada",
    puntaje_ia: 88,
    fecha_solicitud: "2026-08-18"
  },
  {
    id: 4,
    codigo: "SOL-2026-004",
    empresa: "AgroExport SA",
    sector: "Manufactura",
    inversion: 980000,
    empleos: 42,
    zona_franca_id: 1,
    estado: "pendiente",
    puntaje_ia: 58,
    fecha_solicitud: "2026-08-17"
  },
  {
    id: 5,
    codigo: "SOL-2026-005",
    empresa: "Textiles del Este",
    sector: "Manufactura",
    inversion: 650000,
    empleos: 30,
    zona_franca_id: 1,
    estado: "rechazada",
    puntaje_ia: 34,
    fecha_solicitud: "2026-08-15"
  }
];

export const reportes = [
  {
    id: 1,
    solicitud_id: 1,
    empresa: "Tech Solutions CR",
    periodo: "2026-Q2",
    inversion_real: 1600000,
    empleos_actuales: 80,
    cumple_inversion: true,
    cumple_empleos: true,
    estado_cumplimiento: "cumple",
    fecha_reporte: "2026-08-20"
  },
  {
    id: 2,
    solicitud_id: 3,
    empresa: "BioVida CR",
    periodo: "2026-Q2",
    inversion_real: 2950000,
    empleos_actuales: 195,
    cumple_inversion: true,
    cumple_empleos: false,
    estado_cumplimiento: "cumple",
    fecha_reporte: "2026-08-19"
  },
  {
    id: 3,
    solicitud_id: 4,
    empresa: "AgroExport SA",
    periodo: "2026-Q2",
    inversion_real: 410000,
    empleos_actuales: 36,
    cumple_inversion: false,
    cumple_empleos: false,
    estado_cumplimiento: "advertencia",
    fecha_reporte: "2026-08-18"
  },
  {
    id: 4,
    solicitud_id: 5,
    empresa: "Textiles del Este",
    periodo: "2026-Q2",
    inversion_real: 520000,
    empleos_actuales: 22,
    cumple_inversion: false,
    cumple_empleos: false,
    estado_cumplimiento: "desviacion",
    fecha_reporte: "2026-08-19"
  }
];

export const historialDecisiones = [
  {
    id: 1,
    solicitud_id: 1,
    decision: "aprobada",
    usuario: "Marta Arroyo",
    fecha: "2026-08-20",
    comentario: "La empresa cumple con los criterios mínimos establecidos."
  },
  {
    id: 2,
    solicitud_id: 3,
    decision: "aprobada",
    usuario: "Marta Arroyo",
    fecha: "2026-08-19",
    comentario: "Proyecto estratégico para el clúster médico."
  },
  {
    id: 3,
    solicitud_id: 5,
    decision: "sugerencia_rechazo",
    usuario: "IA evaluadora",
    fecha: "2026-08-16",
    comentario: "Puntaje 34/100: no alcanza mínimos de inversión ni empleo."
  }
];

const esperar = (ms) => new Promise((resuelto) => setTimeout(resuelto, ms));

export async function obtenerSolicitudes() {
  await esperar(300);
  return [...solicitudes];
}

export async function obtenerReportes() {
  await esperar(300);
  return [...reportes];
}

export async function obtenerZonasFrancas() {
  await esperar(200);
  return [...zonasFrancas];
}

export async function evaluarLote(listado) {
  return Promise.all(
    listado.map(async (solicitud) => {
      await esperar(150);
      return { ...solicitud };
    })
  );
}
