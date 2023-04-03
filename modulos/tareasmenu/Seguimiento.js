var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  LimpiarDatos();

  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  ConsultarServicio(idParam);

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#volverReportes").on("click", function () {
    window.location.href = "../tareasmenu/ReporteServicios.html";
  });

  $("#btnConsultar").on("click", function () {
    let idservicio = $("#numeroServicio").val();
    ConsultarServicio(idservicio);
  });

  $("#numeroServicio").keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      let idservicio = $("#numeroServicio").val();
      ConsultarServicio(idservicio);
    }
  });

  setTimeout(validarUsuario, 400);

  const inputNumeroServicio = $("#numeroServicio");

  inputNumeroServicio.on("input", function () {
    const inputValue = inputNumeroServicio.val();
    if (isNaN(inputValue)) {
      // Eliminar el último carácter si no es un número
      inputNumeroServicio.val(inputValue.substring(0, inputValue.length - 1));
    }
  });
});

function validarUsuario() {
  if (idrol === 1) {
    $("#volverReportes").removeClass("hidden");
  }
}

function ConsultarServicio(idservicio) {
  if (idservicio === null) {
    return;
  }
  idservicio = parseInt(idservicio);
  $("#numeroServicio").val(idservicio);
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
  if (idrol === 2) {
    if (data.idusuario !== idUsuario) {
      AlertIncorrecta("Solo puedes visualizar tus servicios!");
      LimpiarDatos();
      return;
    }
  }
  let marca = data.marca;
  let SolicitanteServicio = data.usuario;
  let infoRam = data.ram;
  let numeroSerie = data.numeroserie;
  let comentariosSalida = data.comentariossalida;
  let almacenamiento = data.tipodisco;
  let modelo = data.modelo;

  if (infoRam === "") {
    infoRam = "Se esta definiendo esta caracteristica";
  }
  if (numeroSerie === "") {
    numeroSerie = "Se esta definiendo esta caracteristica";
  }
  if (comentariosSalida === "") {
    comentariosSalida = "El servicio aun no tiene comentarios de actualización";
  }
  if (almacenamiento === "") {
    almacenamiento = "Se esta definiendo esta caracteristica";
  }
  if (modelo === "") {
    modelo = "Se esta definiendo esta caracteristica";
  }

  $("#detallesServicio").removeClass("hidden");
  $("#comentariosCliente").html("&nbsp;" + data.comentariosentrada);
  $("#solicitante").html("&nbsp;" + SolicitanteServicio.nombre);
  $("#marca").html("&nbsp;" + marca.charAt(0).toUpperCase() + marca.slice(1));
  $("#tipoDispositivo").html("&nbsp;" + data.tipodispositivo);
  $("#estado").html("&nbsp;" + data.estado);
  $("#numeroSerie").html("&nbsp;" + numeroSerie);
  $("#comentariosTecnico").html("&nbsp;" + comentariosSalida);
  $("#memoriaRam").html("&nbsp;" + infoRam);
  $("#tipoAlmacenamiento").html("&nbsp;" + almacenamiento);
  $("#modelo").html("&nbsp;" + modelo);
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
