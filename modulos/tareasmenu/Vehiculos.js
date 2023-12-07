

$(document).ready(function () {
  verificarSesionWrapper()
    .then(() => {
      $("#spinner").hide();
    })
    .catch((error) => {
      $("#spinner").hide();
      setTimeout(function () {
        window.location.href = "../../acceso/Login.html";
      }, 1000);
    });


  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

});


