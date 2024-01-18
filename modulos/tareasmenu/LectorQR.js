var rol = null;
var idUsuario = null;
var idvehiculofav = null;

$(document).ready(function () {
  $("#movimientoParqueadero").on("click", function () {
    GuardarMovimientoParqueadero(idvehiculofav);
  });
  spinner("Cargando información");
  verificarSesionWrapper()
    .then(() => {
      limpiarDatos();
      // inicializarLectorQR();
      $("#spinner").hide();
    })
    .catch((error) => {
      console.error(error);
      setTimeout(function () {
        window.location.href = "../../acceso/Login.html";
      }, 1000);
    });

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#LeerCodigo").on("click", function () {
    $("#lector-qr").removeClass("hidden");
    $("#infoCodigo, #informacionInstructivo").addClass("hidden");
    inicializarLectorQR();
  });
});

function inicializarLectorQR() {
  var video = document.querySelector("#video");
  var canvasElement = document.createElement("canvas");
  var canvas = canvasElement.getContext("2d");

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      video.srcObject = stream;
      video.onloadedmetadata = function () {
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;

        detectarCodigoQR(video, canvas);
      };
    })
    .catch(function (error) {
      console.error("Error al acceder a la cámara: ", error);
    });

  function detectarCodigoQR(video, canvas) {
    requestAnimationFrame(function () {
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      var code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        $("#lector-qr").addClass("hidden");
        $("#infoCodigo").removeClass("hidden");
        setearInformacion(code.data);
        return;
      }

      detectarCodigoQR(video, canvas);
    });
  }
}

function setearInformacion(idusuarioparqueadero) {
  limpiarDatos();
  spinner("Validando información del usuario");
  const url = "/api/validarQR";
  const data = {
    idusuario: idusuarioparqueadero,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      llenarDatos(result);
      AlertCorrectX("Información cargada exitosamente");
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar la información");
      $("#spinner").hide();
    });
}

function llenarDatos(infoVehiculoFav) {
  $("#color").html(infoVehiculoFav.color.toUpperCase());
  $("#placa").html(infoVehiculoFav.placa.toUpperCase());
  $("#linea").html(infoVehiculoFav.linea.toUpperCase());
  $("#marca").html(infoVehiculoFav.marca.toUpperCase());
  $("#tipovehiculo").html(infoVehiculoFav.tipoVehiculo.toUpperCase());
  $("#documento").html(infoVehiculoFav.usuario.persona.documento.toUpperCase());
  $("#genero").html(infoVehiculoFav.usuario.persona.genero.toUpperCase());
  $("#nombre").html(infoVehiculoFav.usuario.persona.nombre.toUpperCase());
  idvehiculofav = infoVehiculoFav;
}

function GuardarMovimientoParqueadero(infoVehiculoFav) {
  var coincidenDatos = $("input[name='coinciden']:checked").val();
  var tipoDeMovimiento = $("input[name='movimiento']:checked").val();
  if (coincidenDatos === undefined) {
    AlertIncorrecta("Debes seleccionar si los datos coinciden");
    return;
  }
  if (tipoDeMovimiento === undefined) {
    AlertIncorrecta(
      "Debes seleccionar si es una <b>Entrada</b> o una <b>Salida</b> del parqueadero"
    );
    return;
  }

  if (coincidenDatos === "no") {
    AlertIncorrecta(
      "El usuario debe <b>VALIDAR</b> su <br>identidad  con un <br> <b>DOCUMENTO</b>  y/o <b>MODIFICAR</b> <br>sus datos antes de realizar <br>el movimiento en el parqueadero"
    );
    $("#video").html("");
    $("#infoCodigo").addClass("hidden");
    $("#informacionInstructivo").removeClass("hidden");
    return;
  }
  spinner("Registrando el movimiento del parqueadero");
  const url = "/api/registrarMovimientoParqueadero";
  const data = {
    tipoDeMovimiento: tipoDeMovimiento,
    idUsuarioOperador: idUsuario,
    idVehiculoFav: infoVehiculoFav._id,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result === "Movimiento registrado") {
        AlertCorrectX(
          "<b>Ahora</b> puedes dejar que el vehículo <b>AVANCE</b>"
        );
        $("#infoCodigo").addClass("hidden");
        limpiarDatos();
        $("#spinner").hide();
        $("#informacionInstructivo").removeClass("hidden");
        if (infoVehiculoFav.tipoVehiculo === "Bicicleta") {
          RegistrarAuditoria(
            "El usuario permite el movimiento:" +
              tipoDeMovimiento.toUpperCase() +
              " en el parqueadero del vehiculo: " +
              infoVehiculoFav.tipoVehiculo.toUpperCase() +
              " de marca: " +
              infoVehiculoFav.marca.toUpperCase() +
              " y color: " +
              infoVehiculoFav.color.toUpperCase()
          );
        } else {
          RegistrarAuditoria(
            "El usuario permite el movimiento:" +
              tipoDeMovimiento.toUpperCase() +
              " en el parqueadero del vehiculo: " +
              infoVehiculoFav.tipoVehiculo.toUpperCase() +
              " de marca: " +
              infoVehiculoFav.marca.toUpperCase() +
              " y placas: " +
              infoVehiculoFav.placa.toUpperCase()
          );
        }
      }
    })
    .catch((error) => {
      AlertIncorrecta(
        "No se puede registar el ingreso por favor<br> intentalo nuevamente..."
      );
      $("#spinner").hide();
    });
}

function RegistrarAuditoria(textoAuditoria) {
  spinner("Registrando auditoria");
  const url = "/api/registrarAuditoriaModelo";
  const data = {
    idusuario: idUsuario,
    textoAuditoria: textoAuditoria,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo registrar la auditoria, algo falló");
      $("#spinner").hide();
    });
}

function limpiarDatos() {
  $("input[name='movimiento']").prop("checked", false);
  $("input[name='coinciden']").prop("checked", false);
  $("#color").html("");
  $("#placa").html("");
  $("#linea").html("");
  $("#marca").html("");
  $("#tipovehiculo").html("");
  $("#documento").html("");
  $("#genero").html("");
  $("#nombre").html("");
}
