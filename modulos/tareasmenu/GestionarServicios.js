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
      $("#spinner").hide();
    });
}

function cargarDatos(data) {
  $("#comentariosEntrada").val(data.comentariosentrada);
  $("#marca").val(data.marca);
  $("#tipoDispositivo").val(data.tipodispositivo);
  $("#estado").val(data.estado);
  $("#numeroSerie").val(data.numeroserie);
}

function ValidarFormulario() {
  let ComentariosEntrada = $("#comentariosEntrada").val();
  let Marca = $("#marca").val();
  let TipoDispositivo = $("#tipoDispositivo").val();

  if (ComentariosEntrada === "") {
    AlertIncorrecta("Debes indicar alguna informacion sobre el mantenimiento del dispositivo");
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
  return;
  RealizarInsercion();
}

function RealizarInsercion() {
  spinner("Registrando servicio, por favor espere");
  let comentariosentrada = $("#comentariosEntrada").val();
  let marca = $("#marca").val();
  let tipodispositivo = $("#tipoDispositivo").val();
  let numeroserie = $("#numeroSerie").val();

  const url = "/api/NewForm";
  const data = {
    comentariosentrada,
    marca,
    tipodispositivo,
    numeroserie
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
      AlertCorrectX("Servicio regristrado en el sistema ");
      $("#spinner").hide();
      LimpiarFormulario();
    })
    .catch((error) => {
      console.error("Error al registrar:", error);
      $("#spinner").hide();
    });
}

function LimpiarFormulario() {
  $("#comentariosEntrada").val("");
  $("#marca").val("");
  $("#tipoDispositivo").val("");
  $("#numeroSerie").val("");
} 