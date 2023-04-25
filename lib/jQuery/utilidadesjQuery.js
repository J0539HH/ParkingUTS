var utilidadesjQuery = {
    ajax: function (url, params, callback, callbackParams, callbackScope, async) {
        var onSuccess = function (data, response, opts) {
            spinner(false);
            try {
                try {
                    var result = JSON.parse(data);
                    if (!$.isEmptyObject(result.msg)) {
                        if ($.isFunction(callback)) {
                            var scope = this;
                            if (!isEmpty(callbackScope)) {
                                scope = callbackScope;
                            }
                            jAlert(result.msg, "Mensaje", callback, callbackParams, result, true);
                        } else {
                            jAlert(result.msg, "Mensaje");
                        }
                    } else {
                        if ($.isFunction(callback)) {
                            var scope = this;
                            if ($.isFunction(callback)) {
                                scope = callbackScope;
                            }
                            callback.call(scope, callbackParams, result, true);
                        }
                    }
                } catch (e) {
                    var result = data;
                    if ($.isFunction(callback)) {
                        var scope = this;
                        if ($.isFunction(callback)) {
                            scope = callbackScope;
                        }
                        jAlert(e.message, "Mensaje", function () {
                            callback.call(scope, callbackParams, result, true);
                        });
                        return;
                    }
                }
            } catch (e) {
                if (isEmpty(e)) {
                    jAlert("Nulo", "Error en recepcion");
                    return;
                }
                if (!isEmpty(e.message)) {
                    jAlert(e.message, "Error en recepcion");
                } else {
                    jAlert(e, "Error en recepcion");
                }
            }
        };
        var onFail = function (response, opts) {
            spinner(false);
            try {
                if (response.status == 500) {
                    jAlert("El servidor reporta un error desconocido debido a un posible cierre de sesion causado por inactividad del usuario en la aplicacion.", "Posible expiracion de la sesion");
                } else if (response.status >= 400 && response.status < 500) {
                    jAlert(response.statusText, "Error en el cliente web");
                } else if (response.status >= 500 && response.status < 600) {
                    jAlert(response.statusText, "Error en el servidor web");
                } else if (response.status == 0) {
                    jAlert(response.statusText, "Error, el tiempo de conexion ha terminado");
                }

                if ($.isFunction(callback)) {
                    var scope = this;
                    if (!isEmpty(callbackScope))
                        scope = callbackScope;
                    callback.call(scope, callbackParams, response, false);
                }
            } catch (e) {
                if (isEmpty(e)) {
                    jAlert("Nulo", "Error en recepcion");
                    return;
                }
                if (!isEmpty(e.message)) {
                    jAlert(e.message, "Error en recepcion");
                } else {
                    jAlert(e, "Error en recepcion");
                }
            }
        };
        var timeOut = 300000;
        if (!isEmpty(params) && !isEmpty(params.timeout)) {
            timeOut = params.timeout;
        }
        var asynchronous = async;
        if (async === "" || async === undefined) {
            asynchronous = true;
        }
        $.ajax({
            method: 'POST',
            url: url,
            success: onSuccess,
            error: onFail,
            async: asynchronous,
            cache: true,
            scope: this,
            timeout: timeOut,
            data: params
        });
    },
    strPad: function (cadena, longitud, caracter, alineacion) {
        var mitad = '';
        var lenght;

        var str_pad_repeater = function (s, len) {
            var collect = '';

            while (collect.length < len) {
                collect += s;
            }
            collect = collect.substr(0, len);
            return collect;
        };

        cadena += '';
        caracter = caracter !== undefined ? caracter : ' ';

        if (alineacion !== 'STR_PAD_LEFT' && alineacion !== 'STR_PAD_RIGHT' && alineacion !== 'STR_PAD_BOTH') {
            alineacion = 'STR_PAD_RIGHT';
        }
        if ((lenght = longitud - cadena.length) > 0) {
            if (alineacion === 'STR_PAD_LEFT') {
                cadena = str_pad_repeater(caracter, lenght) + cadena;
            } else if (alineacion === 'STR_PAD_RIGHT') {
                cadena = cadena + str_pad_repeater(caracter, lenght);
            } else if (alineacion === 'STR_PAD_BOTH') {
                mitad = str_pad_repeater(caracter, Math.ceil(lenght / 2));
                cadena = mitad + cadena + mitad;
                cadena = cadena.substr(0, longitud);
            }
        }
        return cadena;
    },
    soloNumero: function (evento, decimal) {
        var tecla = evento.keyCode ? evento.keyCode : evento.which ? evento.which : evento.charCode;
        if (decimal === true) {
            if ((tecla >= 48 && tecla <= 57) || (tecla >= 96 && tecla <= 105) || tecla == 8 || tecla == 9 || tecla == 44) {
                return true;
            }
            return false;
        } else {
            if ((tecla >= 48 && tecla <= 57) || (tecla >= 96 && tecla <= 105) || tecla == 8 || tecla == 9 || tecla == 109 || tecla == 173) {
                return true;
            }
            return false;
        }
    }, alfaNumerico: function (evento) {
        var tecla = evento.keyCode ? evento.keyCode : evento.which ? evento.which : evento.charCode;
        if ((tecla >= 48 && tecla <= 57) || (tecla >= 65 && tecla <= 90) || (tecla >= 97 && tecla <= 122) || tecla == 8 || tecla == 9 || tecla == 0 || tecla == 46 || tecla == 32 || tecla == 192 || tecla == 96) {
            return true;
        }
        return false;
    }
};


function isEmpty(s)
{
    return ((s == null) || (s.length == 0))
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