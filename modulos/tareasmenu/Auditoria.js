var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  cargarAuditorias();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#ActualizarUser").on("click", function () {
    ValidarActualizacion();
  });

  $("#BotonBusqueda").on("click", function () {
    BuscarXfiltros();
  });

  $("#agregarNewUser").on("click", function () {
    ValidarInsercion();
  });
  $("#abrirModal").on("click", function () {
    limpiarModal();
  });

  $("#sidebarCollapse").on("click", function () {
    $("#ContenedorTabla").fadeOut(500, function () {
      $(this).toggleClass("ContenedorMax").fadeIn(500);
    });
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
    $("#sidebarCollapse i").toggleClass("rotateImg");
    $("#content").toggleClass("active");
    $("#sidebarCollapse").toggleClass("navbar-btn");
    $("#sidebarCollapse").toggleClass("btn-sidebar-activado");
  });

  $("#verContraseñaMod").click(function () {
    var tipo = $("#contraseñaMod").attr("type");
    if (tipo == "password") {
      $("#contraseñaMod").attr("type", "text");
      $("#verContraseñaMod").text("Ocultar");
    } else {
      $("#contraseñaMod").attr("type", "password");
      $("#verContraseñaMod").text("Mostrar");
    }
  });
});

function cargarAuditorias() {
  spinner("Cargando servicios, por favor espere");
  const url = "/api/auditoriasTotal";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      const tableData = { data: result };
      cargarTablaAuditorias(tableData);
    })
    .catch((error) => {
      // Lógica para manejar el error...
    });
}

function cargarTablaAuditorias(tableData) {
  console.log(tableData);
  $("#tablaUsuarios").DataTable({
    destroy: true,
    data: tableData.data,
    dom: "<'row'<'col-sm-12 paginadorTU col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row mt-3 '<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    columns: [
      { data: "usuario.nombre", className: " text-center" },
      {
        data: "fecha",
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
          return date.toLocaleString("es-CO", options);
        },
        type: "date",
      },
      { data: "descripcion", className: " text-center" },
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
    order: [[1, "desc"]],
  });
}

function Detallado(id) {
  window.location.replace("../tareasmenu/Seguimiento.html?id=" + id);
}
