const CUENTAS_DEMO = [
  {
    rol: "analista",
    correo: "analista@zofranca.cr",
    password: "zf2026",
    nombre: "Marta Arroyo",
    destino: "../admin/admin.html"
  },
  {
    rol: "empresa",
    correo: "empresa@techsolutions.cr",
    password: "zf2026",
    nombre: "Tech Solutions CR",
    destino: "../empresas/empresas.html"
  }
];

const sesionActiva = window.ZFSesion.obtener();

if (sesionActiva) {
  const cajaSesion = document.getElementById("sesion-activa");
  const nombreSesion = document.getElementById("sesion-activa-nombre");
  const rolSesion = document.getElementById("sesion-activa-rol");
  const botonIrPanel = document.getElementById("boton-ir-panel");
  const botonCerrarActiva = document.getElementById("boton-cerrar-activa");

  const cuenta = CUENTAS_DEMO.find((c) => c.rol === sesionActiva.rol);

  nombreSesion.textContent = sesionActiva.nombre;
  rolSesion.textContent =
    sesionActiva.rol === "analista" ? "Analista ZF" : "Empresa";
  if (cuenta) botonIrPanel.href = cuenta.destino;
  cajaSesion.hidden = false;

  botonCerrarActiva.addEventListener("click", () => {
    window.ZFSesion.cerrar();
    cajaSesion.hidden = true;
    campoCorreo.focus();
  });
}

const formulario = document.getElementById("formulario-acceso");
const botonAcceso = document.getElementById("boton-acceso");
const estadoCarga = document.getElementById("estado-carga");
const errorAcceso = document.getElementById("error-acceso");
const alternarPassword = document.getElementById("alternar-password");
const campoPassword = document.getElementById("password");
const campoCorreo = document.getElementById("correo");

alternarPassword.addEventListener("click", () => {
  const esVisible = campoPassword.type === "text";
  campoPassword.type = esVisible ? "password" : "text";
  alternarPassword.setAttribute("aria-pressed", String(!esVisible));
  alternarPassword.setAttribute(
    "aria-label",
    esVisible ? "Mostrar contraseña" : "Ocultar contraseña"
  );
});

document.querySelectorAll("[data-rellena-cuenta]").forEach((boton) => {
  boton.addEventListener("click", () => {
    campoCorreo.value = boton.dataset.correo;
    campoPassword.value = boton.dataset.password;
    const radioRol = document.querySelector(
      `input[name="rol"][value="${boton.dataset.rol}"]`
    );
    if (radioRol) radioRol.checked = true;
    errorAcceso.hidden = true;
    campoCorreo.focus();
  });
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const correo = campoCorreo.value.trim().toLowerCase();
  const password = campoPassword.value;
  const cuenta = CUENTAS_DEMO.find(
    (c) => c.correo === correo && c.password === password
  );

  if (!cuenta) {
    errorAcceso.hidden = false;
    campoPassword.focus();
    return;
  }

  errorAcceso.hidden = true;
  botonAcceso.disabled = true;
  estadoCarga.classList.add("estado-carga--visible");

  window.ZFSesion.guardar({
    rol: cuenta.rol,
    correo: cuenta.correo,
    nombre: cuenta.nombre
  });

  window.setTimeout(() => {
    window.location.href = cuenta.destino;
  }, 900);
});
