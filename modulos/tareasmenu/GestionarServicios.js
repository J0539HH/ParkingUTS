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
        console.log("no session");
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
      crearQR(datosUsuario, result);
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar el vehiculo favorito");
      $("#spinner").hide();
    });
}

function crearQR(infoUsuario, infoVehiculo) {
  let nombre = infoUsuario.persona.nombre;
  let documento = infoUsuario.persona.documento;
  let tipoVehiculo = infoVehiculo.tipoVehiculo;
  let placa = infoVehiculo.placa;
  let marca = infoVehiculo.marca;
  let color = infoVehiculo.color;
  $("#codigoQRContainer").empty();
  const qrContainer = $("<div>");
  new QRCode(qrContainer[0], {
    text:
      "Nombre:" +
      nombre +
      " Documento:" +
      documento +
      " Tipo de vehiculo:" +
      tipoVehiculo +
      " Marca:" +
      marca +
      " Placa:" +
      placa +
      " Color:" +
      color +
      " ",
    width: 256,
    height: 256,
  });
  $("#codigoQRContainer").append(qrContainer);
  console.log("Escanea este código QR para ver la información.");
}
