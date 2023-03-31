const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const session = require("express-session");
const cookieSession = require("cookie-session");
const portApi = 4000;

console.log("APLICACIONES EMPRESARIALES 2023");

app.get(
  [
    "../AplicacionesEmpresariales/lib/js/vendor/OverlayScrollbars/css/OverlayScrollbars.min.css",
    "../AplicacionesEmpresariales/lib/jQuery/alertas/jquery.alerts.css",
    "../AplicacionesEmpresariales/lib/jQuery/utilidadesjQuery.js",
    "../AplicacionesEmpresariales/lib/js/vendor/jquery-3.6.1/jquery-3.6.1.js",
    "../AplicacionesEmpresariales/lib/js/vendor/popper-1.16.0/popper.min.js",
    "../AplicacionesEmpresariales/lib/jQuery/alertas/jquery.alerts.js",
    "../AplicacionesEmpresariales/lib/aes/aes.js",
    "../AplicacionesEmpresariales/modulos/principal/styleGlobal.css",
    "../AplicacionesEmpresariales/modulos/principal/scriptGlobal.js",
    "../AplicacionesEmpresariales/Multimedia/fondoWeb.jpg",
    "../AplicacionesEmpresariales/Multimedia/logo.jpg",
    "../AplicacionesEmpresariales/Multimedia/spinner.gif",
    "../AplicacionesEmpresariales/lib/js/vendor/bootstrap-icons-1.2.2/font/fonts/bootstrap-icons.woff",
    "../AplicacionesEmpresariales/Multimedia/icoAlertWarning.svg",
    "../AplicacionesEmpresariales/Multimedia/icoAlertSuccess.svg",
    "../AplicacionesEmpresariales/Multimedia/Javascript-logo.png",
    "../AplicacionesEmpresariales/Multimedia/Mongo-db-logo.png",
    "../AplicacionesEmpresariales/Multimedia/nodejs.jpg",
    "../AplicacionesEmpresariales/Multimedia/visual.jpg",
    "../AplicacionesEmpresariales/Multimedia/pc.svg",
    "../AplicacionesEmpresariales/Multimedia/seleccionado.svg",
    "../AplicacionesEmpresariales/modulos/tareasmenu/menu.html",
    "../AplicacionesEmpresariales/modulos/tareasmenu/menu.js",
    "../AplicacionesEmpresariales/modulos/tareasmenu/menu.css",
    "../AplicacionesEmpresariales/modulos/tareasmenu/pc.svg",
    "../AplicacionesEmpresariales/modulos/tareasmenu/GestorUsuarios.html",
    "../AplicacionesEmpresariales/modulos/tareasmenu/GestorUsuarios.css",
    "../AplicacionesEmpresariales/modulos/tareasmenu/GestorUsuarios.js",
    "../AplicacionesEmpresariales/modulos/tareasmenu/ReporteServicios.html",
    "../AplicacionesEmpresariales/modulos/tareasmenu/ReporteServicios.css",
    "../AplicacionesEmpresariales/modulos/tareasmenu/ReporteServicios.js",
    "../AplicacionesEmpresariales/modulos/tareasmenu/CrearSevicio.html",
    "../AplicacionesEmpresariales/modulos/tareasmenu/CrearSevicio.css",
    "../AplicacionesEmpresariales/modulos/tareasmenu/CrearSevicio.js",
    "../AplicacionesEmpresariales/modulos/tareasmenu/GestionarServicios.html",
    "../AplicacionesEmpresariales/modulos/tareasmenu/GestionarServicios.css",
    "../AplicacionesEmpresariales/modulos/tareasmenu/GestionarServicios.js",
    "../AplicacionesEmpresariales/modulos/tareasmenu/Seguimiento.html",
    "../AplicacionesEmpresariales/modulos/tareasmenu/Seguimiento.css",
    "../AplicacionesEmpresariales/modulos/tareasmenu/Seguimiento.js",
    "../AplicacionesEmpresariales/lib/datatables/datatables.min.js",
    "../AplicacionesEmpresariales/Multimedia/hdd.png",
    "../AplicacionesEmpresariales/Multimedia/dispositivo.png",
    "../AplicacionesEmpresariales/Multimedia/cliente.png",
    "../AplicacionesEmpresariales/Multimedia/estado.png",
    "../AplicacionesEmpresariales/Multimedia/marca.png",
    "../AplicacionesEmpresariales/Multimedia/ram.png",
    "../AplicacionesEmpresariales/Multimedia/tecnico.png",
    "../AplicacionesEmpresariales/Multimedia/serie.png",
    "../AplicacionesEmpresariales/Multimedia/lupa.png",
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
    pass: "pjsswumpcbagbgbx",
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
  const idrol = req.session.idrol;
  res.send({ idusuario: idusuario, idrol: idrol });
});

app.post("/api/sesion", (req, res) => {
  const idusuario = req.body.idusuario;
  const idrol = req.body.idrol;
  req.session.idusuario = idusuario;
  req.session.idrol = idrol;
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
  console.log(`Database API corriendo en http://localhost:${portApi} by JDFM`);
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
  res.redirect("/AplicacionesEmpresariales/acceso/Login.html");
});

app.get("/acceso/login.css", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "AplicacionesEmpresariales",
      "acceso",
      "login.css"
    )
  );
});

app.get("/AplicacionesEmpresariales/acceso/Login.html", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "AplicacionesEmpresariales",
      "acceso",
      "Login.html"
    )
  );
});

app.get("/AplicacionesEmpresariales/acceso/login.js", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "AplicacionesEmpresariales",
      "acceso",
      "login.js"
    )
  );
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
  console.log("Servidor iniciado en el puerto http://localhost:3000 by JDFM");
});
