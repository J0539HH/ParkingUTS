$(document).ready(function () {
  verificarSesion();
});

function verificarSesion() {
  console.log("VerificandoSessionbyJDFM");
  fetch("/api/sesion")
    .then((response) => response.json())
    .then((data) => {
      const idusuario = data.idusuario;
      console.log(idusuario);
      if (idusuario === undefined || idusuario === null) {
        AlertIncorrectX(
          "Estas tratando de acceder al sistema sin credenciales"
        );
        window.location.href =
          "https://www.uts.edu.co/sitio/tecnologia-en-desarrollo-de-sistemas-informaticos/";
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
