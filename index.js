const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
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
    "/Multimedia/logo.jpg",
    "/Multimedia/spinner.gif",
    "/lib/js/vendor/bootstrap-icons-1.2.2/font/fonts/bootstrap-icons.woff",
    "/Multimedia/icoAlertWarning.svg",
    "/Multimedia/icoAlertSuccess.svg",
    "/Multimedia/Javascript-logo.png",
    "/Multimedia/Mongo-db-logo.png",
    "/Multimedia/nodejs.jpg",
    "/Multimedia/visual.jpg",
    "/Multimedia/pc.svg",
    "/modulos/tareasmenu/menu.html",
    "/modulos/tareasmenu/menu.js",
    "/modulos/tareasmenu/menu.css",
    "/modulos/tareasmenu/pc.svg",
    "/modulos/tareasmenu/GestorUsuarios.html",
    "/modulos/tareasmenu/GestorUsuarios.css",
    "/modulos/tareasmenu/GestorUsuarios.js",
  ],
  (req, res) => {
    res.sendFile(__dirname + req.path);
  }
);
app.use(express.static("public"));

//
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
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

//

app.use(express.static("public"));

if (require.main === module) {
  app.use("/api", require("./api"));
}

app.listen(portApi, () => {
  console.log(
    `Api  database corriendo en corriendo en http://localhost:${portApi} by JDFM`
  );
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
  res.redirect("/acceso/login.html");
});

app.get("/acceso/login.css", (req, res) => {
  res.sendFile(path.join(__dirname, "", "acceso", "login.css"));
});

app.get("/acceso/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "acceso", "login.html"));
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

app.get("/acceso/login.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "acceso", "login.js"));
});

app.get("/acceso/login.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "acceso", "login.js"));
});

app.get("/principal/scriptGlobal.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "principal", "scriptGlobal.js"));
});

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
