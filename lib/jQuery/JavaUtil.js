// ---------------------------------------------------------------------- //
//                             RESUMEN                                    //
// ---------------------------------------------------------------------- //
//
// El objetivo de las siguientes funciones en JavaScript es
// validar los ingresos del usuario en un formulario antes
// de que estos datos vayan al servidor.
//
// Varias de ellas toman un parametro opcional E.O.K (eok) (emptyOK
// - true si se acepta que el valor este vacio, false si no
// se acepta). El valor por omision es el que indique la
// variable global defaultEmptyOK definida mas abajo.
//
// ---------------------------------------------------------------------- //
//                      SINTAXIS DE LAS FUNCIONES                         //
// ---------------------------------------------------------------------- //
//
// FUNCION PARA CHEQUEAR UN CAMPO DE INGRESO:
//
// checkField (theField, theFunction, [, s] [,eok])
//        verifica que el campo de ingreso theField cumpla con la
//        condicion indicada en la funcion theFunction (que puede ser
//        una de las descritas en "FUNCIONES DE VALIDACION" o cualquier
//        otra provista por el usuario). En caso contrario despliega el
//        string "s" (opcional, hay mensajes por default para las
//        funciones de validacion provistas aqui).
//
// FUNCIONES DE VALIDACION:
//
// isInteger (s [,eok])                s representa un entero
// isNumber (s [,eok])                 s es entero o tiene punto decimal
// isAlphabetic (s [,eok])             s tiene solo letras
// isAlphanumeric (s [,eok])           s tiene solo letras y/o numeros
// isPhoneNumber (s [,eok])            s tiene solo numeros, (,),-
// isEmail (s [,eok])                  s es una direccion de e-mail
// ValidarFecha(dia,mes,ano) devuelve true si la fecha es valida, false si no
// CompararFechas(dia1,mes1,ano1,dia2,mes2,ano2)  devuelve 1 si la fecha -1 es mayor que la fecha 2,
//	1 si la fecha 2 es mayor que la fecha 1 y 0 si son iguales. No se hace validacion interna de fechas
//
// FUNCIONES INTERNAS:
//
// isWhitespace (s)                    s es vacio o solo son espacios
// isLetter (c)                        c es una letra
// isDigit (c)                         c es un digito
// isLetterOrDigit (c)                 c es letra o digito
//
// FUNCIONES PARA REFORMATEAR DATOS:
//
// stripCharsInBag (s, bag)            quita de s los caracteres en bag
// stripCharsNotInBag (s, bag)         quita de s los caracteres NO en bag
// stripWhitespace (s)                 quita el espacio dentro de s
// stripInitialWhitespace (s)          quita el espacio al principio de s
//
// FUNCIONES PARA PREGUNTARLE AL USUARIO:
//
// statBar (s)                         pone s en la barra de estado
// warnEmpty (theField, s)             indica que theField esta vacio
// warnInvalid (theField, s)           indica que theField es invalido
//
// ---------------------------------------------------------------------- //
//                                VARIABLES                               //
// ---------------------------------------------------------------------- //
var MONTHS_LONG = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var WEEKDAYS_SHORT = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
/*
 *id = contenedor
 *fechaIni = fecha de inicio seleccionada
 *maxDate = limite superior de fechas seleccionables
 *minDate = limite inferior de fechas seleccionables
 *fnSelect = funcion a ejecutar cuando se selecione una fecha
 *
 **/
function newCalend(id, fechaIni, maxDate, minDate, fnSelect) {
    var date = new Date();
    if (maxDate == undefined || maxDate == null || maxDate == '') {
        maxDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    if (fechaIni == undefined || fechaIni == null || fechaIni == '') {
        fechaIni = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    } else {
        date = new Date(fechaIni);
    }
    if (minDate == undefined || minDate == null || minDate == '') {
        minDate = '01/01/1800';
    }
    var confCalend = {
        navigator: {
            strings: {
                month: "Seleccione Mes",
                year: "Ingrese A&ntilde;o",
                submit: "OK",
                cancel: "Cancel",
                invalidYear: "Por favor ingrese un a&ntilde;o valido"
            },
            monthFormat: YAHOO.widget.Calendar.LONG,
            initialFocus: "year"
        },
        HIDE_BLANK_WEEKS: true,
        MONTHS_LONG: MONTHS_LONG,
        WEEKDAYS_SHORT: WEEKDAYS_SHORT,
        maxdate: maxDate, /*mm/dd/yyyy*/
        mindate: minDate
    };
    Dom.get(id).innerHTML = '<div id="ov_' + id + '"><div id="calend_' + id + '"></div></div>';
    var ov_calend = new YAHOO.widget.Overlay('ov_' + id, {visible: false});
    var bt_calend = new YAHOO.widget.Button({
        container: id,
        type: 'menu',
        label: fechaIni,
        menu: ov_calend
    });
    var calend = new YAHOO.widget.Calendar(id, "calend_" + id, confCalend);
    calend.select(date);
    calend.render();
    calend.selectEvent.subscribe(function (event, data) {
        if (fnSelect != undefined) {
            fnSelect(data)
        } else {
            ov_calend.hide();
            var f = data[0][0];
            bt_calend.set("label", f[2] + "/" + f[1] + "/" + f[0]);
        }
    });
    return {calend: calend, overlay: ov_calend, button: bt_calend};
}
/*
 *Esta funcion deselecciona los valores del calendario
 *
 *
 *objetoCalendario = objeto de calendario creado por la funcion newCalend()
 *texto = texto que se coloca en el label del boton contenedor del calendario
 *
 **/
function limpiarCalendario(objetoCalendario, texto) {
    if (typeof (objetoCalendario) == 'object') {
        objetoCalendario.button.set("label", texto);
        objetoCalendario.calend.deselectAll();
    }
}
var ControlPCMR = 0;//variable para la proteccion contra multiples registros
function EjecutarPCMR() {
    if (ControlPCMR == 1) {
        //alert("Espere mientras su solicitud es procesada y evite dar doble click en los botones o links de envio de datos,\\nesto puede ocacionar la dulicacion de registros.");
        return true;
    }
    ControlPCMR = 1;
    return false;
}

function strReemplazo(aguja, reemp, pajar)
{
    var c, s, i, dim = pajar.length;
    s = '';
    for (i = 0; i < dim; ++i)
    {
        c = pajar.charAt(i);
        s += (c == aguja ? reemp : c);
    }
    return s;
}
function number_format(valor)
{
    var j, s, r, dim, frac = '';
    valor += '';
    s = strReemplazo(',', '', valor);
    if ((j = s.indexOf(".")) != -1)
    {
        frac = s.substr(j, s.length - j);
        s = s.substr(0, j);
    }
    r = '';
    dim = s.length;
    if (dim <= 3) {
        return s;
    }
    for (j = 1; j <= Math.floor((dim - 1) / 3); ++j)
    {
        r = ',' + s.substr(dim - j * 3, 3) + r;
    }
    return (s.substr(0, dim - (j - 1) * 3) + r) + frac;
}
function ValidarFecha(dia, mes, ano)
{
    var bis;
    bis = false;

    if (dia.length > 2)
        return false;

    if (mes.length > 2)
        return false;

    if (ano.length != 4)
        return false;

    if (!isInteger(dia) || !isInteger(mes) || !isInteger(ano))
    {
        return false;
    }
    if (ano % 4 == 0)
        bis = true;
    if (mes <= 0 || mes > 12 || ano <= 0 || dia <= 0 || dia > 31)
    {
        return false;
    }
    if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && (dia < 0 || dia > 30))
    {
        return false;
    } else
    {
        if (mes == 2 && bis == false && (dia < 0 || dia > 28))
        {
            return false;
        } else
        {
            if (mes == 2 && bis == true && (dia < 0 || dia > 29))
            {
                return false;
            }
        }
    }
    return true;
}

// Esta variable indica si esta bien dejar las casillas
// en blanco como regla general
var defaultEmptyOK = false

// listas de caracteres
var digits = "0123456789";
var lowercaseLetters = "abcdefghijklmnopqrstuvwxyzáéíióöuúñ "
var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ "
var whitespace = " \t\n\r";

// caracteres admitidos en nos de telefono
var phoneChars = "()-+ ";

// ---------------------------------------------------------------------- //
//                     TEXTOS PARA LOS MENSAJES                           //
// ---------------------------------------------------------------------- //

// m abrevia "missing" (faltante)
var mMessage = "Error: no puede dejar este espacio vacio"

// p abrevia "prompt"
var pPrompt = "Error: ";
var pAlphanumeric = "Ingrese un texto que contenga solo letras y/o números.";
var pAlphabetic = "Ingrese un texto que contenga solo letras";
var pInteger = "Ingrese solo números.\n Tenga en cuenta que debe omitir espacios en blanco.";
var pNumber = "Ingrese solo números numero.\n Tenga en cuenta que debe omitir espacios en blanco.";
var pPhoneNumber = "Ingrese un número de teléfono";
var pEmail = "Ingrese una dirección de correo electrónico válida";
var pName = "Ingrese un texto que contenga solo letras, números o espacios";

// ---------------------------------------------------------------------- //
//                FUNCIONES PARA MANEJO DE ARREGLOS                       //
// ---------------------------------------------------------------------- //

// JavaScript 1.0 (Netscape 2.0) no tenia un constructor para arreglos,
// asi que ellos tenian que ser hechos a mano. Desde JavaScript 1.1
// (Netscape 3.0) en adelante, las funciones de manejo de arreglos no
// son necesarias.

function makeArray(n) {
//*** BUG: If I put this line in, I get two error messages:
//(1) Window.length can't be set by assignment
//(2) daysInMonth has no property indexed by 4
//If I leave it out, the code works fine.
//   this.length = n;
    for (var i = 1; i <= n; i++) {
        this[i] = 0
    }
    return this
}

// ---------------------------------------------------------------------- //
//                  CODIGO PARA FUNCIONES BASICAS                         //
// ---------------------------------------------------------------------- //


// s es vacio
function isEmpty(s)
{
    return ((s == null) || (s.length == 0))
}

// s es vacio o solo caracteres de espacio
function isWhitespace(s)
{
    var i;
    if (isEmpty(s))
        return true;
    for (i = 0; i < s.length; i++)
    {
        var c = s.charAt(i);
        // si el caracter en que estoy no aparece en whitespace,
        // entonces retornar falso
        if (whitespace.indexOf(c) == -1)
            return false;
    }
    return true;
}

// Quita todos los caracteres que que estan en "bag" del string "s" s.
function stripCharsInBag(s, bag)
{
    var i;
    var returnString = "";

    // Buscar por el string, si el caracter no esta en "bag",
    // agregarlo a returnString

    for (i = 0; i < s.length; i++)
    {
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1)
            returnString += c;
    }

    return returnString;
}

// Lo contrario, quitar todos los caracteres que no estan en "bag" de "s"
function stripCharsNotInBag(s, bag)
{
    var i;
    var returnString = "";
    for (i = 0; i < s.length; i++)
    {
        var c = s.charAt(i);
        if (bag.indexOf(c) != -1)
            returnString += c;
    }

    return returnString;
}

// Quitar todos los espacios en blanco de un string
function stripWhitespace(s)
{
    return stripCharsInBag(s, whitespace)
}

// La rutina siguiente es para cubrir un bug en Netscape
// 2.0.2 - seria mejor usar indexOf, pero si se hace
// asi stripInitialWhitespace() no funcionaria

function charInString(c, s)
{
    for (i = 0; i < s.length; i++)
    {
        if (s.charAt(i) == c)
            return true;
    }
    return false
}

// Quita todos los espacios que antecedan al string
function stripInitialWhitespace(s)
{
    var i = 0;
    while ((i < s.length) && charInString (s.charAt(i), whitespace))
        i++;
    return s.substring(i, s.length);
}

// c es una letra del alfabeto espanol
function isLetter(c)
{
    return((uppercaseLetters.indexOf(c) != -1) ||
            (lowercaseLetters.indexOf(c) != -1))
}

// c es un digito
function isDigit(c)
{
    return ((c >= "0") && (c <= "9"))
}

// c es letra o digito
function isLetterOrDigit(c)
{
    return (isLetter(c) || isDigit(c))
}

// ---------------------------------------------------------------------- //
//                          NUMEROS                                       //
// ---------------------------------------------------------------------- //

// s es un numero entero (con o sin signo)
function isInteger(s)
{
    var i;
    if (isEmpty(s))
        if (isInteger.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isInteger.arguments[1] == true);

    for (i = 0; i < s.length; i++)
    {
        var c = s.charAt(i);
        if (i != 0) {
            if (!isDigit(c))
                return false;
        } else {
            if (!isDigit(c) && (c != "-") || (c == "+"))
                return false;
        }
    }
    return true;
}

// s es un numero (entero o flotante, con o sin signo)
function isNumber(s)
{
    var i;
    var dotAppeared;
    dotAppeared = false;
    if (isEmpty(s))
        if (isNumber.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isNumber.arguments[1] == true);

    for (i = 0; i < s.length; i++)
    {
        var c = s.charAt(i);
        if (i != 0) {
            if (c == ".") {
                if (!dotAppeared)
                    dotAppeared = true;
                else
                    return false;
            } else
            if (!isDigit(c))
                return false;
        } else {
            if (c == ".") {
                if (!dotAppeared)
                    dotAppeared = true;
                else
                    return false;
            } else
            if (!isDigit(c) && (c != "-") || (c == "+"))
                return false;
        }
    }
    return true;
}

// ---------------------------------------------------------------------- //
//                        STRINGS SIMPLES                                 //
// ---------------------------------------------------------------------- //

// s tiene solo letras
function isAlphabetic(s)
{
    var i;

    if (isEmpty(s))
        if (isAlphabetic.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isAlphabetic.arguments[1] == true);
    for (i = 0; i < s.length; i++)
    {
        // Check that current character is letter.
        var c = s.charAt(i);

        if (!isLetter(c))
            return false;
    }
    return true;
}

function isName(s)
{
    var i;

    if (isEmpty(s))
        if (isName.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isName.arguments[1] == true);
    for (i = 0; i < s.length; i++)
    {
        // Check that current character is letter.
        var c = s.charAt(i);

        if (!isLetter(c) && c != "'" && c != " ")
        {
            return false;
        }
    }
    return true;
}


// s tiene solo letras y numeros
function isAlphanumeric(s)
{
    var i;

    if (isEmpty(s))
        if (isAlphanumeric.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isAlphanumeric.arguments[1] == true);

    for (i = 0; i < s.length; i++)
    {
        var c = s.charAt(i);
        if (!(isLetter(c) || isDigit(c)))
            return false;
    }

    return true;
}

// s tiene solo letras, numeros o espacios en blanco
/*
 function isName (s)
 {
 if (isEmpty(s))
 if (isName.arguments.length == 1) return defaultEmptyOK;
 else return (isAlphanumeric.arguments[1] == true);

 return( isAlphanumeric( stripCharsInBag( s, whitespace ) ) );
 }
 */

// ---------------------------------------------------------------------- //
//                           FONO o EMAIL                                 //
// ---------------------------------------------------------------------- //

// s es numero de telefono valido
function isPhoneNumber(s)
{
    var modString;
    if (isEmpty(s))
        if (isPhoneNumber.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isPhoneNumber.arguments[1] == true);
    modString = stripCharsInBag(s, phoneChars);
    return (isInteger(modString))
}

// s es una direccion de correo valida
function isEmail(s)
{
    if (isEmpty(s))
        if (isEmail.arguments.length == 1)
            return defaultEmptyOK;
        else
            return (isEmail.arguments[1] == true);
    if (isWhitespace(s))
        return false;
    var i = 1;
    var sLength = s.length;
    while ((i < sLength) && (s.charAt(i) != "@"))
    {
        i++
    }

    if ((i >= sLength) || (s.charAt(i) != "@"))
        return false;
    else
        i += 2;

    while ((i < sLength) && (s.charAt(i) != "."))
    {
        i++
    }

    if ((i >= sLength - 1) || (s.charAt(i) != "."))
        return false;
    else
        return true;
}

// ---------------------------------------------------------------------- //
//                  FUNCIONES PARA RECLAMARLE AL USUARIO                  //
// ---------------------------------------------------------------------- //

// pone el string s en la barra de estado
function statBar(s)
{
    window.status = s
}

// notificar que el campo theField esta vacio
function warnEmpty(theField)
{
    theField.focus()
    alert(mMessage)
    statBar(mMessage)
    return false
}

// notificar que el campo theField es invalido
function warnInvalid(theField, s)
{
    theField.focus()
    theField.select()
    alert(s)
    statBar(pPrompt + s)
    return false
}

// el corazon de todo: checkField
function checkField(theField, theFunction, emptyOK, s)
{
    var msg;
    if (checkField.arguments.length < 3)
        emptyOK = defaultEmptyOK;
    if (checkField.arguments.length == 4) {
        msg = s;
    } else {
        if (theFunction == isAlphabetic)
            msg = pAlphabetic;
        if (theFunction == isAlphanumeric)
            msg = pAlphanumeric;
        if (theFunction == isInteger)
            msg = pInteger;
        if (theFunction == isNumber)
            msg = pNumber;
        if (theFunction == isEmail)
            msg = pEmail;
        if (theFunction == isPhoneNumber)
            msg = pPhoneNumber;
        if (theFunction == isName)
            msg = pName;
    }

    if ((emptyOK == true) && (isEmpty(theField.value)))
        return true;

    if ((emptyOK == false) && (isEmpty(theField.value)))
        return warnEmpty(theField);

    if (theFunction(theField.value) == true)
        return true;
    else
        return warnInvalid(theField, msg);

}


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//
//     C u a d r a r    l a    r e s o l u c i o n    d e   l a   p a n t a l l a      //
//
/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var iResolucionX = window.screen.width;		//resolucion horizontal de la pantalla del cliente
var iResolucionY = window.screen.height;	//resolucion vertical de la pantalla del cliente

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declaracion de funciones
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Funcion xrelativo800
//Calcula la proporcion de un valor en la resolucion horizontal actual con respecto a 800 px
function xrelativo800(antiguox)
{
    return Math.floor(antiguox * iResolucionX / 800);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion yrelativo600
//Calcula la proporcion de un valor en la resolucion vertical actual con respecto a 600 px
function yrelativo600(antiguoy)
{
    return Math.floor(antiguoy * iResolucionY / 600);
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//
//     F U N C I O N E S    P A R A   E N C R I P T A R            //
//
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

var posicion = "01234567890123456789012345678901234567890123456789012345678901";
var alfabeto = "mnbvcxz1LKJHG3FDS9Apoiuytrewq5VCXZ0QWERT4gfdsa7BNM2hjkl6YUIO8P";

function prodpunto(A, B)
{
    var suma;
    var Me = new Array(2);
    var longitud = A.length;

    for (var i = 0; i < longitud; i++)
    {
        for (var j = 0; j < longitud; j++)
        {
            suma = 0;
            for (var k = 0; k < longitud; k++)
                suma = suma + (A[i][k] * B[k]);
        }
        Me[i] = suma;
    }

    for (var i = 0; i < 3; i++)
    {
        Me[i] = Me[i] % 62;
    }

    return Me;
}

function encriptar(contrasena)
{
    var clave = contrasena;
    var form = document.FormLogin;
    var Va = new Array(Array(3, 0, 1), Array(1, 1, 1), Array(0, 0, 1));
    var Me = new Array(2);
    var Ve = new Array(2);
    var LongitudClave;
    var contador = 0;
    var temp = 0;
    var n = 0;
    var cad = "";
    var letra;
    var pos;
    var LongitudTe;

    LongitudClave = clave.length;
    form.iLongitudText.value = LongitudClave;

    var Te = new Array(LongitudClave);
    var TeChar = new Array(LongitudClave);


    while ((LongitudClave % 3) != 0)
    {
        clave = clave + 'X';
        LongitudClave = clave.length;
    }

    while (contador < LongitudClave)
    {
        n = n + 3;
        var j = 0;
        for (var i = contador; i < n; i++)
        {
            letra = clave.charAt(i);
            Ve[j] = alfabeto.indexOf(letra);
            j = j + 1;
        }

        Me = prodpunto(Va, Ve);

        for (i = 0; i < 3; i++)
        {
            Te[temp] = Me[i];
            temp = temp + 1;
        }

        contador = contador + 3;
    }

//convertir el vector de Posiciones Te[] (Texto encriptado) en letras.
    LongitudTe = Te.length;
    contador = 0;
    letra = "";
    while (contador < LongitudTe)
    {
        pos = Te[contador];   //recorro el vector Te[] en cada posicion
        letra = alfabeto.charAt(pos); //que Letra o Numero corresponde a esa posicion?
        TeChar[contador] = letra;
        cad = cad + letra;
        contador = contador + 1;
    }

    form.TextoCryp.value = cad;

}


///////////////////////////////////////////////////////////////////
//  FUNCIONES DE EDGAR   .....CONTENIDO.PHP
//////////////////////////////////////////////////////////////////
var ventanaNotas = false;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//					D	E	C	L	A	R	A	C	I	O	N		 D	E	 	F	U	N	C	I	O	N	E	S		 J	S
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function vernotas(codmat, nommat, codigoest)
{
    if (typeof ventanaNotas.document == "object")
    {
        ventanaNotas.close()
    }
    ventanaNotas = window.open("http://192.168.0.236/luis/notasweb/datos/mostrarnotas.php?iCodigoAsignatura=" + codmat + "&nom=" + nommat + "&codest=" + codigoest + "", " notas", "toolbar=no, scrollbars=auto, location=no,directories=no,status=no,menubar=no, resizable=no,width=300,height=200,left=100,top=100,screenX=100,screenY=100");
}

//Funcion: OverMenu
//Se encarga de los esfectos de solapas
function OverMenu(img)
{
    if (img.estado == 1)
    {
        img.src = "imagenes/contenido/tabover" + img.NumTab + ".jpg";
        img.estado = 0;
    } else
    {
        if (img.estado == 0)
        {
            img.src = "imagenes/contenido/tab" + img.NumTab + ".jpg";
            img.estado = 1;
        }
    }
}

//Funcion: EnviarAPagina
//Me reenvia a la pagina pero con una solapa seleccionada
function EnviarAPagina(parametro, pagina)
{
    var forma = document.opcion;
    forma.iSeleccionado.value = parametro;
    forma.iPagina.value = pagina;
    forma.submit();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Estas son las funciones que me permiten colocar el reloj en la pantalla

//Funcion: ColocarCero
//Convierte el 1 a 01, 9 a 09
function ColocarCero(val)
{
    return (val < 10) ? "0" + val.toString() : val;
}
//Funcion: Hora
//Arma la hora actual y devuelve una cadena que la contiene
function Hora()
{
    var Fecha = new Date();
    var ampm = " am";
    var h = Fecha.getHours();
    var LaHora;
    //if(h>12)
    //{
    //h=h-12;
    //ampm=" pm";
    //}

    LaHora = ColocarCero(h) + ":" + ColocarCero(Fecha.getMinutes()) + ":" + ColocarCero(Fecha.getSeconds());
    return LaHora;
}

//Funcion: tick
//Me coloca la hora actual en una capa (<div id=reloj>xxxxx</div>) llamada 'reloj'
function EscribirHora()
{
    document.all.reloj.innerHTML = Hora();
}

function CompararFechas(dia1, mes1, ano1, dia2, mes2, ano2)
{
    dia1 = (dia1 * 1);
    dia2 = (dia2 * 1);
    mes1 = (mes1 * 1);
    mes2 = (mes2 * 1);
    ano1 = (ano1 * 1);
    ano2 = (ano2 * 1);
    if (ano1 > ano2)
    {
        return -1;
    } else
    {
        if (ano2 > ano1)
        {
            return 1;
        } else
        {
            if (mes1 > mes2)
            {
                return -1;
            } else
            {
                if (mes2 > mes1)
                {
                    return 1;
                } else
                {
                    if (dia1 > dia2)
                    {
                        return -1;
                    } else
                    {
                        if (dia2 > dia1)
                        {
                            return 1;
                        } else
                        {
                            return 0;
                        }
                    }
                }
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var sVacio = '';
var sCantidadFormateada = sVacio;
var sEntero = sVacio;
var sSeparador = sVacio;
var sDecimal = sVacio;
var sEnLetra = sVacio;
var un = false;
var unMillones = false;
var maxLen = 13;

function NumerosALetras(inTxt, b) {
    var space = ' '
    var errorMsg = sVacio
    var sEnLetra = sVacio
    var valor = ""

    init()

    sCantidadFormateada = formatoCantidad(inTxt)
    sEntero = cantidadEnLetra(parteEntera(sCantidadFormateada))
    sSeparador = " pesos con "
    sDecimal = cantidadEnLetra(parteDecimal(sCantidadFormateada))

    //cantFormato.innerHTML = separadores(parteEntera(inTxt)) + '.' + separadores(parteDecimal(inTxt))
    sEntero = sEntero.substring(0, 1).toUpperCase().toString() + sEntero.substring(1).toString()


    ///if(sDecimal==undefined)
    valor = sEntero + " pesos "
    //else
    //valor= sEntero + sSeparador + sDecimal + ' centavos'
    return valor;
}

//==================================================================================================separadores
function separadores(s) {
    var sCantSeparadores = sVacio
    var coma = ','
    var apostrofo = '\''
    var j = 1
    s = strToArray(s)
    for (var i = s.length - 1; i >= 0; i--) {
        if (j % 6 == 0) {
            if (i == 0) {
                sCantSeparadores = s[i] + sCantSeparadores
            } else {
                sCantSeparadores = apostrofo + s[i] + sCantSeparadores
            }
        } else {
            if (j % 3 == 0) {
                if (i == 0) {
                    sCantSeparadores = s[i] + sCantSeparadores
                } else {
                    sCantSeparadores = coma + s[i] + sCantSeparadores
                }
            } else {
                sCantSeparadores = s[i] + sCantSeparadores
            }
        }
        j++
    }
    return sCantSeparadores
}

//==================================================================================================init
function init() {
    sVacio = ''
    sCantidadFormateada = sVacio
    sEnLetra = sVacio
    sEntero = sVacio
    sSeparador = sVacio
    sDecimal = sVacio
    un = false
}

//==================================================================================================strToArray
function strToArray(inTxt) {
    aChars = inTxt.split('')
    return (aChars)
}
//==================================================================================================formatoCantidad
function formatoCantidad(inTxt) {
    var aChars = new Array()
    var cPoint = '.'

    aChars = strToArray(inTxt)

    //Formato para la cantidad "cero" o "punto"
    if ((inTxt == '0') || (aChars.length == 1 && aChars[0] == cPoint)) {
        sCantidadFormateada = "0.0"
        return sCantidadFormateada
    }

    //eliminar ceros a la izquierda ingresados en la parte entera
    for (var i = 0; i < aChars.length; i++) {
        var c = aChars[i]
        if ((c >= "1" && c <= "9")) {
            break
        }
        if (c == cPoint) {
            break
        }
    }
    sCantidadFormateada = inTxt.substring(i)

    // Agregar el punto decimal y un cero si no se ingreso el punto
    if (sCantidadFormateada.indexOf('.') == -1) {
        sCantidadFormateada += ".0"
    }
    // Agregar un cero y el punto decimal si no se ingreso el punto
    if (sCantidadFormateada.substring(0, sCantidadFormateada.indexOf('.')) == sVacio) {
        sCantidadFormateada = "0" + sCantidadFormateada
    }
    // Agregar un cero si despues del punto decimal no hay nada
    if (sCantidadFormateada.substring(sCantidadFormateada.indexOf('.') + 1) == sVacio) {
        sCantidadFormateada = sCantidadFormateada + "0"
    }

    return sCantidadFormateada
}
//==================================================================================================formato cada 3 digitos, sin decimales
function formatoNumero(oData, separador) {
    var oData = oData.toString();
    oData = oData.split(separador);
    oData = oData.join("");
    oData = oData.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(oData))
        oData = oData.replace(pattern, "$1" + separador + "$2");
    return oData;
}
//==================================================================================================formato numero detallado
function formatoNumeroDetallado(number, cantidadDecimales, caracterDecimal, caracterMilesima) {

    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+cantidadDecimales) ? 0 : Math.abs(cantidadDecimales),
            sep = (typeof thousands_sep === 'undefined') ? ',' : caracterMilesima,
            dec = (typeof dec_point === 'undefined') ? '.' : caracterDecimal,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
//==================================================================================================parteEntera
function parteEntera(inTxt) {
    var inTxtI = ''
    inTxtI = inTxt.substring(0, inTxt.indexOf('.'))
    return inTxtI
}
//==================================================================================================parteDecimal
function parteDecimal(inTxt) {

    var inTxtF = ''
    if (inTxt.indexOf('.') == -1) {
        inTxtF = sVacio
    } else {
        inTxtF = inTxt.substring(inTxt.indexOf('.') + 1)
    }

    return inTxtF
}
//==================================================================================================cantidadEnLetra
function cantidadEnLetra(sCantidad) {
    sEnLetra = sVacio
    switch (sCantidad.length) {
        case 1 :
            sEnLetra = unidades(sEnLetra, sCantidad)
            break
        case 2 :
            sEnLetra = decenas(sEnLetra, sCantidad)
            break
        case 3 :
            sEnLetra = centenas(sEnLetra, sCantidad)
            break
        case 4 :
            sEnLetra = miles(sEnLetra, sCantidad)
            break
        case 5 :
            sEnLetra = dMiles(sEnLetra, sCantidad)
            break
        case 6 :
            sEnLetra = cMiles(sEnLetra, sCantidad)
            break
        case 7 :
            sEnLetra = millones(sEnLetra, sCantidad)
            break
        case 8 :
            sEnLetra = dMillones(sEnLetra, sCantidad)
            break
        case 9 :
            sEnLetra = cMillones(sEnLetra, sCantidad)
            break
        case 10 :
            sEnLetra = mMillones(sEnLetra, sCantidad)
            break
        case 11 :
            sEnLetra = dmMillones(sEnLetra, sCantidad)
            break
        case 12 :
            sEnLetra = cmMillones(sEnLetra, sCantidad)
            break
        case 13 :
            sEnLetra = billon(sEnLetra, sCantidad)
            break
        default :
            sEnLetra = "fuera de rango"
            break
    }
    return sEnLetra
}
//==================================================================================================unidades
function unidades(sEnLetra, inTxt) {
    switch (parseInt(inTxt)) {
        case 0 :
            sEnLetra = sEnLetra + "cero"
            return sEnLetra;
        case 1 :
            if (!un) {
                sEnLetra = sEnLetra + "uno"
            } else {
                sEnLetra = sEnLetra + "un"
            }
            return sEnLetra;
        case 2 :
            sEnLetra = sEnLetra + "dos"
            return sEnLetra;
        case 3 :
            sEnLetra = sEnLetra + "tres"
            return sEnLetra;
        case 4 :
            sEnLetra = sEnLetra + "cuatro"
            return sEnLetra;
        case 5 :
            sEnLetra = sEnLetra + "cinco"
            return sEnLetra;
        case 6 :
            sEnLetra = sEnLetra + "seis"
            return sEnLetra;
        case 7 :
            sEnLetra = sEnLetra + "siete"
            return sEnLetra;
        case 8 :
            sEnLetra = sEnLetra + "ocho"
            return sEnLetra;
        case 9 :
            sEnLetra = sEnLetra + "nueve"
            return sEnLetra;
        default :
            sEnLetra = "Ocurrio una excepción en unidades"
            return sEnLetra
    }
}
//==================================================================================================centenas
function decenas(sEnLetra, inTxt) {
    switch (parseInt(inTxt)) {
        case 10 :
            sEnLetra = sEnLetra + "diez"
            return sEnLetra;
        case 11 :
            sEnLetra = sEnLetra + "once"
            return sEnLetra;
        case 12 :
            sEnLetra = sEnLetra + "doce"
            return sEnLetra;
        case 13 :
            sEnLetra = sEnLetra + "trece"
            return sEnLetra;
        case 14 :
            sEnLetra = sEnLetra + "catorce"
            return sEnLetra;
        case 15 :
            sEnLetra = sEnLetra + "quince"
            return sEnLetra;
    }
    if (parseInt(inTxt) >= 16 && parseInt(inTxt) <= 99) {
        aChars = strToArray(inTxt)
        switch (parseInt(aChars[0])) {
            case 1 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "diez"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "dieci"
                }
                break
            case 2 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "veinte"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "veinti"
                }
                break
            case 3 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "treinta"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "treinta y "
                }
                break
            case 4 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "cuarenta"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cuarenta y "
                }
                break
            case 5 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "cincuenta"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cincuenta y "
                }
                break
            case 6 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "sesenta"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "sesenta y "
                }
                break
            case 7 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "setenta"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "setenta y "
                }
                break
            case 8 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "ochenta"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "ochenta y "
                }
                break
            case 9 :
                if (parseInt(aChars[1]) == 0) {
                    sEnLetra = sEnLetra + "noventa"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "noventa y "
                }
                break
            default :
                sEnLetra = "Ocurrio una excepción en decenas"
                break
        }
        sEnLetra = unidades(sEnLetra, aChars[1])
        return sEnLetra
    }
}
//==================================================================================================centenas
function centenas(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    if (parseInt(inTxt) >= 100 && parseInt(inTxt) <= 999) {
        aChars = strToArray(inTxt)
        switch (parseInt(aChars[0])) {
            case 1 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "cien"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "ciento "
                }
                break
            case 2 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "doscientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "doscientos "
                }
                break
            case 3 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "trescientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "trescientos "
                }
                break
            case 4 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "cuatrocientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cuatrocientos "
                }
                break
            case 5 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "quinientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "quinientos "
                }
                break
            case 6 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "seiscientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "seiscientos "
                }
                break
            case 7 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "setecientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "setecientos "
                }
                break
            case 8 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "ochocientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "ochocientos "
                }
                break
            case 9 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
                    sEnLetra = sEnLetra + "novecientos"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "novecientos "
                }
                break
            default :
                sEnLetra = "Ocurrio una excepción en decenas"
                break
        }

        if (parseInt(aChars[1]) == 0) {
            unidad = aChars[2]
            sEnLetra = unidades(sEnLetra, unidad)
        } else {
            decena = aChars[1] + aChars[2]
            sEnLetra = decenas(sEnLetra, decena)
        }
        return sEnLetra
    }
}
//==================================================================================================miles
function miles(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    if (parseInt(inTxt) >= 1000 && parseInt(inTxt) <= 9999) {
        aChars = strToArray(inTxt)
        switch (parseInt(aChars[0])) {
            case 1 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "mil "
                }
                break
            case 2 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "dos mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "dos mil "
                }
                break
            case 3 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "tres mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "tres mil  "
                }
                break
            case 4 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "cuatro mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cuatro mil "
                }
                break
            case 5 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "cinco mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cinco mil "
                }
                break
            case 6 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "seis mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "seis mil "
                }
                break
            case 7 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "siete mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "siete mil "
                }
                break
            case 8 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "ocho mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "ocho mil "
                }
                break
            case 9 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0) {
                    sEnLetra = sEnLetra + "nueve mil"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "nueve mil "
                }
                break
            default :
                sEnLetra = "Ocurrio una excepción en miles"
                break
        }

        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0) {
            unidad = aChars[3]
            sEnLetra = unidades(sEnLetra, unidad)
        }
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) != 0) {
            decena = aChars[2] + aChars[3]
            sEnLetra = decenas(sEnLetra, decena)
        }
        centena = aChars[1] + aChars[2] + aChars[3]
        if (parseInt(centena) >= 100) {
            sEnLetra = centenas(sEnLetra, centena)
        }

        return sEnLetra
    }
}
//==================================================================================================dMiles
function dMiles(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var aChars = new Array()
    if (parseInt(inTxt) >= 10000 && parseInt(inTxt) <= 99999) {
        aChars = strToArray(inTxt)
        if (parseInt(aChars[0]) >= 1 || parseInt(aChars[0]) <= 9) {
            if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0) {
                decena = aChars[0] + aChars[1]
                sEnLetra = decenas(sEnLetra, decena)
                sEnLetra += " mil"
                return sEnLetra
            } else {
                un = true
                decena = aChars[0] + aChars[1]
                sEnLetra = decenas(sEnLetra, decena)
                sEnLetra += " mil "
                if (unMillones) {
                    un = true
                } else {
                    un = false
                }
            }
        } else {
            sEnLetra = "Ocurrio una excepción en dMiles"
        }
        if (parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0) {
            unidad = aChars[4]
            sEnLetra = unidades(sEnLetra, unidad)
        }

        if (parseInt(aChars[2]) == 0 && parseInt(aChars[3]) != 0) {
            decena = aChars[3] + aChars[4]
            sEnLetra = decenas(sEnLetra, decena)
        }

        centena = aChars[2] + aChars[3] + aChars[4]
        if (parseInt(centena) >= 100 && parseInt(centena) <= 999) {
            sEnLetra = centenas(sEnLetra, centena)
        }

        millar = aChars[1] + aChars[2] + aChars[3] + aChars[4]
        if (parseInt(millar) >= 10000 && parseInt(millar) <= 99999) {
            sEnLetra = miles(sEnLetra, millar)
        }

        un = false

        return sEnLetra
    }
}
//==================================================================================================dMiles
function cMiles(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var aChars = new Array()

    aChars = strToArray(inTxt)
    centena = aChars[0] + aChars[1] + aChars[2]
    if (parseInt(aChars[2]) == 1) {
        un = true
    } else {
        un = false
    }
    if (parseInt(centena) >= 100) {
        sEnLetra = centenas(sEnLetra, centena)
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0) {
            sEnLetra += " mil"
            return sEnLetra
        } else {
            sEnLetra += " mil "
        }
    }
    un = false
    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) != 0) {
        unidad = aChars[5]
        if (unMillones) {
            un = true
        }
        sEnLetra = unidades(sEnLetra, unidad)
        un = false
    }

    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0) {
        decena = aChars[4] + aChars[5]
        sEnLetra = decenas(sEnLetra, decena)
    }

    if (parseInt(aChars[3]) != 0) {
        centena = aChars[3] + aChars[4] + aChars[5]
        if (unMillones) {
            un = true
        }
        sEnLetra = centenas(sEnLetra, centena)
        un = false
    }

    return sEnLetra
}
//==================================================================================================millones
function millones(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var aChars = new Array()

    if (parseInt(inTxt) >= 1000000 && parseInt(inTxt) <= 9999999) {
        aChars = strToArray(inTxt)
        switch (parseInt(aChars[0])) {
            case 1 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "un millón"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "un millón "
                }
                break
            case 2 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "dos millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "dos millones "
                }
                break
            case 3 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "tres millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "tres millones  "
                }
                break
            case 4 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "cuatro millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cuatro millones "
                }
                break
            case 5 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "cinco millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "cinco millones "
                }
                break
            case 6 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "seis millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "seis millones "
                }
                break
            case 7 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "siete millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "siete millones "
                }
                break
            case 8 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "ocho millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "ocho millones "
                }
                break
            case 9 :
                if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
                    sEnLetra = sEnLetra + "nueve millones"
                    return sEnLetra
                } else {
                    sEnLetra = sEnLetra + "nueve millones "
                }
                break
            default :
                sEnLetra = "Ocurrio una excepción en millones"
                break
        }

        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
            unidad = aChars[6]
            sEnLetra = unidades(sEnLetra, unidad)
        }
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) != 0) {
            decena = aChars[5] + aChars[6]
            sEnLetra = decenas(sEnLetra, decena)
        }
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0) {
            centena = aChars[4] + aChars[5] + aChars[6]
            sEnLetra = centenas(sEnLetra, centena)
        }
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) != 0) {
            millar = aChars[3] + aChars[4] + aChars[5] + aChars[6]
            if (parseInt(millar) >= 1000 && parseInt(millar) < 2000) {
                sEnLetra += " un "
            }
            sEnLetra = miles(sEnLetra, millar)
        }
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) != 0) {
            dm = aChars[2] + aChars[3] + aChars[4] + aChars[5] + aChars[6]
            sEnLetra = dMiles(sEnLetra, dm)
        }
        if (parseInt(aChars[1]) != 0) {
            cm = aChars[1] + aChars[2] + aChars[3] + aChars[4] + aChars[5] + aChars[6]
            sEnLetra = cMiles(sEnLetra, cm)
        }
    }
    return sEnLetra
}
//==================================================================================================dMillones
function dMillones(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var aChars = new Array()
    if (parseInt(inTxt) >= 10000000 && parseInt(inTxt) <= 99999999) {
        aChars = strToArray(inTxt)
        if (parseInt(aChars[0]) >= 1 || parseInt(aChars[0]) <= 9) {
            if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0) {
                decena = aChars[0] + aChars[1]
                sEnLetra = decenas(sEnLetra, decena)
                sEnLetra += " millones"
                return sEnLetra
            } else {
                un = true
                decena = aChars[0] + aChars[1]
                sEnLetra = decenas(sEnLetra, decena)
                sEnLetra += " millones "
                un = false
            }
        } else {
            sEnLetra = "Ocurrio una excepción en dMillones"
        }
        if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0) {
            unidad = aChars[7]
            sEnLetra = unidades(sEnLetra, unidad)
        }
        if (parseInt(aChars[1]) != 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
            unidad = aChars[7]
            sEnLetra = unidades(sEnLetra, unidad)
        }

        if (parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
            decena = aChars[6] + aChars[7]
            sEnLetra = decenas(sEnLetra, decena)
        }

        if (parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) != 0) {
            centena = aChars[5] + aChars[6] + aChars[7]
            sEnLetra = centenas(sEnLetra, centena)
        }

        if (parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0) {
            millar = aChars[4] + aChars[5] + aChars[6] + aChars[7]
            if (parseInt(millar) >= 1000 && parseInt(millar) < 2000) {
                sEnLetra += " un "
            }
            sEnLetra = miles(sEnLetra, millar)
        }

        if (parseInt(aChars[2]) == 0 && parseInt(aChars[3]) != 0) {
            dm = aChars[3] + aChars[4] + aChars[5] + aChars[6] + aChars[7]
            sEnLetra = dMiles(sEnLetra, dm)
        }

        if (parseInt(aChars[2]) != 0) {
            cm = aChars[2] + aChars[3] + aChars[4] + aChars[5] + aChars[6] + aChars[7]
            sEnLetra = cMiles(sEnLetra, cm)
        }

        return sEnLetra
    }
}
//==================================================================================================cMillones
function cMillones(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var aChars = new Array()

    aChars = strToArray(inTxt)

    centena = aChars[0] + aChars[1] + aChars[2]
    un = true
    sEnLetra = centenas(sEnLetra, centena)
    un = false
    sEnLetra += " millones "

    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) != 0) {
        unidad = aChars[8]
        sEnLetra = unidades(sEnLetra, unidad)
    }

    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) != 0) {
        decena = aChars[7] + aChars[8]
        sEnLetra = decenas(sEnLetra, decena)
    }

    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
        centena = aChars[6] + aChars[7] + aChars[8]
        sEnLetra = centenas(sEnLetra, centena)
    }

    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) != 0) {
        millar = aChars[5] + aChars[6] + aChars[7] + aChars[8]
        if (parseInt(millar) >= 1000 && parseInt(millar) < 2000) {
            sEnLetra += " un "
        }
        sEnLetra = miles(sEnLetra, millar)
    }

    if (parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0) {
        dm = aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8]
        sEnLetra = dMiles(sEnLetra, dm)
    }

    if (parseInt(aChars[3]) != 0) {
        cm = aChars[3] + aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8]
        sEnLetra = cMiles(sEnLetra, cm)
    }

    return sEnLetra
}

//==================================================================================================mMillones
function mMillones(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var millon = sVacio
    var aChars = new Array()

    aChars = strToArray(inTxt)


    millar = aChars[0] + aChars[1] + aChars[2] + aChars[3]
    un = true
    sEnLetra = miles(sEnLetra, millar)
    sEnLetra += " millones "
    un = false

    if (parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) != 0) {
        unidad = aChars[9]
        sEnLetra = unidades(sEnLetra, unidad)
    }

    if (parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) != 0) {
        decena = aChars[8] + aChars[9]
        sEnLetra = decenas(sEnLetra, decena)
    }

    if (parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) != 0) {
        centena = aChars[7] + aChars[8] + aChars[9]
        sEnLetra = centenas(sEnLetra, centena)
    }

    if (parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
        millar = aChars[6] + aChars[7] + aChars[8] + aChars[9]
        if (parseInt(millar) >= 1000 && parseInt(millar) < 2000) {
            sEnLetra += " un "
        }
        sEnLetra = miles(sEnLetra, millar)
    }

    if (parseInt(aChars[4]) == 0 && parseInt(aChars[5]) != 0) {
        dm = aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9]
        sEnLetra = dMiles(sEnLetra, dm)
    }

    if (parseInt(aChars[4]) != 0) {
        cm = aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9]
        sEnLetra = cMiles(sEnLetra, cm)
    }

    return sEnLetra
}

//==================================================================================================dmMillones
function dmMillones(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var aChars = new Array()

    aChars = strToArray(inTxt)

    dm = aChars[0] + aChars[1] + aChars[2] + aChars[3] + aChars[4]
    unMillones = true
    sEnLetra = dMiles(sEnLetra, dm)
    unMillones = false
    sEnLetra += " millones "

    if (parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) == 0 && parseInt(aChars[10]) != 0) {
        unidad = aChars[10]
        sEnLetra = unidades(sEnLetra, unidad)
    }

    if (parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) != 0) {
        decena = aChars[9] + aChars[10]
        sEnLetra = decenas(sEnLetra, decena)
    }

    if (parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) != 0) {
        centena = aChars[8] + aChars[9] + aChars[10]
        sEnLetra = centenas(sEnLetra, centena)
    }

    if (parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) != 0) {
        millar = aChars[7] + aChars[8] + aChars[9] + aChars[10]
        if (parseInt(millar) >= 1000 && parseInt(millar) < 2000) {
            sEnLetra += " un "
        }
        sEnLetra = miles(sEnLetra, millar)
    }

    if (parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
        dm = aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10]
        sEnLetra = dMiles(sEnLetra, dm)
    }

    if (parseInt(aChars[5]) != 0) {
        cm = aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10]
        sEnLetra = cMiles(sEnLetra, cm)
    }
    /*
     if(parseInt(aChars[0]) != 0 && parseInt(aChars[1]) != 0 && parseInt(aChars[2]) != 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0){
     cm = sVacio
     cm = aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10]
     sEnLetra = cMiles(sEnLetra,cm)
     }
     */
    return sEnLetra
}

//==================================================================================================cmMillones
function cmMillones(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var aChars = new Array()

    aChars = strToArray(inTxt)

    cm = aChars[0] + aChars[1] + aChars[2] + aChars[3] + aChars[4] + aChars[5]
    unMillones = true
    sEnLetra = cMiles(sEnLetra, cm)
    unMillones = false
    sEnLetra += " millones "

    if (parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) == 0 && parseInt(aChars[10]) == 0 && parseInt(aChars[11]) != 0) {
        unidad = aChars[11]
        sEnLetra = unidades(sEnLetra, unidad)
    }

    if (parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) == 0 && parseInt(aChars[10]) != 0) {
        decena = aChars[10] + aChars[11]
        sEnLetra = decenas(sEnLetra, decena)
    }

    if (parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) != 0) {
        centena = aChars[9] + aChars[10] + aChars[11]
        sEnLetra = centenas(sEnLetra, centena)
    }

    if (parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) != 0) {
        millar = aChars[8] + aChars[9] + aChars[10] + aChars[11]
        if (parseInt(millar) >= 1000 && parseInt(millar) < 2000) {
            sEnLetra += " un "
        }
        sEnLetra = miles(sEnLetra, millar)
    }

    if (parseInt(aChars[6]) == 0 & parseInt(aChars[7]) != 0) {
        dm = aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11]
        sEnLetra = dMiles(sEnLetra, dm)
    }

    if (parseInt(aChars[6]) != 0) {
        cm = aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11]
        sEnLetra = cMiles(sEnLetra, cm)
    }
    return sEnLetra
}

//==================================================================================================billón
function billon(sEnLetra, inTxt) {
    var unidad = sVacio
    var decena = sVacio
    var centena = sVacio
    var millar = sVacio
    var dm = sVacio
    var cm = sVacio
    var M = sVacio
    var dM = sVacio
    var cM = sVacio
    var mM = sVacio
    var dmM = sVacio
    var cmM = sVacio
    var aChars = new Array()
    var usar = sVacio

    aChars = strToArray(inTxt)

    unidad = aChars[0]
    if (parseInt(unidad) > 1) {
        usar = " billónes "
    } else {
        usar = " billón "
    }
    un = true
    sEnLetra = unidades(sEnLetra, unidad)
    un = false
    sEnLetra += usar

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) == 0 && parseInt(aChars[10]) == 0 && parseInt(aChars[11]) == 0 && parseInt(aChars[12]) != 0) {
        unidad = aChars[12]
        sEnLetra = unidades(sEnLetra, unidad)
    }
    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) == 0 && parseInt(aChars[10]) == 0 && parseInt(aChars[11]) != 0) {
        decena = aChars[11] + aChars[12]
        sEnLetra = decenas(sEnLetra, decena)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) == 0 && parseInt(aChars[10]) != 0) {
        centena = aChars[10] + aChars[11] + aChars[12]
        sEnLetra = centenas(sEnLetra, centena)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) == 0 && parseInt(aChars[9]) != 0) {
        millar = aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = miles(sEnLetra, millar)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) == 0 && parseInt(aChars[8]) != 0) {
        dm = aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = dMiles(sEnLetra, dm)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) == 0 && parseInt(aChars[7]) != 0) {
        cm = aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = cMiles(sEnLetra, cm)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) == 0 && parseInt(aChars[6]) != 0) {
        M = aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = millones(sEnLetra, M)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) == 0 && parseInt(aChars[5]) != 0) {
        dM = aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = dMillones(sEnLetra, dM)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) == 0 && parseInt(aChars[4]) != 0) {
        cM = aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = cMillones(sEnLetra, cM)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) == 0 && parseInt(aChars[3]) != 0) {
        mM = aChars[3] + aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = mMillones(sEnLetra, mM)
    }

    if (parseInt(aChars[1]) == 0 && parseInt(aChars[2]) != 0) {
        dmM = aChars[2] + aChars[3] + aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = dmMillones(sEnLetra, dmM)
    }

    if (parseInt(aChars[1]) != 0) {
        cmM = aChars[1] + aChars[2] + aChars[3] + aChars[4] + aChars[5] + aChars[6] + aChars[7] + aChars[8] + aChars[9] + aChars[10] + aChars[11] + aChars[12]
        sEnLetra = cmMillones(sEnLetra, cmM)
    }

    return sEnLetra
}
//==================================================================================================longitud

//==================================================================================================decimales
function decimales(nValor, nDecimales) {
    if (nDecimales >= 0) {
        var x = parseFloat(nValor);
        x = x * Math.pow(10, nDecimales);
        x = Math.round(x);
        x = x / Math.pow(10, nDecimales);
        return x
    } else {
        return nValor
    }
}
//-->

function FraccionDecimal(inTxt)
{
    var inTxtF = ''
    if (inTxt.indexOf('.') == -1) {
        inTxtF = sVacio
    } else {
        inTxtF = inTxt.substring(inTxt.indexOf('.'))
    }
    return inTxtF
}

function Redondear(iNumber)
{
    var iParteDecimal = eval(FraccionDecimal(iNumber)) * 100;
    var redondeo = Math.round(iParteDecimal) / 100;
    var iNum = eval(parteEntera(iNumber)) + redondeo;
    return iNum;
}

function Rnd(MiValor, NumDecimales)
{
    var entero = parseInt(MiValor);
    var decimal = MiValor % 1;
    decimales = Math.pow(10, NumDecimales);
    decimal = Math.round(decimal * decimales) / decimales;
    valor = entero * 1 + decimal * 1;
    return valor;
}
function Numeros(e, campo) {
    var tecla = e.keyCode;
    if (tecla == 0)
        tecla = e.which;
    if (tecla == 13)
        return true;
    if ((tecla != 8 && tecla != 46 && tecla != 9) && (tecla < 48 || tecla > 57)) {
        if (navigator.appName == "Konqueror")
            return false;
        else {
            if (e.cancelable)
                e.preventDefault();
            else {
                e.returnValue = false;
                e.cancelBubble = true;
            }
        }
    }
}
//==================================================================================================

//==================================================================================================
function soloTeclasNumerosAccionEnter(evento, accion) {//El evento es el keyPress
    var tecla = evento.keyCode ? evento.keyCode : evento.which ? evento.which : evento.charCode;
    if ((tecla >= 48 && tecla <= 57) || tecla == 8 || tecla == 9 || tecla == 0 || tecla == 46 || (tecla >= 37 && tecla <= 40))//Si solo son numeros
        return true;
    else {//Si no son numeros
        if (tecla == 13) {//es tecla enter
            accion();
            return true;
        } else {
            return false;
        }
    }

}
function alinear(txt, align) {
    if (align != "center" && align != "right" && align != "left")
        align = "center";
    return "<div align='" + align + "'>" + txt + "</div>";
}
/**
 * JuanSebastianMorales: Obtiene los parametros enviados por GET de una URL, si se indica la clave solo retorna el valor
 * de esta si no la encuentra retorna false
 * Solo es obligatorio el parametro de la URL
 * @param url<p>
 * URL
 * @param clave <p>
 * Nombre del parametro en la URL a buscar
 */
function urlGetParametros(url, clave) {
    if (clave == null) {
        clave = "";
    }
    url = decodeURIComponent(url);
    var array = url.split("?")[1].split("&");
    var oParametrosGet = Object();
    var aParametro = [];
    if (!array.length) {
        return false;
    }
    for (var a = 0; a < array.length; a++) {
        aParametro = array[a].split("=");
        if (clave == aParametro[0]) {
            return aParametro[1];
        }
        oParametrosGet[aParametro[0]] = aParametro[1];
    }
    if (!clave.length) {
        return oParametrosGet;
    }
    return false;
}
function solo_teclas_numero_onkeydown(evento, accion, puntoOk, comaOk, formato) {
    var tecla = evento.keyCode ? evento.keyCode : evento.which ? evento.which : evento.charCode;
    if (formato != undefined && formato != false) {
        setTimeout(
                function () {
                    var elemento = evento.target;
                    var vector = Dom.get(elemento).value.split(",");
                    var total = vector.join("");
                    Dom.get(elemento).value = formatoNumero(total, ',');
                },
                1);//para poder dar formato a medida de su escritura
    }
    if ((tecla >= 48 && tecla <= 57) || tecla == 0 || tecla == 45 || (tecla >= 96 && tecla <= 105)) {
        return true;
    } else if (tecla == 13) {
        if (accion != undefined && accion != false) {
            accion();
        }
        return true;
    } else if (tecla == 8 || tecla == 9 || tecla == 17 || tecla == 16 || (tecla >= 37 && tecla <= 40) || tecla == 46 || tecla == 116) {//dackSpace,TAB,Ctrl,Shift,Arriba,Abajo,Derecha,Izquierda,Supr
        return true;
    } else if (puntoOk && (tecla == 190 || tecla == 110)) {
        return true;
    } else if (comaOk && tecla == 188) {
        return true;
    } else
        return false;
}

function redireccionarjQuery(sScript) {
    if (location.pathname.indexOf("menu.php") !== -1) {
        $("#formularioMenuSigno input:hidden[name=sScript]").val(sScript);
        $("#formularioMenuSigno").attr("action", "menujq.php");
        $("#formularioMenuSigno").submit();
        exit();
    }
}
//redirecciona a interfaces
function irMenu(sScript) {
    if (sScript.indexOf(".php") !== -1) {
        $("#formularioMenuSigno").attr("action", "menu.php");
    }
    $("#formularioMenuSigno input:hidden[name=sScript]").val(sScript);
    $("#formularioMenuSigno").submit();

}
function exit(status) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;
    if (typeof status === 'string') {
        alert(status);
    }
    window.addEventListener('error', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation(e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i = 0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {
            stopPropagation(e);
        }, true);
    }
//    if (window.stop) {
//        window.stop();
//    }

    throw '';
}
function VerAyuda(Ruta) {
    if (Ruta != '') {
        var VentanaAyuda = window.open(Ruta, 'ayuda', 'toolbar=0,location=0,width=640,height=480,maximize=1,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,copyhistory=0');
        VentanaAyuda.focus();
    } else
        alert('No hay ayuda disponible para el tema actual.');
}
var asistenteImpresion = false;
function verImpresoras(test) {
    //if(typeof jConfirm === "undefined") {
    var respuesta = false;
    if (!test) {
        respuesta = confirm("Desea utlizar Applet para realizar la impresión? ");
    }
    if (respuesta == true) {
        try {
            var impresoras = obtenerImpresoras();
            if (impresoras !== false) {
                buscarImpresorasUsuario(impresoras, null);
            }
        } catch (e) {
            IniciarDialogoImpresoras();
            VerDialogoImpresoras(null, null, false);
            //alert("Error al "+e.message);
        }
    } else {
        setTipoImpresion();
        //iniciarServidor(listarImpresoras);
        var iniciar = iniciarServidor();
        asistenteImpresion = iniciar;
        if (iniciar === true) {
            listarImpresoras();
        }

    }
    //} else {
    /*if(test) {
     listarImpresoras();
     return;
     }
     $("#modoImpresion").css("display","block");
     $("#modoImpresion").dialog({
     resizable: false,
     height: "auto",
     width: 300,
     modal: true,
     closeOnEscape: false,
     open: function(event, ui) {
     $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
     },
     buttons: {
     Si: function() {
     try{*/
    /*var impresoras = obtenerImpresoras();
     if (impresoras !== false) {
     buscarImpresorasUsuario(impresoras, null);
     //$(this).dialog("close");
     }*/
    /*
     }catch(e){
     alert("Error al "+e.message);
     }
     },
     No: function() {
     setTipoImpresion();
     var iniciar = iniciarServidor();
     if(iniciar === true) {
     listarImpresoras();
     }
     $(this).dialog("close");
     }
     }
     });*/
//        jConfirm("Desea utlizar Applet para realizar la impresi&oacute;n? ", "Modo Imprimir", function(respuesta) {
//            if(respuesta == true) {
//                try{
//                    var impresoras = obtenerImpresoras();
//                    if (impresoras !== false) {
//                        buscarImpresorasUsuario(impresoras, null);
//                    }
//                }catch(e){
//                    alert("Error al "+e.message);
//                }
//            } else {
//                setTipoImpresion();
//                var iniciar = iniciarServidor();
//                if(iniciar === true) {
//                    listarImpresoras();
//                }
//            }
//        });
    //}
}
