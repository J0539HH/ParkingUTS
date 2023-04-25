//Opciones de la Datatable

opcionesDatatable = {
  sProcessing: "Procesando...",
  sLengthMenu:
    "<label class='labelSelectDatatable'>Registros</label>" +
    "<select>" +
    '<option value="5">5</option>' +
    '<option value="10">10</option>' +
    '<option value="20">20</option>' +
    '<option value="50">50</option>' +
    "</select>  ",
  sZeroRecord: "Sin Resultados",
  sEmptyTable: "Sin Resultados",
  sInfoEmpty: "Sin Resultados",
  sInfo: "",
  sInfoFiltered: "",
  sInfoPostFix: "",
  sSearch: "Buscar",
  sUrl: "",
  sInfoThousands: ",",
  sLoadingRecords: "Cargando...",
  oPaginate: {
    sFirst: "Primero",
    sLast: "Último",
    sNext: "Siguiente",
    sPrevious: "Anterior",
  },
  select: {
    rows: "",
  },
  oAria: {
    sSortAscending: "Asc",
    sSortDescending: "Desc",
  },
};

$(document).ready(function () {
  $(this).scrollTop(0);
});

function verificarSesion() {
  //  return;
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
    })
    .catch((error) => {
      console.error(error);
    });
}

function CerrarSession() {
  fetch("/api/logout", { method: "GET" })
    .then((response) => {
      if (response.ok) {
        document.cookie =
          "mostradoModal=true; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "../../acceso/Login.html";
      } else {
        throw new Error("Error al cerrar sesión");
      }
    })
    .catch((error) => console.error(error));
}

function AlertIncorrectX(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
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

function configuracionInput() {
  $("input[type=text]").attr("autocomplete", "off");
  $("input[type=text]").on("keypress", function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });

  $("input[type=password]").each(function (inx, obj) {
    $(obj)
      .parent()
      .append(
        $("<i/>", {
          class: "bi bi-eye iTooltipPassword",
          onclick: "habilitarVerPassword(this);",
        })
      );
  });
}

function habilitarVerPassword(obj) {
  if ($(obj).hasClass("bi-eye")) {
    $(obj).removeClass("bi-eye");
    $(obj).addClass("bi-eye-slash");
    $(obj).siblings("input[type='password']").attr({
      type: "text",
    });
  } else if ($(obj).hasClass("bi-eye-slash")) {
    $(obj).removeClass("bi-eye-slash");
    $(obj).addClass("bi-eye");
    $(obj).siblings("input[type='text']").attr({
      type: "password",
    });
  }
}

function renderizarSelects() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $(".selectpicker").selectpicker("destroy");
    $("select.form-control").selectpicker({
      mobile: true,
    });
  }

  $("select.form-control.selectpicker").each(function (index, el) {
    var idSelect = $(el).attr("id");
    var value = $(el).val();

    if (value === "" || value === "0" || value.length === 0) {
      $("button.dropdown-toggle[data-id='" + idSelect + "']").css(
        "color",
        "#6F6F6E"
      );
    } else {
      $("button.dropdown-toggle[data-id='" + idSelect + "']").css(
        "color",
        "#000000"
      );
    }

    $("button.dropdown-toggle[data-id='" + idSelect + "']")
      .siblings("div.dropdown-menu")
      .find("div.bs-actionsbox button.actions-btn")
      .addClass("btnDefault");

    $("button.dropdown-toggle[data-id='" + idSelect + "']")
      .siblings("div.dropdown-menu")
      .find("div.bs-actionsbox button.bs-select-all")
      .html("Marcar todo");
    $("button.dropdown-toggle[data-id='" + idSelect + "']")
      .siblings("div.dropdown-menu")
      .find("div.bs-actionsbox button.bs-deselect-all")
      .html("Desmarcar todo");
  });
}

function configuracionInputError() {
  $("input.form-control.inputError").on("focus", function (event) {
    $(this).removeClass("inputError");
  });

  $("select.form-control.inputError").on("focus", function (event) {
    $(this).removeClass("inputError");
  });

  $("textarea.form-control.inputError").on("focus", function (event) {
    $(this).removeClass("inputError");
  });

  $("button.dropdown-toggle").on("focus", function (event) {
    $(this).prev("select").removeClass("inputError");
    $(this)
      .prev("select")
      .parent()
      .next("span.spanHelperErrorInput")
      .css("display", "none");
  });
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

function AlertIncorrecta(Texto) {
  Swal.fire({
    title: "",
    html: Texto,
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

function AlertCorrectX(Texto) {
  Swal.fire({
    title: "",
    text: Texto,
    imageUrl: "../../Multimedia/icoAlertSuccess.svg",
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
