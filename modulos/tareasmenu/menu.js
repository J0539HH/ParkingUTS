var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  $("body").addClass("hidden");
  verificarAccesos();

  $("#CreacionServicios").on("click", function () {
    window.location.href = "../tareasmenu/CrearSevicio.html";
  });
  $("#GestionDeUsuarios").on("click", function () {
    window.location.href = "../tareasmenu/GestorUsuarios.html";
  });

  $("#GestionDeUsuarios").on("click", function () {
    window.location.href = "../tareasmenu/GestorUsuarios.html";
  });

  $("#ReporteServicios").on("click", function () {
    window.location.href = "../tareasmenu/ReporteServicios.html";
  });

  $("#GestionarServicio").on("click", function () {
    window.location.href = "../tareasmenu/GestionarServicios.html";
  });

  $("#ConsultarServicios").on("click", function () {
    window.location.href = "../tareasmenu/Seguimiento.html";
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
  $("#ContenedorGestionUsuarios").removeClass("hidden");
  $("#ContenedorCreacionServicio").removeClass("hidden");
  $("#ContenedorGestionServicios").removeClass("hidden");
  $("#ContenedorConsultarServicios").removeClass("hidden");
  $("#ContenedorReporteServicios").removeClass("hidden");
  $("body").removeClass("hidden");
}
