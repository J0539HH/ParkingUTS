/* global utilidadesjQuery */

var OTPgenerado = "";
var Usuario = "";
var OTP2 = "";

var VERIFICAR_LOGIN = 101;

$(document).ready(function () {
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

  $("p#pOlvidoContraseña").on("click", function () {
    $("#modalUser").modal({
      backdrop: "static",
      keyboard: false,
    });
    $("#modalUser").modal("show");
    LimpiarRegistros();
    $("#usuarioIngresado").val($("#usuario").val());
  });

  $("div#divGlobal").overlayScrollbars({
    overflowBehavior: {
      x: "hidden",
    },
    scrollbars: {
      // autoHide: "leave", //"never", "scroll", "leave", "move"
    },
  });

  configuracionInput();

  $(".input-key").keyup(function () {
    if ($(this).val().length == $(this).attr("maxlength")) {
      $(this).next(".input-key").focus();
    }
  });
});

function verificarLogin() {
  var usuario = $("#usuario").val();
  var password = $("#password").val();
  if (usuario === "") {
    jAlert(
      "Debe proporcionar un nombre de usuario para acceder al sistema",
      "Aviso"
    );
    return;
  }
  if (password === "") {
    jAlert("Debe proporcionar una palabra clave de entrada", "Aviso");
    return;
  }
  var fecha = new Date();
  AlertIncorrecta(
    "Nombre de usuario incorrecto o no existe, inténtelo otra vez."
  );
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

function CerrarAlerta() {
  $.alerts._hide();
  callback(true);
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
