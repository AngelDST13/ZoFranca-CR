const CLAVE_SESION = "zf_sesion";

window.ZFSesion = {
  rutaLogin: "/src/pages/login/login.html",

  obtener() {
    try {
      return JSON.parse(sessionStorage.getItem(CLAVE_SESION));
    } catch (error) {
      return null;
    }
  },

  guardar(sesion) {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  },

  cerrar() {
    sessionStorage.removeItem(CLAVE_SESION);
  },

  requerir(opciones) {
    const sesion = this.obtener();
    if (!sesion || !sesion.correo) {
      window.location.replace(this.rutaLogin);
      return null;
    }
    if (opciones && opciones.rol && sesion.rol !== opciones.rol) {
      window.location.replace(
        sesion.rol === "analista"
          ? "../admin/admin.html"
          : "../empresas/empresas.html"
      );
      return null;
    }
    this.pintarUsuario(sesion);
    return sesion;
  },

  pintarUsuario(sesion) {
    const iniciales = sesion.nombre
      .split(" ")
      .map((parte) => parte[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    document.querySelectorAll("[data-usuario-nombre]").forEach((elemento) => {
      elemento.textContent = sesion.nombre;
    });
    document.querySelectorAll("[data-usuario-rol]").forEach((elemento) => {
      elemento.textContent =
        sesion.rol === "analista" ? "Analista senior" : "Empresa inversionista";
    });
    document.querySelectorAll("[data-usuario-iniciales]").forEach((elemento) => {
      elemento.textContent = iniciales;
    });
  }
};

document.querySelectorAll("[data-cerrar-sesion]").forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();
    window.ZFSesion.cerrar();
    window.location.href = window.ZFSesion.rutaLogin;
  });
});
