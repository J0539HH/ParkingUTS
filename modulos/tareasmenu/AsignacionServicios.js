var idrol = null;
var idUsuario = null;
var idServicioAsignable = "";

$(document).ready(function () {
  verificarSesion();
  CargarTecnicos();
  cargarServiciosEnCola();
  LimpiarModal();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#asignarServicio").on("click", function () {
    validarAsignacion();
  });
});

function CargarTecnicos() {
  spinner("Cargando tecnicos, por favor espere");
  const url = "/api/cargarTecnicos";
  const data = {
    idrol: 3,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((usuarios) => {
      $.each(usuarios, function (index, usuario) {
        $("#tecnicoModal").append(
          $("<option>", {
            value: usuario.idusuario,
            text: usuario.nombre,
          })
        );
      });
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se encontraron coincidencias.");
      $("#spinner").hide();
    });
}

function AlertaIncorrecta(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
    imageUrl: "/Multimedia/icoAlertWarning.svg",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "Custom Icon",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Aceptar",
    denyButtonText: "",
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
      denyButton: "buttonBtn btnPrimary btnHidden",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // CONFIRMED CODE
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function cargarServiciosEnCola() {
  spinner("Cargando servicios, por favor espere");
  const url = "/api/serviciosSinAsignar";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result === "No se encontraron servicios") {
        AlertaIncorrecta("No hay servicios en cola para asignar!");
        $("#spinner").hide();
        $("#ContenedorTabla").addClass("hidden");
      } else {
        $("#ContenedorTabla").removeClass("hidden");
        const tableData = { data: result };
        CargarTablaServicios(tableData);
      }
    })
    .catch((error) => {
      // Lógica para manejar el error...
    });
}

function CargarTablaServicios(tableData) {
  idServicioAsignable = "";
  $("#tablaUsuarios").DataTable({
    destroy: true,
    data: tableData.data,
    dom: "<'row'<'col-sm-12 paginadorTU col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row mt-3 '<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    columns: [
      { data: "idservicio", className: " text-center" },
      {
        data: "marca",
        className: "text-center",
        render: function (data, type, row, meta) {
          return data.charAt(0).toUpperCase() + data.slice(1);
        },
      },
      { data: "tipodispositivo", className: " text-center" },
      { data: "usuario.nombre", className: " text-center" },
      {
        data: "fechaentrada",
        className: "text-center",
        render: function (data, type, row, meta) {
          var date = new Date(data);
          var options = { day: "numeric", month: "long", year: "numeric" };
          return date.toLocaleDateString("es-ES", options);
        },
      },
      { data: "comentariosentrada", className: " text-center" },
      {
        data: null,
        className: "text-center",
        render: function (data, type, row) {
          return (
            '<img src="../../Multimedia/asignar.png" class="iconoTabla" onclick="Asignar(\'' +
            row.idservicio +
            "')\" />"
          );
        },
      },
    ],
    language: {
      sProcessing: "Procesando...",
      sLengthMenu: "Mostrar _MENU_ registros",
      sZeroRecords: "No se encontraron resultados",
      sEmptyTable: "Ningún dato disponible en esta tabla",
      sInfo: "Mostrando  _END_ / _TOTAL_ registros",
      sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
      sInfoPostFix: "",
      sSearch: "Buscar:",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords: "Cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending:
          ": Activar para ordenar la columna de manera ascendente",
        sSortDescending:
          ": Activar para ordenar la columna de manera descendente",
      },
    },
    drawCallback: function (settings) {
      $("#spinner").hide();
    },
  });
}

function Asignar(id) {
  idServicioAsignable = id;
  $("#agregarUsuarioModal").modal("show");
  $("#asignarServicioTittle").html("Asignar servicio #" + id);
  LimpiarModal();
}

function validarAsignacion() {
  let tecnicoModal = $("#tecnicoModal").val();
  let comentariosSalida = $("#comentariosSalida").val();

  if (idServicioAsignable === "") {
    AlertIncorrectX("Parece que no puedes hacer esto");
    return;
  }
  if (tecnicoModal === "") {
    AlertIncorrectX("Debes seleccionar un tecnico para asignar el servicio.");
    return;
  }
  if (comentariosSalida === "") {
    AlertIncorrectX("Debes ingresar un comentario de asignación");
    return;
  }
  ConfirmarAsignacion();
}

function ConfirmarAsignacion() {
  let tecnico = $("#tecnicoModal option:selected").text();
  Swal.fire({
    title: "",
    html:
      "Desea asignar el servicio  <b>#" +
      idServicioAsignable +
      "</b> <br> Al tecnico: <b>" +
      tecnico +
      "?</b>",
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
    denyButtonText: "Cancelar",
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
      AsignacionDefinitiva();
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function AsignacionDefinitiva() {
  spinner("Actualizando el  servicio, por favor espere");
  let idservicio = parseInt(idServicioAsignable);
  let ComentariosSalida = $("#comentariosSalida").val();
  let Estado = "En mantenimiento";

  const url = "/api/AsignarServicio";
  const dataM = {
    idservicio: idservicio,
    estado: Estado,
    comentariossalida: ComentariosSalida,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(dataM),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {})
    .catch((error) => {
      console.error("Error al modificar:", error);
    });

  let tecnicoAsignar = parseInt($("#tecnicoModal").val());
  let servicioAsignado = parseInt(idServicioAsignable);
  const url2 = "/api/NewAsignado";
  const data = {
    idusuario: tecnicoAsignar,
    idservicio: servicioAsignado,
  };
  fetch(url2, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      RegistrarAuditoria(idServicioAsignable);
      AlertCorrectX("Servicio asignado exitosamente!");
      cargarServiciosEnCola();
      $("#agregarUsuarioModal").modal("hide");
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });

  $("#spinner").hide();
}

function LimpiarModal() {
  $("#tecnicoModal").val("");
  $("#comentariosSalida").val("");
}

function RegistrarAuditoria(idservicio) {
  tecnicoAsignado = $("#tecnicoModal option:selected").html();
  spinner("Registrando Auditoria");
  let descripcionAuditoria =
    "Se le asigna el mantenimiento del servicio con ID: " +
    idservicio +
    " a el tecnico: " +
    tecnicoAsignado;
  const url = "/api/NewAudtoria";
  const data = {
    idusuario: idUsuario,
    descripcion: descripcionAuditoria,
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
      LimpiarModal();
      $("#spinner").hide();
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });
}
