var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  LimpiarDatos();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#btnConsultar").on("click", function () {
    ConsultarServicio();
  });

  const inputNumeroServicio = $("#numeroServicio");

  inputNumeroServicio.on("input", function () {
    const inputValue = inputNumeroServicio.val();
    if (isNaN(inputValue)) {
      // Eliminar el último carácter si no es un número
      inputNumeroServicio.val(inputValue.substring(0, inputValue.length - 1));
    }
  });
});

function ConsultarServicio() {
  let idservicio = parseInt($("#numeroServicio").val());

  spinner("Cargando datos del servicio, por favor espere");
  const url = "/api/servicioEspecifico";
  const data = {
    idservicio: idservicio,
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
      console.log(result);
      cargarDatos(result);
      $("#spinner").hide();
    })
    .catch((error) => {
      console.log(error);
      AlertIncorrecta("No se pudo cargar el servicio");
      LimpiarDatos();
      $("#spinner").hide();
    });
}
function cargarDatos(data) {
  $("#detallesServicio").removeClass("hidden");

  $("#comentariosCliente").html(data.comentariosentrada);
  $("#marca").html(data.marca);
  $("#tipoDispositivo").html(data.tipodispositivo);
  $("#estado").html(data.estado);
  $("#numeroSerie").html(data.numeroserie);
  $("#comentariosTecnico").html(data.comentariossalida);
  $("#memoriaRam").html(data.ram);
  $("#tipoAlmacenamiento").html(data.tipodisco);
}

function LimpiarDatos() {
  $("#numeroServicio").val("");
  $("#detallesServicio").addClass("hidden");
  $("#comentariosCliente").empty();
  $("#marca").empty();
  $("#tipoDispositivo").empty();
  $("#memoriaRam").empty();
  $("#tipoAlmacenamiento").empty();
  $("#numeroSerie").empty();
  $("#estado").empty();
  $("#comentariosTecnico").empty();
}
