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
  const mensaje = `<p>Hola, <b>${datos.usuario.nombre}</b></p><p>acabamos de recibir exitosamente el ingreso de un mantenimiento con el número:</p>
  <div style='display:flex;'><p style='color:#1664ab; font-size: 20px'>${datos.servicio.idservicio}</p></div>
  <p>Puedes realizar el seguimiento en el portal con el número anterior</p>
  <b> Estos son algnos datos del servicio </b>
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
        AlertCorrectX("Te enviamos un correo con información del servicio!");
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
  let modelo = $("#modelo").val();

  const url = "/api/NewForm";
  const data = {
    idusuario: idUsuario,
    comentariosentrada,
    marca,
    tipodispositivo,
    numeroserie,
    modelo,
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
      enviarCorreo(result);
      RegistrarAuditoriaC(result);
    })
    .catch((error) => {
      console.error("Error al registrar:", error);
      $("#spinner").hide();
    });
}

function RegistrarAuditoriaC(datos) {
  spinner("Registrando Auditoria");
  let descripcionAuditoria =
    "Registro de un nuevo servicio con id:" + datos.servicio.idservicio;
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
      setTimeout(function () {
        window.location.href = "../tareasmenu/menu.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Error al ingresar:", error);
    });
}

function verificarSesion() {
  fetch("/api/sesion")
        .then((response) => response.json())
        .then((usuario) => {
            document.getElementById('nombrePersona').value = usuario.nombre;
            console.log(nombre);
        })
        .catch((error) => {
            console.error(error);
        });
}

function LimpiarFormulario() {
  $("#comentariosEntrada").val("");
  $("#marca").val("");
  $("#tipoDispositivo").val("");
  $("#numeroSerie").val("");
  $("#modelo").val("");
}
