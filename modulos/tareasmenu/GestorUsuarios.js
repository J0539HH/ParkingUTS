var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  cargarUsuarios();
  LimpiarFiltros();
  limpiarModal();
  limpiarModalEdit();

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

function BuscarXfiltros() {
  spinner("Cargando usuarios solicitados, por favor espere");
  let busNombre = $("#busNombre").val();
  let busRol = parseInt($("#busRol").val());
  let busUsuario = $("#busUsuario").val().toUpperCase();
  let busEstado0 = $("#busEstado").val();
  busEstado = "";
  if (busEstado0 === "true") {
    busEstado = true;
  }
  if (busEstado0 === "false") {
    busEstado = false;
  }

  const url = "/api/FiltrarUsuarios";
  const data = {
    usuario: busUsuario,
    nombre: busNombre,
    rol: busRol,
    estado: busEstado,
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
      const tableData = { data: result };
      CargarTablaUsuarios(tableData);
      LimpiarFiltros();
      $("#spinner").hide();
    })
    .catch((error) => {
      cargarUsuarios();
      AlertIncorrecta("No se encontraron coincidencias.");
      LimpiarFiltros();
      $("#spinner").hide();
    });
}

function LimpiarFiltros() {
  $("#busNombre").val("");
  $("#busRol").val("");
  $("#busUsuario").val("");
  $("#busEstado").val("");
}

function cargarUsuarios() {
  spinner("Cargando usuarios, por favor espere");
  const url = "/api/usuariosTotal";
  fetch(url)
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
      { data: "usuario", className: " text-center" },
      { data: "persona.nombre", className: " text-center" },
      { data: "rol", className: " text-center" },
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
            '<a class="btn fondoVerde btn-primary btn-sm btnEditarGestion" id="'+row._id+'" onclick="editarUsuario(this.id)">Editar</a>            ' +
            '<a class="btn btn-danger btn-sm ml-1" onclick="ValidarEliminacion(' +
            row._id +
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

function editarUsuario(idUser) {
  //spinner("Cargando datos del usuario, por favor espere");
  $("#ActualizarUser").on("click", function () {
    ValidarActualizacion(idUser);
  });
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
  console.log(Data);
  $("#usuarioMod").val(Data.usuario);
  $("#contraseñaMod").val(Data.password);
  $("#tipoUsuarioMod").val(Data.rol);
  $("#nombreMod").val(Data.persona.nombre);
  $("#correoMod").val(Data.persona.correo);
  $("#estadoMod").val(Data.estado.toString());
  $("#modificarUsuarioModal").modal("show");
  $("#contraseñaMod").attr("type", "password");
  $("#verContraseñaMod").text("Mostrar");
}

function ValidarActualizacion(IdUsuario) {
  let UsuarioEdit = $("#usuarioMod").val();
  let IdRolEdit = $("#tipoUsuarioMod").val();
  let NombreEdit = $("#nombreMod").val();
  let EstadoEdit = $("#estadoMod").val();
  let CorreoEdit = $("#correoMod").val();

  if (UsuarioEdit === "") {
    AlertIncorrectX("Debes agregar un nombre de usuario");
    return;
  }
 
  if (IdRolEdit === "") {
    AlertIncorrectX("Debes agregar un tipo de usuario");
    return;
  }
  if (NombreEdit === "") {
    AlertIncorrectX(
      "Debes agregar el nombre de la persona que utilizará el perfil"
    );
    return;
  }

  if (EstadoEdit === "") {
    AlertIncorrectX("Debes agregar el estado del usuario");
    return;
  }
  if (CorreoEdit === "") {
    AlertIncorrectX("Debes agregar el correo del usuario");
    return;
  }

  Swal.fire({
    title: "",
    text: "Estas seguro de Modificar el usuario del sistema?",
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
      denyButton: "buttonBtn btnPrimary fondoRojo ",
      cancelButton: "",
      loader: "",
      footer: "",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      RealizarModificacion(IdUsuario);
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function RealizarModificacion(IdUsuario) {
  spinner("Modificando datos del usuario, por favor espere");
  let UsuarioEdit = $("#usuarioMod").val().toUpperCase();
  let IdRolEdit = $("#tipoUsuarioMod").val();
  let NombreEdit = $("#nombreMod").val();
  let correo = $("#correoMod").val();
  let estado = $("#estadoMod").val();

  EstadoEdit = false;
  if (estado === "true") {
    EstadoEdit = true;
  }

  const url = "/api/EditUser";
  const dataM = {
    idusuario: IdUsuario,
    usuario: UsuarioEdit,
    idrol: IdRolEdit,
    nombre: NombreEdit,
    estado: EstadoEdit,
    correo: correo,
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
      let descripcionAuditoria =
        "Modificación de los datos del usuario con id:" + IdUsuario;
      AlertCorrectX("Usuario Modificado exitosamente!");
      RegistrarAuditoriaGestionU(descripcionAuditoria);
      $("#spinner").hide();
      cargarUsuarios();
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
      $("#spinner").hide();
    });

  limpiarModalEdit();
  $("#modificarUsuarioModal").modal("hide");
}

function limpiarModalEdit() {
  $("#usuarioMod").val("");
  $("#contraseñaMod").val("");
  $("#tipoUsuarioMod").val("");
  $("#nombreMod").val("");
  $("#estadoMod").val("");
}

function ValidarInsercion() {
  let NewUsuario = $("#usuario").val();
  let NewPass = $("#contraseña").val();
  let NewTipoU = $("#tipoUsuario").val();
  let NewName = $("#nombre").val();
  let Correo = $("#correo").val();

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
  if (Correo === "") {
    AlertIncorrectX("Debes agregar correo electronico");
    return;
  }
  if (NewName === "") {
    AlertIncorrectX(
      "Debes agregar el nombre de la persona que utilizará el perfil"
    );
    return;
  }

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
  spinner("Registrando usuario, por favor espere");
  let NewUsuario = $("#usuario").val().toUpperCase();
  let NewPass = $("#contraseña").val();
  let NewTipoU = parseInt($("#tipoUsuario").val());
  let NewName = $("#nombre").val();
  let Correo = $("#correo").val();
  const url = "/api/NewUser";
  const data = {
    usuario: NewUsuario,
    password: SHA256(NewPass),
    idrol: NewTipoU,
    nombre: NewName,
    correo: Correo,
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
      AlertCorrectX("Usuario registrado en el sistema ");
      let descripcionAuditoria =
        "Se registra un nuevo usuario para :" + NewName;
      RegistrarAuditoriaGestionU(descripcionAuditoria);
      $("#spinner").hide();
      cargarUsuarios();
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
      $("#spinner").hide();
    });

  limpiarModal();
  $("#agregarUsuarioModal").modal("hide");
}

function limpiarModal() {
  $("#usuario").val("");
  $("#contraseña").val("");
  $("#tipoUsuario").val("");
  $("#nombre").val("");
}

function ValidarEliminacion(Id) {
  Swal.fire({
    title: "",
    html:
      "¿Estás seguro de eliminar el usuario con <b>identificador: " +
      Id +
      "</b> del sistema?",
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
      EliminarDefinitivo(Id);
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function EliminarDefinitivo(idUser) {
  spinner("Eliminado el usuario, por favor espere");
  const url = "/api/deleteUser";
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
      AlertCorrectX("El usuario se elimino con exito!");
      $("#spinner").hide();
      cargarUsuarios();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar el usuario");
      $("#spinner").hide();
    });
}

function RegistrarAuditoriaGestionU(descripcionAuditoria) {
  spinner("Registrando Auditoria");
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
      $("#spinner").hide();
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });
}
