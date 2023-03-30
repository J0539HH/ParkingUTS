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
  if (data.estado === "Entregado") {
    AlertIncorrecta(
      "El servicio ya a sido entregado no puedes realizar modificaciones"
    );
    LimpiarFormulario();
    return;
  }
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
  if (Estado === "En cola") {
    AlertIncorrecta("No puedes dejar en cola el servicio a gestionar");
    return;
  }
  if (ComentariosSalida === "") {
    AlertIncorrecta(
      "Debes indicar alguna informacion sobre el mantenimiento del dispositivo"
    );
    return;
  }
  if (Estado === "Entregado") {
    ConfirmacioFinalizar();
    return;
  }
  ActualizarServicio();
}

function ConfirmacioFinalizar() {
  Swal.fire({
    title: "",
    text: "Estas seguro de dar por finalizado el servicio?",
    imageUrl: "../../Multimedia/icoAlertWarning.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Aceptar",
    denyButtonText: "Volver",
    customClass: {
      container: "",
      popup: "",
      header: "",
      title: "",
      closeButton: "",
      icon: "",
      image: "",
      content: "",
      htmlContainer: "",
      input: "",
      inputLabel: "",
      validationMessage: "",
      actions: "",
      confirmButton: "buttonBtn btnPrimary",
      denyButton: "buttonBtn btnPrimary ",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      ActualizarServicio();
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
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
  $("#estado").val("");
  $("#tipoDisco").val("");
}
