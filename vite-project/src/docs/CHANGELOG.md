# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/).

## [Unreleased] - 2026-08-22

### Corregido (Fixed)
- **Alertas (`alertas.html`):**
  - Ajustada la jerarquía de carga de scripts ordenando `sesion.js` previo a los módulos de JS[cite: 4].
  - Integrados estilos en línea y CSS de estructura para corregir la alineación del logo de la marca y las tarjetas de alertas[cite: 4].

- **Cumplimiento (`cumplimiento.html`):**
  - Corregida la desalineación visual en la tabla lateral de "Últimos reportes"[cite: 5].
  - Removidos scripts e importaciones duplicadas al final del archivo HTML[cite: 5].

- **Panel de Administración (`admin_2.html`):**
  - Identificada y estructurada la sección del pie de página (`.pie-tabla`) que contiene los componentes de paginación de solicitudes[cite: 6].
  - Documentadas las reglas de estilos CSS para asegurar el resalte y la visibilidad adecuada de la paginación[cite: 6].