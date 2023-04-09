var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesionT();
  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#serviciosGestionados").on("click", function () {
    $("#serviciosAsignados").removeClass("hidden");
    $("#serviciosGestionados").addClass("hidden");
    $("#tituloCabeceraAsignados").html("Historial de mantenimientos");
    $("#ContenedorTabla").addClass("hidden");
    $("#ContenedorTablaGestionados").removeClass("hidden");
    $("#tituloCabeceraAsignados").removeClass("BlueSistem");
    $("#tituloCabeceraAsignados").addClass("GreenSistem");
    cargarMisServiciosFinalizados();
  });

  $("#serviciosAsignados").on("click", function () {
    $("#serviciosGestionados").removeClass("hidden");
    $("#serviciosAsignados").addClass("hidden");
    $("#tituloCabeceraAsignados").html("Mantenimientos asignados");
    $("#ContenedorTablaGestionados").addClass("hidden");
    $("#ContenedorTabla").removeClass("hidden");
    $("#tituloCabeceraAsignados").removeClass("GreenSistem");
    $("#tituloCabeceraAsignados").addClass("BlueSistem");
    cargarMisServiciosEnCola();
  });
});

function cargarMisServiciosEnCola() {
  spinner("Cargando servicios, por favor espere");
  const url = "/api/serviciosTecnico";
  let idTecnico = idUsuario;
  const data = { idTecnico: idTecnico };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      const tableData = { data: result };
      CargarTablaServicios(tableData);
    })
    .catch((error) => {});
}

function cargarMisServiciosFinalizados() {
  spinner("Cargando servicios, por favor espere");
  const url = "/api/serviciosFinalizadosTecnico";
  let idTecnico = idUsuario;
  const data = { idTecnico: idTecnico };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      const tableData = { data: result };
      CargarTablaGestionados(tableData);
    })
    .catch((error) => {});
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
      {
        data: "serviciosasignados.fechaAsignacion",
        className: "text-center",
        render: function (data, type, row, meta) {
          var date = new Date(data);
          var options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          };
          return date.toLocaleDateString("es-ES", options);
        },
      },
      { data: "comentariosentrada", className: " text-center" },
      {
        data: null,
        className: "text-center",
        render: function (data, type, row) {
          return (
            '<img src="../../Multimedia/tool.png" class="iconoTabla" onclick="Gestionar(\'' +
            row.idservicio +
            "')\" />"
          );
        },
      },
      {
        data: null,
        className: "text-center",
        render: function (data, type, row) {
          return (
            '<img src="../../Multimedia/lupa.png" class="iconoTabla" onclick="Detallado(\'' +
            row.idservicio +
            "')\" />"
          );
        },
      },
    ],
    order: [[3, "asc"]],
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

function CargarTablaGestionados(tableData) {
  console.log(tableData);
  idServicioAsignable = "";
  $("#tablaGestionados").DataTable({
    destroy: true,
    data: tableData.data,
    dom: "<'row'<'col-sm-12 paginadorTU col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row mt-3 '<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    columns: [
      { data: "estado", className: " text-center" },
      {
        data: "marca",
        className: "text-center",
        render: function (data, type, row, meta) {
          return data.charAt(0).toUpperCase() + data.slice(1);
        },
      },
      { data: "tipodispositivo", className: " text-center" },
      {
        data: "serviciosasignados.fechaAsignacion",
        className: "text-center",
        render: function (data, type, row, meta) {
          var date = new Date(data);
          var options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          };
          return date.toLocaleDateString("es-ES", options);
        },
      },
      {
        data: "serviciosasignados.fechaFinalizacion",
        className: "text-center",
        render: function (data, type, row, meta) {
          var date = new Date(data);
          var options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          };
          return date.toLocaleDateString("es-ES", options);
        },
      },
      {
        data: null,
        className: "text-center",
        render: function (data, type, row) {
          return (
            '<img src="../../Multimedia/lupa.png" class="iconoTabla" onclick="Detallado(\'' +
            row.idservicio +
            "')\" />"
          );
        },
      },
    ],
    order: [[3, "desc"]],
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

function verificarSesionT() {
  console.log("VerificandoSessionbyJDFM");
  fetch("/api/sesion")
    .then((response) => response.json())
    .then((data) => {
      const idusuario = data.idusuario;
      idrol = data.idrol;
      idUsuario = data.idusuario;
      if (idusuario === undefined || idusuario === null) {
        $("#ContenedorTotal").addClass("hidden");
        AlertIncorrectX(
          "Estas tratando de acceder al sistema sin credenciales"
        );
        setTimeout(function () {
          window.location.href = "../../acceso/Login.html";
        }, 1000);
      }
      cargarMisServiciosEnCola();
    })
    .catch((error) => {
      console.error(error);
    });
}

function Gestionar(id) {
  window.location.replace("../tareasmenu/GestionarServicios.html?id=" + id);
}

function Detallado(id) {
  window.location.replace("../tareasmenu/Seguimiento.html?id=" + id);
}
