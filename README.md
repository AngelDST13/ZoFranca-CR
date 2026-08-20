# ZoFranca CR - Plataforma de Gestion y Cumplimiento para Zonas Francas

ZoFranca CR es una solucion web integral disenada para digitalizar, agilizar y transparentar el proceso de solicitud de instalacion y seguimiento de cumplimiento para las empresas dentro del regimen de zonas francas en Costa Rica^^.

El sistema reemplaza los procesos manuales por una arquitectura moderna basada en procesamiento asincono, pre-clasificacion mediante Inteligencia Artificial y persistencia de datos con json-server^^.

## Caracteristicas Principales

* **Gestion Asincrona de Solicitudes:** Registro de empresas (inversion, empleos y sector) sin congelar la interfaz mediante async/await^^.
* **Pre-evaluacion por IA:** Analisis automatico de la solicitud que genera un puntaje de afinidad (0-100) y badges de sugerencia (Recomendada, Revisar, Rechazada)^^.
* **Control y Decision Humana:** Panel donde el analista de la zona franca revisa la justificacion de la IA y toma la decision final^^.
* **Monitoreo y Alertas de Cumplimiento:** Deteccion de desviaciones cuando los reportes reales de las empresas estan por debajo de los compromisos iniciales^^.
* **Procesamiento en Paralelo:** Evaluacion masiva de solicitudes utilizando Promise.all^^.
* **Diseno Moderno:** Interfaz responsiva con acabados Glassmorphism, soporte para modo claro/oscuro y estado visual de carga^^.

## Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Glassmorphism), JavaScript ES6+ (Modulos)^^.
* **Herramienta de Construccion:** Vite.
* **Backend Simulado:** Node.js + json-server^^.
* **Diseno UI/UX:** Stitch^^.
* **Control de Versiones:** Git y GitHub^^.

## Estructura del Proyecto

**Plaintext**

```
vite-project/
├── public/
├── src/
│   ├── assets/
│   ├── docs/
│   │   ├── arquitectura.md
│   │   ├── CHANGELOG.md
│   │   ├── CLAUDE.md
│   │   ├── CONTRIBUTING.md
│   │   └── requerimientos.md
│   ├── images/
│   ├── js/
│   ├── pages/
│   ├── services/
│   ├── index.html
│   ├── main.js
│   └── style.css
├── db.json
├── package.json
└── README.md
```
