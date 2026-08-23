// src/js/sesion.js

export function obtenerSesion() {
  const raw = localStorage.getItem('zf_sesion') || localStorage.getItem('zf_usuario');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function guardarSesion(usuario) {
  localStorage.setItem('zf_sesion', JSON.stringify(usuario));
  localStorage.setItem('zf_usuario', JSON.stringify(usuario));
}

export function cerrarSesion() {
  localStorage.removeItem('zf_sesion');
  localStorage.removeItem('zf_usuario');
  window.location.href = '/src/pages/login/login.html';
}

export function gestionarSesionYPerfil() {
  const usuario = obtenerSesion();
  const rutaActual = window.location.pathname;

  // Si no hay usuario y no está en login/landing, redirigir
  if (!usuario) {
    if (!rutaActual.includes('login.html') && !rutaActual.includes('index.html') && rutaActual !== '/') {
      window.location.href = '/src/pages/login/login.html';
      return;
    }
  } else {
    // Si la sesión existe, actualizar interfaz
    actualizarDatosUI(usuario);
  }
}

function actualizarDatosUI(usuario) {
  const nombreTexto = usuario.nombre || usuario.email || usuario.correo || 'Marta Arroyo';
  const rolTexto = usuario.rol === 'empresa' ? 'Empresa Solicitante' : 'Analista Senior';
  const iniciales = nombreTexto.substring(0, 2).toUpperCase();

  // Actualizar textos
  document.querySelectorAll('[data-usuario-nombre]').forEach((el) => (el.textContent = nombreTexto));
  document.querySelectorAll('[data-usuario-rol]').forEach((el) => (el.textContent = rolTexto));
  document.querySelectorAll('[data-usuario-iniciales]').forEach((el) => (el.textContent = iniciales));

  // Menú inferior en el sidebar
  const contenedorPerfil = document.querySelector('.info-usuario') || document.querySelector('aside > div:last-child');
  if (contenedorPerfil) {
    contenedorPerfil.style.cursor = 'pointer';
    contenedorPerfil.style.position = 'relative';

    contenedorPerfil.onclick = (e) => {
      e.stopPropagation();
      let menu = document.getElementById('menu-logout-popup');
      if (!menu) {
        menu = document.createElement('div');
        menu.id = 'menu-logout-popup';
        menu.style.cssText = `
          position: absolute; bottom: 100%; left: 0; width: 100%;
          background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 0.5rem; z-index: 1000; margin-bottom: 0.5rem;
        `;
        menu.innerHTML = `
          <button id="btn-logout-act" style="width: 100%; text-align: left; background: transparent; border: none; color: #ef4444; padding: 0.5rem; font-weight: 600; cursor: pointer; font-size: 0.85rem;">
            🚪 Cerrar sesión
          </button>
        `;
        contenedorPerfil.appendChild(menu);
        document.getElementById('btn-logout-act').onclick = () => cerrarSesion();
      } else {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      }
    };

    document.addEventListener('click', () => {
      const menu = document.getElementById('menu-logout-popup');
      if (menu) menu.style.display = 'none';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', gestionarSesionYPerfil);
} else {
  gestionarSesionYPerfil();
}