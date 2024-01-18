var rol = null;
var idUsuario = null;

$(document).ready(function () {
  spinner("Cargando información");
  verificarSesionWrapper()
    .then(() => {
      limpiarDatos();
      inicializarLectorQR();
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
    $("#infoCodigo").addClass("hidden");
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
      AlertCorrectX("Informacion cargada exitosamente");
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
  $("#movimientoParqueadero").on("click", function () {
    GuardarMovimientoParqueadero(infoVehiculoFav);
  });
}

function GuardarMovimientoParqueadero(infoVehiculoFav) {
  console.log(infoVehiculoFav);
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
      "El usuario debe <b>VALIDAR</b> con un <b>DOCUMENTO</b> o <b>MODIFICAR</b> sus datos antes de realizar el movimiento en el parqueadero"
    );
  }
  console.log(coincidenDatos, tipoDeMovimiento);
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
