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
  const mensaje = `<p>Hola <b>${datos.usuario.nombre}</b>, acabamos de recibir exitosamente el ingreso del servicio con identificador:</p><h2>${datos.servicio.idservicio}</h2>
  <p>Puedes realizar el seguimiento en el portal con el número anterior</p>.
  <br><p>Estos son los datos de tu servicio</p>
  <br>Tipo de dispositivo:${datos.servicio.tipodispositivo} 
  <br>Marca:${datos.servicio.marca}
  <br>Informacion sobre el mantenimiento:${datos.servicio.comentariosentrada}
  <br><br>Gracias por confiarnos la solicitud de tu mantenimiento! `;
  const correo = datos.usuario.correo;
  const asunto = "Ingreso de servicio (Mantenimiento)";

  // Configurar los datos de la solicitud POST
  const data = {
    correo: correo,
    asunto: asunto,
    mensaje: mensaje,
  };

  // Hacer la solicitud POST usando fetch()
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
      AlertCorrectX("Servicio regristrado en el sistema ");
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
