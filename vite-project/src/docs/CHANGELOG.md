# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto adhiere a [Semantic Versioning](https://semver.org/).

## [Unreleased] - 2026-08-22

### Añadido (Added)

- **Vista Administrador (`admin.html`):** Integración y alineación de la paginación dentro del pie de tabla (`.pie-tabla`)[cite: 6].

### Corregido (Fixed)

- **Vista Alertas (`alertas.html`):**
  - Ajuste en el orden de scripts (`sesion.js` antes del módulo JS)[cite: 4].
  - Corrección de la estructura de tarjetas y alineación de la marca `ZF ZoFranca CR`[cite: 4].

- **Vista Cumplimiento (`cumplimiento.html`):**
  - Corrección del desbordamiento en la tabla secundaria "Últimos reportes"[cite: 5].
  - Limpieza de scripts e importaciones duplicadas[cite: 5].

- **Estilos (`dashboard.css`):**
  - Ajustes de responsividad y scroll interno para tablas en contenedores secundarios[cite: 5, 6]
