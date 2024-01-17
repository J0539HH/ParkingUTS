var rol = null;
var idUsuario = null;

$(document).ready(function () {
  spinner("Cargando información");
  verificarSesionWrapper()
    .then(() => {
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
        $("#textoCodigo").html(code.data);
      }

      detectarCodigoQR(video, canvas);
    });
  }
}
