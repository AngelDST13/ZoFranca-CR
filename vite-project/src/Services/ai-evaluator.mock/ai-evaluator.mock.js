const UMBRAL_RECOMENDADA = 70;
const UMBRAL_REVISAR = 40;

export const criteriosBase = [
  { id: "inversion", etiqueta: "Inversión ≥ mínimo de la zona", peso: 0.4 },
  { id: "empleos", etiqueta: "Empleos ≥ mínimo de la zona", peso: 0.35 },
  { id: "sector", etiqueta: "Sector permitido en la zona", peso: 0.25 }
];

function sugerencia(puntaje) {
  if (puntaje >= UMBRAL_RECOMENDADA) return "Recomendada";
  if (puntaje >= UMBRAL_REVISAR) return "Revisar";
  return "Rechazada";
}

export function calcularPuntaje({ inversion, empleos, sector }, zonaFranca) {
  const cumpleInversion = inversion >= zonaFranca.inversion_minima;
  const cumpleEmpleos = empleos >= zonaFranca.empleos_minimos;
  const sectorPermitido = zonaFranca.sectores_permitidos.includes(sector);

  let puntaje = 20;
  if (cumpleInversion) puntaje += 30;
  if (cumpleEmpleos) puntaje += 25;
  if (sectorPermitido) puntaje += 25;

  return {
    puntaje,
    sugerencia: sugerencia(puntaje),
    criterios: [
      { ...criteriosBase[0], cumple: cumpleInversion },
      { ...criteriosBase[1], cumple: cumpleEmpleos },
      { ...criteriosBase[2], cumple: sectorPermitido }
    ]
  };
}

export async function preEvaluar(solicitud, zonaFranca) {
  await new Promise((resuelto) => setTimeout(resuelto, 400));
  return calcularPuntaje(solicitud, zonaFranca);
}

export async function evaluarEnLote(solicitudes, zonaFranca) {
  return Promise.all(
    solicitudes.map(async (solicitud) => ({
      empresa: solicitud.empresa,
      ...(await preEvaluar(solicitud, zonaFranca))
    }))
  );
}
