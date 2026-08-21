ZoFranca CR — Arquitectura y generación de interfaz (Fase 1: UI Visual)

1. Rol
Actúa como un desarrollador Front-End Senior y Diseñador UI/UX Senior, especializado en interfaces web corporativas modernas, accesibles, responsivas y mantenibles.
Tu tarea es desarrollar únicamente la capa visual (UI) del proyecto ZoFranca CR, respetando la estructura modular actual del proyecto y los requerimientos visuales.

IMPORTANTE: Esta es la FASE 1: INTERFAZ VISUAL. No debes implementar lógica de negocio real, autenticación con backend, bases de datos ni conexiones reales.

2. Objetivo de esta fase
Construir la interfaz visual completa utilizando HTML5 semántico, CSS3 y JavaScript puro (únicamente para control visual de menús/modales), bajo una arquitectura compatible con Vite, con diseño 100% responsive, componentes reutilizables y datos estáticos de prueba (mocks).

3. Identidad visual obligatoria
Utilizar estrictamente estas variables CSS globales en todo el proyecto (`src/css/variables.css`):
:root {
  --zofranca-azul-real: #1F5D8E;   /* Botones principales, enlaces activos, acciones, bordes destacados */
  --zofranca-azul-marino: #2C3E50; /* Sidebar, navegación, encabezados importantes, títulos */
  --zofranca-verde: #28A745;       /* Estados aprobados, indicadores positivos, métricas favorables */
  --zofranca-gris-medio: #6C757D;  /* Textos secundarios, iconos, bordes sutiles */
  --zofranca-gris-claro: #F4F6F8;  /* Fondo general, áreas de trabajo, auth */
  --zofranca-blanco: #FFFFFF;      /* Tarjetas, formularios, contenedores */
}

4. Estructura de carpetas actualizada (Respetando el árbol del proyecto)
La estructura dentro de src/ debe organizarse de la siguiente manera:
src/
├── css/
│   ├── variables.css
│   ├── global.css
│   ├── components.css
│   ├── landing.css
│   ├── login.css
│   └── dashboard.css
├── js/
│   ├── admin/
│   │   └── admin.js
│   ├── empresas/
│   │   └── empresas.js
│   └── login/
│       └── login.js
├── pages/
│   ├── admin/
│   │   └── admin.html         (Panel del analista / gestor)
│   ├── empresas/
│   │   ├── empresas.html      (Vistas de empresas / solicitudes)
│   │   └── solicitud.html     (Formulario de nueva solicitud)
│   └── login/
│       └── login.html         (Pantalla de autenticación visual)
├── services/
│   ├── api.mock.js            (Estructuras base y funciones simuladas de datos)
│   └── ai-evaluator.mock.js   (Simulación visual del puntaje de IA)
└── index.html                 (Landing page principal)

5. Páginas y vistas clave a maquetar
- index.html (Landing corporativa con Hero, características y llamada a la acción).
- login.html (Pantalla de acceso visual con redirección simulada).
- admin.html (Panel de gestión principal con Sidebar, métricas con acentos verdes y tabla de solicitudes).
- empresas.html / detalle-solicitud.html (Vista detallada con desglose de inversión, empleos y ponderación visual de IA vs Decisión Humana).
- cumplimiento.html / alertas.html (Formularios de reporte de compromisos y panel visual de alertas de incumplimiento).

6. Restricciones de esta fase
NO implementar lógica real de backend, fetch a servidores externos, bases de datos, localStorage persistente para sesiones complejas, ni validaciones de negocio pesadas. La navegación debe conectar visualmente las páginas para demostrar el flujo de usuario.