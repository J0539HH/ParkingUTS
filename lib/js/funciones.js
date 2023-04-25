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


var wCont = 0;
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

function digitoVerificacion(NIT) {
    if (NIT == '' || NIT.length > 15) {
        return '';
    }
    var i, dim, modulo, zuma, c;
    var primos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    zuma = 0;
    modulo = 0;
    dim = NIT.length;
    for (i = 0; i < dim; ++i) {
        c = NIT.charAt((dim - 1) - i);
        if (c < '0' || c > '9')
            return '';
        zuma += (parseInt(c) * primos[i]);
    }
    modulo = zuma % 11;
    if (modulo > 1) {
        return (11 - modulo);
    }
    return modulo;
}