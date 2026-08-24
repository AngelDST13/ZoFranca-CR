// src/js/sesion.js

const RUTA_SOLICITUD = '/src/pages/empresas/solicitud.html';

// Únicas páginas permitidas para el rol empresa
const PAGINAS_EMPRESA = ['solicitud.html', 'detalle-solicitud.html'];

// Páginas/enlaces exclusivos del analista (RF-12: gestión y decisión)
const ENLACES_SOLO_ANALISTA = ['admin.html', 'empresas.html', 'cumplimiento.html', 'alertas.html'];

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

// Bloquea a la empresa el acceso a páginas del analista
function protegerRutaPorRol(usuario) {
  if (!usuario || usuario.rol !== 'empresa') return true;
  const rutaActual = window.location.pathname;
  const esPublica = rutaActual.endsWith('index.html') || rutaActual.includes('login.html') || rutaActual === '/';
  const permitida = PAGINAS_EMPRESA.some((pagina) => rutaActual.endsWith(pagina));
  if (!esPublica && !permitida) {
    window.location.replace(RUTA_SOLICITUD);
    return false;
  }
  return true;
}

// Esconde funciones exclusivas del analista cuando la sesión es de empresa
function ocultarFuncionesAnalista() {
  // Enlaces hacia páginas del analista (menú lateral, migas de pan, botones)
  document.querySelectorAll('a[href]').forEach((enlace) => {
    const destino = enlace.getAttribute('href') || '';
    if (!ENLACES_SOLO_ANALISTA.some((pagina) => destino.includes(pagina))) return;

    // En migas de pan (títulos), convertir el enlace en texto plano para no romper el formato
    if (enlace.closest('h1, h2, h3')) {
      const texto = document.createElement('span');
      texto.textContent = enlace.textContent;
      texto.style.color = 'inherit';
      enlace.replaceWith(texto);
    } else {
      enlace.style.display = 'none';
    }
  });

  // Botón "Registrar decisión" / "Decidir" (RF-12, solo analista)
  document.querySelectorAll('[data-abre-modal]').forEach((boton) => {
    boton.style.display = 'none';
  });

  // Títulos del menú que quedaron sin enlaces visibles
  document.querySelectorAll('.navegacion-lateral__titulo').forEach((titulo) => {
    let nodo = titulo.nextElementSibling;
    let hayEnlaces = false;
    while (nodo && !nodo.classList.contains('navegacion-lateral__titulo')) {
      if (nodo.tagName === 'A' && nodo.style.display !== 'none') {
        hayEnlaces = true;
        break;
      }
      nodo = nodo.nextElementSibling;
    }
    if (!hayEnlaces) titulo.style.display = 'none';
  });

  // El botón Cancelar del formulario apuntaba al directorio de empresas
  const cancelar = document.querySelector('#formulario-solicitud a[href*="empresas.html"]');
  if (cancelar) {
    cancelar.style.display = '';
    cancelar.setAttribute('href', '../../../index.html');
  }
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
    // Control de acceso por rol: la empresa solo ve sus solicitudes
    if (!protegerRutaPorRol(usuario)) return;

    // Si la sesión existe, actualizar interfaz
    actualizarDatosUI(usuario);

    if (usuario.rol === 'empresa') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ocultarFuncionesAnalista);
      } else {
        ocultarFuncionesAnalista();
      }
    }
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