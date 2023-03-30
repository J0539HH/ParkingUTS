var idrol = null;

$(document).ready(function () {
  verificarSesion();
  $("body").addClass("hidden");
  setTimeout(verificarAccesos, 400);

  $("#CreacionServicios").on("click", function () {
    window.location.href = "../tareasmenu/CrearSevicio.html";
  });

  $("#GestionarServicio").on("click", function () {
    jAlert("Acá entra a gestionar un servicio");
  });

  $("#ConsultarServicios").on("click", function () {
    jAlert("Acá entra a consultar los servicios");
  });

  $("#GestionDeUsuarios").on("click", function () {
    window.location.href = "../tareasmenu/GestorUsuarios.html";
  });

  $("#volverLogin").on("click", function () {
    CerrarSession();
  });
});

// Scripts de los estilos
$(function () {
  $(".menu-button").each(function () {
    var items = this.parentNode.querySelectorAll(".circle a");
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].style.left =
        (
          50 -
          42 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
        ).toFixed(4) + "%";
      items[i].style.top =
        (
          50 +
          42 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
        ).toFixed(4) + "%";
    }
  });

  $(".circular-menu").hover(
    function () {
      this.querySelector(".circle").classList.add("open");
      this.querySelector(".menu-button").classList.add("selected");
    },
    function () {
      this.querySelector(".circle").classList.remove("open");
      this.querySelector(".menu-button").classList.remove("selected");
    }
  );
});

function verificarAccesos() {
  if (idrol === 2) {
    $("#ContenedorGestionUsuarios").addClass("hidden");
    $("#ContenedorGestionServicios").addClass("hidden");
  }
  $("body").removeClass("hidden");
}
