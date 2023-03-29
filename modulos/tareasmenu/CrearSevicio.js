var idrol = null;

$(document).ready(function () {
  verificarSesion();

  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $("#ActualizarUser").on("click", function () {
    ValidarActualizacion();
  });
});
