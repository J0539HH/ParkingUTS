var idrol = null;

$(document).ready(function () {
  verificarSesion();
  $("#CreacionServicios").on("click", function () {
    alert("Se ha hecho clic en el botón Crear Servicios");
  });
});

function verificarSesion() {
  console.log("VerificandoSessionbyJDFM");
  fetch("/api/sesion")
    .then((response) => response.json())
    .then((data) => {
      const idusuario = data.idusuario;
      idrol = data.idrol;
      if (idusuario === undefined || idusuario === null) {
        AlertIncorrectX(
          "Estas tratando de acceder al sistema sin credenciales"
        );
        setTimeout(function () {
          window.location.href = "../../acceso/login.html";
        }, 1500);
      }
    })
    .catch((error) => {
      console.error(error);
    });
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

// Scripts de los estilos
$(function () {
  $(".menu-button").each(function () {
    var items = this.parentNode.querySelectorAll(".circle a");
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].style.left =
        (
          50 -
          42 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
        ).toFixed(4) + "%";
      items[i].style.top =
        (
          50 +
          42 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
        ).toFixed(4) + "%";
    }
  });

  $(".circular-menu").hover(
    function () {
      this.querySelector(".circle").classList.add("open");
      this.querySelector(".menu-button").classList.add("selected");
    },
    function () {
      this.querySelector(".circle").classList.remove("open");
      this.querySelector(".menu-button").classList.remove("selected");
    }
  );
});
