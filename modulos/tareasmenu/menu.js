var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesionM();

  $("#CreacionServicios").on("click", function () {
    window.location.href = "../tareasmenu/CrearSevicio.html";
  });
  $("#GestionDeUsuarios").on("click", function () {
    window.location.href = "../tareasmenu/GestorUsuarios.html";
  });

  $("#myHistorial").on("click", function () {
    window.location.href = "../tareasmenu/HistorialCliente.html";
  });

  $("#ReporteServicios").on("click", function () {
    window.location.href = "../tareasmenu/ReporteServicios.html";
  });

  $("#GestionarServicio").on("click", function () {
    window.location.href = "../tareasmenu/GestionarServicios.html";
  });

  $("#AsignacionServicios").on("click", function () {
    window.location.href = "../tareasmenu/AsignacionServicios.html";
  });

  $("#ConsultarServicios").on("click", function () {
    window.location.href = "../tareasmenu/Seguimiento.html";
  });

  $("#Asignados").on("click", function () {
    window.location.href = "../tareasmenu/ServiciosAsignados.html";
  });

  $("#Auditoria").on("click", function () {
    window.location.href = "../tareasmenu/Auditoria.html";
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

function verificarSesionM() {
  spinner("Validando tipo de usuario");
  console.log("VerificandoSessionbyJDFM");
  fetch("/api/sesion")
    .then((response) => response.json())
    .then((data) => {
      const idusuario = data.idusuario;
      idrol = data.idrol;
      idUsuario = data.idusuario;
      verificarAccesos();
      if (idusuario === undefined || idusuario === null) {
        $("#ContenedorTotal").addClass("hidden");
        AlertIncorrectX(
          "Estas tratando de acceder al sistema sin credenciales"
        );
        setTimeout(function () {
          window.location.href = "../../acceso/Login.html";
        }, 1000);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function verificarAccesos() {
  // Opciones de un  cliente
  if (idrol === 2) {
    $("#ContenedorCreacionServicio").removeClass("hidden");
    $("#ContenedorConsultarServicios").removeClass("hidden");
    $("#ContenedorMiHistorial").removeClass("hidden");
    $("#ContainerMenu").addClass("centrarBotones");
  }

  // Opciones de un  tecnico
  if (idrol === 3) {
    $("#ContenedorGestionServicios").removeClass("hidden");
    $("#ContenedorConsultarServicios").removeClass("hidden");
    $("#ContenedorAsignados").removeClass("hidden");
    $("#ContainerMenu").addClass("centrarBotones");
  }

  // Opciones de un  administrador
  if (idrol === 1) {
    $("#ContenedorGestionUsuarios").removeClass("hidden");
    $("#ContenedorCreacionServicio").removeClass("hidden");
    $("#ContenedorGestionServicios").removeClass("hidden");
    $("#ContenedorConsultarServicios").removeClass("hidden");
    $("#ContenedorReporteServicios").removeClass("hidden");
    $("#ContenedorAsignacionServicio").removeClass("hidden");
    $("#ContenedorMiHistorial").removeClass("hidden");
    $("#ContenedorAuditoria").removeClass("hidden");
  }

  $("#spinner").hide();
}
