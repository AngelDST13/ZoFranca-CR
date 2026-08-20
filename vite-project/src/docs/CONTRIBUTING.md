# Guía de Contribución - ZoFranca CR

¡Bienvenido al repositorio de **ZoFranca CR**! Este documento establece las normas y el flujo de trabajo colaborativo mediante Git y GitHub[cite: 1].

## 1. Flujo de Trabajo con Ramas (Git Flow)

- La rama `main` contiene únicamente código estable e integrado[cite: 1].
- Cada integrante debe desarrollar sus funcionalidades en su respectiva rama personal (ejemplo: `Angel` o `feature/nombre-funcionalidad`)[cite: 1].
- **Nunca** se debe hacer commit directo sobre la rama `main`[cite: 1].

## 2. Convención de Mensajes de Commit

Sigue el formato estándar para los mensajes de confirmación:

- `feat:` Nuevas características o pantallas (ej. `feat: agregar formulario de solicitud`).
- `fix:` Corrección de errores de código o estilos.
- `docs:` Cambios o adiciones en la documentación de la carpeta `docs/`.
- `style:` Ajustes visuales, CSS o formato sin afectar lógica.

## 3. Proceso de Pull Request (PR)

1. Sube tus cambios a tu rama remota: `git push origin Angel`.
2. Crea un **Pull Request** hacia la rama `main` desde la interfaz de GitHub[cite: 1].
3. Tu compañero/a de pareja debe revisar la propuesta de cambios antes de autorizar la fusión (`merge`)[cite: 1].
