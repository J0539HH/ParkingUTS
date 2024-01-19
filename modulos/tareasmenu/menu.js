var rolUsuario = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesionM();

  if (document.cookie.indexOf("mostradoModal=true") === -1) {
    $("#modalUser").modal("show");
    var now = new Date();
    var expireTime = now.getTime() + 12 * 60 * 60 * 1000;
    now.setTime(expireTime);
    document.cookie =
      "mostradoModal=true; expires=" + now.toUTCString() + "; path=/";
  }

  $("#btnModal").on("click", function () {
    $("#modalUser").modal("hide");
  });

  $("#MiPerfil").on("click", function () {
    window.location.href = "../tareasmenu/MiPerfil.html";
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

  $("#miQR").on("click", function () {
    window.location.href = "../tareasmenu/MiCodigoQR.html";
  });

  $("#lectorQR").on("click", function () {
    window.location.href = "../tareasmenu/LectorQR.html";
  });

  $("#ConsultarVehiculos").on("click", function () {
    window.location.href = "../tareasmenu/Vehiculos.html";
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
  fetch("/api/sesion")
    .then((response) => response.json())
    .then((data) => {
      rolUsuario = data.rol;
      idUsuario = data.idusuario;
      verificarAccesos(data.nombre);
      if (idUsuario === undefined || idUsuario === null) {
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
  // Opciones de un  administrador
  if (rolUsuario === "administrador") {
    $("#ContenedorGestionUsuarios").removeClass("hidden");
    $("#ContenedorMiPerfil").removeClass("hidden");
    $("#ContenedorMisVehiculos").removeClass("hidden");
    $("#ContenedorMiQR").removeClass("hidden");
    $("#ContenedorAuditoria").removeClass("hidden");
    $("#ContenedorLectorQR").removeClass("hidden");

    $("#infoUsuario").html(
      "Hola <b>" +
        Nombre +
        "</b>" +
        ", hemos identificado que eres un usuario <br><b>ADMINISTRADOR</b>. <br>Tienes todas las opciones del menu disponibles, gracias por preferir nuestro sistema!"
    );
  } else if (rolUsuario === "estudiante") {
    $("#ContenedorMiPerfil").removeClass("hidden");
    $("#ContenedorMisVehiculos").removeClass("hidden");
    $("#ContenedorMiQR").removeClass("hidden");

    $("#infoUsuario").html(
      "Hola <b>" +
        Nombre +
        "</b>" +
        ", hemos identificado que eres un <b>ESTUDIANTE.</b> <br> Utiliza esta plataforma para validar tu identidad."
    );
  } else if (rolUsuario === "controlador") {
    $("#ContenedorMiPerfil").removeClass("hidden");
    $("#ContenedorLectorQR").removeClass("hidden");

    $("#infoUsuario").html(
      "Hola <b>" +
        Nombre +
        "</b>" +
        ", hemos identificado que eres un <b>OPERADOR.</b> <br> Utiliza esta plataforma para permitir ingresos y salidas del parqueadero."
    );
  }

  $("#spinner").hide();
}
