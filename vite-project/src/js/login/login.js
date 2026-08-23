// src/js/login/login.js
import { guardarSesion } from '../sesion.js';
import '../../css/global.css';
import '../../css/components.css';
import '../../css/login.css';

const CUENTAS_DEMO = {
  analista: {
    correo: "analista@zofranca.cr",
    password: "zf2026",
    nombre: "Marta Arroyo",
    rol: "analista",
    destino: "/src/pages/admin/admin.html"
  },
  empresa: {
    correo: "empresa@techsolutions.cr",
    password: "zf2026",
    nombre: "Tech Solutions CR",
    rol: "empresa",
    destino: "/src/pages/empresas/solicitud.html"
  }
};

function obtenerRolSeleccionado() {
  const radioSeleccionado = document.querySelector('input[name="rol"]:checked');
  return radioSeleccionado ? radioSeleccionado.value : "analista";
}

function validarCredenciales(correo, password, rol) {
  return Object.values(CUENTAS_DEMO).find((cuenta) => {
    return cuenta.rol === rol && cuenta.correo.toLowerCase() === correo.toLowerCase() && cuenta.password === password;
  }) || null;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form") || document.getElementById("formulario-acceso");
  const inputCorreo = document.getElementById("correo") || document.querySelector("input[type='email']");
  const inputPass = document.getElementById("password") || document.querySelector("input[type='password']");
  const errorAcceso = document.getElementById("error-acceso");

  document.querySelectorAll(".cuenta-demo button, [data-usar-credencial], [data-rol]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const esAnalista = btn.dataset.rol === "analista" || btn.closest(".cuenta-demo")?.textContent.includes("Analista");
      const cuenta = esAnalista ? CUENTAS_DEMO.analista : CUENTAS_DEMO.empresa;

      if (inputCorreo) inputCorreo.value = cuenta.correo;
      if (inputPass) inputPass.value = cuenta.password;

      iniciarSesion(cuenta);
    });
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const correo = inputCorreo ? inputCorreo.value.trim().toLowerCase() : "";
      const password = inputPass ? inputPass.value.trim() : "";
      const rol = obtenerRolSeleccionado();
      const cuenta = validarCredenciales(correo, password, rol);

      if (!cuenta) {
        if (errorAcceso) {
          errorAcceso.hidden = false;
        }
        return;
      }

      if (errorAcceso) {
        errorAcceso.hidden = true;
      }

      iniciarSesion(cuenta);
    });
  }

  function iniciarSesion(cuenta) {
    guardarSesion({
      rol: cuenta.rol,
      correo: cuenta.correo,
      nombre: cuenta.nombre
    });

    const destino = new URL(cuenta.destino, window.location.origin).pathname;
    window.location.assign(destino);
  }
});