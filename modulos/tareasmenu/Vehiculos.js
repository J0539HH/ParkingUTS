var rol = null;
var idUsuario = null;

$(document).ready(function () {
  limpiarDatos();
  limpiarDatosEditar();
  verificarSesionWrapper()
    .then(() => {
      cargarVehiculos();
      $("input[name='vehiculo']").prop("checked", false);
      $("#spinner").hide();
    })
    .catch((error) => {
      $("#spinner").hide();
      setTimeout(function () {
        console.log("no session");
        window.location.href = "../../acceso/Login.html";
      }, 1000);
    });

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#btnRegistrar").on("click", function () {
    validarRegistro();
  });

  $("#btnRegistrarE").on("click", function () {
    let idVehiculoEditable = $("#btnRegistrarE").attr("idvehiculo");
    let tipoVehiculo = $("#btnRegistrarE").attr("tipovehiculo");
    validarModificacion(idVehiculoEditable, tipoVehiculo);
  });

  $("#nuevoVehiculo").on("click", function () {
    $("#modalNewVehiculo").modal("show");
    limpiarDatos();
  });

  $("input[name='vehiculo']").change(function () {
    let vehiculoSeleccionado = $("input[name='vehiculo']:checked").val();
    if (vehiculoSeleccionado === "Carro") {
      $("#datosCarro").removeClass("hidden");
      $("#datosMoto, #datosBicicleta").addClass("hidden");
      $("#imagenTipoVehiculo").fadeOut(400, function () {
        $(this).attr("src", "../../multimedia/infocar.png").fadeIn(400);
      });
    } else if (vehiculoSeleccionado === "Moto") {
      $("#datosMoto").removeClass("hidden");
      $("#datosCarro, #datosBicicleta").addClass("hidden");
      $("#imagenTipoVehiculo").fadeOut(400, function () {
        $(this).attr("src", "../../multimedia/motocicleta.png").fadeIn(400);
      });
    } else if (vehiculoSeleccionado === "Bicicleta") {
      $("#datosBicicleta").removeClass("hidden");
      $("#datosCarro, #datosMoto").addClass("hidden");
      $("#imagenTipoVehiculo").fadeOut(400, function () {
        $(this).attr("src", "../../multimedia/bicicleta.png").fadeIn(400);
      });
    } else {
      $("#imagenTipoVehiculo").fadeOut(400, function () {
        $(this).attr("src", "../../multimedia/preguntas.png").fadeIn(400);
      });
      $("#datosCarro, #datosBicicleta").addClass("hidden");
      $("#datosMoto").addClass("hidden");
    }
  });
});

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
      if (result === "Usuario sin vehiculos") {
        AlertCorrectX(
          "Empieza a registrar tus vehiculos presionando el botón: <b>NUEVO</b>"
        );
        $("#contenedorVehiculos").empty();
        var info = $("<p>").text(
          "Parece que no tienes vehiculos registrados.."
        );
        $("#contenedorVehiculos").append(info);
      } else {
        $("#contenedorVehiculos").empty();
        var table = $("<table>").addClass("table");
        var columnTitles = [
          "Tipo Vehículo",
          "Placa",
          "Marca",
          "Color",
          "Línea",
          "Acciones",
        ];
        var headerRow = $("<tr>");
        columnTitles.forEach(function (title) {
          var th = $("<th>").text(title);
          if (title === "placa") {
            th.addClass("text-left");
          }
          headerRow.append(th);
        });
        table.append(headerRow);
        result.forEach(function (item) {
          var row = $("<tr id='" + item._id + "'>");
          var columnKeys = [
            "tipoVehiculo",
            "placa",
            "marca",
            "color",
            "linea",
            "_id",
          ];

          columnKeys.forEach(function (key) {
            if (typeof item[key] !== "object") {
              var cell = $("<td>").text(item[key]);
              if (key === "usuario" || key === "_id") {
                cell.addClass("hidden");
              } else if (key === "tipoVehiculo") {
                if (item.tipoVehiculo === "Moto") {
                  cell.append(
                    `<img class="imgTabla" src="../../Multimedia/motoenduro.svg"  alt="moto">`
                  );
                } else if (item.tipoVehiculo === "Carro") {
                  cell.append(
                    `<img class="imgTabla" src="../../Multimedia/deportivo.svg"  alt="carro">`
                  );
                } else if (item.tipoVehiculo === "Bicicleta") {
                  cell.append(
                    `<img class="imgTabla" src="../../Multimedia/ciclismo.svg"  alt="cicla">`
                  );
                }
              } else if (key === "placa") {
                cell.addClass("placaTabla");
              } else if (key === "marca") {
                cell.text(item[key].toUpperCase());
              } else if (key === "marca" || key === "color") {
                cell.text(item[key].toUpperCase());
              }
              row.append(cell);
            }
          });
          var actionsCell = $("<td>");
          var editarIcon = $(
            '<img class="accion-icon iconoAccion" src="../../Multimedia/editar.png" alt="Editar">'
          ).attr("data-id", item._id);
          var eliminarIcon = $(
            '<img class="accion-icon iconoAccion" src="../../Multimedia/borrar.png" alt="Eliminar">'
          ).attr("data-id", item._id);
          editarIcon.on("click", function () {
            editarVehiculo(item);
          });
          eliminarIcon.on("click", function () {
            eliminarVehiculo(item);
          });

          actionsCell.append(editarIcon, eliminarIcon);
          row.append(actionsCell);
          table.append(row);
        });

        $("#contenedorVehiculos").append(table);
      }
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
      let idfav = result._id;
      const rutaImagen = "url('../../Multimedia/starFav.png')";
      $("#" + idfav)
        .css({
          "background-image": rutaImagen,
          "background-repeat": "no-repeat",
          "background-size": "119px",
          "background-position": "120px 13px",
        })
        .attr("favorito", "true");
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta("No se pudo cargar tu vehiculo favorito");
      $("#spinner").hide();
    });
}

function editarVehiculo(info) {
  $("#btnRegistrarE").attr("idvehiculo", info._id);
  $("#btnRegistrarE").attr("tipovehiculo", info.tipoVehiculo);
  limpiarDatosEditar();
  if (info.tipoVehiculo === "Carro") {
    $("#placaCarroE").val(info.placa);
    $("#marcasCarroE").val(info.marca);
    $("#ColorCarroE").val(info.color);
    $("#LineaCarroE").val(info.linea);
    $("#datosCarroE").removeClass("hidden");
    $("#datosMotoE, #datosBicicletaE").addClass("hidden");
    $("#imagenTipoVehiculoE").fadeOut(400, function () {
      $(this).attr("src", "../../multimedia/infocar.png").fadeIn(400);
    });
  } else if (info.tipoVehiculo === "Moto") {
    $("#placaMotoE").val(info.placa);
    $("#marcasMotoE").val(info.marca);
    $("#ColorMotoE").val(info.color);
    $("#LineaMotoE").val(info.linea);
    $("#datosMotoE").removeClass("hidden");
    $("#datosCarroE, #datosBicicletaE").addClass("hidden");
    $("#imagenTipoVehiculoE").fadeOut(400, function () {
      $(this).attr("src", "../../multimedia/motocicleta.png").fadeIn(400);
    });
  } else if (info.tipoVehiculo === "Bicicleta") {
    $("#ColorCiclaE").val(info.color);
    $("#MarcaCiclaE").val(info.marca);
    $("#datosBicicletaE").removeClass("hidden");
    $("#datosCarroE, #datosMotoE").addClass("hidden");
    $("#imagenTipoVehiculoE").fadeOut(400, function () {
      $(this).attr("src", "../../multimedia/bicicleta.png").fadeIn(400);
    });
  } else {
    AlertIncorrecta(
      "Parece que hay un problema con el tipo de vehiculo a editar"
    );
    return;
  }
  $("#modalEditarVehiculo").modal("show");
}

function eliminarVehiculo(info) {
  Swal.fire({
    title: "",
    html:
      "Estas seguro de eliminar el vehiculo de marca<br> <b>" +
      info.marca.toUpperCase(),
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
      eliminarVehiculoDB(info._id);
    } else if (result.isDenied) {
      // DENIED CODE
    }
  });
}

function eliminarVehiculoDB(idVehiculo) {
  spinner("Intentando registrar tu vehiculo");
  const url = "/api/EliminarVehiculoUser";
  const data = {
    idusuario: idUsuario,
    idVehiculo: idVehiculo,
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
      let vehiculo = result.VehiculoEliminado;
      AlertCorrectX("Vehiculo eliminado exitosamente");
      cargarVehiculos();
      RegistrarAuditoria(
        "Vehiculo de tipo " +
          vehiculo.tipoVehiculo +
          " y marca " +
          vehiculo.marca +
          " eliminado exitosamente desde el modulo de gestion de vehiculos"
      );
      $("#spinner").hide();
      return;
    })
    .catch((error) => {
      AlertIncorrecta(
        "No se pudo eliminar el vehiculo, contacta al administrador del sistema"
      );
      $("#spinner").hide();
    });
}

function validarRegistro() {
  let vehiculoSeleccionado = $("input[name='vehiculo']:checked").val();
  if (vehiculoSeleccionado === undefined) {
    AlertIncorrecta("Debes seleccionar un tipo de vehiculo");
    return;
  } else if (vehiculoSeleccionado === "Carro") {
    let placaCarro = $("#placaCarro").val().toUpperCase();
    if (placaCarro === "") {
      AlertIncorrecta("Debes introducir la <b>placa</b> de tu vehiculo");
      return;
    }
    if (placaCarro.length < 5) {
      AlertIncorrecta(
        "Debes introducir una <b>placa</b> de vehículo válida <br> (mínimo 5 caracteres)."
      );
      return;
    }
    let marcaCarro = $("#marcasCarro").val();
    if (marcaCarro === "") {
      AlertIncorrecta("Debes introducir la <b>marca</b> de tu vehiculo");
      return;
    }
    let colorCarro = $("#ColorCarro").val();
    if (colorCarro === "") {
      AlertIncorrecta("Debes introducir el <b>color</b> de tu vehiculo");
      return;
    }
    let lineaCarro = $("#LineaCarro").val();
    if (lineaCarro === "") {
      AlertIncorrecta("Debes introducir la <b>linea</b> de tu vehiculo");
      return;
    }
    RegistrarVehiculo(
      vehiculoSeleccionado,
      placaCarro,
      marcaCarro,
      colorCarro,
      lineaCarro
    );
  } else if (vehiculoSeleccionado === "Moto") {
    let placaMoto = $("#placaMoto").val().toUpperCase();
    if (placaMoto === "") {
      AlertIncorrecta("Debes introducir la <b>placa</b> de tu vehiculo");
      return;
    }
    if (placaMoto.length < 5) {
      AlertIncorrecta(
        "Debes introducir una <b>placa</b> de vehículo válida <br> (mínimo 5 caracteres)."
      );
      return;
    }
    let marcasMoto = $("#marcasMoto").val();
    if (marcasMoto === "") {
      AlertIncorrecta("Debes introducir la <b>marca</b> de tu vehiculo");
      return;
    }
    let colorMoto = $("#ColorMoto").val();
    if (colorMoto === "") {
      AlertIncorrecta("Debes introducir el <b>color</b> de tu vehiculo");
      return;
    }
    let lineaMoto = $("#LineaMoto").val();
    if (lineaMoto === "") {
      AlertIncorrecta("Debes introducir la <b>linea</b> de tu vehiculo");
      return;
    }
    RegistrarVehiculo(
      vehiculoSeleccionado,
      placaMoto,
      marcasMoto,
      colorMoto,
      lineaMoto
    );
  } else if (vehiculoSeleccionado === "Bicicleta") {
    let marcaCicla = $("#MarcaCicla").val();
    if (marcaCicla === "") {
      AlertIncorrecta("Debes introducir la <b>marca</b> de tu vehiculo");
      return;
    }
    let ColorCicla = $("#ColorCicla").val();
    if (ColorCicla === "") {
      AlertIncorrecta("Debes introducir el <b>color</b> de tu vehiculo");
      return;
    }
    RegistrarVehiculo(
      vehiculoSeleccionado,
      "NO APLICA",
      marcaCicla,
      ColorCicla,
      "NO APLICA"
    );
  } else {
    AlertIncorrecta("Estas tratando de registrar un vehiculo invalido?");
    return;
  }
}
function RegistrarVehiculo(tipoVehiculo, placa, marca, color, linea) {
  spinner("Intentando registrar tu vehiculo");
  const url = "/api/registrarVehiculo";
  const data = {
    idusuario: idUsuario,
    tipoVehiculo: tipoVehiculo,
    placa: placa.toUpperCase(),
    marca: marca.toUpperCase(),
    color: color.toUpperCase(),
    linea: linea.toUpperCase(),
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
      if (result.error === "Placa utilizada") {
        AlertIncorrecta("La <b>placa</b> ingresada se encuentra registrada");
        $("#spinner").hide();
        return;
      }
      AlertCorrectX("Vehiculo registrado exitosamente");
      RegistrarAuditoria(
        "Vehiculo tipo " +
          result.tipoVehiculo +
          " de marca " +
          result.marca +
          " registrado exitosamente desde el modulo de gestion de vehiculos"
      );
      cargarVehiculos();
      $("#modalNewVehiculo").modal("hide");
      $("#spinner").hide();
      return;
    })
    .catch((error) => {
      AlertIncorrecta(
        "No se pudo registrar el vehiculo, valida la información"
      );
      $("#spinner").hide();
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

function validarModificacion(idvehiculo, tipoVehiculo) {
  console.log(idvehiculo, tipoVehiculo);
  let marca = "";
  let color = "";
  let placa = "";
  let linea = "";
  if (tipoVehiculo === "Bicicleta") {
    marca = $("#MarcaCiclaE").val();
    color = $("#ColorCiclaE").val();
    placa = "NO APLICA";
    linea = "NO APLICA";
    if (marca === "") {
      AlertIncorrecta("Debes ingresar una <b>marca</b> para la bicicleta");
      return;
    }
    if (color === "") {
      AlertIncorrecta("Debes ingresar una <b>color</b> para la bicicleta");
      return;
    }
  } else if (tipoVehiculo === "Moto") {
    marca = $("#marcasMotoE").val();
    color = $("#ColorMotoE").val();
    placa = $("#placaMotoE").val();
    linea = $("#LineaMotoE").val();
    if (marca === "") {
      AlertIncorrecta("Debes ingresar una <b>marca</b> para la motocicleta");
      return;
    }
    if (color === "") {
      AlertIncorrecta("Debes ingresar una <b>color</b> para la motocicleta");
      return;
    }
    if (placa === "") {
      AlertIncorrecta("Debes ingresar una <b>placa</b> para la motocicleta");
      return;
    }
    if (linea === "") {
      AlertIncorrecta("Debes ingresar una <b>linea</b> para la motocicleta");
      return;
    }
  } else {
    marca = $("#marcasCarroE").val();
    color = $("#ColorCarroE").val();
    placa = $("#placaCarroE").val();
    linea = $("#LineaCarroE").val();
    if (marca === "") {
      AlertIncorrecta("Debes ingresar una <b>marca</b> para la motocicleta");
      return;
    }
    if (color === "") {
      AlertIncorrecta("Debes ingresar una <b>color</b> para la motocicleta");
      return;
    }
    if (placa === "") {
      AlertIncorrecta("Debes ingresar una <b>placa</b> para la motocicleta");
      return;
    }
    if (linea === "") {
      AlertIncorrecta("Debes ingresar una <b>linea</b> para la motocicleta");
      return;
    }
  }
  spinner("Intentando modificar tu vehiculo");
  const url = "/api/modificarVehiculo";
  const data = {
    idusuario: idUsuario,
    idvehiculo: idvehiculo,
    marca: marca.toUpperCase(),
    color: color.toUpperCase(),
    linea: linea.toUpperCase(),
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
      if (result === "El vehiculo no se puede modificar") {
        AlertIncorrecta("El vehiculo no se puede modificar");
        return;
      } else {
        AlertCorrectX("El vehiculo se ha modificado exitosamente");
        RegistrarAuditoria(
          "El usuario modifica la información del vehiculo con id:" + idvehiculo
        );
        $("#modalEditarVehiculo").modal("hide");
        limpiarDatosEditar();
        cargarVehiculos();
        console.log(result);
      }
      $("#spinner").hide();
    })
    .catch((error) => {
      AlertIncorrecta(
        "No se pudo registrar el vehiculo, valida la información"
      );
      $("#spinner").hide();
    });
}

function limpiarDatos() {
  $("#marcasCarro").val("");
  $("#ColorCarro").val("");
  $("#placaCarro").val("");
  $("#LineaCarro").val("");
  $("input[name='vehiculo']").prop("checked", false);
  $("input[name='vehiculo']").change();
  $("#placaMoto").val("");
  $("#marcasMoto").val("");
  $("#ColorMoto").val("");
  $("#LineaMoto").val("");
  $("#ColorCicla").val("");
  $("#MarcaCicla").val("");
}
function limpiarDatosEditar() {
  $("#marcasCarroE").val("");
  $("#ColorCarroE").val("");
  $("#placaCarroE").val("");
  $("#LineaCarroE").val("");
  $("#placaMotoE").val("");
  $("#marcasMotoE").val("");
  $("#ColorMotoE").val("");
  $("#LineaMotoE").val("");
  $("#ColorCiclaE").val("");
  $("#MarcaCiclaE").val("");
}
