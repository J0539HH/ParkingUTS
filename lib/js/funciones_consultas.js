/** ** Funciones generales utilizadas principalmente en las consultas de SIGNO
 **- Autor: Luis Eduardo Zambrano Fz -**/
var efectoConsultando = "<br /><img src='../../GIFS/General/loading4.gif' alt='Consultando...' /><br /><b><i>&nbsp;Consultando...</i></b>";
var efectoPaginando = "<br /><img src='../../GIFS/General/loading_page2.gif' alt='Paginando...' /><br><b><i>&nbsp;Paginando...</i></b>";
var efectoCargando = "<br /><img src='../../GIFS/escrituracion/fabrica/loading7.gif' alt='Cargando...' /><br />";
var efectoProcesando = "<br /><img src='../../GIFS/escrituracion/fabrica/loading8.gif' alt='Procesando...' style='width:16px; height:16px;' /><b><i>&nbsp;Procesando...</i></b>";
var efectoCreandoPDF = "<br /><img src='../../GIFS/escrituracion/fabrica/loading0.gif' alt='Creando PDF...' style='width:22px; height:22px; vertical-align:middle;' /><b><i>&nbsp;Creando PDF...</i></b>";
var error404 = "<br /><span style='color:red;'><b>No existe el script de consulta</b></span>";
var errorMemoria = "<br /><span style='color:red;'><b>Demasiados datos para extraer.<br />Reduzca el intervalo de consulta</b></span>";
var MV_TMP, MV_TMP2; /*variables para valor temporal en los eventos del teclado*/
function errorDesconocido(status, statusText)
{
    return "<br /><hr /><span style='color:red;'><b>Imposible extraer los datos.</b></span>" +
            "<br /><span style='color:lime;'><b>Detalle de error: " + status + " (" + statusText + ")</b></span><br /><hr />";
}
function getID(item)
{
    if (document.getElementById)
        return document.getElementById(item);
    eval("if (document." + item + ") return document." + item + ";");
    if (document.all)
        return document.all[item];
    if (window.mmIsOpera)
        return document.getElementById(item);
    return false;
}
function nuevoAjax()
{
    var xmlhttp = false;
    try {
        xmlhttp = new XMLHttpRequest();
    } catch (e)
    {
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e)
        {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e)
            {
                xmlhttp = false;
                alert("Su navegador esta desactualizado y no reconoce el recurso de consulta");
            }
        }
    }
    return xmlhttp;
}
function sendFormulario(f)
{
    if (!f)
        return f;
    var i, j, dim = f.elements.length;
    var o = false, s = "";
    for (i = 0, j = 0; i < dim; ++i)
    {
        o = f.elements[i];
        if (o.type == "radio" && !o.checked)
            continue;
        if (o.type == "checkbox" && !o.checked)
            continue;
        //        if(!o.disabled && o.value!="" && o.name!="sScript"){//Ignora los valores que sean vacios
        if (!o.disabled && o.name != "sScript") { // Incluye los valores que son vacios
            s += (j > 0 ? "&" : "") + (o.name + "=" + o.value);
            ++j;
        }
    }
    return s;
}
function traerDatos(xml, Url, Capa, Opc)
{
    if (!xml)
        xml = nuevoAjax();
    else
        xml.abort();
    var cp = getID(Capa);
    if (!cp) {
        alert("La capa destino es requerida y  (" + Capa + ") no existe");
        return false;
    }
    var align = cp.align;
    if (!align && Opc.Consultando)
        align = 'left';
    var varbls = null;
    if (!Opc || typeof Opc != "object")
        Opc = {};
    function porDefecto(p, v) {
        if (typeof Opc[p] == "undefined") {
            Opc[p] = v;
        }
    }
    ;
    porDefecto("Consultando", false); /*boolean: Muestra el efecto de consulta ejecutandose*/
    porDefecto("Paginando", false); /*boolean: Muestra el efecto de paginacion*/
    porDefecto("Cargando", false); /*boolean: Muestra el efecto cargando*/
    porDefecto("Procesando", false); /*boolean: Muestra el efecto procesando*/
    porDefecto("CreandoPDF", false); /*boolean: Muestra el efecto creando PDF*/
    porDefecto("cpSizePDF", null); /*Nombre del div que contiene el tamaño del PDF*/
    porDefecto("Formulario", null); /*object | string: Recibe el nombre del formulario, o el formulario en si, o una lista de clave=valor separadas con el caracter &, ejemplo: "nombre=luis&apellidos=zambrano" */
    porDefecto("Metodo", "POST"); /*string: El metodo de envio de variables, por ahora solo usar POST o GET*/
    porDefecto("Funcion", function () {
    }); /*object: Es la funcion (tuya) que deseas ejecutar despues de terminar la carga de datos*/
    Opc.Metodo = Opc.Metodo.toUpperCase();
    if (typeof Opc.Funcion == "string")
        eval("Opc.Funcion=" + Opc.Funcion + ";");
    if (Opc.Formulario)
    {
        if (typeof Opc.Formulario == "string")

        {
            if (Opc.Formulario.indexOf("=") != -1) {
                varbls = Opc.Formulario;
            } else {
                varbls = sendFormulario(getID(Opc.Formulario));
            }
        } else if (typeof Opc.Formulario == "object") {
            varbls = sendFormulario(Opc.Formulario);
        }
    }
    if (Opc.Consultando) {
        cp.align = 'center';
        cp.innerHTML = efectoConsultando;
    } else if (Opc.Procesando) {
        cp.align = 'center';
        cp.innerHTML = efectoProcesando;
    } else if (Opc.Cargando) {
        cp.align = 'center';
        cp.innerHTML = efectoCargando;
    } else if (Opc.CreandoPDF)
    {
        cp.innerHTML = efectoCreandoPDF;
        if (Opc.cpSizePDF && getID(Opc.cpSizePDF)
                && (1 * getID(Opc.cpSizePDF).innerHTML > 300000))
        {
            var tardar = 1 * getID(Opc.cpSizePDF).innerHTML < 1000000 ? "segundos" : "minutos";
            cp.innerHTML += "<br /><span class='pequena fondoamarillo'>(Podr&iacute;a tardar varios " + tardar + ")</span>";
        }
        cp.innerHTML += "<br /><span id='spanKillPidPDF' class='gris enlace negrilla efectofondo nowrap' onclick='onCancelarPDF(\"" + Capa + "\")'> Cancelar PDF </span>";
    } else if (Opc.MensajePersonalizado)
    {
        cp.align = 'center';
        cp.innerHTML = efectoProcesando.replace(/<b><i>&nbsp;Procesando...<\/i><\/b>/, Opc.MensajePersonalizado);
    }
    if (Url.toLowerCase().indexOf('html') != -1) {
        Opc.Metodo = "GET";
    }
    xml.onreadystatechange = function () {
        switch (xml.readyState)
        {
            case 3:
                if (Opc.Paginando)
                    cp.innerHTML = efectoPaginando;
                break;
            case 4:
                if (!xml.status || xml.status == 200 || xml.status == 0)
                {
                    if (xml.responseText && xml.responseText.substring(0, 80).indexOf("Allowed memory size of") != -1)
                    {
                        cp.innerHTML = errorMemoria;
                    } else
                    {
                        if (Opc.Consultando || Opc.Paginando || Opc.Cargando || Opc.Procesando) {
                            cp.align = align;
                        }
                        cp.innerHTML = xml.responseText; //xml.abort();
                        if (typeof libroActual != "undefined")
                            libroActual = 0;
                        if (typeof Opc.Funcion == "function")
                            Opc.Funcion();
                        else
                            alert("parametro invalido: \"Funcion\"");
                    }
                } else if (xml.status == 404) {
                    cp.align = 'center';
                    cp.innerHTML = error404;
                } else {
                    cp.align = 'center';
                    cp.innerHTML = errorDesconocido(xml.status, xml.statusText) + xml.responseText;
                }
                break;
        }
    }
    if (navigator.appVersion.indexOf("Konqueror/3.3") == -1)
    {
        xml.open(Opc.Metodo, Url, true);
        if (/*null != varbls &&*/ Opc.Metodo == "POST")
            xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//else if(null == varbls) xml.setRequestHeader("Content-Type","text/html; charset=ISO-8859-1");
        xml.send(varbls);
    } else
    {
        xml.open("GET", Url + "?" + varbls, true);
        xml.send();
    }
}
var objApell = false; /*-Se guarda el objeto que produjo el evento-*/
var valAnterior = ""; /*Este seria el valor anterior del text Apellido*/
function setValSelected(input, select)
{
    if (!input.getAttribute("tipo"))
    {
        input.value = select[select.selectedIndex].value;
        return;
    }
    switch (input.getAttribute("tipo"))
    {
        case "entero":
            var s = select[select.selectedIndex].value;
            var v = s.split('-');
            input.value = trim(v[0]);
            break;
    }
}
function onClickSuggest(e)
{
    if (!e && window.event)
        e = window.event;
    if (typeof e == "undefined")
        return;
    var sel;
    if (e.target)
        sel = e.target;
    else if (e.srcElement)
        sel = e.srcElement;
    if (typeof sel.selectedIndex == "undefined")
        return;/*para corregir un bug en firefox*/
    setValSelected(objApell, sel);
    objApell.focus();
    sel.style.visibility = 'hidden';
    if (lanzarBusqueda)
        lanzarBusqueda();
}
function onChangeSuggest(e)
{
    if (!e)
        e = window.event;
    var sel;
    if (e.target)
        sel = e.target;
    else if (e.srcElement)
        sel = e.srcElement;
    setValSelected(objApell, sel);
}
function onKeyPressSuggest(e)
{
    if (!e)
        e = window.event;
    var sel;
    if (e.target)
        sel = e.target;
    else if (e.srcElement)
        sel = e.srcElement;
    switch (keyCode(e))
    {
        case 27:
            sel.style.visibility = 'hidden';
            objApell.focus();
            objApell.value = valAnterior;
            break;
        case 13:
            setValSelected(objApell, sel);
            MV_TMP = objApell.value;
            objApell.focus();
            sel.style.visibility = 'hidden';
            if (lanzarBusqueda)
                lanzarBusqueda();
            break;
    }
}
function onBlurSuggest(e)
{
    if (!e)
        e = window.event;
    var sel;
    if (e.target)
        sel = e.target;
    else if (e.srcElement)
        sel = e.srcElement;
    if (sel)
        ocultarCapa(sel.getAttribute("id"));
}
var puedeOcultarse = true;
function onActivateSuggest(e) {
    puedeOcultarse = false;
}
function onDeactivateSuggest(e) {
    puedeOcultarse = true;
}
var lanzarBusqueda = false;
function getNombre(e, lanzar)
{
    if (!e)
        e = window.event;
    if (typeof e == "undefined")
        return;
    if (lanzar)
        lanzarBusqueda = lanzar;
    if (keyCode(e) == 9 && getID(cpSuggApell)) {
        ocultarCapa(cpSuggApell);
        return; /*La tecla tab fue presionada*/
    }
    if (keyCode(e) == 40 && getID(cpSuggApell))
    {
        var sel = getID(cpSuggApell);
        valAnterior = objApell.value;
        sel.focus();
        sel.selectedIndex = 0;
        setValSelected(objApell, sel);
        if (esCapaOculta(cpSuggApell))
            mostrarCapa(cpSuggApell);
    }
}
var esTiempoOcultar = false;
var punteroOcultar = false;
function verSiOcultar()
{
    if (esTiempoOcultar)

    {
        if (getID(cpSuggApell) && getID(cpSuggApell).selectedIndex == -1)

        {
            ocultarCapa(cpSuggApell);
        }
        window.clearInterval(punteroOcultar);
    } else {
        esTiempoOcultar = true;
    }
}
var ajaxApell = nuevoAjax();
var cpSuggApell;
function sugerirNombre(e, Destino, campos, servicio)
{
    if (!e)
        e = window.event;
    if (typeof e == "undefined")
        return false;
//if(lanzar) lanzarBusqueda=lanzar;
    window.clearInterval(punteroOcultar);
    if (!Destino)
    {
        if (puedeOcultarse === true) {
            esTiempoOcultar = false;
            punteroOcultar = window.setInterval(verSiOcultar, 100, "JavaScript");
        }
        puedeOcultarse = true;
        return;
    }

    if (e.target)
        objApell = e.target;
    else if (e.srcElement)
        objApell = e.srcElement;
    var s = trim(objApell.value);
    if (s == "") {
        getID(Destino).innerHTML = "";
        return false;
    }
    traerDatos(ajaxApell, "../general/sugerir_nombre.php", Destino, {
        Formulario: "texto=" + s + "&capa=" + Destino + (campos ? "&campo=" + campos : "") + (servicio ? "&servicio=" + servicio : "")
    });
    cpSuggApell = "suggest" + Destino; /*Este ID debe corresponderse con el select del script sugerir_nombre.php*/
    if (keyCode(e) == 40 || keyCode(e) == 9)
        getNombre(e);
    return true;
}
SUGERIR_SETUP = function (Opt)
{
    if (!Opt)
        return;
    function porDefecto(p, v) {
        if (typeof Opt[p] == "undefined") {
            Opt[p] = v;
        }
    }
    ;
    porDefecto("Input", null); /*ejemplo: "apell" si: <input type='text' id='apell' name='apellidos' autocomplete='off' /> */
    porDefecto("Capa", null); /*ejemplo: "capaDondeMostar" si: <div id='capaDondeMostrar'></div> */
    porDefecto("Campos", ""); /*ejemplo: "apellidos_usuario,nombre_empresa" si: se quiere sugerir estos campos*/
    porDefecto("Servicio", ""); /*ejemplo: "escrituras" si: se quiere sugerir los campos anteriores relacionados al modulo de escriuras*/
    porDefecto("Funcion", ""); /*ejemplo: "enviarFormulario" si: es el nombre de la funcion que ejecutas para enviar la pagina*/
    if (!getID(Opt.Input) || !getID(Opt.Capa))
    {
        alert("El nombre de la capa=" + Opt.Capa + " o el input=" + Opt.Input + " es incorrecto");
        return false;
    }
    var Input = getID(Opt.Input);
    var kd = Input.onkeydown ? Input.onkeydown : function () {
    };
    var ku = Input.onkeyup ? Input.onkeyup : function () {
    };
    var kp = Input.onkeypress ? Input.onkeypress : function () {
    };
    var ob = Input.onblur ? Input.onblur : function () {
    };

    Input.onkeydown = function () {
        MV_TMP = this.value;
    }
    Input.onkeyup = new Function("e", " if(! e) e=window.event; if(MV_TMP!=this.value) sugerirNombre(e,\"" + Opt.Capa + "\",\"" + (Opt.Campos ? Opt.Campos : "") + "\",\"" + (Opt.Servicio ? Opt.Servicio : "") + "\"); else if(this.value!='') getNombre(e" + (Opt.Funcion ? ("," + Opt.Funcion) : "") + ");");
//onkeypress=new Function(" if(this.value!='') getNombre(window.event"+(Opt.Funcion?(","+Opt.Funcion):"")+");");
    Input.onkeypress = new Function("e", " if(! e) e=window.event; var ffz=" + kp + "; if(this.value!='') getNombre(e" + (Opt.Funcion ? ("," + Opt.Funcion) : "") + "); ffz();");
    Input.onblur = function (e) {
        if (!e)
            e = window.event;
        sugerirNombre(e, false);
    }
    Input.setAttribute("autocomplete", "off");

//alert(getID(Opt.Input).onkeypress);
    getID(Opt.Capa).style.position = 'absolute';
    getID(Opt.Capa).style.display = 'inline';
}
function onProgreso(e, capa)
{
    if (!e)
        e = window.event;
    if (!(e.position && e.totalSize))
        return;
    var pc = (e.position / e.totalSize) * 100;
    if (getID(capa))
        getID(capa).innerHTML = pc + "%";
}
function crearEvento(evnt, elem, func)
{
    if (typeof elem == "string")
        elem = getID(elem);
    if (typeof func == "string")
        eval("func = " + func + ";");
    if (elem.addEventListener) {
        elem.addEventListener(evnt, func, true);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + evnt, func);
    } else {
        elem["on" + evnt] = func;
    }
}
function pararEvento(e)
{
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        if (!e)
            e = window.event;
        e.cancelBubble = true;
    }
}
function cancelarEvento(e)
{
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        if (!e)
            e = window.event;
        e.returnValue = false;
    }
}
function noEvento(e) {
    pararEvento(e);
    cancelarEvento(e);
}
function eliminarEvento(evnt, elem, func)
{
    if (typeof elem == "string")
        elem = getID(elem);
    if (typeof func == "string")
        eval("func = " + func + ";");
    if (elem.removeEventListener) {
        elem.removeEventListener(evnt, func, true);
    } else if (elem.detachEvent) {
        elem.detachEvent("on" + evnt, func);
    } else {
        elem["on" + evnt] = null;
    }
}
function crearElemento(type, parent)
{
    var el = null;
    if (document.createElementNS)
    {
        el = document.createElementNS("http://www.w3.org/1999/xhtml", type);
    } else
        el = document.createElement(type);
    if (typeof parent != "undefined")
        parent.appendChild(el);
    return el;
}
function posicionCursor()
{
    var tb = getID("apellidos");
    var cursor = -1;
    if (document.selection && (document.selection != 'undefined'))
    {
        var _range = document.selection.createRange();
        var contador = 0;
        while (_range.move('character', - 1))
            contador++;
        cursor = contador;
    } else if (tb.selectionStart >= 0)
        cursor = tb.selectionStart;
    return cursor;
}
var libroActual = 0;
function irIndex(actual)
{
    eval("vCapaConsulta" + libroActual + ".style.display='none'");
    eval("vCapaConsulta" + actual + ".style.display='inline'");
    libroActual = actual;
}
function atras(actual)
{
    var ant = 1 * actual == 0 ? actual : 1 * actual - 1;
    irIndex(ant);
}
function siguiente(actual)
{
    var sig = actual + 1;
    irIndex(sig);
}
function digitoVerificacion(NIT)
{
    if (NIT == '' || NIT.length > 15)
        return '';
    var i, dim, modulo, zuma, c;
    var primos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    zuma = 0;
    modulo = 0;
    dim = NIT.length;
    for (i = 0; i < dim; ++i)
    {
        c = NIT.charAt((dim - 1) - i);
        if (c < '0' || c > '9')
            return '';
        zuma += (parseInt(c) * primos[i]);
    }
    modulo = zuma % 11;
    if (modulo > 1)
        return (11 - modulo);
    return modulo;
}
function esEntero(s)
{
    var i, dim = s.length;
    for (i = 0; i < dim; ++i)
        if (s.charAt(i) > '9' || s.charAt(i) < '0')
            return false;
    return true;
}
function esReal(s)
{
    var i, c, pts = 0, dim = s.length;
    for (i = 0; i < dim; ++i)
    {
        c = s.charAt(i);
        if ((c > '9' || c < '0') && c != '.')
            return false;
        else if (c == '.')
            ++pts;
    }
    if (pts > 1)
        return false;
    return true;
}
function numeroDeDecimales(val)
{
    var i, dim = val.length;
    var punto = false, decimales = 0;
    for (i = 0; i < dim; ++i)
    {
        if (val.charAt(i) == '.') {
            punto = true;
            continue;
        }
        if (punto == true)
            ++decimales;
    }
    return decimales;
}
function redondear(numero, decimales)
{
    return (Math.round(numero * Math.pow(10, decimales)) / Math.pow(10, decimales));
// return parseFloat(parseFloat(val).toFixed(precision));
}
function number_format(number, decimals, dec_point, thousands_sep)
{
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point == undefined ? "." : dec_point;
    var t = thousands_sep == undefined ? "," : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
function hayComillasSimples(s) {
    return (s.indexOf("'") != -1);
}
function hayComillasDobles(s) {
    return (s.indexOf('"') != -1);
}
function hayComillas(s) {
    return (hayComillasSimples(s) || hayComillasDobles(s));
}
function validarIntervaloEntero(obj1, obj2, sTexto, bAlertar)
{
    if (typeof obj1 != "object" || typeof obj2 != "object")
        return false;
    if (typeof bAlertar == "undefined")
        bAlertar = true;
    var v1 = obj1.value;
    var v2 = obj2.value;
    if (v1 != '' && !esEntero(v1))
    {
        if (bAlertar)
            alert("Ingrese un valor entero");
        obj1.select();
        obj1.focus();
        return false;
    }
    if (v2 != '' && !esEntero(v2))
    {
        if (bAlertar)
            alert("Ingrese un valor entero");
        obj2.select();
        obj2.focus();
        return false;
    }
    if (v1 != '' && v2 != '' && 1 * v2 < 1 * v1)
    {
        if (!sTexto)
            sTexto = "valor";
        if (bAlertar)
            alert("El " + sTexto + " final debe ser mayor que el inicial");
        obj2.select();
        obj2.focus();
        return false;
    }
    return true;
}
function validarIntervaloReal(obj1, obj2, sTexto, bAlertar)
{
    if (typeof obj1 != "object" || typeof obj2 != "object")
        return false;
    if (typeof bAlertar == "undefined")
        bAlertar = true;
    var v1 = obj1.value;
    var v2 = obj2.value;
    if (v1 != '' && !esReal(v1))
    {
        if (bAlertar)
            alert("Ingrese un valor numérico");
        obj1.select();
        obj1.focus();
        return false;
    }
    if (v2 != '' && !esReal(v2))
    {
        if (bAlertar)
            alert("Ingrese un valor numérico");
        obj2.select();
        obj2.focus();
        return false;
    }
    if (v1 != '' && v2 != '' && parseFloat(v2) < parseFloat(v1))
    {
        if (!sTexto)
            sTexto = "valor";
        if (bAlertar)
            alert("El " + sTexto + " final debe ser mayor que el inicial");
        obj2.select();
        obj2.focus();
        return false;
    }
    return true;
}
function ltrim(cadena) {
    cadena = '' + cadena + '';
    return cadena.replace(/^\s*/g, '');
}
function rtrim(cadena) {
    cadena = '' + cadena + '';
    return cadena.replace(/\s*$/g, '');
}
function trim(cadena) {
    cadena = '' + cadena + '';
    return cadena.replace(/^\s*|\s*$/g, '');
}
function html2text(html) {
    return html.replace(/<\/?[^>]+>/gi, '');
}
function stripTags(html) {
    return html2text(html);
}
function strPad(s, dim, rell, derecha)
{
    s += '';
    if (!rell)
        rell = '0';
    if (!derecha)
        while (s.length < dim)
            s = rell + s;
    else
        while (s.length < dim)
            s = s + rell;
    return s;
}
function compararFechas(dia1, mes1, anio1, dia2, mes2, anio2)
{
    var fecha1 = strPad(anio1, 4) + strPad(mes1, 2) + strPad(dia1, 2);
    var fecha2 = strPad(anio2, 4) + strPad(mes2, 2) + strPad(dia2, 2);
    return (1 * fecha1 - 1 * fecha2);
}

function compararFechasyHoras(dia1, mes1, anio1, hora1, minuto1, meridiano1, dia2, mes2, anio2, hora2, minuto2, meridiano2)
{
    var fecha1 = strPad(anio1, 4) + strPad(mes1, 2) + strPad(dia1, 2);
    var fecha2 = strPad(anio2, 4) + strPad(mes2, 2) + strPad(dia2, 2);
    var resultadoComparacion = (1 * fecha1 - 1 * fecha2);


    if (resultadoComparacion <= 0) {
        var error = 0;

        if (meridiano1 == "pm") {
            if (hora1 > 0 && hora1 < 12)
                hora1 = 12 + parseInt(hora1);
        }
        if (meridiano2 == "pm") {
            if (hora2 > 0 && hora2 < 12)
                hora2 = 12 + parseInt(hora2);
        }

        if (hora1 > hora2) {
            error = 1;
        } else if (hora1 < hora2) {
            error = 0;
        } else if (hora1 == hora2) {
            if (minuto1 > minuto2) {
                error = 1;
            } else if (minuto1 < minuto2) {
                error = 0;
            } else if (minuto1 == minuto2) {
                error = 0;
            }
        }

        if (error == 1) {
//alert("La hora inicial debe ser anterior a la hora final.");
            return 1;
        } else {
            return -1;
        }
    } else {
        return resultadoComparacion;
    }
}


function num_dias(mes, anio)
{
    mes *= 1;
    anio *= 1;
    switch (mes)
    {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
            break;
        case 2:
            if (anio % 4 == 0)
                return 29;
            else
                return 28;
            break;
        default:
            return false;
    }
}
function sMes(i)
{
    i *= 1;
    switch (i)
    {
        case 1:
            return "Ene";
            break;
        case 2:
            return "Feb";
            break;
        case 3:
            return "Mar";
            break;
        case 4:
            return "Abr";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "Jun";
            break;
        case 7:
            return "Jul";
            break;
        case 8:
            return "Ago";
            break;
        case 9:
            return "Sep";
            break;
        case 10:
            return "Oct";
            break;
        case 11:
            return "Nov";
            break;
        case 12:
            return "Dic";
            break;
        default:
            alert(i);
            return "";
            break;
    }
}
function esFechaValida(dia, mes, anio)
{
    dia *= 1;
    mes *= 1;
    anio *= 1;
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 100)
        return false;
    return (dia <= num_dias(mes, anio));
}
function validarFecha(formulario, prefijo, sufijo, bAlertar)
{
    var f, dia, mes, anio, odia, omes, oanio;
    if (!(f = getID(formulario)))
        return false;
    if (eval("! f." + prefijo + "dia" + sufijo))
        return false;
    if (eval("! f." + prefijo + "mes" + sufijo))
        return false;
    if (eval("! f." + prefijo + "anio" + sufijo))
        return false;
    eval(" dia=f." + prefijo + "dia" + sufijo + ".value;" +
            " mes=f." + prefijo + "mes" + sufijo + ".value;" +
            " anio=f." + prefijo + "anio" + sufijo + ".value;" +
            " odia=f." + prefijo + "dia" + sufijo + ";" +
            " omes=f." + prefijo + "mes" + sufijo + ";" +
            " oanio=f." + prefijo + "anio" + sufijo + ";");
    if (dia != '')
    {
        if (!esEntero(dia))
        {
            if (bAlertar == true)
                alert('Ingrese un valor entero');
            if (odia.select && odia.focus)
            {
                odia.select();
                odia.focus();
            }
            return false;
        } else if (1 * dia < 1 || 1 * dia > 31)
        {
            if (bAlertar == true)
                alert('Valor no permitido para el día');
            if (odia.select && odia.focus)
            {
                odia.select();
                odia.focus();
            }
            return false;
        }
    }
    if (mes != '')
    {
        if (!esEntero(mes))
        {
            if (bAlertar)
                alert('Ingrese un valor entero');
            if (omes.select && omes.focus)
            {
                omes.select();
                omes.focus();
            }
            return false;
        } else if (1 * mes < 1 || 1 * mes > 12)
        {
            if (bAlertar)
                alert('Valor no permitido para el mes');
            if (omes.select && omes.focus)
            {
                omes.select();
                omes.focus();
            }
            return false;
        }
    }
    if (anio != '')
    {
        if (!esEntero(anio))
        {
            if (bAlertar)
                alert('Ingrese un valor entero');
            if (oanio.select && oanio.focus)
            {
                oanio.select();
                oanio.focus();
            }
            return false;
        } else if (1 * anio <= 999 || 1 * anio > 9999)
        {
            if (bAlertar)
                alert('Ingrese cuatro cifras para el año');
            if (oanio.select && oanio.focus)
            {
                oanio.select();
                oanio.focus();
            }
            return false;
        }
    }
    if (dia == '')
    {
        if (bAlertar)
            alert('Ingrese el día');
        if (odia.focus)
            odia.focus();
        return false;
    }
    if (mes == '')
    {
        if (bAlertar)
            alert('Ingrese el mes');
        if (omes.focus)
            omes.focus();
        return false;
    }
    if (anio == '')
    {
        if (bAlertar)
            alert('Ingrese el año');
        if (oanio.focus)
            oanio.focus();
        return false;
    }
    if (1 * dia > num_dias(1 * mes, 1 * anio))
    {
        if (bAlertar)
            alert('El mes ' + mes + ' del ' + anio + ' solo tiene ' + num_dias(1 * mes, 1 * anio) + ' días');
        if (odia.select && odia.focus)
        {
            odia.select();
            odia.focus();
        }
        return false;
    }
    return true;
}
/* Valida intervalo de hora sobre un mismo dia */
function validarIntervaloHorasMeridiano(hora1, minuto1, meridiano1, hora2, minuto2, meridiano2) {
    var error = 0;

    if (meridiano1 == "pm") {
        if (hora1 > 0 && hora1 < 12)
            hora1 = 12 + parseInt(hora1);
    }
    if (meridiano2 == "pm") {
        if (hora2 > 0 && hora2 < 12)
            hora2 = 12 + parseInt(hora2);
    }
    if (hora1 > hora2) {
        error = 1;
    } else if (hora1 < hora2) {
        error = 0;
    } else if (hora1 == hora2) {
        if (minuto1 > minuto2) {
            error = 1;
        } else if (minuto1 < minuto2) {
            error = 0;
        } else if (minuto1 == minuto2) {
            error = 0;
        }
    }
    if (error == 1) {
        alert("La hora inicial debe ser anterior a la hora final.");
        return false;
    }
    return true;
}
function validarIntervaloFecha(formulario, pref1, suf1, pref2, suf2, bAlertar)
{
    var f, dia1, mes1, anio1, dia2, mes2, anio2, odia, omes, oanio;
    if (typeof bAlertar == "undefined")
        bAlertar = true;
    if (!(f = getID(formulario)))
        return false;
    if (eval("! f." + pref1 + "dia" + suf1 + " || ! f." + pref2 + "dia" + suf2))
        return false;
    if (eval("! f." + pref1 + "mes" + suf1 + " || ! f." + pref2 + "mes" + suf2))
        return false;
    if (eval("! f." + pref1 + "anio" + suf1 + " || ! f." + pref2 + "anio" + suf2))
        return false;
    eval(" dia1=f." + pref1 + "dia" + suf1 + ".value; dia2=f." + pref2 + "dia" + suf2 + ".value;" +
            " mes1=f." + pref1 + "mes" + suf1 + ".value; mes2=f." + pref2 + "mes" + suf2 + ".value;" +
            " anio1=f." + pref1 + "anio" + suf1 + ".value; anio2=f." + pref2 + "anio" + suf2 + ".value;" +
            " odia=f." + pref2 + "dia" + suf2 + ";" +
            " omes=f." + pref2 + "mes" + suf2 + ";" +
            " oanio=f." + pref2 + "anio" + suf2 + ";");
    if (dia1 != '' || mes1 != '' || anio1 != '')
        if (validarFecha(formulario, pref1, suf1, bAlertar) == false)
            return false;
    if (dia2 != '' || mes2 != '' || anio2 != '')
        if (validarFecha(formulario, pref2, suf2, bAlertar) == false)
            return false;
    if (dia1 != '' && mes1 != '' && anio1 != '' && dia2 != '' && mes2 != '' && anio2 != '')
        if (compararFechas(dia1, mes1, anio1, dia2, mes2, anio2) > 0)
        {
            if (bAlertar)
                alert("La fecha inicial debe ser anterior a la fecha final");
            if (odia.select && omes.select && oanio.select)
            {
                odia.select();
                omes.select();
                oanio.select();
            }
            return false;
        }
    return true;
}
function validarIntervaloFechaSelect(formulario, pref1, suf1, pref2, suf2, bAlertar)
{
    var f, dia1, mes1, anio1, dia2, mes2, anio2, odia, omes, oanio;
    if (typeof bAlertar == "undefined")
        bAlertar = true;
    if (!(f = getID(formulario)))
        return false;
    if (eval("! f." + pref1 + "dia" + suf1 + " || ! f." + pref2 + "dia" + suf2))
        return false;
    if (eval("! f." + pref1 + "mes" + suf1 + " || ! f." + pref2 + "mes" + suf2))
        return false;
    if (eval("! f." + pref1 + "anio" + suf1 + " || ! f." + pref2 + "anio" + suf2))
        return false;
    eval(" dia1=f." + pref1 + "dia" + suf1 + "[f." + pref1 + "dia" + suf1 + ".selectedIndex].value; dia2=f." + pref2 + "dia" + suf2 + "[f." + pref2 + "dia" + suf2 + ".selectedIndex].value;" +
            " mes1=f." + pref1 + "mes" + suf1 + "[f." + pref1 + "mes" + suf1 + ".selectedIndex].value; mes2=f." + pref2 + "mes" + suf2 + "[f." + pref2 + "mes" + suf2 + ".selectedIndex].value;" +
            " anio1=f." + pref1 + "anio" + suf1 + "[f." + pref1 + "anio" + suf1 + ".selectedIndex].value; anio2=f." + pref2 + "anio" + suf2 + "[f." + pref2 + "anio" + suf2 + ".selectedIndex].value;");
    if ((dia1 != '' || mes1 != '' || anio1 != '') && !esFechaValida(dia1, mes1, anio1))
    {
        if (bAlertar)
            alert("Fecha invalida");
        return false;
    }
    if ((dia2 != '' || mes2 != '' || anio2 != '') && !esFechaValida(dia2, mes2, anio2))
    {
        if (bAlertar)
            alert("Fecha invalida");
        return false;
    }
    if (dia1 != '' && mes1 != '' && anio1 != '' && dia2 != '' && mes2 != '' && anio2 != '')
        if (compararFechas(dia1, mes1, anio1, dia2, mes2, anio2) > 0)
        {
            if (bAlertar)
                alert("La fecha inicial debe ser anterior a la fecha final");
            return false;
        }
    return true;
}
/*Para intervalo de fecha en busqueda avanzada*/
function validarIntervaloFechaTr(formulario, prefijo, bAlertar, nombre_fecha)
{
    var f, dia1, mes1, anio1, dia2, mes2, anio2, odia, omes, oanio;
    if (typeof bAlertar == "undefined")
        bAlertar = true;
    if (!(f = getID(formulario)))
        return false;
    if (eval("! f." + prefijo + "1 || ! f." + prefijo + "2"))
        return false;
    if (eval("f." + prefijo + "1.value=='' || f." + prefijo + "2.value==''"))
        return true;
    var vf1, vf2;
    eval("vf1 = f." + prefijo + "1.value.split('-'); vf2 = f." + prefijo + "2.value.split('-');");
    dia1 = vf1[2];
    mes1 = vf1[1];
    anio1 = vf1[0];
    dia2 = vf2[2];
    mes2 = vf2[1];
    anio2 = vf2[0];
    if ((dia1 != '' || mes1 != '' || anio1 != '') && !esFechaValida(dia1, mes1, anio1))
    {
        if (bAlertar)
            alert("Fecha invalida");
        return false;
    }
    if ((dia2 != '' || mes2 != '' || anio2 != '') && !esFechaValida(dia2, mes2, anio2))
    {
        if (bAlertar)
            alert("Fecha invalida");
        return false;
    }
    if (dia1 != '' && mes1 != '' && anio1 != '' && dia2 != '' && mes2 != '' && anio2 != '')
        if (compararFechas(dia1, mes1, anio1, dia2, mes2, anio2) > 0)
        {
            if (bAlertar)
            {
                if (typeof nombre_fecha == "undefined")
                    nombre_fecha = "Error en fecha especificada:";
                alert(nombre_fecha + "\nLa fecha inicial debe ser anterior a la fecha final");
            }
            return false;
        }
    return true;
}
function teclaValida(kc)
{
    return (kc == 0 || kc == 8 || kc == 9 || kc == 13 || kc == 35 || kc == 36 || kc == 37 || kc == 39 || kc == 127);
}
function keyCode(e)
{
    if (!e)
        e = window.event;
    return (e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode));
}
function returnEntero(e)
{
    if (!e)
        e = window.event;
    if (typeof kc == "undefined")
        return;
    var kc = keyCode(e);
    if (typeof kc == "undefined")
        return;
    if (kc > 47 && kc < 58) {
        return true;
    } else if (teclaValida(kc)) {
        return true;
    } else {
        noEvento(e);
        return false;
    }
}
function returnReal(e)
{
    if (!e)
        e = window.event;
    var obj = false, kc = keyCode(e);
    if ((kc > 47 && kc < 58) || kc == 46)
    {
        if (e.target)
            obj = e.target;
        else if (e.srcElement)
            obj = e.srcElement;
        if (kc == 46 && obj && obj.value.indexOf(".") != -1) {
            noEvento(e);
            return false;
        }
        return true;
    } else if (teclaValida(kc)) {
        return true;
    } else {
        noEvento(e);
        return false;
    }
}
function onSalir()
{
    var f, i, dim = document.forms.length;
    var salio = false;
    for (i = 0; i < dim; ++i)
    {
        f = document.forms[i];
        if (null != f.sScript)
        {
            f.action = '../principal/menu.php';
            if (f.target)
                f.target = "_self";
            f.sScript.value = '';
            f.submit();
            salio = true;
            break;
        }
    }
    if (salio == false) {
        location.href = '../principal/menu.php';
    }
}
function onIrScript(script)
{
    var f, i, dim = document.forms.length;
    var salio = false;
    for (i = 0; i < dim; ++i)
    {
        f = document.forms[i];
        if (null != f.sScript)
        {
            f.action = '../principal/menu.php';
            if (f.target)
                f.target = "_self";
            f.sScript.value = script;
            f.submit();
            salio = true;
            break;
        }
    }
    if (salio == false) {
        location.href = '../principal/menu.php?sScript=' + script;
    }
}
function onLimpiarSalir(DirectorioTemporal)
{
    var xml = nuevoAjax();
    if (typeof DirectorioTemporal == "string" && getID(DirectorioTemporal))
    {
        var sDirTmp = getID(DirectorioTemporal).innerHTML;
        if (sDirTmp != '')
        {
            traerDatos(xml, "../escrituras/limpiar_tmp.php", "cpAyuda", {
                Formulario: "sDirTmp=" + sDirTmp
            });
        }
    }
    onSalir();
}
function limpiarDatos(f)
{
    if (typeof f == "undefined")
        f = getID("formAsistente");
    if (typeof f != "object")
        return;
    var i, o, dim = f.length;
    for (i = 0; i < dim; ++i)
    {
        o = f.elements[i];
        switch (o.type)
        {
            case 'text':
            case 'textarea':
                o.value = '';
                break;
            case 'select-one':
            case 'select-multiple':
                o.selectedIndex = 0;
                break;
            case 'textarea':
                o.selectedIndex = 0;
                break;
            case 'hidden':
                if (!o.getAttribute("borrar") || o.getAttribute("borrar") != 'si')
                    continue;
                o.value = "";
                break;
        }
    }
}
function inArray(aguja, pajar)
{
    var i, dim = pajar.length;
    for (i = 0; i < dim; ++i)
        if (aguja == pajar[i])
            return true;
    return false;
}
function formularioVacio(formulario, excepto)
{
    var f = getID(formulario);
    if (!f) {
        alert("Nombre de formulario inválido");
        return true;
    }
    var i, obj, dim = f.elements.length;
    var vacios = 0, elementos = 0, vExcepto = new Array();
    for (i = 0; i < dim; ++i)
    {
        obj = f.elements[i];
        if (obj.type == 'hidden')
            continue;
        if (excepto)
        {
            vExcepto = excepto.split(",");
            if (inArray(obj.type, vExcepto) || inArray(obj.name, vExcepto))
                continue;
        }
        //alert("["+obj.type+"] "+obj.name+"="+obj.value);
        ++elementos;
        if (obj.value == '')
            ++vacios;
    }
    if (elementos == vacios)
        return true;
    return false;
}
function navegador()
{
    if ((navigator.userAgent.indexOf("MSIE") != -1))
        return "explorer";
    else
        return "konqueror";
}

function esExplorer() {
    return (navigator.userAgent.indexOf("MSIE") !== -1);
}
function esExplorer6() {
    return (navigator.userAgent.indexOf("MSIE 6") !== -1);
}
function esExplorer7() {
    return (navigator.userAgent.indexOf("MSIE 7") !== -1);
}
wCont = 0;
function abrirVentana(wVen, url, Opc)
{
    var resX = xPantalla();
    var resY = yPantalla(true);

    if (!Opc || typeof Opc != "object")
        Opc = {};
    function porDefecto(p, v) {
        if (typeof Opc[p] == "undefined") {
            Opc[p] = v;
        }
    }
    ;
    porDefecto("denX", 8); /*valor >= 1, entre mas grande, mas pequeño el ancho de la ventana, se sugiere utilizar potencias de 2 {2, 4, 8, 16, 32, ...}*/
    porDefecto("igualMargen", true); /*te ubica un margen superior igual al margen izquierdo*/
    porDefecto("denY", 8); /*valor >= 1, entre mas grande, mas pequeña el alto de la ventana, se sugiere utilizar potencias de 2 {2, 4, 8, 16, 32, ...}*/
    if (Opc.denX < 1)
        Opc.denX = 1;
    if (Opc.denY < 1)
        Opc.denY = 1;
    if (typeof Opc["margenX"] != "undefined" && Opc.margenX < 1)
        Opc.margenX = 1;
    if (typeof Opc["margenY"] != "undefined" && Opc.margenY < 1)
        Opc.margenY = 1;

    if (null != wVen && typeof wVen.document == "object")
        wVen.close();
    var wEstilo = "menubar=0,toolbar=0,location=0,directories=0,scrollbars=1,status=0,resizable=1";
    var wNombre = 'wVen' + ++wCont;
    var left, top, width, height;
    if (typeof Opc["margenX"] == "undefined")
        left = Math.ceil(resX / Opc.denX);
    else
        left = Opc.margenX;
    if (typeof Opc["margenY"] == "undefined") {
        if (Opc.igualMargen)
            top = left;
        else
            top = Math.ceil(resY / Opc.denY);
    } else
        top = Opc.margenY;
    if (typeof Opc["ancho"] == "undefined")
        width = resX - 2 * left;
    else
        width = Opc.ancho;
    if (typeof Opc["alto"] == "undefined")
        height = resY - 2 * top;
    else
        height = Opc.alto;
    wEstilo += ",left=" + left + ",top=" + top + ",width=" + width + ",height=" + height;
    wVen = window.open(url, "_blank", wEstilo);
    if (null != wVen)
        wVen.focus();
    return wVen;
}
var wEsc;
function detalleEscritura(tipo_factura, numero_factura, tipo_escritura, numero_escritura, id_escritura)
{
    var url = "../escrituras/detalle_escritura.php?tipo_factura=" + tipo_factura + "&numero_factura=" + numero_factura + "&tipo_escritura=" + tipo_escritura + "&numero_escritura=" + numero_escritura + "&id_escritura=" + id_escritura;
    abrirVentana(wEsc, url);
}

var wExt;
function detalleBeneficencia(idEscritura)
{
    var url = "../escrituras/detalle_extranotariales.php?idEscritura=" + idEscritura;
    abrirVentana(wExt, url);
}
var wRem;
function detalleRemate(id_remate)
{
    var url = "../remates/detalle_remate.php?id_remate=" + id_remate;
    abrirVentana(wRem, url);
}
var wCon;
function detalleConciliacion(id_conciliacion)
{
    var url = "../conciliaciones/detalle_conciliacion.php?id_conciliacion=" + id_conciliacion;
    abrirVentana(wCon, url);
}
var wLiqRem;
function LiquidarRemate(id_remate)
{
//    location.href = "menu.php?sScript=../remates/liquidar_remate.php?id_remate=" + id_remate + "&nuevo=0";
    var parametros = "../remates/CotizacionLiquidacionRemates.html";
    var url = "../../modulos/principal/menujq.php?sScript=" + parametros + '&id=' + id_remate;
    location.href = url;

}

function LiquidarInsolvencia(id_insolvencia)
{
//    location.href = "menu.php?sScript=../remates/liquidar_remate.php?id_remate=" + id_remate + "&nuevo=0";
    var parametros = "../insolvencia/CotizacionLiquidacionInsolvencia.html";
    var url = "../../modulos/principal/menujq.php?sScript=" + parametros + '&id=' + id_insolvencia;
    location.href = url;

}

var wLiqCon;
function LiquidarConciliacion(id_conciliacion, securi)
{
    var parametros = "../conciliaciones/CotizarLiquidarConciliacion.html";
    var url = "../../modulos/principal/menujq.php?sScript=" + parametros + '&id=' + id_conciliacion;
    location.href = url;
}
var wRad;
function detalleRadicado(id_escritura)
{
    var url = "../escrituras/detalle_radicado.php?id_escritura=" + id_escritura;
    abrirVentana(wRad, url);
}
var wProv;
function detalleProvisiones(securi, anio, mes, quincena, tipo)
{
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&anio=" + anio + "&mes=" + mes + "&quincena=" + quincena + "&tabla=" + tipo), securi, 256));
    var url = "../../modulos/contabilidad/DetalleProvisiones.html?q=" + parametros;
    abrirVentana(wProv, url);
}
function detallarServicios(valor, copiasRegistro, mesNumero, mes, anio)
{
    var url = "../tareasmenu/detalle_servicios.php?id_registro=" + valor + "&copiasRegistro=" + copiasRegistro + "&mesNumero=" + mesNumero + "&mes=" + mes + "&anio=" + anio;
    abrirVentana(wRad, url);
}

var wRad;
function detalleConsolidado(fechaInicial, fechaFinal, idcuenta, nombreCuenta)
{
    var url = "../tareasmenu/valores_consolidados.php?fechaInicial=" + fechaInicial + "&fechaFinal=" + fechaFinal + "&idcuenta=" + idcuenta + "&nombreCuenta=" + nombreCuenta;
    abrirVentana(wRad, url);
}

var wCor;
function detalleFechaCorte(id_acta, fecha)
{
    var url = "../tareasmenu/detalle_acta_fecha_corte.php?id_acta=" + id_acta + "&fecha_corte=" + fecha;
    abrirVentana(wCor, url);
}



var wIns;
function detalleRadicadoInsolvencia(id_insolvenciaeconomica)
{
    var url = "../tareasmenu/detalle_radicado_insolvenciaeconomica.php?id_insolvenciaeconomica=" + id_insolvenciaeconomica;
    abrirVentana(wIns, url);
}
var wFac;
function detalleFactura(tipo_factura, numero_factura, id_usuario, dir, securi)
{
    var resX = xPantalla(); //window.screen.width;
    var left = Math.floor(resX / 5);
    var width = resX - left - 50;
    var resY = yPantalla(); //window.screen.height-100;
    var top = 40;
    var height = resY - top;
    var url;
    if (tipo_factura.indexOf("fe") != -1) {
        url = "../../modulos/facturacion2.0/escrituras/soporte/ImpresionFactura.php?tipo_factura=" + tipo_factura + "&numfactura=" + numero_factura;
    } else {
        var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("tipoFactura=" + tipo_factura + "&numeroFactura=" + numero_factura + "&iCopia=1&iIDUsuario=" + id_usuario), securi, 256));
        url = "../facturacion3.0/varios/ImprimirFacturaVarios.php?q=" + parametros;
    }

    //Anadido el 14 enero de 2013
    //a peticion Ing Grateful Montano
    //Si dir == 'noImprimir', entonces no se imprime por defecto
    if (dir === 'noImprimir') {
        url += "&iImprimir=0";
    } else {
        if (typeof dir != "undefined" && dir) {
            url = dir + url;
        }

        if (typeof imprimir != "undefined" && imprimir) {
            url += "&iImprimir=1";
        }
    }

    abrirVentana(wFac, url, {
        margenX: left,
        ancho: width,
        margenY: top,
        alto: height
    });


    /**
     *$iCopia=isset($_GET['iCopia'])?$_GET['iCopia']:"";
     if(empty($iCopia))
     $iCopia=isset($_POST['iCopia'])?$_POST['iCopia']:"";

     $iImprimir=isset($_GET['iImprimir'])?$_GET['iImprimir']:"";
     if(empty($iImprimir))
     $iImprimir=isset($_POST['iImprimir'])?$_POST['iImprimir']:"";
     **/
}
var wHojDat;
function hojaDatos(id_escritura)
{
    var url = "../escrituras/imprimir_escritura.php?id_escritura=" + id_escritura;
    abrirVentana(wHojDat, url, {
        denX: 16
    });
}
function hojaDatosConciliacion(id_conciliacion)
{
    //var url="../conciliaciones/hoja_datos_conciliacion.php?iIdConciliacion="+id_conciliacion;
    var url = "../conciliaciones/hoja_datos_conciliacion.php?id_conciliacion=" + id_conciliacion;
    abrirVentana(wHojDat, url, {
        denX: 16
    });
}
function hojaDatosRemates(id_remate, securi)
{
//    var url = "../remates/imprimir_remate.php?id_remate=" + id_remate;
//    abrirVentana(wHojDat, url, {
//        denX: 16
//    });
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&id_remate=" + id_remate), securi, 256));
    var url = "../../modulos/remates/HojaDatosRemate.php?q=" + parametros;
    abrirVentana(wProv, url);
}
function hojaDatosInsolvencia(id_insolvencia, securi)
{
//    var url = "../remates/imprimir_remate.php?id_remate=" + id_remate;
//    abrirVentana(wHojDat, url, {
//        denX: 16
//    });
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&id_insolvencia=" + id_insolvencia), securi, 256));
    var url = "../../modulos/insolvencia/HojaDatosInsolvencia.php?q=" + parametros;
    abrirVentana(wProv, url);
}
var wFlujo;
function detalleFlujo(id_escritura)
{
    var url = "../escrituras/recorrido_proceso.php?id=" + id_escritura;
    abrirVentana(wFlujo, url, {
        denX: 10
    });
}
var wCont;
function verControlLegal(id_escritura)
{
    var url = "../tareasmenu/control_legal_sin_bpm.php?id_escritura=" + id_escritura;
    abrirVentana(wCont, url, {
        denX: 50
    });
}
var wLiq;
function detalleLiquidacion(id_escritura)
{
    var url = "../escrituras/detalle_liquidacion.php?id=" + id_escritura;
    abrirVentana(null, url);
}
var wWork;
function VerWorkFlow(id_escritura)
{
    var url = "../escrituras/detalle_workflow.php?id_escritura=" + id_escritura;
    abrirVentana(wWork, url, {
        denX: 10
    });
}
var wObs;
function detalleObservacion(id_escritura)
{
    var url = "../escrituras/detalle_observacion.php?id_escritura=" + id_escritura;
    abrirVentana(wObs, url);
}
var wObsF;
function detalleObservacionFlujo(id_escritura)
{
    var url = "../escrituras/observaciones_flujo.php?id_escritura=" + id_escritura;
    abrirVentana(wObsF, url);
}
var wDIF;
function VerDetallesIngresosRete(idempleado, fechainicial, fechafinal)
{
    var url = "../tareasmenu/DetalleIngresosyRetenciones.php?accion=101&idempleado=" + idempleado + "&fechainicial=" + fechainicial + "&fechafinal=" + fechafinal;
    abrirVentana(wDIF, url);
}
var wOid;
function detalleOidFlujo(oid, org)
{
    var url = "../escrituras/observaciones_flujo.php?vsig=" + oid + "&org=" + org;
    abrirVentana(wOid, url, {
        alto: 400
    });
}
var wImg;
function imagenEscritura(numero_escritura, anio_escritura)
{
    var url = "../escrituras/imagen_escritura.php?numero_escritura=" + numero_escritura + "&anio_escritura=" + anio_escritura;
    abrirVentana(wImg, url);
}
var wBien;
function detalleInmueble(id_escritura)
{
    var url = "../escrituras/detalle_inmuebles.php?id_escritura=" + id_escritura;
    abrirVentana(wBien, url);
}
var wDoc;
function detalleDocumento(id_escritura)
{
    var url = "../escrituras/detalle_documentos.php?id_escritura=" + id_escritura;
    abrirVentana(wDoc, url);
}
var wBio;
function detalleBiosigno(id_escritura)
{
    var url = "../escrituras/consulta_biometria.php?id_escritura=" + id_escritura;
    abrirVentana(wBio, url);
}
var wMod;
function detalleModelo(id_modelo)
{
    var url = "../escrituras/detalle_modeloescritura.php?id_modelo=" + id_modelo;
    abrirVentana(wMod, url);
}
var wLav;
function detalleLavado(tipo_documento, id_documento, mes, anio, excluir)
{
    var url = "../escrituras/detalle_lavadoactivos.php?tipo_documento=" + tipo_documento + "&id_documento=" + id_documento + "&mes=" + mes + "&anio=" + anio + "&excluir=" + e
    abrirVentana(wLav, url);
}
var wDec;
function detalleDeclaracion(consecutivo, fechahora)
{
    var url = "../declaraciones/detalle_declaracion.php?consecutivo=" + consecutivo + "&fechahora=" + fechahora;
    abrirVentana(wDec, url);
}
var wFir;
function detalleFirma(indice)
{
    var url = "../firmas/detallesfirma.php?cod=" + indice;
    abrirVentana(wFir, url);
}
var wCer;
function detalleCertificadoRetencion(certificado)
{
    var url = "../facturacion2.0/escrituras/soporte/ImpresionRetencion.php?certificado=" + certificado;
    abrirVentana(wCer, url);
}
function detalleCertificadoTimbre(certificado)
{
    var url = "../facturacion2.0/escrituras/soporte/ImpresionTimbre.php?certificado=" + certificado;
    abrirVentana(wCer, url);
}
var wForPag;
function detalleFormaPago(tipo_factura, numero_factura)
{
    var url = "../facturacion/ver_forma_de_pago.php?numfactura=" + numero_factura + "&sTipoFactura=" + tipo_factura;
    abrirVentana(wForPag, url, {
        alto: 350
    });
}
var wRecCaj;
function detalleReciboCaja(id_recibocaja, securi)
{
    var url = "";
    if (typeof securi != "undefined" && securi) {
        var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=101&idReciboCaja=" + id_recibocaja), securi, 256));
        url = "../../modulos/cartera/DetallesRecaudoCartera.php?q=" + parametros;
    } else {
        url = "../facturacion/detalle_recibocaja.php?id_recibocaja=" + id_recibocaja;
    }
    abrirVentana(wRecCaj, url);
}
function reciboCajaCartera(id_recibocaja)
{
    var url = "../cartera/ImpresionReciboCaja.php?id_recibocaja=" + id_recibocaja + "&imprimir=1";
    //abrirVentana(wRecCaj,url);
    location.href = url;
}
function reciboCajaEscritura(id_recibocaja, copia)
{
    var url = "../facturacion2.0/escrituras/soporte/ImpresionReciboCaja.php?rc=" + id_recibocaja + "&copia=" + copia;
    location.href = url;
    //abrirVentana(wRecCaj,url);
}
var wActDep;
function detalleActaDeposito(id_acta, sesion, dir)
{
    var url = "../facturacion/ver_acta_deposito.php?iIdActa=" + id_acta + "&iIDUsuario=" + sesion;
    if (typeof dir != "undefined")
        url = dir + url;
    abrirVentana(wActDep, url);
}
var vDet;
function VerDetalles(tipo, serial) {
    if (tipo === 1) {
        var url = '../registro/ver_nacimiento.php?iCerrar=1&iIndicativoSerial=' + serial + '';
    } else if (tipo === 2) {
        var url = '../registro/ver_matrimonio.php?iCerrar=1&iIndicativoSerial=' + serial + '';
    } else if (tipo === 3) {
        var url = '../registro/ver_defuncion.php?iCerrar=1&iIndicativoSerial=' + serial + '';
    }
    abrirVentana(vDet, url);
}
var vImg;
function verImagen(tipoRegistro, iIndicativoSerial) {
    var url = '../registro/ver_imagen.php?iTipoRegistro=' + tipoRegistro + '&iIndicativoSerial=' + iIndicativoSerial;
    abrirVentana(vImg, url);
}
var VisorImagen;
function verVisor(rutaFichero, nombreFichero, tituloInforme)
{
    var url = "../../visor/index.php?rutaFichero=" + rutaFichero + "&nombreFichero=" + nombreFichero + "&tituloInforme=" + tituloInforme; //navegador();
    abrirVentana(VisorImagen, url);
}
var wImp;
function ImprimirCertificado(sArchivo, iIndicativoSerial, iMotivo, Motivo, abrirVent, solicitudDe)
{
    if (abrirVent == undefined || abrirVent == null) {
        abrirVent = true;
    }
    var url = '../registro/imprimir_certificado_nacimiento.php?sArchivo=' + sArchivo + '&iConsecutivo=' + iIndicativoSerial + '&origen=consulta&iIdMotivo=' + iMotivo + '&sMotivo=' + Motivo + '&abrirVent=' + abrirVent + '&solicitudDe=' + solicitudDe;
    abrirVentana(wImp, url);
}
var wCli;
function detalleCuentaCredito(id_cliente)
{
    var url = "../cartera/datos_kardex_car.php?id_cliente=" + id_cliente;
    abrirVentana(wCli, url);
}
var wNot;
function detalleNotasCredito(consecutivo)
{
    var url = "../cartera/detalle_notascredito_car.php?consecutivo=" + consecutivo;
    abrirVentana(wNot, url);
}
var wCCob;
function detalleCuentaCobro(identificador, securi)
{
    var url = "../cartera/detalles_ccobro.php?identificador=" + identificador;
    if (securi !== "") {
        var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=101&identificador=" + identificador + "&esCopia=t"), securi, 256));
        url = "../cartera/DetallesCuentaCobro.php?q=" + parametros;
    }
    abrirVentana(wCCob, url);
}
var wNot;
function detalleNotaCartera(consecutivo)
{
    var url = "../cartera/detalles_notascredito_car.php?consecutivo=" + consecutivo;
    abrirVentana(wNot, url);
}
var wSol;
function detalleSolicitudServicio(id_solicitud)
{
    var url = "../facturacion/detalle_solicitudservicio.php?id_solicitud=" + id_solicitud;
    abrirVentana(wSol, url);
}
var wFPCC;
function imprimirSolicitud(id_solicitud, detalleSolicitud)
{
    var url = "../facturacion2.0/varios/soporte/ImpresionSolicitud.php?idSolicitudImprimir=" + id_solicitud + "&detalleSolicitud=" + detalleSolicitud;
    abrirVentana(wFPCC, url, {
        denX: 10,
        denY: 20
    });
}
var wFACC;
function facturasAgrupadasCuentaCobro(identificador)
{
    var url = "../cartera/links_consultaccobro_car.php?identificador=" + identificador;
    abrirVentana(wFACC, url);
}
var wFPCC;
function facturasPendientesCuentaCredito(id_cliente)
{
    var url = "../cartera/pendientes_facturas_cuentacredito.php?&id_cliente=" + id_cliente;
    abrirVentana(wFPCC, url, {
        denX: 10,
        denY: 20
    });
}
var wCCP;
function ccobrosPendientesCuentaCredito(id_cliente, censo)
{
    var url = "../cartera/pendientes_cobros_cuentacredito.php?id_cliente=" + id_cliente + (typeof censo != "undefined" ? "&censo=1" : "");
    abrirVentana(wCCP, url, {
        denX: 4
    });
}
var wSalF;
function detalleSaldoFactura(tipo_factura, numero_factura, id_cliente)
{
    var url = "../cartera/detalle_saldo_factura.php?tipo_factura=" + tipo_factura + "&numero_factura=" + numero_factura + "&id_cliente=" + id_cliente;
    abrirVentana(wSalF, url, {
        denX: 16,
        denY: 4,
        igualMargen: false
    });
}
var wSalCC;
function detalleSaldoCuentaCobro(identificador)
{
    var url = "../cartera/detalle_saldo_ccobro.php?identificador=" + identificador;
    abrirVentana(wSalCC, url, {
        denX: 16,
        denY: 4,
        igualMargen: false
    });
}
var wSalK;
function detalleSaldoCuentaCredito(id_cliente)
{
    var url = "../cartera/detalle_saldo_kardex.php?id_cliente=" + id_cliente;
    abrirVentana(wSalK, url, {
        denX: 16,
        denY: 4,
        igualMargen: false
    });
}
var wRem;
function detalleRemate(id_remate, securi)
{
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&id_remate=" + id_remate), securi, 256));
    var url = "../../modulos/remates/DetalleRemate.php?q=" + parametros;
    abrirVentana(wProv, url);
}

function detalleInsolvencia(id_insolvencia, securi)
{
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&id_insolvencia=" + id_insolvencia), securi, 256));
    var url = "../../modulos/insolvencia/DetalleInsolvencia.php?q=" + parametros;
    abrirVentana(wProv, url);
}
var wCon;
function detalleConciliacion(id_conciliacion, securi)
{
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&id_conciliacion=" + id_conciliacion + '&securi=' + securi), securi, 256));
    var url = "../../modulos/conciliaciones/DetalleConciliacion.php?q=" + parametros;
    abrirVentana(wProv, url);
}
var wCom;
function detallesComprobante(numero_documento, id_tipo, fecha_comprobante, est, norma, securi)
{
    var parametros = encodeURIComponent(Aes.Ctr.encrypt(Base64.encode("accion=100&numero_documento=" + numero_documento + "&id_tipo=" + id_tipo + "&fecha_comprobante=" + fecha_comprobante + "&est=" + est + "&id_configuracion_niif=" + norma + '&securi=' + securi), securi, 256));
    var url = "../contabilidad/VerComprobante.php?q=" + parametros;
    abrirVentana(wDec, url);
}

function detalleComprobante(numero_documento, id_tipo, fecha_comprobante, est, norma)
{
    var url = "../contabilidad/ver_comprobante.php?numero_documento=" + numero_documento + "&id_tipo=" + id_tipo + "&fecha_comprobante=" + fecha_comprobante + "&est=" + est + "&id_configuracion_niif=" + norma;
    abrirVentana(wDec, url);
}
var wRegDef;
function detalleDefuncion(indicativo_serial)
{
    var url = "../registro/ver_defuncion.php?iIndicativoSerial=" + indicativo_serial;
    abrirVentana(wRegDef, url);
}
var wSalCaj;
function detalleSalidaCaja(id_recibo, iImprimir)
{
    var url = "../facturacion/imprimir_salida_caja.php?iIdRecibo=" + id_recibo + "&iImprimir=" + iImprimir + "&iCerrar=0&iCopia=1";
    abrirVentana(wSalCaj, url, {
        denX: 10
    });
}
function xScroll()
{
    if (document.body && document.body.scrollLeft)
        return  document.body.scrollLeft;
    else if (document.documentElement && document.documentElement.scrollLeft)
        return document.documentElement.scrollLeft;
    else if (window.scrollX)
        return window.scrollX;
    else
        return 0;
}
function yScroll()
{
    if (document.body && document.body.scrollTop)
        return  document.body.scrollTop;
    else if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    else if (window.scrollY)
        return  window.scrollY;
    else
        return 0;
}
function xPantalla(disponible)
{
    if (!disponible)
    {
        if (screen && typeof screen.width != "undefined")
            return  screen.width;
        else if (window.screen && typeof window.screen.width != "undefined")
            return window.screen.width;
    } else
    {
        if (screen && typeof screen.availWidth != "undefined")
            return  screen.availWidth;
        else if (window.screen && typeof window.screen.availWidth != "undefined")
            return window.screen.availWidth;
    }
    return false;
}
function yPantalla(disponible)
{
    if (!disponible)
    {
        if (screen && typeof screen.height != "undefined")
            return  screen.height;
        else if (window.screen && typeof window.screen.height != "undefined")
            return window.screen.height;
    } else
    {
        if (screen && typeof screen.availHeight != "undefined")
            return  screen.availHeight;
        else if (window.screen && typeof window.screen.availHeight != "undefined")
            return window.screen.availHeight;
    }
    return false;
}
function xDocumento()
{
    if (typeof document.width != "undefined")
        return document.width;
    else if (document.body && typeof document.body.clientWidth != "undefined")
    {
        return document.body.clientWidth;
    }
    return false;
}
function yDocumento()
{
    if (typeof document.height != "undefined")
        return document.height;
    else if (document.body && typeof document.body.clientHeight != "undefined")
    {
        return document.body.clientHeight;
    }
    return false;
}
function xVentana(disponible)
{
    if (!disponible)
    {
        if (typeof window.width != "undefined")
            return window.width;
        if (typeof window.outerWidth != "undefined")
            return window.outerWidth;
        else if (document.body && typeof document.body.clientWidth != "undefined")
        {
            return document.body.clientWidth;
        }
    } else
    {
        if (typeof window.innerWidth != "undefined")
            return window.innerWidth;
        else if (document.body && typeof document.body.clientWidth != "undefined")
        {
            return document.body.clientWidth;
        } else
            return xDocumento();
    }
    return false;
}
function yVentana(disponible)
{
    if (!disponible)
    {
        if (typeof window.height != "undefined")
            return window.height;
        if (typeof window.outerHeight != "undefined")
            return window.outerHeight;
        else if (document.body && typeof document.body.clientHeight != "undefined")
        {
            return document.body.clientHeight;
        }
    } else
    {
        if (typeof window.innerHeight != "undefined")
            return window.innerHeight;
        else if (document.body && typeof document.body.clientHeight != "undefined")
        {
            return document.body.clientHeight;
        }
    }
    return false;
}
/*posicion X del raton*/
function xRaton(e)
{
    if (!e)
        e = window.event;
    try
    {
        return e.clientX + document.body.scrollLeft; // + document.documentElement.scrollLeft /**/
    } catch (excepcion1)
    {
        try
        {
            return e.clientX + window.scrollX; /*Para NestCape*/
        } catch (excepcion2)
        {
            return null;
        }
    }
}
/*posicion Y del raton*/
function yRaton(e)
{
    if (!e)
        e = window.event;
    try
    {
        return e.clientY + document.body.scrollTop; // + document.documentElement.scrollTop /**/
    } catch (excepcion1)
    {
        try
        {
            return e.clientY + window.scrollY; /*Para NestCape*/
        } catch (excepcion2)
        {
            return null;
        }
    }
}
function verAyuda(e, sAyuda)
{
    var cpAyuda;
    if (!(cpAyuda = getID("cpAyuda")))
        return;
    var x, y;
    if (!e)
        e = window.event;
    x = xRaton(e);
    y = yRaton(e);
    x += 20;
    y -= 15;
    cpAyuda.style.visibility = 'visible';
    cpAyuda.style.left = x;
    cpAyuda.style.top = y;
    cpAyuda.innerHTML = sAyuda;
}
/*esta funcion es casi inutil y solo sirve para workflow*/
function verAyudaURL(e, url, capa)
{
    var cpAyuda;
    if (!(cpAyuda = getID(capa)))
        return;
    //var x, y;
    //if(! e) e=window.event;
    //x=xRaton(e); y=yRaton(e);
    //x += 20; y -= 15;
    cpAyuda.style.visibility = 'visible';
    cpAyuda.style.left = 300 - 2 * 16;
    cpAyuda.style.top = 16;
    traerDatos(false, url, capa,
            {
                Formulario: false,
                Metodo: "POST",
                Consultando: false,
                Paginando: false
            });
}
function esCapaOculta(capa)
{
    var cp;
    if (!(cp = getID(capa)))
        return true;
    return (cp.style.visibility == 'hidden' || cp.style.display == 'none');
}
function ocultarCapa(capa)
{
    var cp;
    if ((cp = getID(capa)))
        cp.style.visibility = 'hidden';
}
function mostrarCapa(capa)
{
    var cp;
    if ((cp = getID(capa)))
        cp.style.visibility = 'visible';
}
function ocultarAyuda() {
    ocultarCapa("cpAyuda");
}
window.onerror = function (msj, url, l)
{
    var i, dim = document.forms.length;
    var txt = "Lo sentimos, SIGNO! ha detectado un error JavaScript" +
            " en el procedimiento que intenta ejecutar.\n\n";
    txt += "Le rogamos comunicar al soporte tecnico la siguiente informacion:\n\n\n";
    txt += "Url: " + url + "\n";
    for (i = 0; i < dim; ++i)
    {
        if (document.forms[i].name)
            txt += "Formulario: " + document.forms[i].name + "\n";
        if (document.forms[i].sScript)
            txt += "Script: " + document.forms[i].sScript.value + "\n";
    }
    txt += "Linea: " + l + "\n";
    txt += "Error: \"" + msj + "\"\n\n\n";
    return true;
}
function efectoEnlace(cp)
{
    if (!cp || !(cp = getID(cp)))
        return;
    var antes = cp.className;
    var nuevo = cp.className + " enlaceefecto";
    cp.className = nuevo;
    /*De esta forma quedan inutilizados estos dos eventos*/
    cp.onmouseover = function () {
        cp.className = nuevo;
    };
    cp.onmouseout = function () {
        cp.className = antes;
    };
}
function getCookie(name)
{
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length)))
    {
        return null;
    }
    if (start == -1)
        return null;
    var end = document.cookie.indexOf(';', len);
    if (end == -1)
        end = document.cookie.length;
    return (document.cookie.substring(len, end));
}
function setCookie(name, value, expires, path, domain, secure)
{
    var today = new Date();
    today.setTime(today.getTime());
    if (expires)
    {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) +
            ((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
            ((path) ? ';path=' + path : '') +
            ((domain) ? ';domain=' + domain : '') +
            ((secure) ? ';secure' : '');
}
function deleteCookie(name, path, domain)
{
    if (getCookie(name))
        document.cookie = name + '=' +
                ((path) ? ';path=' + path : '') +
                ((domain) ? ';domain=' + domain : '') +
                ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}
var wMin;
function verMinuta(id_escritura) {

    var resX = xPantalla(); //window.screen.width;
    var left = Math.floor(resX / 5);
    var width = resX;
    var resY = yPantalla(); //window.screen.height-100;
    var top = 40;
    var height = resY;
    var url = "../escrituras/minutas/revision.php?id_escritura=" + id_escritura;
    abrirVentana(wMin, url, {margenX: left, ancho: width, margenY: top, alto: height});

}
function nuevaPestana(url)
{
    var i, e, f = document.createElement("form");
    f.setAttribute("method", "POST");
    f.setAttribute("action", url);
    f.setAttribute("target", "_blank");
    var variables = url.substring(url.indexOf('?') + 1, url.length);
    var vVariables = variables.split('&');
    var dim = vVariables.length;
    var eIndex, eName, eValue;
    for (i = 0; i < dim; ++i)
    {
        eIndex = vVariables[i].indexOf('=');
        eName = vVariables[i].substring(0, eIndex);
        eValue = vVariables[i].substring(eIndex + 1, vVariables[i].length);
        e = document.createElement("input");
        e.setAttribute("type", "hidden");
        e.setAttribute("name", eName);
        e.setAttribute("value", eValue);
        f.appendChild(e);
    }
    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
}
function forzarEvento(obj, evento)
{
    if (typeof obj == "string")
        obj = getID(obj);
    if (!obj)
        return false;
    if (obj.fireEvent)
    {
        obj.fireEvent("on" + evento);
    } else
    {
        var clickEvent = window.document.createEvent("MouseEvent");
        clickEvent.initEvent(evento, false, true);
        obj.dispatchEvent(clickEvent);
    }
}
function onEnter(e, Funcion)
{
    if (!e)
        e = window.event;
    if (typeof e == "undefined")
        return;
    var k = keyCode(e);
    if (typeof k == "undefined")
        return;
    if (k != 13)
        return;
    if (typeof Funcion == "undefined")
    {
        if (typeof onBuscar != "undefined")
        {
            Funcion = function () {
                onBuscar(true);
            }
        } else
            Funcion = function () {
            };
    }
    if (typeof Funcion == "string")
        eval(Funcion);
    else
        Funcion();
}
function cambioSelectTipoDocumento(o)
{
    if (typeof o == "undefined")
        return;
    var cpA = getID("celdaApellidos");
    var cpN = getID("celdaNombre");
    if (!(cpA && cpN))
        return;
    if (typeof o.selectedIndex == "undefined" || o.selectedIndex == -1)
        return;
    if (o[o.selectedIndex].getAttribute("aplica_persona") == 'f')
    {
        cpA.innerHTML = "NOMBRE EMPRESA";
        cpN.innerHTML = "";
    } else
    {
        cpA.innerHTML = "APELLIDOS";
        cpN.innerHTML = "NOMBRE";
    }
}
function mostrarOcultarBusquedaAvanzada(cp)
{
    if (typeof cp == "undefined")
        cp = "tablaBusquedaAvanzada";
    if (!getID(cp))
        return;
    if (esCapaOculta(cp))
        getID(cp).style.display = "inline";
    else
        getID(cp).style.display = "none";
    if (getID("formAsistente") && typeof getID("formAsistente").dpBusqAvanz != "undefined")
    {
        getID("formAsistente").dpBusqAvanz.value = getID(cp).style.display;
    }
}
function onChangeFormaPago(obj)
{
    var o = obj[obj.selectedIndex];
    var f = obj.form;
    f.dpCheque.value = getID("cpCheque1").style.display = getID("cpCheque2").style.display = (o.getAttribute("cheque") && o.getAttribute("cheque") == 't') ? 'table-row' : 'none';
    f.dpCredito.value = getID("cpCredito").style.display = (o.getAttribute("credito") && o.getAttribute("credito") == 't') ? 'table-row' : 'none';
    f.dpActa.value = getID("cpAnticipo").style.display = (o.getAttribute("anticipo") && o.getAttribute("anticipo") == 't') ? 'table-row' : 'none';
}
function alInstante(v1, v2)
{
    if (MV_TMP != v1 && v1 != "" && v1 == v2)
        onBuscar(false);
}
function onChangeOpcionPDF(o, id_script)
{
    var f = o.form;
    var id_opcion = o.name;
    var valor = "";
    switch (o.type)
    {
        case "select-one":
            valor = o[o.selectedIndex].value;
            break;
        case "checkbox":
            valor = (o.checked == true) ? 1 : 0;
            break;
        default:
            valor = o.value;
            break;
    }
    var variables = "id_opcion=" + o.name;
    variables += "&valor=" + valor;
    variables += "&id_script=" + id_script;
    traerDatos(false, "../../modulos/general/pdf_changeopcion_ajax.php", "cpChangeOpcionPDF",
            {
                Formulario: variables,
                Metodo: "POST",
                Procesando: false
            });
}
function onChangeOpcionESCP(o, id_script)
{
    var f = o.form;
    var id_opcion = o.name;
    var valor = "";
    switch (o.type)
    {
        case "select-one":
            valor = o[o.selectedIndex].value;
            break;
        default:
            valor = o.value;
            break;
    }
    var variables = "id_opcion=" + o.name;
    variables += "&valor=" + valor;
    variables += "&id_script=" + id_script;
    traerDatos(false, "../general/escp_changeopcion_ajax.php", "cpChangeOpcionESCP",
            {
                Formulario: variables,
                Metodo: "POST",
                Procesando: false
            });
}
function verOpcPDF(f)
{
    if (typeof f == "string")
        f = getID(f);
    else if (typeof f == "undefined")
    {
        f = getID("formAsistente");
    }
    var cp = getID("cpOpcPDF");
    if (!f || !cp || !f.impPDF)
        return;
    if (!f.impPDF.checked)
    {
        ocultarCapa("cpOpcPDF");
        return;
    } else
    {
        if (getID("cpOpcESCP") && !esCapaOculta("cpOpcESCP"))
            ocultarCapa("cpOpcESCP");
        mostrarCapa("cpOpcPDF");
    }

    cp.style.overflow = "auto";
    cp.style.width = "430px";
    /*cp.style.maxHeight = "300px";
     */
    traerDatos(false, "../../modulos/general/pdf_opciones_ajax.php", "cpOpcPDF",
            {
                Formulario: f.name ? f.name : f.id,
                Metodo: "POST",
                Procesando: true
            });
}
function verOpcESCP(f)
{
    if (typeof f == "string")
        f = getID(f);
    else if (typeof f == "undefined")
    {
        f = getID("formAsistente");
    }
    var cp = getID("cpOpcESCP");
    if (!f || !cp || !f.impESCP)
        return;
    if (!f.impESCP.checked)
    {
        ocultarCapa("cpOpcESCP");
        return;
    } else
    {
        if (getID("cpOpcPDF") && !esCapaOculta("cpOpcPDF"))
            ocultarCapa("cpOpcPDF");
        mostrarCapa("cpOpcESCP");
    }

    cp.style.overflow = "auto";
    cp.style.width = "430px";
    /*cp.style.maxHeight = "300px";
     */
    traerDatos(false, "../general/escp_opciones_ajax.php", "cpOpcESCP",
            {
                Formulario: f.name ? f.name : f.id,
                Metodo: "POST",
                Procesando: true
            });
}
function onImprimirESCP(e)
{
    if (!e)
        e = window.event;
    var impESCP = getID("impESCP");
    if (!impESCP || !impESCP.form)
    {
        alert("Imposible imprimir. No se pudo identificar el formulario");
        return;
    }
    var f = impESCP.form;
    if (!f.archivoESCP || f.archivoESCP.value == "")
    {
        alert("Imposible imprimir. No se pudo identificar el archivo de impresion");
        return;
    }
    if (!getID("cpErroresESCP"))
    {
        alert("Imposible imprimir. No se pudo identificar la capa de mensajes de impresion.");
        return;
    }
    if (!getID("cpErroresESCPinterno"))
    {
        alert("Imposible imprimir. No se pudo identificar la capa interna de mensajes de impresion.");
        return;
    }
    if (window.setTimeout)
    {
        getID("cpErroresESCP").style.visibility = "visible";
        getID("cpErroresESCP").style.left = xRaton(e) - 100;
        getID("cpErroresESCP").style.top = yRaton(e) - 100;
        if (typeof getID("cpErroresESCP").style.maxWidth != "undefined")
        {
            getID("cpErroresESCP").style.maxWidth = "600";
            getID("cpErroresESCP").style.overflow = "auto";
        }
    }
    var variables = "archivoESCP=" + f.archivoESCP.value;
    variables += "&nombre_script=" + f.nombre_script.value;
    traerDatos(false, "../general/escp_imprimir_ajax.php", "cpErroresESCPinterno",
            {
                Formulario: variables,
                Metodo: "POST",
                MensajePersonalizado: "&nbsp;&nbsp;Enviando impresi&oacute;n...",
                Funcion: function () {
                }
            });
}
function onCancelarPDF(capa)
{
    traerDatos(false, "../general/pdf_changeopcion_ajax.php", "spanKillPidPDF",
            {
                Formulario: "cancelarPDF=si",
                Metodo: "POST",
                Funcion: function ()
                {
                    if (getID(capa))
                    {
                        var cancelado = "<span class='nowrap negrilla rojo'><img class='img' id='imgPDFx' src='../../GIFS/escrituracion/fabrica/pdfx.gif' border='0' width='22px' height='22px' /> [Cancelado]</span>";
                        getID(capa).innerHTML = cancelado;
                        window.setTimeout("if(getID(\"" + capa + "\")) getID(\"" + capa + "\").innerHTML = \"" + cancelado + "\";", 500);
                        window.setTimeout("if(getID(\"" + capa + "\")) getID(\"" + capa + "\").innerHTML = \"" + cancelado + "\";", 1000);
                        window.setTimeout("if(getID(\"" + capa + "\")) getID(\"" + capa + "\").innerHTML = \"" + cancelado + "\";", 2000);
                    }
                }
            });
}
function newTag(tag) {
    return document.createElement(tag);
}
function newText(texto) {
    return document.createTextElement(texto);
}
function addHijo(padre, hijo) {
    return padre.appendChild(hijo);
}
function getPadre(hijo) {
    return hijo.getParentNode;
}
function deleteHijo(padre, hijo) {
    return padre.removeChild(hijo);
}
/**
 * CSantos:  a cada uno de los componentes del objeto
 * @param obj object <br/> string donde se insertaran los <br>
 */
function unescapeObjeto(obj) {
    for (key in obj) {
        if (typeof obj[key] == "object")
            key = unescapeObjeto(obj[key]);
        else
            obj[key] = (obj[key]);
    }
    return obj;
}
/**
 * CSantos: dar br con un tamanio limite de caracteres por linea 'Cantidad'
 * @param texto string <br/> string donde se insertaran los <br>
 * @param cantidad init <br/> cantidad de caracteres por linea
 * @param br string <br/> Tipo de salto de linea a dar
 * @return Revuelve el texto con br incluidos
 */
function darBr(texto, cantidad, br) {
    if (typeof br === 'undefined' || br === null)
        br = "<br/>";
    texto = texto.replace(/[ ]+/gi, " ");
    var arrayTexto = texto.split(" ");
    var contador = 0;
    var palabra = null;
    var rta = "";
    for (var i = 0; i < arrayTexto.length; i++) {
        palabra = arrayTexto[i];
        contador += (palabra.length * 1);
        if (contador < cantidad) {
            rta += palabra + " ";
        } else if (contador == cantidad) {
            rta += palabra + br;
        } else {
            rta = trim(rta) + br;
            --i;
            contador = 0;
        }
    }
    return rta;
}

/**
 * CSantos: Funcion de validacion de numericos
 * @param objEvaluados array <p>
 * Recibe un array de objeto(s). cada obj debe conterner un 'valor' y un 'msjError'<br/>Ejm: {valor:'1',msjError:'El numero de id'}
 * </p>
 * @return Si encuentra No Numericos Retorna un string en HTML con los msjError de los NotNumeric<br/>Sino retorna vacio ""
 */
function ErrorIsNotInteger(objEvaluados) {
    var detener = false;
    var vEntero = null;
    var arrayErrores = [];
    var numberIs = function (valor) {
        valor *= 1;
        if (typeof valor === 'number' && isFinite(valor)) {
            valor += "";
            var ubic = valor.indexOf(".");
            if (ubic == "-1")
                return true;
            else
                return false;
        } else
            return false;
    };
    for (key in objEvaluados) {
        vEntero = (objEvaluados[key].valor != "") ? numberIs(objEvaluados[key].valor) : true;
        if (vEntero === false) {
            if (detener === false)
                detener = true;
            arrayErrores.push(objEvaluados[key].msjError + " debe ser un N&uacute;mero Entero.");
        }
    }
    if (arrayErrores.length > 0)
        return "- " + arrayErrores.join("<br/>- ");
    else
        return "";
}
/**
 * CSantos: Funcion de validacion de numero: puede ser con Decimal o Negativo
 * @param num string <p>
 * Recibe un string, con el numero que se desea evaluar
 * @param conDecimal boolean <p>
 * Condicion para validar si el numero puede contener decimales o no
 * @param conNegativo boolean <p>
 * Condicion para validar si el numero puede ser negativo o no
 * </p>
 * @return Retorna FALSE o TRUE segun validaciones
 */
function esNumero(num, conDecimal, conNegativo) {
    num = trim(num);
    if (num == "")
        return false;
    if (typeof conDecimal === 'undefined' || conDecimal === null)
        conDecimal = false;
    if (typeof conNegativo === 'undefined' || conNegativo === null)
        conNegativo = false;
    var o = num * 1;
    if (typeof o === 'number' && isFinite(o)) { // Es numero, sea decimal o negativo
        if (conDecimal === false) {  // Si el numero tiene decimales, retornar false
            var ubic = num.indexOf(".");
            if (ubic != "-1") // Encontro un punto
                return false;
        }
        if (conNegativo === false) { // Si el numero es negativo, retornar false
            if (num.charAt(0) == '-') // el primer caracter es un menos
                return false;
        }
        return true;
    }
    return false;
}

/**
 * CSantos: Funcion de validacion de cantidad de caracteres en un texto
 * Todos los parametros de entrada son obligatorios
 * @param txt string <p>
 * Recibe el string a evaluar
 * @param minimo entero <p>
 * Cantidad minima de caracteres
 * @param maximo entero <p>
 * Cantidad maxima de caracteres
 * @param descripcion entero <p>
 * identificador del texto evaluado. ejm: 'El nombre de la persona'
 * </p>
 * @return Retorna TRUE si esta dentro del intervalo, o string de la forma:
 * '<b>descripcion</b> debe tener entre <b>minimo</b> y <b>maximo</b> caracteres.'
 */
function validaCantidadCaracteres(txt, minimo, maximo, descripcion) {
    txt = trim(txt);
    if (txt.length < minimo || txt.length > maximo) {
        return descripcion + " debe contener entre " + minimo + " y " + maximo + " caracteres.";
    }
    return true;
}
/**
 * JuanSebastianMorales: Consulta a detalles de mejor cliente
 * Solo es obligatorio los parametros de: tipoDocuemnto, idDocumento, posicion
 * @param tipoDocumento<p>
 * Tipo del documento del cliente
 * @param idDocumento <p>
 * Identificacion del cliente
 * @param posicion <p>
 * Posicion del cliente en la tabla
 * @param fechaInicio <p>
 * Filtro de fecha inical
 * @param fechaFin <p>
 * Filtro de fecha final
 * @param tipoDetalle <p>
 * Indica el tipo de informe del cual se estan consultando los detalles 1=Escrituras legalizadas, 2=Derechos notariales
 */
function ventanaDetalleMejorCliente(tipoDocumento, idDocumento, posicion, fechaInicio, fechaFin, tipoDetalle) {
    var ventana = null;
    var UrlLink = '../tareasmenu/detalles_estadistica_clientes_escrituras.php?tipoDocumento=' + tipoDocumento +
            '&idDocumento=' + idDocumento +
            '&posicion=' + posicion +
            '&fechaInicio=' + fechaInicio +
            '&fechaFin=' + fechaFin +
            '&tipoDetalle=' + tipoDetalle;
    var windowNameLink = 'Recorrido_Proceso';
    var resX = window.screen.width;
    var left = resX / 8;
    var width = resX - 2 * left;
    var resY = window.screen.height - 100;
    var top = left;
    var height = resY - 2 * top;
    var windowStyleLink = 'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height + ',menubar=0,toolbar=0,location=0,directories=0,scrollbars=1,status=1,resizable=1';
    ventana = window.open(UrlLink, windowNameLink, windowStyleLink);
    ventana.focus();
}
/**
 * JuanSebastianMorales: Consulta a detalles de mejor modelo contrato
 * Solo es obligatorio los parametros de: idModelo, posicion
 * @param idModelo <p>
 * Identificacion del cliente
 * @param posicion <p>
 * Posicion del modelo en la tabla
 * @param fechaInicio <p>
 * Filtro de fecha inical
 * @param fechaFin <p>
 * Filtro de fecha final
 * @param tipoDetalle <p>
 * Indica el tipo de informe del cual se estan consultando los detalles 1=Escrituras legalizadas, 2=Derechos notariales
 */
function ventanaDetalleMejorModeloContrato(idModelo, posicion, fechaInicio, fechaFin, tipoDetalle) {
    var ventana = null;
    var UrlLink = '../tareasmenu/detalles_estadistica_modelos_contrato.php?' +
            'idModelo=' + idModelo +
            '&posicion=' + posicion +
            '&fechaInicio=' + fechaInicio +
            '&fechaFin=' + fechaFin +
            '&tipoDetalle=' + tipoDetalle;
    var windowNameLink = 'Recorrido_Proceso';
    var resX = window.screen.width;
    var left = resX / 8;
    var width = resX - 2 * left;
    var resY = window.screen.height - 100;
    var top = left;
    var height = resY - 2 * top;
    var windowStyleLink = 'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height + ',menubar=0,toolbar=0,location=0,directories=0,scrollbars=1,status=1,resizable=1';
    ventana = window.open(UrlLink, windowNameLink, windowStyleLink);
    ventana.focus();
}
function hojaDatosInsolvenciaEconomica(id_insolvenciaeconomica)
{
    var url = "../tareasmenu/detalle_radicado_insolvencia_economica.php?idradicado=" + id_insolvenciaeconomica;
    abrirVentana(wHojDat, url, {
        denX: 16
    });
}
function detalleLiquidacionInsolvenciaEconomica(id_insolvenciaeconomica)
{
    var url = "../tareasmenu/detalle_liquidacion_insolvenciaeconomica.php?id_insolvenciaeconomica=" + id_insolvenciaeconomica;
    abrirVentana(wHojDat, url, {
        denX: 16
    });
}
