var rol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesionWrapper()
    .then(() => {
      cargarInformacion();
      $("#spinner").hide();
    })
    .catch((error) => {
      $("#spinner").hide();
      setTimeout(function () {
        window.location.href = "../../acceso/Login.html";
      }, 1000);
    });

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });
});

function cargarInformacion() {
  spinner("Cargando datos del usuario, por favor espere");
  const url = "/api/EspecificUser";
  const data = {
    idusuario: idUsuario,
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
      cargarVehiculo(result);
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar el usuario");
      $("#spinner").hide();
    });
}
function cargarVehiculo(datosUsuario) {
  spinner("Cargando datos del usuario, por favor espere");
  const url = "/api/VehiculoFav";
  const data = {
    idusuario: datosUsuario._id,
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
      crearQR(datosUsuario);
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar el vehiculo favorito");
      $("#spinner").hide();
    });
}

function crearQR(infoUsuario) {
  $("#codigoQRContainer").empty();
  const qrContainer = $("<div>");

  new QRCode(qrContainer[0], {
    text: infoUsuario._id,
    width: 380,
    height: 380,
  });
  $("#codigoQRContainer").append(qrContainer);
}
