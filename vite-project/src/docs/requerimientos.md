
# Documento de Requerimientos - ZoFranca CR

## 1. Visión del Sistema

ZoFranca CR es una plataforma para automatizar la recepción, pre-evaluación por IA y seguimiento de cumplimiento de las empresas en el régimen de zonas francas de Costa Rica[cite: 1].

## 2. Requerimientos Funcionales Clave (RF)

- **RF-02:** Formulario de solicitud de instalación (Inversión, Empleos, Sector)[cite: 1].
- **RF-03:** Conexión asíncrona con el backend `json-server` (puerto 3001)[cite: 1].
- **RF-04 / RF-05:** Pre-clasificación por IA con puntaje de afinidad (0–100) y badges de estado[cite: 1].
- **RF-06 / RF-08:** Reportes de cumplimiento y alertas por desviación de compromisos[cite: 1].
- **RF-12:** Decisión final reservada al analista humano[cite: 1].
- **RF-13:** Procesamiento en paralelo mediante `Promise.all`[cite: 1].

## 3. Requerimientos No Funcionales (RNF)

- **RNF-01:** Manejo asíncrono no bloqueante con `async/await`[cite: 1].
- **RNF-06:** Persistencia de datos en `db.json` vía Node/json-server[cite: 1].
- **RNF-07:** Interfaz construida en base a los prototipos de Stitch[cite: 1].
