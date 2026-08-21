const botonMenu = document.getElementById("boton-menu");
const barraLateral = document.getElementById("barra-lateral");
const fondoMenu = document.getElementById("fondo-menu");

if (botonMenu && barraLateral && fondoMenu) {
  function alternarMenu(abierto) {
    barraLateral.classList.toggle("barra-lateral--abierta", abierto);
    fondoMenu.classList.toggle("fondo-menu--visible", abierto);
    botonMenu.setAttribute("aria-expanded", String(abierto));
  }

  botonMenu.addEventListener("click", () => {
    alternarMenu(!barraLateral.classList.contains("barra-lateral--abierta"));
  });

  fondoMenu.addEventListener("click", () => alternarMenu(false));
}

const modal = document.getElementById("modal-decision");

if (modal) {
  const empresaModal = document.getElementById("modal-empresa");

  document.querySelectorAll("[data-abre-modal]").forEach((boton) => {
    boton.addEventListener("click", () => {
      if (empresaModal && boton.dataset.empresa) {
        empresaModal.textContent = boton.dataset.empresa;
      }
      modal.hidden = false;
      const primeraOpcion = modal.querySelector('input[name="decision"]');
      if (primeraOpcion) primeraOpcion.focus();
    });
  });

  const cerrarModal = () => {
    modal.hidden = true;
  };

  document.querySelectorAll("[data-cierra-modal]").forEach((boton) => {
    boton.addEventListener("click", cerrarModal);
  });

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !modal.hidden) cerrarModal();
  });

  const formularioDecision = document.getElementById("formulario-decision");

  if (formularioDecision) {
    formularioDecision.addEventListener("submit", (evento) => {
      evento.preventDefault();
      cerrarModal();
    });
  }
}

const formularioSolicitud = document.getElementById("formulario-solicitud");

if (formularioSolicitud) {
  formularioSolicitud.addEventListener("submit", (evento) => {
    evento.preventDefault();
    window.location.href = "detalle-solicitud.html";
  });
}
