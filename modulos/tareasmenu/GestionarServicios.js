var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  LimpiarFormulario();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#btnGestionar").on("click", function () {
    ValidarFormulario();
  });

  $("#numeroServicio").on("change", function () {
    cargarInfoServicio();
  });
});

function cargarInfoServicio() {
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
      LimpiarFormulario();
      $("#spinner").hide();
    });
}

function cargarDatos(data) {
  console.log(data);
  $("#comentariosEntrada").val(data.comentariosentrada);
  $("#marca").val(data.marca);
  $("#tipoDispositivo").val(data.tipodispositivo);
  $("#estado").val(data.estado);
  $("#numeroSerie").val(data.numeroserie);
  $("#comentariosSalida").val(data.comentariossalida);
  $("#ram").val(data.ram);
  $("#tipoDisco").val(data.tipodisco);
}

function ValidarFormulario() {
  let ComentariosSalida = $("#comentariosSalida").val();
  let Marca = $("#marca").val();
  let Estado = $("#estado").val();
  let TipoDispositivo = $("#tipoDispositivo").val();
  let idservicio = $("#numeroServicio").val();
  let ram = $("#ram").val();
  let tipodisco = $("#tipoDisco").val();

  if (idservicio === "") {
    AlertIncorrecta("Debes indicar un número de servicio");
    return;
  }

  if (Marca === "") {
    AlertIncorrecta("Debes indicar la marca del dispositivo");
    return;
  }
  if (TipoDispositivo === "") {
    AlertIncorrecta("Debes seleccionar un tipo de dispositivo");
    return;
  }
  if (ram === "") {
    AlertIncorrecta("Debes indicar la cantidad de memoria ram del dispositivo");
    return;
  }
  if (tipodisco === "") {
    AlertIncorrecta("Debes indicar el tipo de almacenamiento del dispositivo");
    return;
  }
  if (Estado === "") {
    AlertIncorrecta("Debes indicar el estado del servicio");
    return;
  }
  if (ComentariosSalida === "") {
    AlertIncorrecta(
      "Debes indicar alguna informacion sobre el mantenimiento del dispositivo"
    );
    return;
  }
  ActualizarServicio();
}

function ActualizarServicio() {
  spinner("Actualizando el  servicio, por favor espere");
  let idservicio = parseInt($("#numeroServicio").val());
  let ComentariosSalida = $("#comentariosSalida").val();
  let Marca = $("#marca").val();
  let Estado = $("#estado").val();
  let TipoDispositivo = $("#tipoDispositivo").val();
  let numeroserie = $("#numeroSerie").val();
  let ram = $("#ram").val();
  let tipodisco = $("#tipoDisco").val();

  const url = "/api/EditService";
  const dataM = {
    idservicio: idservicio,
    marca: Marca,
    tipodispositivo: TipoDispositivo,
    estado: Estado,
    numeroserie,
    comentariossalida: ComentariosSalida,
    ram: ram,
    tipodisco: tipodisco,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(dataM),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      AlertCorrectX("Servicio modificado exitosamente!");
    })
    .catch((error) => {
      console.error("Error al modificar:", error);
    });

  LimpiarFormulario();
  $("#spinner").hide();
}

function LimpiarFormulario() {
  $("#comentariosEntrada").val("");
  $("#marca").val("");
  $("#tipoDispositivo").val("");
  $("#numeroSerie").val("");
  $("#numeroServicio").val("");
  $("#comentariosSalida").val("");
  $("#ram").val("");
  $("#tipoDisco").val("");
}
