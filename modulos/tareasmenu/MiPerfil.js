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

  $("#btnModificar").on("click", function () {
    validarModificacion();
  });


});

function validarModificacion() {


  if ($("#userPersona").val() === "") {
    AlertIncorrectX("Debes ingresar un Usuario de acceso");
    return;
  }
  if ($("#generoPersona").val() === "") {
    AlertIncorrectX("Debes seleccionar un Genero");
    return;
  }
  var correoElectronico = $("#correoPersona").val();

  var expresionRegularCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (correoElectronico === "") {
    AlertIncorrectX("Debes ingresar un Correo electrónico");
  } else if (!expresionRegularCorreo.test(correoElectronico)) {
    AlertIncorrectX("Ingresa un Correo electrónico válido");
  }
  if ($("#telefonoPersona").val() === "") {
    AlertIncorrectX("Debes ingresar un Telefono");
    return;
  }
  if ($("#direccionPersona").val() === "") {
    AlertIncorrectX("Debes ingresar una dirección");
    return;
  }
}


function cargarInformacion() {
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
      $("#nombrePersona").val(result.persona.nombre);
      $("#userPersona").val(result.usuario);
      $("#contraseña").val(result.password);
      $("#telefonoPersona").val(result.persona.celular);
      $("#direccionPersona").val(result.persona.direccion);
      $("#generoPersona").val(result.persona.genero);
      $("#correoPersona").val(result.persona.correo);
      $("#vehiculoPersona").val("xxxx");

      console.log(result);
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar la información de tu perfil");
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
