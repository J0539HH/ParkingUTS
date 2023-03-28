var idrol = null;

$(document).ready(function () {
  verificarSesion();
  $("#VolverMenu").on("click", function () {
    window.location.href = "../tareasmenu/menu.html";
  });

  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
    $('#sidebarCollapse i').toggleClass('rotateImg');
    $('#content').toggleClass('active');
    $('#sidebarCollapse').toggleClass("navbar-btn");
    $('#sidebarCollapse').toggleClass("btn-sidebar-activado");
  });

});
