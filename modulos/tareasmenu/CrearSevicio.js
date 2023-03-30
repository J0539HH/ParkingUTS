var idrol = null;
var idUsuario = null;

$(document).ready(function () {
  verificarSesion();
  LimpiarFormulario();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#btnSolicitar").on("click", function () {
    ValidarFormulario();
  });
});

function enviarCorreo(datos) {
  const mensaje = `<p>Hola</p> <b>${datos.usuario.nombre}</b><p>Acabamos de recibir exitosamente el ingreso del servicio con identificador:</p>
  <p style="color:#1664ab; font-size: 20px">${datos.servicio.idservicio}</p>
  <p>Puedes realizar el seguimiento en el portal con el número anterior</p>
  <b>Estos son los datos de tu servicio</b>
  <br><b>Tipo de dispositivo:&nbsp;</b>${datos.servicio.tipodispositivo} 
  <br><b>Marca:&nbsp;</b>${datos.servicio.marca}
  <br><b>Informacion sobre el mantenimiento:&nbsp;</b>${datos.servicio.comentariosentrada}
  <br><br>Gracias por confiarnos la solicitud de tu mantenimiento!`;
  const correo = datos.usuario.correo;
  const asunto = "Ingreso de servicio (Mantenimiento)";

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
        console.log("Correo electrónico enviado correctamente");
      } else {
        throw new Error("Error al enviar el correo electrónico");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function ValidarFormulario() {
  let ComentariosEntrada = $("#comentariosEntrada").val();
  let Marca = $("#marca").val();
  let TipoDispositivo = $("#tipoDispositivo").val();

  if (ComentariosEntrada === "") {
    AlertIncorrecta(
      "Debes indicar alguna informacion sobre el mantenimiento del dispositivo"
    );
    return;
  }
  if (Marca === "") {
    AlertIncorrecta("Debes indicar la marca del dispositivo");
    return;
  }
  if (TipoDispositivo === "") {
    AlertIncorrecta("Debes seleccionar un tipo de dispositivo");
    return;
  }
  RealizarInsercion();
}

function RealizarInsercion() {
  spinner("Registrando servicio, por favor espere");
  let comentariosentrada = $("#comentariosEntrada").val();
  let marca = $("#marca").val();
  let tipodispositivo = $("#tipoDispositivo").val();
  let numeroserie = $("#numeroSerie").val();

  const url = "/api/NewForm";
  const data = {
    idusuario: idUsuario,
    comentariosentrada,
    marca,
    tipodispositivo,
    numeroserie,
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
      enviarCorreo(result);
      AlertCorrectX("Servicio registrado en el sistema ");
      $("#spinner").hide();
      LimpiarFormulario();
    })
    .catch((error) => {
      console.error("Error al registrar:", error);
      $("#spinner").hide();
    });
}

function LimpiarFormulario() {
  $("#comentariosEntrada").val("");
  $("#marca").val("");
  $("#tipoDispositivo").val("");
  $("#numeroSerie").val("");
}
