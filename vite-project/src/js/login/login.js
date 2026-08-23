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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form") || document.getElementById("formulario-acceso");
  const inputCorreo = document.getElementById("correo") || document.querySelector("input[type='email']");
  const inputPass = document.getElementById("password") || document.querySelector("input[type='password']");

  // Botones "Usar" de demostración
  document.querySelectorAll(".cuenta-demo button, [data-usar-credencial], [data-rol]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const esAnalista = btn.dataset.rol === "analista" || btn.closest(".cuenta-demo")?.textContent.includes("Analista");
      const cuenta = esAnalista ? CUENTAS_DEMO.analista : CUENTAS_DEMO.empresa;

      if (inputCorreo) inputCorreo.value = cuenta.correo;
      if (inputPass) inputPass.value = cuenta.password;

      // Iniciar sesión directamente al pulsar Usar
      iniciarSesion(cuenta);
    });
  });

  // Evento submit del formulario
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const correo = inputCorreo ? inputCorreo.value.trim().toLowerCase() : "";
      
      const cuenta = Object.values(CUENTAS_DEMO).find(c => c.correo === correo) || CUENTAS_DEMO.analista;
      iniciarSesion(cuenta);
    });
  }

  function iniciarSesion(cuenta) {
    guardarSesion({
      rol: cuenta.rol,
      correo: cuenta.correo,
      nombre: cuenta.nombre
    });

    window.location.href = cuenta.destino;
  }
});