// src/js/tema.js
// Modo noche: aplica el tema guardado y crea el botón de alternancia

const CLAVE_TEMA = 'zf_tema';

const ICONO_LUNA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICONO_SOL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function temaPreferido() {
  const guardado = localStorage.getItem(CLAVE_TEMA);
  if (guardado === 'oscuro' || guardado === 'claro') return guardado;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  const boton = document.getElementById('boton-tema');
  if (boton) {
    boton.innerHTML = tema === 'oscuro' ? ICONO_SOL : ICONO_LUNA;
    boton.title = tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo noche';
    boton.setAttribute('aria-label', boton.title);
  }
}

function alternarTema() {
  const nuevo = document.documentElement.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
  localStorage.setItem(CLAVE_TEMA, nuevo);
  aplicarTema(nuevo);
}

function crearBotonTema() {
  let boton = document.getElementById('boton-tema');
  if (!boton) {
    boton = document.createElement('button');
    boton.id = 'boton-tema';
    boton.type = 'button';
    boton.className = 'boton-tema';
    boton.addEventListener('click', alternarTema);

    // Contenedor según el tipo de página
    const contenedor =
      document.querySelector('.cabecera-app__acciones') ||
      document.querySelector('.nav-landing') ||
      document.querySelector('.tarjeta-auth');

    if (!contenedor) return;

    if (contenedor.classList.contains('tarjeta-auth')) {
      contenedor.style.position = 'relative';
      boton.style.position = 'absolute';
      boton.style.top = '0.9rem';
      boton.style.right = '0.9rem';
    }

    contenedor.appendChild(boton);
  }
  aplicarTema(document.documentElement.getAttribute('data-tema') || temaPreferido());
}

aplicarTema(temaPreferido());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', crearBotonTema);
} else {
  crearBotonTema();
}
