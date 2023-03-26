/* global utilidadesjQuery */


var OTPgenerado = "";
var Usuario = "";
var OTP2 = "";

var VERIFICAR_LOGIN = 101;
//var ENVIAR_MENSAJE = 102;
var RECUPERAR_PASSWORD = 103;
var VALIDAR_OTP_USUARIO = 104;
var CAMBIAR_CONTRA = 105;

$(document).ready(function () {

    document.querySelector('.ojoPassword1').addEventListener('click', function () {
        if ($('#pass1').attr('type') === "text") {
            $('#pass1').attr('type', 'password');
        } else {
            $('#pass1').attr('type', 'text');
        }
    });
    document.querySelector('.ojoPassword').addEventListener('click', function () {
        if ($('#pass2').attr('type') === "text") {
            $('#pass2').attr('type', 'password');
        } else {
            $('#pass2').attr('type', 'text');
        }
    });

    $("#btnValidarCorreo").on("click", EnviarRecuperacion);


    $("#btnValidarOTPpassword").on('click', function () {
        var N1 = $("#OTP1").val();
        var N2 = $("#OTP2").val();
        var N3 = $("#OTP3").val();
        var N4 = $("#OTP4").val();
        var N5 = $("#OTP5").val();
        var N6 = $("#OTP6").val();
        var OTPingresado = N1 + "" + N2 + "" + N3 + "" + N4 + "" + N5 + "" + N6;
        var OTPSHA = SHA256(OTPingresado);
        ValidaryCambiar(OTPSHA);
    });

    $("#btnNuevoOtp2").on("click", function () {
        $('#modal2').modal('hide');
        verificarLogin();
    });

    $("#password").on("keydown", function (event) {
        var tecla = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (tecla === 13) {
            setTimeout(function () {
                verificarLogin();
            }, 500);
        }
    });
    $("#usuario").on("keydown", function (event) {
        var tecla = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (tecla === 13) {
            setTimeout(function () {
                verificarLogin();
            }, 500);
        }
    });

    $("#usuario, #password").focus(function () {
        $("p.pTxtMsg").addClass("hidden");
    });

    $('#modalOTP').on('show.bs.modal', function (e) {

    });

    $("div#divGlobal").removeClass("hidden");

    $("button#btnIniciarSesion").on('click', function () {
        verificarLogin();
    });


    $("p#pOlvidoContraseña").on('click', function () {
        $('#modalUser').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#modalUser').modal("show");
        LimpiarRegistros();
        $('#usuarioIngresado').val($('#usuario').val());

    });

    $("div#divGlobal").overlayScrollbars({
        overflowBehavior: {
            x: "hidden",
        },
        scrollbars: {
            // autoHide: "leave", //"never", "scroll", "leave", "move" 
        },
    });

    configuracionInput();

    $("#btnCambiarpass").on("click", CambiarContraseña);

    $(".input-key").keyup(function () {
        if ($(this).val().length == $(this).attr("maxlength")) {
            $(this).next('.input-key').focus();
        }
    });
});

function ValidaryCambiar(OTPingresado) {
    OTP2 = OTPingresado;
    var parametros = {accion: VALIDAR_OTP_USUARIO, OTPingresado: OTPingresado, usuario: Usuario};
    var miCallback = function (callbackParams, result, acceso) {
        if (!acceso || !result.success) {
            return false;
        } else {
            if (result.estado === true) {
                $('#validarOTPrecuperar').modal("hide");
                $('#CambiarContra').modal("show");
                $('#pass1').attr('type', 'password');
                $('#pass2').attr('type', 'password');

            } else {
                jAlert("OTP invalido", "Mensaje");
                return;
            }
        }
    };
    spinner("Validando OTP, por favor espere...");
    utilidadesjQuery.ajax("Login.php", parametros, miCallback, null, this);
    return;
}

function CambiarContraseña() {

    var pass1 = $("#pass1").val();
    var pass2 = $("#pass2").val();

    if (pass1 === "") {
        jAlert("La nueva contraseña no puede estar vacia", "mensaje");
        return;
    }
    if (pass1.length < 8) {
        jAlert("La nueva contraseña es muy corta", "mensaje");
        return;
    }
    if (tiene_numeros(pass1) === 0) {
        jAlert("La nueva contraseña Incluir al menos un número", "mensaje");
        return;
    }
    if (tiene_minusculas(pass1) === 0) {
        jAlert("La nueva contraseña debe tener una minúscula", "mensaje");
        return;
    }
    if (tiene_mayusculas(pass1) === 0) {
        jAlert("La nueva contraseña debe tener una mayúscula", "mensaje");
        return;
    }
    if (tiene_caracteres(pass1) === 0) {
        jAlert("La nueva contraseña debe tener un carácter especial", "mensaje");
        return;
    }
    if (pass2 === "") {
        jAlert("Las confirmación de contraseña no puede estar vacia", "mensaje");
        return;
    }
    if (pass1 !== pass2) {
        jAlert("Las contraseñas no son iguales", "mensaje");
        return;
    } else {
        var newPass = pass1;
    }
    var parametros = {accion: CAMBIAR_CONTRA, OTPingresado: OTP2, usuario: Usuario, newPass: newPass};
    var miCallback = function (callbackParams, result, acceso) {
        if (!acceso || !result.success) {
            return false;
        }
    };
    jAlert("La contraseña ha sido cambiada exitosamente", "Mensaje");
    setTimeout(function () {
        $("#popup_overlay").remove();
        $("#popup_container").remove();
    }, 1500);
    $('#CambiarContra').modal("hide");
    spinner("Cambiando contraseña, por favor espere...");
    utilidadesjQuery.ajax("Login.php", parametros, miCallback, null, this);
    $('#pass1').attr('type', 'password');
    $('#pass2').attr('type', 'password');
    LimpiarRegistros();

}

function EnviarRecuperacion() {
    $('#modalUser').modal('hide');
    var usuario = $('#usuarioIngresado').val();
    if (usuario === "") {
        jAlert("El usuario no puede estar vacio", "Mensaje");
        return;
    }
    var parametros = {accion: RECUPERAR_PASSWORD, usuario: usuario};
    var miCallback = function (callbackParams, result, acceso) {
        if (!acceso || !result.success) {
            return false;
        } else {
            Usuario = result.idUsuario;
            $('#validarOTPrecuperar').modal('show');
        }
    };
    spinner("Enviando correo, por favor espere...");
    utilidadesjQuery.ajax("Login.php", parametros, miCallback, null, this);
}

function verificarLogin() {
    OTPgenerado = "";
    var usuario = $("#usuario").val();
    var password = $("#password").val();
    if (usuario === "") {
        jAlert("Debe proporcionar un nombre de usuario para acceder al sistema", "Aviso");
        return;
    }
    if (password === "") {
        jAlert("Debe proporcionar una palabra clave de entrada", "Aviso");
        return;
    }
    var fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + 10);
    var año = (fecha.getFullYear());
    var mes = (fecha.getMonth() + 1);
    var dia = (fecha.getDate());
    var hora = (fecha.getHours());
    var min = (fecha.getMinutes());
    var seg = (fecha.getSeconds());
    var vencimientoOTP = dia + "-" + mes + "-" + año + " " + hora + ":" + min + ":" + seg;
    var vencimientoTabla = año + "-" + mes + "-" + dia + " " + hora + ":" + min + ":" + seg;
    var fecha1 = new Date();
    fecha1.setMinutes(fecha1.getMinutes() + 10);
    var año1 = (fecha1.getFullYear());
    var mes1 = (fecha1.getMonth() + 1);
    var dia1 = (fecha1.getDate());
    var hora1 = (fecha1.getHours());
    var min1 = (fecha1.getMinutes());
    var seg1 = (fecha1.getSeconds());
    var fechaactual = año1 + "-" + mes1 + "-" + dia1 + " " + hora1 + ":" + min1 + ":" + seg1;
    var fechaLogin = (new Date(fechaactual));
    var parametros = {accion: VERIFICAR_LOGIN, login: usuario, password: password, vencimiento: vencimientoOTP, tablaVencimiento: vencimientoTabla};
    var miCallback = function (callbackParams, result, estado) {
        if (result.login === true) {
            OTPgenerado = (result.OTPCHECK);
            mostrarModal(fechaLogin, OTPgenerado);
            setTimeout(EnfocarOtp, 500);
        } else {
            $("p.pTxtMsg").removeClass("hidden");

            Swal.fire({
                title: "",
                text: "Nombre de usuario incorrecto o no existe, inténtelo otra vez.",
                imageUrl: '../iconos/icoAlertWarning.svg',
                imageWidth: 80,
                imageHeight: 80,
                imageAlt: 'Custom Icon',
                showConfirmButton: true,
                focusConfirm: false,
                allowOutsideClick: false,
                focusDeny: true,
                showDenyButton: true,
                confirmButtonText: "Aceptar",
                denyButtonText: "",
                customClass: {
                    container: '',
                    popup: '',
                    header: '',
                    title: '',
                    closeButton: '',
                    icon: '',
                    image: '',
                    content: '',
                    htmlContainer: '',
                    input: '',
                    inputLabel: '',
                    validationMessage: '',
                    actions: '',
                    confirmButton: 'buttonBtn btnPrimary',
                    denyButton: 'buttonBtn btnPrimary btnHidden',
                    cancelButton: '',
                    loader: '',
                    footer: ''
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // CONFIRMED CODE
                } else if (result.isDenied) {
                    // DENIED CODE
                }
            });
            return;
        }
    };
    utilidadesjQuery.ajax("Login.php", parametros, miCallback, null, this);
    spinner("Validando Usuario, por favor espere...");
}

function EnfocarOtp() {
    $("#Numero1").get(0).focus();
}

function mostrarModal(vencimiento, OTPSHA) {
    LimpiarRegistros();
    OTPgenerado = OTPSHA;
    $("p.pTxtMsg").removeClass("hidden");

    $("p.pTxtMsg").addClass("hidden");

    $('#modalOTP').modal({
        backdrop: 'static',
        keyboard: false
    });

    $('#modalOTP').modal("show");

    var vencimientoOTP = (vencimiento);
    $("#btnVerificarOTP").on("click", function () {
        var fecha = new Date();
        var año = (fecha.getFullYear());
        var mes = (fecha.getMonth() + 1);
        var dia = (fecha.getDate());
        var hora = (fecha.getHours());
        var min = (fecha.getMinutes());
        var seg = (fecha.getSeconds());
        var fechaactual = año + "-" + mes + "-" + dia + " " + hora + ":" + min + ":" + seg;
        var fechaLogin = (new Date(fechaactual));
        var N1 = $("#Numero1").val();
        var N2 = $("#Numero2").val();
        var N3 = $("#Numero3").val();
        var N4 = $("#Numero4").val();
        var OTPingresado = N1 + "" + N2 + "" + N3 + "" + N4;
        var OTPSHA2 = SHA256(OTPingresado);
        if (OTPgenerado === OTPSHA2) {
            var fechaingreso = (fechaLogin);
            var fechalimite = (vencimientoOTP);
            if (fechaingreso <= fechalimite) {
                jAlert("Bienvenido!", "Mensaje del Sistema");
                location.href = "../modulos/principal/menu.html";
                return;
            } else {
                mostrarModal2();
                return;
            }
        } else {
            jAlert("El OTP no es v&aacute;lido, por favor escr&iacute;balo correctamente.", "Mensaje del Sistema");
            LimpiarRegistros();
            setTimeout(CerrarAlerta, 800);
            setTimeout(EnfocarOtp, 301);
            return;
        }
    });


}

function CerrarAlerta() {
    $.alerts._hide();
    callback(true);
}

function LimpiarRegistros() {
    $("#Numero1").val("");
    $("#Numero2").val("");
    $("#Numero3").val("");
    $("#Numero4").val("");
    $("#OTP1").val("");
    $("#OTP2").val("");
    $("#OTP3").val("");
    $("#OTP4").val("");
    $("#OTP5").val("");
    $("#OTP6").val("");
    $("#usuarioIngresado").val("");
    $("#pass1").val("");
    $("#pass2").val("");
    return;
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

function Numeros(string) {//Solo numeros
    var out = '';
    var filtro = '1234567890';//Caracteres validos
    //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos
    for (var i = 0; i < string.length; i++)
        if (filtro.indexOf(string.charAt(i)) !== -1)
            //Se añaden a la salida los caracteres validos
            out += string.charAt(i);
    //Retornar valor filtrado
    return out;

}

function mostrarModal2() {
    $('#modalOTP').modal('hide');
    $('#modal2').modal("show");
}

function tiene_numeros(texto) {
    var numeros = "0123456789";
    for (i = 0; i < texto.length; i++) {
        if (numeros.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}

function tiene_minusculas(texto) {
    var letras = "abcdefghyjklmnñopqrstuvwxyz";
    for (i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}

function tiene_mayusculas(texto) {
    var letras_mayusculas = "ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
    for (i = 0; i < texto.length; i++) {
        if (letras_mayusculas.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}

function tiene_caracteres(texto) {
    var caracteres = "%.!@*#$_-¡:";
    for (i = 0; i < texto.length; i++) {
        if (caracteres.indexOf(texto.charAt(i), 0) !== -1) {
            return 1;
        }
    }
    return 0;
}
