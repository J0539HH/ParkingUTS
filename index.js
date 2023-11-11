const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const session = require("express-session");
const cookieSession = require("cookie-session");
const portApi = 4000;

app.get(
  [
    "/lib/js/vendor/OverlayScrollbars/css/OverlayScrollbars.min.css",
    "/lib/jQuery/alertas/jquery.alerts.css",
    "/lib/jQuery/utilidadesjQuery.js",
    "/lib/js/vendor/jquery-3.6.1/jquery-3.6.1.js",
    "/lib/js/vendor/popper-1.16.0/popper.min.js",
    "/lib/jQuery/alertas/jquery.alerts.js",
    "/lib/aes/aes.js",
    "/modulos/principal/styleGlobal.css",
    "/modulos/principal/scriptGlobal.js",
    "/Multimedia/fondoWeb.jpg",
    "/Multimedia/fondoLogin.png",
    "/Multimedia/logo.jpg",
    "/Multimedia/spinner.gif",
    "/lib/js/vendor/bootstrap-icons-1.2.2/font/fonts/bootstrap-icons.woff",
    "/Multimedia/icoAlertWarning.svg",
    "/Multimedia/icoAlertSuccess.svg",
    "/Multimedia/JS.png",
    "/Multimedia/Mongo-db-logo.png",
    "/Multimedia/nodejs.jpg",
    "/Multimedia/visual.jpg",
    "/Multimedia/pc.svg",
    "/Multimedia/seleccionado.svg",
    "/modulos/tareasmenu/menu.html",
    "/modulos/tareasmenu/menu.js",
    "/modulos/tareasmenu/menu.css",
    "/acceso/Login.html",
    "/acceso/login.js",
    "/acceso/login.css",
    "/modulos/tareasmenu/pc.svg",
    "/modulos/tareasmenu/GestorUsuarios.html",
    "/modulos/tareasmenu/GestorUsuarios.css",
    "/modulos/tareasmenu/GestorUsuarios.js",
    "/modulos/tareasmenu/ReporteServicios.html",
    "/modulos/tareasmenu/ReporteServicios.css",
    "/modulos/tareasmenu/ReporteServicios.js",
    "/modulos/tareasmenu/CrearSevicio.html",
    "/modulos/tareasmenu/CrearSevicio.css",
    "/modulos/tareasmenu/CrearSevicio.js",
    "/modulos/tareasmenu/GestionarServicios.html",
    "/modulos/tareasmenu/GestionarServicios.css",
    "/modulos/tareasmenu/GestionarServicios.js",
    "/modulos/tareasmenu/Seguimiento.html",
    "/modulos/tareasmenu/Seguimiento.css",
    "/modulos/tareasmenu/Seguimiento.js",
    "/modulos/tareasmenu/AsignacionServicios.html",
    "/modulos/tareasmenu/AsignacionServicios.css",
    "/modulos/tareasmenu/AsignacionServicios.js",
    "/modulos/tareasmenu/ServiciosAsignados.html",
    "/modulos/tareasmenu/ServiciosAsignados.css",
    "/modulos/tareasmenu/ServiciosAsignados.js",
    "/modulos/tareasmenu/HistorialCliente.html",
    "/modulos/tareasmenu/HistorialCliente.css",
    "/modulos/tareasmenu/HistorialCliente.js",
    "/modulos/tareasmenu/Auditoria.html",
    "/modulos/tareasmenu/Auditoria.css",
    "/modulos/tareasmenu/Auditoria.js",
    "/lib/datatables/datatables.min.js",
    "/Multimedia/hdd.png",
    "/Multimedia/dispositivo.png",
    "/Multimedia/cliente.png",
    "/Multimedia/estado.png",
    "/Multimedia/marca.png",
    "/Multimedia/ram.png",
    "/Multimedia/tecnico.png",
    "/Multimedia/identificacion.png",
    "/Multimedia/codigo.png",
    "/Multimedia/serie.png",
    "/Multimedia/lupa.png",
    "/Multimedia/Registration.png",
    "/Multimedia/Star.png",
    "/Multimedia/candadoAbierto.png",
    "/Multimedia/asignar.png",
    "/Multimedia/modelos.png",
    "/Multimedia/tool.png",
    "/Multimedia/fondomenu.png",
    "/Multimedia/fondoBodyM.png",
    "/Multimedia/eye.svg",
    "/Multimedia/personas.svg",
    "/Multimedia/newServicio.svg",
    "/Multimedia/asignarServicios.svg",
    "/Multimedia/gestion.svg",
    "/Multimedia/oportunidad.svg",
    "/Multimedia/evaluar.svg",
    "/Multimedia/reporte.svg",
    "/Multimedia/asignado.svg",
    "/Multimedia/logoDocu.svg",
    "/Multimedia/gearDocu.svg",
    "/Multimedia/favIcon.png",
    "/Multimedia/mystory.svg",
    "/Multimedia/newGestion.svg",
    "/Multimedia/detallado.svg",
    "/Multimedia/auditor.svg",
  ],
  (req, res) => {
    res.sendFile(__dirname + req.path);
  }
);
app.use(express.static("public"));

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "docutech.info.empresariales@gmail.com",
    pass: "wgabvjgdexvrruoa",
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Envio de correos
app.post("/EnvioDecorreo", (req, res) => {
  const correo = req.body.correo;
  const asunto = req.body.asunto;
  const mensaje = req.body.mensaje;

  const mailOptions = {
    from: "docutech.info.empresariales@gmail.com",
    to: correo,
    subject: asunto,
    html: mensaje,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error al enviar el correo electrónico");
    } else {
      console.log("Correo electrónico enviado: " + info.response);
      res.send("Correo electrónico enviado correctamente");
    }
  });
});

//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["420"],
  })
);

app.use(
  session({
    secret: "420",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.get("/api/sesion", (req, res) => {
  const idusuario = req.session.idusuario;
  const rol = req.session.rol;
  const nombre = req.session.nombre;
  res.send({ idusuario: idusuario, rol: rol, nombre: nombre });
});

app.post("/api/sesion", (req, res) => {
  const idusuario = req.body._idusuario;
  const rol = req.body.rol;
  const nombre = req.body.nombre;
  req.session.idusuario = idusuario;
  req.session.rol = rol;
  req.session.nombre = nombre;
  res.send();
});

app.get("/api/logout", (req, res) => {
  req.session = null;
  res.send();
});

//

app.use(express.static("public"));

if (require.main === module) {
  app.use("/api", require("./api"));
}

app.listen(portApi, () => {
  console.log(`Database API corriendo en el puerto: ${portApi} by JDFM`);
});

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get(
  "/lib/js/vendor/bootstrap-icons-1.2.2/font/bootstrap-icons.css",
  (req, res) => {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(
      path.join(
        __dirname,
        "lib",
        "js",
        "vendor",
        "bootstrap-icons-1.2.2",
        "font",
        "bootstrap-icons.css"
      )
    );
  }
);

app.use(express.static(path.join(__dirname, "Multimedia")));

app.get(
  "/lib/js/vendor/sweetalert2/dist/sweetalert2.min.css",
  function (req, res) {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(
      path.join(
        __dirname,
        "lib",
        "js",
        "vendor",
        "sweetalert2",
        "dist",
        "sweetalert2.min.css"
      )
    );
  }
);

app.get(
  "/lib/js/vendor/bootstrap-4.6.2-dist/js/bootstrap.min.js",
  (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      path.join(
        __dirname,
        "lib",
        "js",
        "vendor",
        "bootstrap-4.6.2-dist",
        "js",
        "bootstrap.min.js"
      )
    );
  }
);

app.get("/lib/js/vendor/sweetalert2/dist/sweetalert2.min.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(
    path.join(
      __dirname,
      "lib",
      "js",
      "vendor",
      "sweetalert2",
      "dist",
      "sweetalert2.min.js"
    )
  );
});

app.get("/", (req, res) => {
  res.redirect("/acceso/Login.html");
});

app.get("/acceso/login.css", (req, res) => {
  res.sendFile(path.join(__dirname, "", "acceso", "login.css"));
});

app.get("/acceso/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "acceso", "login.html"));
});
app.get("/acceso/login.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "acceso", "login.js"));
});

app.get("/lib/jQuery/sha256.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "lib", "jQuery", "sha256.js"));
});

app.get("/principal/scriptGlobal.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "principal", "scriptGlobal.js"));
});

app.get("/lib/jQuery/sha256.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "lib", "jQuery", "sha256.js"));
});

app.get("/modulos/principal/styleGlobal.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "", "principal", "styleGlobal.css"));
});

app.get(
  "/lib/js/vendor/bootstrap-4.6.2-dist/css/bootstrap.min.css",
  (req, res) => {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(
      path.join(
        __dirname,
        "lib",
        "js",
        "vendor",
        "bootstrap-4.6.2-dist",
        "css",
        "bootstrap.min.css"
      )
    );
  }
);

app.get(
  "/lib/js/vendor/OverlayScrollbars/js/jquery.overlayScrollbars.min.js",
  function (req, res) {
    res.set("Content-Type", "application/javascript");
    res.sendFile(
      __dirname +
        "/lib/js/vendor/OverlayScrollbars/js/jquery.overlayScrollbars.min.js"
    );
  }
);

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto: 3000 by JDFM");
});
