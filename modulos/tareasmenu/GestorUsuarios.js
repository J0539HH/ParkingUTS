var idrol = null;

$(document).ready(function () {
  verificarSesion();
  cargarUsuarios();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#agregarNewUser").on("click", function () {
    AgregarUsuario();
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
});

function AgregarUsuario() {
  let NewUsuario = $("#usuario").val();
  let NewPass = $("#contraseña").val();
  let NewTipoU = $("#tipoUsuario").val();
  let NewName = $("#nombre").val();

  if (NewUsuario === "") {
    AlertIncorrectX("Debes agregar un nombre de usuario");
    return;
  }
  if (NewPass === "") {
    AlertIncorrectX("Debes agregar una contraseña para el usuario");
    return;
  }
  if (NewTipoU === "") {
    AlertIncorrectX("Debes agregar un tipo de usuario");
    return;
  }
  if (NewName === "") {
    AlertIncorrectX(
      "Debes agregar el nombre de la persona que utilizará el perfil"
    );
    return;
  }
  ValidarInsercion();
}

function cargarUsuarios() {
  spinner("Cargando usuarios, por favor espere");
  const url = "/api/usuariosTotal";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      const tableData = { data: result };

      CargarTablaUsuarios(tableData);
    })
    .catch((error) => {
      // Lógica para manejar el error...
    });
}

function CargarTablaUsuarios(tableData) {
  $("#tablaUsuarios").DataTable({
    destroy: true,
    data: tableData.data,
    dom: "<'row'<'col-sm-12 paginadorTU col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row mt-3 '<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    columns: [
      { data: "idusuario", className: " text-center" },
      { data: "usuario", className: " text-center" },
      { data: "nombre", className: " text-center" },
      {
        data: "idrol",
        className: " text-center",
        render: function (data, type, row) {
          Rol = row.idrol;
          if (Rol === 1) {
            return "<td class=' text-center'>Administrador</td>";
          } else {
            return "<td class=' text-center'>Cliente</td>";
          }
        },
      },
      {
        data: "estado",
        className: " text-center",
        render: function (data, type, row) {
          Estado = row.estado;
          if (Estado === true) {
            return "<td class=' text-center'>Activo</td>";
          } else {
            return "<td class=' text-center'>Inactivo</td>";
          }
        },
      },
      {
        data: null,
        className: " text-center",
        render: function (data, type, row) {
          return (
            '<a class="btn btn-primary btn-sm" onclick="editarUsuario(' +
            row.idusuario +
            ')">Editar</a> ' +
            '<a class="btn btn-danger btn-sm ml-1" onclick="eliminarUsuario(' +
            row.idusuario +
            ')">Eliminar</a>'
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

function limpiarModal() {
  $("#usuario").val("");
  $("#contraseña").val("");
  $("#tipoUsuario").val("");
  $("#nombre").val("");
}

function editarUsuario(idUser) {
  spinner("Cargando datos del usuario, por favor espere");
  const url = "/api/EspecificUser";
  const data = {
    idusuario: idUser,
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
      MostrarDatosUsuario(result);
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar el usuario");
      $("#spinner").hide();
    });
}

function MostrarDatosUsuario(Data) {
  $("#usuarioMod").val(Data.usuario);
  $("#contraseñaMod").val(Data.password);
  $("#tipoUsuarioMod").val(Data.idrol);
  $("#nombreMod").val(Data.nombre);
  $("#estadoMod").val(Data.estado.toString());
  console.log(Data);
  $("#modificarUsuarioModal").modal("show");
  console.log("ff");
}

function limpiarModalEdit() {
  $("#usuarioMod").val("");
  $("#contraseñaMod").val("");
  $("#tipoUsuarioMod").val("");
  $("#nombreMod").val("");
  $("#estadoMod").val("");
}

function ValidarInsercion() {
  Swal.fire({
    title: "",
    text: "Estas seguro de agregar un nuevo usuario al sistema?",
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
      InsertarUsuario();
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function InsertarUsuario() {
  let NewUsuario = $("#usuario").val();
  let NewPass = $("#contraseña").val();
  let NewTipoU = $("#tipoUsuario").val();
  let NewName = $("#nombre").val();
  const url = "/api/NewUser";
  const data = {
    usuario: NewUsuario,
    password: NewPass,
    idrol: NewTipoU,
    nombre: NewName,
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
      AlertCorrectX("Usuario regristrado en el sistema ");
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });

  setTimeout(cargarUsuarios, 2500);
  limpiarModal();
  $("#agregarUsuarioModal").modal("hide");
}
