/* global utilidadesjQuery */

$(document).ready(function () {
  limpiarNewUser();
  limpiarCampos();
  $("#password").on("keydown", function (event) {
    var tecla = event.keyCode
      ? event.keyCode
      : event.which
        ? event.which
        : event.charCode;
    if (tecla === 13) {
      setTimeout(function () {
        verificarLogin();
      }, 500);
    }
  });

  $("#usuario").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#password").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newPassword").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newPassword2").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newCorreo").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#newUser").on("keyup", function () {
    var valor = $(this).val();
    var valorSinEspacios = valor.replace(/\s/g, "");
    $(this).val(valorSinEspacios);
  });

  $("#usuario").on("keydown", function (event) {
    var tecla = event.keyCode
      ? event.keyCode
      : event.which
        ? event.which
        : event.charCode;
    if (tecla === 13) {
      setTimeout(function () {
        verificarLogin();
      }, 500);
    }
  });

  $("#usuario, #password").focus(function () {
    $("p.pTxtMsg").addClass("hidden");
  });

  $("div#divGlobal").removeClass("hidden");

  $("button#btnIniciarSesion").on("click", function () {
    verificarLogin();
  });

  $("div#divGlobal").overlayScrollbars({
    overflowBehavior: {
      x: "hidden",
    },
    scrollbars: {
      // autoHide: "leave", //"never", "scroll", "leave", "move"
    },
  });

  $("#newCliente").on("click", function () {
    $("#modalNewUser").modal("show");
  });

  $("#passwordRecovery").on("click", function () {
    $("#modalRecuperar").modal("show");
  });

  $("#btnRecuperar").on("click", function () {
    ValidarUsuarioRecuperar();
  });

  $("#btnValidar").on("click", function () {
    ValidarCodigoRecuperar();
  });

  $("#btnRegistrar").on("click", function () {
    ValidarNuevoUsuario();

  });

  configuracionInput();

  $(".input-key").keyup(function () {
    if ($(this).val().length == $(this).attr("maxlength")) {
      $(this).next(".input-key").focus();
    }
  });
});

function ValidarNuevoUsuario() {
  let nuevoUsuario = $("#newUser").val().trim();
  let UserUPP = nuevoUsuario.toUpperCase();
  let nuevoPass = $("#newPassword").val();
  let nuevoPass2 = $("#newPassword2").val();
  let correo = $("#newCorreo").val();
  let nombreCompleto = $("#newName").val();

  if (nuevoUsuario === "") {
    AlertIncorrecta("Debes seleccionar un nombre de usuario");
    return;
  }
  if (nuevoPass === "") {
    AlertIncorrecta("La contraseña no puede estar vacia");
    return;
  }
  if (nuevoPass2 === "") {
    AlertIncorrecta("La confirmación de la contraseña no puede estar vacia");
    return;
  }
  if (correo === "") {
    AlertIncorrecta("El correo no puede estar vacio");
    return;
  } else {
    var patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!patron.test(correo)) {
      AlertIncorrecta("El correo electrónico ingresado no es válido.");
      return;
    }
  }
  if (nombreCompleto === "") {
    AlertIncorrecta("Debes proporcionarnos tu nombre completo");
    return;
  }

  if (nuevoPass !== nuevoPass2) {
    AlertIncorrecta("Las contraseñas no son iguales");
    return;
  }
  $("#modalNewUser").modal("hide");
  spinner("Validando el usuario, por favor espere");
  const url = "/api/EspecificLogin";
  const data = {
    usuario: UserUPP,
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
      if (result === "Login no encontrado") {
        RegistrarNewUser();
      } else {
        $("#spinner").hide();
        AlertIncorrecta("No puedes registrarte con este nombre de usuario.");
        $("#modalNewUser").modal("show");
      }
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo registrar");
      $("#spinner").hide();
    });
}
function ValidarUsuarioRecuperar() {
  $("#modalCodigoRecuperar").modal("show");
  $("#modalRecuperar").modal("hide");
}
function ValidarCodigoRecuperar() {
  $("#modalCambioPass").modal("show");
  $("#modalCodigoRecuperar").modal("hide");
}

function RegistrarNewUser() {
  spinner("Registrando un nuevo usuario, por favor espere");
  let nuevoUsuario = $("#newUser").val().toUpperCase();
  let nuevoPass = $("#newPassword").val();
  let correo = $("#newCorreo").val();
  let nombreCompleto = $("#newName").val();

  const url = "/api/NewUser";
  const data = {
    usuario: nuevoUsuario,
    password: SHA256(nuevoPass),
    idrol: 2,
    nombre: nombreCompleto,
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
      enviarCorreo();
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
      $("#spinner").hide();
    });
}
function enviarCorreo() {
  spinner("Enviando información al correo electronico!");
  let nuevoUsuario = $("#newUser").val().toUpperCase();
  let nuevoPass = $("#newPassword").val();
  let nombre = $("#newName").val().toUpperCase();
  const mensaje =
    "<p>Hola! <b>" +
    nombre +
    ", </b>gracias por registrarte en el sistema de gestion de mantenimientos de <b>DOCUTECH.</b> <br> <p>Estos son tus datos de acceso!</p> <br>🎯 <b>Login:</b> " +
    nuevoUsuario +
    "<br>⭐<b>Contraseña:</b> " +
    nuevoPass +
    "</p><br>Recuerda que puedes iniciar sesión en el siguiente link: <p>http://34.125.36.154:3000/acceso/Login.html</p> ";
  const correo = $("#newCorreo").val();
  const asunto = "Bienvenido a DOCUTECH";

  const data = {
    correo: correo,
    asunto: asunto,
    mensaje: mensaje,
  };

  fetch("/EnvioDecorreo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        spinner("Enviando información al correo electronico!");
        AlertCorrectX("Usuario registrado en el sistema!! ");
        $("#usuario").val(nuevoUsuario);
        $("#password").val(nuevoPass);
        limpiarNewUser();
        $("#spinner").hide();
      } else {
        $("#modalNewUser").modal("show");
        throw new Error("Error al enviar el correo electrónico");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function verificarLogin() {
  var usuario = $("#usuario").val().trim();
  var password = $("#password").val();
  if (usuario === "") {
    AlertIncorrecta(
      "Debe proporcionar un nombre de usuario para acceder al sistema"
    );
    return;
  }
  if (password === "") {
    AlertIncorrecta("Debe proporcionar contraseña para acceder al sistema");
    return;
  }
  var fecha = new Date();

  ValidarUsuario();
  spinner("Validando Usuario, por favor espere...");
}

function AlertIncorrecta(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
    imageUrl: "../Multimedia/icoAlertWarning.svg",
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

function AlertCorrecta(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
    imageUrl: "../Multimedia/icoAlertSuccess.svg",
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

function ValidarUsuario() {
  const usuario = $("#usuario").val().toUpperCase();
  const password = document.getElementById("password").value;
  const url = "/api/usuarios";
  const data = {
    usuario: usuario,
    password: SHA256(password),
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
      IniciarSession(result.idusuario, result.idrol, result.nombre);
      $("#spinner").hide();
    })
    .catch((error) => {
      console.error("Error al validar el usuario:", error);
      // Lógica para manejar el error...
      AlertIncorrecta("Usuario y/o contraseña incorrecta");
      $("#spinner").hide();
    });
}

function RegistrarAuditoria(idusuario) {
  spinner("Registrando Auditoria");
  let descripcionAuditoria = "Ingreso exitoso al sistema";
  const url = "/api/NewAudtoria";
  const data = {
    idusuario: idusuario,
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
      AlertCorrecta("Bienvenido al sistema!");
      setTimeout(function () {
        window.location.href = "/modulos/tareasmenu/menu.html";
      }, 1500);
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });
}

function limpiarNewUser() {
  $("#newUser").val("");
  $("#newPassword").val("");
  $("#newPassword2").val("");
  $("#newCorreo").val("");
  $("#newName").val("");
}

function limpiarCampos() {
  $("#usuario").val("");
  $("#password").val("");
}

function CerrarAlerta() {
  $.alerts._hide();
  callback(true);
}

function IniciarSession(idusuario, idrol, nombre) {
  fetch("/api/sesion", {
    method: "POST",
    body: JSON.stringify({ idusuario: idusuario, idrol: idrol, nombre: nombre }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  RegistrarAuditoria(idusuario);
}

function spinner(texto) {
  if (texto === "") {
    texto = "Cargando...";
  }
  if (texto === false) {
    $("#spinner").hide();
    return;
  }
  $("#textLoad").html(texto);
  $("#spinner").show();
}
