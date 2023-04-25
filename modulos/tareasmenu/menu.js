var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesionM();

  if (document.cookie.indexOf("mostrandoModal=true") === -1) {
    $("#modalUser").modal("show");
    document.cookie =
      "mostrandoModal=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  }

  $("#btnModal").on("click", function () {
    $("#modalUser").modal("hide");
  });

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
      verificarAccesos(data.nombre);
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

function verificarAccesos(Nombre) {
  console.log(Nombre);
  // Opciones de un  cliente
  if (idrol === 2) {
    $("#ContenedorCreacionServicio").removeClass("hidden");
    $("#ContenedorConsultarServicios").removeClass("hidden");
    $("#ContenedorMiHistorial").removeClass("hidden");
    $("#ContainerMenu").addClass("centrarBotones");
    $("#infoUsuario").html(
      "Hola <b>" +
        Nombre +
        "</b>" +
        ", hemos identificado que eres un usuario del tipo <b>CLIENTE</b>.<br>En el menú tendrás la opción de crear solicitudes de mantenimiento, ver el historial de tus solicitudes anteriores y hacer un seguimiento específico de cada una de ellas. <br>Gracias por preferirnos como tu gestor de mantenimientos!"
    );
  }

  // Opciones de un  tecnico
  if (idrol === 3) {
    $("#ContenedorGestionServicios").removeClass("hidden");
    $("#ContenedorConsultarServicios").removeClass("hidden");
    $("#ContenedorAsignados").removeClass("hidden");
    $("#ContainerMenu").addClass("centrarBotones");
    $("#infoUsuario").html(
      "Hola <b>" +
        Nombre +
        "</b>" +
        ", hemos identificado que eres un usuario del tipo <b>TECNICO</b>. <br>Dentro de las opciones de tu menú, puedes administrar las solicitudes de mantenimiento que te han sido asignadas y también puedes acceder al historial y los detalles específicos de cada una de ellas.<br>Esperamos que tengas un dia muy productivo!"
    );
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
    $("#infoUsuario").html(
      "Hola <b>" +
        Nombre +
        "</b>" +
        ", hemos identificado que eres un usuario del tipo <b>ADMINISTRADOR</b>. <br>Tienes todas las opciones del sistema disponibles, gracias por preferir nuestro sistema!"
    );
  }

  $("#spinner").hide();
}
