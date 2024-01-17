var rol = null;
var idUsuario = null;

$(document).ready(function () {
  spinner("Cargando información");
  LimpiarFormulario();
  verificarSesionWrapper()
    .then(() => {
      cargarInformacion();
    })
    .catch((error) => {
      console.error(error);
      setTimeout(function () {
        window.location.href = "../../acceso/Login.html";
      }, 1000);
    });

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#password").on("click", function () {
    let password = $("#password").val();
    if (password === "******") {
      ValidacionCambioContraseña();
    }
  });

  $("#btnModificar").on("click", function () {
    validateExistingUser();
  });
});

function ValidacionCambioContraseña() {
  Swal.fire({
    title: "",
    html: "¿Quieres modificar la contraseña?",
    imageUrl: "../../Multimedia/candadoAbierto.png",
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: "PasswordModal",
    showConfirmButton: true,
    focusConfirm: false,
    allowOutsideClick: false,
    focusDeny: true,
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: "No",
    customClass: {
      container: "",
      popup: "",
      header: "",
      title: "",
      closeButton: "",
      icon: "",
      image: "passwordModal",
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
      $("#password").val("");
      $("#passwordC").val("");
    } else if (result.isDenied) {
      $("#password").val("******");
      $("#passwordC").val("******");
    }
  });
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

function validateExistingUser() {
  let usuario = $("#userPersona").val().toUpperCase();
  spinner("Validando disponibilidad del login");
  const url = "/api/EspecificUserLogin";
  const data = {
    idusuario: idUsuario,
    usuario: usuario,
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
      if (result === null) {
        validarModificacion();
        $("#spinner").hide();
        return;
      } else if (result.error === "OCUPED-USER") {
        AlertIncorrecta("El usuario esta ocupado");
        $("#spinner").hide();
        return;
      } else {
        validarModificacion();
        $("#spinner").hide();
        return;
      }
    })
    .catch((error) => {
      AlertIncorrecta("No se puede utilizar este nombre de usuario");
      $("#spinner").hide();
    });
}

function validarModificacion() {
  let usuario = $("#userPersona").val().toUpperCase();
  let password = $("#password").val();
  let passwordC = $("#passwordC").val();
  let genero = $("#generoPersona").val();
  let correo = $("#correoPersona").val();
  let telefono = $("#telefonoPersona").val();
  let direccion = $("#direccionPersona").val();
  let actualizarContraseña = false;

  if (usuario === "") {
    AlertIncorrectX("Debes ingresar un Usuario de acceso");
    return;
  }

  if (password !== "******") {
    actualizarContraseña = true;
  }

  if (password === "") {
    AlertIncorrectX("Tu contraseña no puede estar vacia");
    return;
  } else if (password !== passwordC) {
    AlertIncorrectX("La contraseñas no coinciden");
    $("#password").val("");
    $("#passwordC").val("");
    return;
  }

  if (genero === "") {
    AlertIncorrectX("Debes seleccionar un Genero");
    return;
  }
  var correoElectronico = correo;

  var expresionRegularCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (correoElectronico === "") {
    AlertIncorrectX("Debes ingresar un Correo electrónico");
  } else if (!expresionRegularCorreo.test(correoElectronico)) {
    AlertIncorrectX("Ingresa un Correo electrónico válido!");
  }
  if (telefono === "") {
    AlertIncorrectX("Debes ingresar un Telefono!");
    return;
  }
  if (direccion === "") {
    AlertIncorrectX("Debes ingresar una dirección!");
    return;
  }
  let vehiculoFavID = $("#vehiculos").val();

  spinner("Cambiando información de tu perfil");
  const url = "/api/ChangePersonalInformation";
  const data = {
    idusuario: idUsuario,
    usuario: usuario,
    password: password,
    genero: genero,
    correo: correo,
    telefono: telefono,
    direccion: direccion,
    actualizarContraseña: actualizarContraseña,
    vehiculofavorito: vehiculoFavID,
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
      AlertCorrectX("Información modificada exitosamente!");
      RegistrarAuditoria(
        "El usuario modifica su información personal desde el modulo mi perfil"
      );
      cargarInformacion();
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar la información de tu perfil");
      $("#spinner").hide();
    });
}

function cargarInformacion() {
  spinner("Cambiando información de tu perfil");
  const url = "/api/EspecificUser";
  const data = {
    idusuario: idUsuario,
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
      cargarVehiculos();
      $("#nombrePersona").val(result.persona.nombre);
      $("#carrera").val(result.persona.carrera);
      $("#identificacion").val(result.persona.documento);
      $("#userPersona").val(result.usuario);
      $("#password").val("******");
      $("#passwordC").val("******");
      $("#telefonoPersona").val(result.persona.celular);
      $("#direccionPersona").val(result.persona.direccion);
      $("#generoPersona").val(result.persona.genero);
      $("#correoPersona").val(result.persona.correo);
      $("#vehiculoPersona").val("xxxx");
      $("#sectionDatosOrigen").removeClass("hidden");
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar la información de tu perfil");
      $("#spinner").hide();
    });
}

function cargarVehiculos() {
  spinner("Cargando información de tus vehiculos");
  const url = "/api/VehiculosPersonales";
  const data = {
    idusuario: idUsuario,
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
      var selectElement = $("#vehiculos");
      selectElement.empty();
      selectElement.append(
        $("<option>").val("").text("Seleccione un vehiculo")
      );
      $.each(result, function (index, vehiculo) {
        if (vehiculo.tipoVehiculo === "Bicicleta") {
          var option = $("<option>")
            .val(vehiculo._id)
            .text(
              vehiculo.tipoVehiculo +
                " - " +
                vehiculo.marca.toUpperCase() +
                " - " +
                vehiculo.color
            );
        } else {
          var option = $("<option>")
            .val(vehiculo._id)
            .text(
              vehiculo.tipoVehiculo +
                " - " +
                vehiculo.marca.toUpperCase() +
                " - " +
                vehiculo.linea.toUpperCase() +
                " - " +
                vehiculo.placa
            );
        }

        selectElement.append(option);
      });
      cargarVehiculoFav();
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar la información de tus vehiculos");
      $("#spinner").hide();
    });
}

function cargarVehiculoFav() {
  spinner("Cargando tu vehiculo favorito");
  const url = "/api/VehiculoFav";
  const data = {
    idusuario: idUsuario,
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
      $("#vehiculos").val(result._id);
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar tu vehiculo favorito");
      $("#spinner").hide();
    });
}

function LimpiarFormulario() {
  $("#nombrePersona").val("");
  $("#userPersona").val("");
  $("#contraseña").val("");
  $("#telefonoPersona").val("");
  $("#direccionPersona").val("");
  $("#generoPersona").val("");
  $("#correoPersona").val("");
  $("#vehiculoPersona").val("");
}
