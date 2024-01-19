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

  $("#atrasCrear").on("click", function () {
    $("#netxStep, #contenedorDatosPersonales, #cerrarCrear").removeClass(
      "hidden"
    );
    $("#infoSubtitulo").html("Datos personales:");
    $("#agregarNewUser, #atrasCrear, #contenedorDatosUsuario").addClass(
      "hidden"
    );
  });

  $("#BotonBusqueda").on("click", function () {
    BuscarXfiltros();
  });

  $("#netxStep").on("click", function () {
    ValidarDatosPersonales();
  });

  $("#agregarNewUser").on("click", function () {
    ValidarInsercion();
  });
  $("#abrirModal").on("click", function () {
    $("#netxStep, #contenedorDatosPersonales, #cerrarCrear").removeClass(
      "hidden"
    );
    $("#infoSubtitulo").html("Datos personales:");
    $("#agregarNewUser, #atrasCrear, #contenedorDatosUsuario").addClass(
      "hidden"
    );
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
      {
        data: "rol",
        className: "text-center",
        render: (data) => data.toUpperCase(),
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
            '<a class="btn fondoVerde btn-primary btn-sm btnEditarGestion" id="' +
            row._id +
            '" onclick="editarUsuario(this.id)">Editar</a>            ' +
            '<a class="btn btn-danger btn-sm ml-1" id="' +
            row._id +
            '" onclick="ValidarEliminacion(this.id)">Eliminar</a>'
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
  let tipoUsuario = $("#tipoUsuarioMod").val();
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
    tipoUsuario: tipoUsuario,
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
      RegistrarAuditoria(descripcionAuditoria);
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

function RegistrarAuditoria(textoAuditoria) {
  spinner("Registrando auditoria");
  const url = "/api/registrarAuditoriaModelo";
  const data = {
    idusuario: idUsuario,
    textoAuditoria: textoAuditoria,
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
      return;
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo registrar la auditoria, algo falló");
      $("#spinner").hide();
    });
}

function limpiarModalEdit() {
  $("#usuarioMod").val("");
  $("#contraseñaMod").val("");
  $("#tipoUsuarioMod").val("");
  $("#nombreMod").val("");
  $("#estadoMod").val("");
}

function ValidarInsercion() {
  let NewUsuario = $("#usuarioR").val();
  let NewPass = $("#passwordR").val();
  let NewPassC = $("#passwordCR").val();
  let NewTipoU = $("#tipoUsuarioR").val();
  let estado = $("#estadoR").val();

  if (NewUsuario === "") {
    AlertIncorrecta("Debes agregar un nombre de <b>usuario</b>");
    return;
  }
  if (NewPass === "") {
    AlertIncorrecta("Debes agregar una <b>contraseña</b> para el usuario");
    return;
  }
  if (NewPass !== NewPassC) {
    AlertIncorrecta("Las contraseñas deben  <b>conincidir</b>");
    return;
  }
  if (NewTipoU === "") {
    AlertIncorrecta("Debes agregar un <b>tipo de usuario</b>");
    return;
  }
  if (estado === "") {
    AlertIncorrecta(
      "Debes agregar un <b>estado</b> para el usuario a registrar"
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
  let NewUsuario = $("#usuarioR").val();
  let NewPass = $("#passwordR").val();
  let NewTipoU = $("#tipoUsuarioR").val();
  let estado = $("#estadoR").val();
  let nombre = $("#nombrePersona").val();
  let documento = $("#documentoPersona").val();
  let genero = $("#generoPersona").val();
  let carrera = $("#carreraPersona").val();
  let celular = $("#celularPersona").val();
  let direccion = $("#direccionPersona").val();
  let correo = $("#correoPersona").val();

  let estadoBool = false;
  if (estado === "true") {
    estadoBool = true;
  }

  const url = "/api/NewUser";
  const data = {
    usuario: NewUsuario.toUpperCase(),
    password: SHA256(NewPass),
    rol: NewTipoU,
    estado: estadoBool,
    nombre: nombre,
    documento: documento,
    genero: genero,
    carrera: carrera,
    celular: celular,
    direccion: direccion,
    correo: correo,
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
      if (result === "Login Utilizado") {
        AlertIncorrectX("El login a registrar ya está en uso");
        return;
      } else {
        AlertCorrectX("Usuario registrado en el sistema ");
        let descripcionAuditoria =
          "Se registra un nuevo usuario para :" + nombre;
        RegistrarAuditoria(descripcionAuditoria);
        $("#spinner").hide();
        limpiarModal();
        cargarUsuarios();
      }
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
      $("#spinner").hide();
    });

  $("#agregarUsuarioModal").modal("hide");
}

function limpiarModal() {
  $("#nombrePersona").val("");
  $("#documentoPersona").val("");
  $("#generoPersona").val("");
  $("#carreraPersona").val("");
  $("#celularPersona").val("");
  $("#direccionPersona").val("");
  $("#correoPersona").val("");
  $("#usuarioR").val("");
  $("#passwordR").val("");
  $("#passwordCR").val("");
  $("#tipoUsuarioR").val("");
  $("#estadoR").val("");
}

function ValidarEliminacion(Id) {
  Swal.fire({
    title: "",
    html: "¿Estás seguro de eliminar el usuario del sistema?",
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

function ValidarDatosPersonales() {
  let nombre = $("#nombrePersona").val();
  let documento = $("#documentoPersona").val();
  let genero = $("#generoPersona").val();
  let carrera = $("#carreraPersona").val();
  let celular = $("#celularPersona").val();
  let direccion = $("#direccionPersona").val();
  let correo = $("#correoPersona").val();

  if (nombre === "") {
    AlertIncorrecta(
      "Debes introducir un <b>nombre</b> de la persona a registrar"
    );
    return;
  }

  if (documento === "") {
    AlertIncorrecta(
      "Debes introducir un <b>documento</b> de la persona a registrar"
    );
    return;
  }
  if (genero === "") {
    AlertIncorrecta(
      "Debes introducir un <b>genero</b> de la persona a registrar"
    );
    return;
  }
  if (carrera === "") {
    AlertIncorrecta(
      "Debes introducir una <b>carrera</b> de la persona a registrar"
    );
    return;
  }
  if (celular === "") {
    AlertIncorrecta(
      "Debes introducir un <b>celular</b> de la persona a registrar"
    );
    return;
  }
  if (direccion === "") {
    AlertIncorrecta(
      "Debes introducir una <b>direccion</b> de la persona a registrar"
    );
    return;
  }
  if (correo === "") {
    AlertIncorrecta(
      "Debes introducir una <b>correo</b> de la persona a registrar"
    );
    return;
  }
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(correo)) {
    AlertIncorrecta("El formato del correo electrónico no es válido");
    return;
  }

  spinner(
    "Validando la disponibilidad del documento a registrar, por favor espere.."
  );
  const url = "/api/findPersonByDocument";
  const data = {
    documento: documento,
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
      if (result === "Disponible") {
        $("#infoSubtitulo").html("Datos del usuario: ");
        $("#netxStep, #contenedorDatosPersonales, #cerrarCrear").addClass(
          "hidden"
        );
        $("#agregarNewUser, #atrasCrear,#contenedorDatosUsuario").removeClass(
          "hidden"
        );
        $("#spinner").hide();
      } else {
        AlertIncorrecta("El documento ya se encuentra registrado");
        $("#spinner").hide();
        return;
      }
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo validar el documento");
      $("#spinner").hide();
      return;
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
