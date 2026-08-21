const formulario = document.getElementById("formulario-acceso");
const botonAcceso = document.getElementById("boton-acceso");
const estadoCarga = document.getElementById("estado-carga");
const alternarPassword = document.getElementById("alternar-password");
const campoPassword = document.getElementById("password");

alternarPassword.addEventListener("click", () => {
  const esVisible = campoPassword.type === "text";
  campoPassword.type = esVisible ? "password" : "text";
  alternarPassword.setAttribute("aria-pressed", String(!esVisible));
  alternarPassword.setAttribute(
    "aria-label",
    esVisible ? "Mostrar contraseña" : "Ocultar contraseña"
  );
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const rol = document.querySelector('input[name="rol"]:checked').value;
  const destino =
    rol === "analista"
      ? "../admin/admin.html"
      : "../empresas/empresas.html";

  botonAcceso.disabled = true;
  estadoCarga.classList.add("estado-carga--visible");

  window.setTimeout(() => {
    window.location.href = destino;
  }, 900);
});
