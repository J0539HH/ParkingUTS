// Api que gestiona peticiones a MONGODB by Jhosep Florez //

const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const crypto = require("crypto-js");

// Conexion activa a la base de datos
const uri =
  "mongodb+srv://J0539H:xuHDohemqJ82FzCb@utsparking.f4ednna.mongodb.net/";
const client = new MongoClient(uri);
(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas --> PARKING-UTS (4000-JDFM)");
  } catch (err) {
    console.error(err);
  }
})();
const database = client.db("UTSparking");

router.get("/", (req, res) => {
  res.send("API funcionando by Jhosep Florez");
});

//Registrar el vehiculo favorito / Mi perfil (PARKING-UTS) NO FUNCIONAL
router.post("/registrarFavorito", jsonParser, async (req, res) => {
  try {
    const { idusuario, tipoVehiculo, placa, marca, color, linea } = req.body;
    const queryU = {
      _id: new ObjectId(idusuario),
    };
    const collectionU = database.collection("usuarios");
    const resultU = await collectionU.findOne(queryU);
    if (resultU) {
      const queryV = {
        placa: placa,
        tipoVehiculo: { $ne: "Bicicleta" },
      };
      const collectionV = database.collection("vehiculos");
      const resultV = await collectionV.findOne(queryV);
      if (resultV === null) {
        const collection = database.collection("vehiculos");
        const result = await collection.insertOne({
          usuario: resultU,
          tipoVehiculo,
          placa,
          marca,
          color,
          estado: true,
          linea,
        });
        const response = {
          resultado: result,
          tipoVehiculo: tipoVehiculo,
          marca: marca,
        };
        res.json(response);
      } else {
        res.status(500).json({ error: "Placa utilizada" });
        return;
      }
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar vehiculo favorito / Mi codigo QR (PARKING-UTS)
router.post("/VehiculoFav", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("vehiculoFavorito");
    const query = {
      "usuario._id": new ObjectId(req.body.idusuario),
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Vehiculo favorito no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar Auditoria CON IDUSUARIO (GENERAL)  / Desde distintos origenes (PARKING-UTS)
router.post("/registrarAuditoriaModelo", jsonParser, async (req, res) => {
  try {
    const { idusuario, textoAuditoria } = req.body;
    const fechaAuditoria = moment().tz("America/Bogota").format();
    const collectionU = database.collection("usuarios");
    const queryU = {
      _id: new ObjectId(idusuario),
    };
    const resultU = await collectionU.findOne(queryU);
    if (resultU) {
      const collectionA = database.collection("auditoria");
      const result = await collectionA.insertOne({
        usuario: resultU,
        fecha: fechaAuditoria,
        descripcion: textoAuditoria,
      });
      res.json(result);
    } else {
      res.status(500).json({ error: "No se puede ingresar la auditoria" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Elimninar un vehiculo / MIS VEHICULOS (PARKING-UTS)
router.post("/EliminarVehiculoUser", jsonParser, async (req, res) => {
  try {
    const { idusuario, idVehiculo } = req.body;
    const queryV = {
      _id: new ObjectId(idVehiculo),
      "usuario._id": new ObjectId(idusuario),
    };
    const collectionV = database.collection("vehiculos");
    const resultV = await collectionV.findOne(queryV);

    if (resultV) {
      const deleteResult = await collectionV.deleteOne(queryV);

      if (deleteResult.deletedCount === 1) {
        const response = {
          respuesta: "Vehículo eliminado exitosamente",
          VehiculoEliminado: resultV,
        };
        res.json(response);
      } else {
        res.json("Error al intentar eliminar el vehículo");
      }
    } else {
      res.json("Usuario no encontrado o vehículo no asociado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Cargar todos los vehiculos personales / MIS VEHICULOS (PARKING-UTS)
router.post("/VehiculosPersonales", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("vehiculos");
    const query = {
      "usuario._id": new ObjectId(req.body.idusuario),
    };
    const result = await collection.find(query).toArray();

    if (result && result.length > 0) {
      res.json(result);
    } else {
      res.json("Usuario sin vehiculos");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Validar login (disponible) por modificacion de usuario / MI PERFIL (PARKING-UTS)
router.post("/EspecificUserLogin", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      usuario: req.body.usuario,
    };
    let idusuario = new ObjectId(req.body.idusuario);
    const result = await collection.findOne(query, { returnDocument: "After" });
    if (result) {
      if (result._id.toString() === idusuario.toString()) {
        res.json(result);
      } else {
        res.status(404).json({ error: "OCUPED-USER" });
      }
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Actualizar datos personales / MI PERFIL (PARKING-UTS)
router.post("/ChangePersonalInformation", jsonParser, async (req, res) => {
  try {
    const {
      usuario: usuario,
      password: password,
      genero: genero,
      correo: correo,
      telefono: telefono,
      direccion: direccion,
      actualizarContraseña: actualizarContraseña,
    } = req.body;

    const idusuario = req.body.idusuario;
    const collection = database.collection("usuarios");
    const updateObject = {
      usuario: usuario,
      "persona.genero": genero,
      "persona.celular": telefono,
      "persona.direccion": direccion,
      "persona.correo": correo,
    };
    if (actualizarContraseña) {
      updateObject.password = crypto
        .SHA256(String(password))
        .toString(crypto.enc.Hex);
    }
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(idusuario), estado: true },
      {
        $set: updateObject,
      },
      { returnDocument: "After" }
    );
    //Actualizacion del usuario persona
    let usuarioModificado = result.value;
    let idusuarioP = usuarioModificado.persona._id;

    const collectionP = database.collection("persona");
    const resultP = await collectionP.updateOne(
      { _id: new ObjectId(idusuarioP) },
      {
        $set: {
          genero: genero,
          celular: telefono,
          direccion: direccion,
          correo: correo,
        },
      }
    );
    res.json(resultP);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar Contraseña / LOGIN (PARKING-UTS)
router.post("/cambiarContra", jsonParser, async (req, res) => {
  try {
    const { idusuario: idusuario, token: token, newPass: newPass } = req.body;
    const collection = database.collection("usuarios");
    const result = await collection.updateOne(
      {
        _id: new ObjectId(idusuario),
        token: token,
        estado: true,
      },
      {
        $set: {
          password: crypto.SHA256(String(newPass)).toString(crypto.enc.Hex),
        },
      }
    );
    let resultado = result;
    const queryU = {
      _id: new ObjectId(idusuario),
    };
    const resultU = await collection.findOne(queryU);
    if (resultU) {
      resultado = resultU;
    }

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizacion de token de Usuario para cambio de contraseña / LOGIN (PARKING-UTS)
router.post("/ActualizarToken", jsonParser, async (req, res) => {
  try {
    const token = Math.floor(Math.random() * 900000) + 100000;
    const { idusuario: idusuario } = req.body;
    const tokenHash = crypto.SHA256(String(token)).toString(crypto.enc.Hex);

    const collection = database.collection("usuarios");
    const result = await collection.updateOne(
      { "persona._id": new ObjectId(idusuario) },
      { $set: { token: tokenHash } }
    );
    let resultado = result;
    if (result.modifiedCount === 1) {
      const queryU = {
        "persona._id": new ObjectId(idusuario),
      };
      const resultU = await collection.findOne(queryU);
      if (resultU) {
        enviarCorreoRecuperacion(resultU, token);
      }
      resultado = resultU;
    }
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Validacion del token para cambio de contraseña /LOGIN (PARKING-UTS)
router.post("/validarToken", jsonParser, async (req, res) => {
  token = req.body.token;
  idusuario = req.body.idusuario;
  tokenSHA = crypto.SHA256(String(token)).toString(crypto.enc.Hex);
  try {
    const collection = database.collection("usuarios");
    const query = {
      _id: new ObjectId(idusuario),
      token: tokenSHA,
      estado: true,
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("El token no concuerda");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Envio del codigo de validacion para recuperacion de contraseña / LOGIN (PARKING-UTS)
function enviarCorreoRecuperacion(objetoUsuario, codigo) {
  let correo = objetoUsuario.persona.correo;
  let nombre = objetoUsuario.persona.nombre;
  let usuario = objetoUsuario.usuario;
  const mensaje =
    "<p>Hola! <b>" +
    nombre +
    ", </b><br>Este es el codigo de validacion para recuperar tu contraseña:<b> " +
    codigo +
    "</b><br> Recuerda que tu login de acceso es: <b>" +
    usuario +
    "</b>";
  ("</p> ");
  const asunto = "Recuperacion de contraseña UTS - PARKING";

  const data = {
    correo: correo,
    asunto: asunto,
    mensaje: mensaje,
  };

  fetch("http://localhost:3000/EnvioDecorreo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
      } else {
        throw new Error("Error al enviar el correo electrónico");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Registrar Auditoria (GENERAL) / Desde distintos origenes (PARKING-UTS)
router.post("/NewAuditoria", jsonParser, async (req, res) => {
  try {
    const fechaAuditoria = moment().tz("America/Bogota").format();
    const { usuario, descripcion } = req.body;
    const collection = database.collection("auditoria");

    const result = await collection.insertOne({
      usuario: usuario,
      fecha: fechaAuditoria,
      descripcion: descripcion,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Login de un usuario / LOGIN (PARKING-UTS)
router.post("/usuarios", jsonParser, async (req, res) => {
  let userL = req.body.usuario.trim();
  try {
    const collection = database.collection("usuarios");
    const query = {
      usuario: userL,
      password: req.body.password,
      estado: true,
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Registrar un nuevo vehiculo / MIS VEHICULOS (PARKING-UTS)
router.post("/registrarVehiculo", jsonParser, async (req, res) => {
  try {
    const { idusuario, tipoVehiculo, placa, marca, color, linea } = req.body;
    const queryU = {
      _id: new ObjectId(idusuario),
    };
    const collectionU = database.collection("usuarios");
    const resultU = await collectionU.findOne(queryU);
    if (resultU) {
      const queryV = {
        placa: placa,
        tipoVehiculo: { $ne: "Bicicleta" },
      };
      const collectionV = database.collection("vehiculos");
      const resultV = await collectionV.findOne(queryV);
      if (resultV === null) {
        const collection = database.collection("vehiculos");
        const result = await collection.insertOne({
          usuario: resultU,
          tipoVehiculo,
          placa,
          marca,
          color,
          estado: true,
          linea,
        });
        const response = {
          resultado: result,
          tipoVehiculo: tipoVehiculo,
          marca: marca,
        };
        res.json(response);
      } else {
        res.status(500).json({ error: "Placa utilizada" });
        return;
      }
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar usuario especifico / Multiples interfaces (PARKING-UTS)
router.post("/EspecificUser", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      _id: new ObjectId(req.body.idusuario),
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Validar usuario especifico / Multiples interfaces (PARKING-UTS)
router.post("/EspecificLogin", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      usuario: req.body.usuario,
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.json("Login no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Validar persona  especifica por numero de identificacion y/o documento / LOGIN (PARKING-UTS)
router.post("/documentoRecuperable", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("persona");
    const query = {
      documento: req.body.documento,
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.json("Documento no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar usuario especifico / GESTOR DE USUARIOS (PARKING-UTS) - NO FUNCIONAL
router.post("/deleteUser", async (req, res) => {
  try {
    const idusuario = req.body.idusuario;
    const database = client.db("docutech");
    const collection = database.collection("usuarios");
    const result = await collection.deleteOne({
      idusuario: idusuario,
    });
    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar todos los usuarios / GESTOR DE USUARIOS  (PARKING-UTS)
router.get("/usuariosTotal", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const result = await collection.find({}).toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("No se encontraron usuarios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Editar usuario especifico desde administracion de usuarios / GESTOR DE USUARIOS (PARKING-UTS) 70% FUNCIONAL
router.post("/EditUser", jsonParser, async (req, res) => {
  try {
    const {
      usuario: usuario,
      password: password,
      idrol: idrol,
      nombre: nombre,
      estado: estado,
      correo: correo,
    } = req.body;
    const idusuario = parseInt(req.body.idusuario);
    const idrolInt = parseInt(idrol);
    const estadoBool = estado;
    const collection = database.collection("usuarios");
    const result = await collection.updateOne(
      { idusuario: idusuario },
      {
        $set: {
          usuario: usuario,
          password: password,
          idrol: idrolInt,
          nombre: nombre,
          estado: estadoBool,
          correo: correo,
        },
      }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar nuevo usuario desde administracion de usuarios / GESTOR DE USUARIOS (PARKING-UTS)
router.post("/NewUser", jsonParser, async (req, res) => {
  try {
    const { usuario, password, idrol, nombre, correo } = req.body;
    const collection = database.collection("usuarios");

    const lastUser = await collection.findOne({}, { sort: { idusuario: -1 } });
    const newId = lastUser ? lastUser.idusuario + 1 : 1;

    const result = await collection.insertOne({
      idusuario: newId,
      usuario,
      password,
      idrol,
      nombre,
      estado: true,
      correo,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Consultar USUARIOS por filtros / GESTOR DE USUARIOS (PARKING-UTS)
router.post("/FiltrarUsuarios", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {};
    if (req.body.nombre) {
      query["persona.nombre"] = {
        $regex: req.body.nombre,
        $options: "i",
      };
    }

    if (req.body.rol) {
      query.rol = req.body.rol;
    }
    if (req.body.usuario) {
      query.usuario = req.body.usuario;
    }
    if (typeof req.body.estado === "boolean") {
      query.estado = req.body.estado;
    }
    console.log(query);
    const result = await collection.find(query).toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("No se encontraron usuarios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar todas las auditorias del sistema / AUDITORIAS (PARKING-UTS)
router.get("/auditoriasTotal", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("auditoria");

    // Obtener los documentos y convertir las fechas de string a objetos de fecha
    const result = await collection.find({}).toArray();
    const resultWithDate = result.map((doc) => ({
      ...doc,
      fecha: new Date(doc.fecha),
    }));

    // Ordenar por fecha en orden descendente
    const sortedResult = resultWithDate.sort((a, b) => b.fecha - a.fecha);

    if (sortedResult.length > 0) {
      res.json(sortedResult);
    } else {
      res.status(404).send("No se encontraron auditorias");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar nuevo formulario (DOCUTECH)
router.post("/NewForm", jsonParser, async (req, res) => {
  try {
    const {
      idusuario,
      comentariosentrada,
      marca,
      tipodispositivo,
      numeroserie,
      modelo,
    } = req.body;
    const collection = database.collection("servicios");
    const lastUser = await collection.findOne({}, { sort: { idservicio: -1 } });
    const newId = lastUser ? lastUser.idservicio + 1 : 1;
    const fechaEntrada = moment().tz("America/Bogota").format();
    const result = await collection.insertOne({
      idservicio: newId,
      comentariosentrada,
      marca,
      tipodispositivo,
      modelo,
      numeroserie,
      estado: true,
      comentariossalida: "",
      ram: "",
      tipodisco: "",
      estado: "En cola",
      fechaentrada: fechaEntrada,
      fechasalida: null,
      idusuario,
    });
    const insertedItem = await collection.findOne({ idservicio: newId });
    const usuariosCollection = database.collection("usuarios");
    const usuario = await usuariosCollection.findOne({
      idusuario: insertedItem.idusuario,
    });
    const response = {
      servicio: insertedItem,
      usuario: usuario,
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar todos los servicios (DOCUTECH)
router.get("/serviciosTotal", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("servicios");
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: "usuarios",
            localField: "idusuario",
            foreignField: "idusuario",
            as: "usuario",
          },
        },
        {
          $unwind: "$usuario",
        },
      ])
      .toArray();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar servicios en cola (DOCUTECH)
router.get("/serviciosSinAsignar", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("servicios");
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: "usuarios",
            localField: "idusuario",
            foreignField: "idusuario",
            as: "usuario",
          },
        },
        {
          $unwind: "$usuario",
        },
        {
          $match: {
            estado: "En cola",
          },
        },
      ])
      .toArray();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.json("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar servicios de un tecnico (DOCUTECH)
router.post("/serviciosTecnico", jsonParser, async (req, res) => {
  try {
    const idtecnico = req.body.idTecnico;
    const collection = database.collection("servicios");
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: "serviciosasignados",
            localField: "idservicio",
            foreignField: "idservicio",
            as: "serviciosasignados",
          },
        },
        {
          $unwind: "$serviciosasignados",
        },
        {
          $match: {
            estado: "En mantenimiento",
            "serviciosasignados.idusuario": idtecnico,
          },
        },
      ])
      .toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar servicios finalizados de un tecnico (DOCUTECH)
router.post("/serviciosFinalizadosTecnico", jsonParser, async (req, res) => {
  try {
    const idtecnico = req.body.idTecnico;
    const collection = database.collection("servicios");
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: "serviciosasignados",
            localField: "idservicio",
            foreignField: "idservicio",
            as: "serviciosasignados",
          },
        },
        {
          $unwind: "$serviciosasignados",
        },
        {
          $match: {
            estado: { $in: ["Listo para entregar", "Entregado"] },
            "serviciosasignados.idusuario": idtecnico,
          },
        },
      ])
      .toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar servicio especifico (DOCUTECH)
router.post("/servicioEspecifico", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("servicios");
    const aggregation = [
      {
        $match: { idservicio: req.body.idservicio },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "idusuario",
          foreignField: "idusuario",
          as: "usuario",
        },
      },
      {
        $unwind: "$usuario",
      },
    ];
    const result = await collection.aggregate(aggregation).toArray();
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send("Servicio no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar servicios de usuario especifico (DOCUTECH)
router.post("/serviciosUsuario", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("servicios");
    const aggregation = [
      {
        $match: {
          estado: {
            $in: ["Listo para entregar", "En cola", "En mantenimiento"],
          },
          idusuario: req.body.idusuario,
        },
      },
    ];
    const result = await collection.aggregate(aggregation).toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar servicios Gestionados de usuario especifico (DOCUTECH)
router.post("/serviciosEntregadosUsuario", jsonParser, async (req, res) => {
  try {
    const idusuario = req.body.idusuario;
    const collection = database.collection("servicios");
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: "serviciosasignados",
            localField: "idservicio",
            foreignField: "idservicio",
            as: "serviciosasignados",
          },
        },
        {
          $unwind: "$serviciosasignados",
        },
        {
          $match: {
            estado: "Entregado",
            idusuario: idusuario,
          },
        },
      ])
      .toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json("No se encontraron servicios");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Editar servicio especifico (DOCUTECH)
router.post("/EditService", jsonParser, async (req, res) => {
  try {
    const {
      idservicio,
      marca,
      tipodispositivo,
      estado,
      numeroserie,
      comentariossalida,
      ram,
      tipodisco,
      modelo,
    } = req.body;
    const collection = database.collection("servicios");
    const fechasalida = moment().tz("America/Bogota").format();
    const result = await collection.updateOne(
      { idservicio: idservicio },
      {
        $set: {
          marca: marca,
          comentariossalida: comentariossalida,
          tipodispositivo: tipodispositivo,
          numeroserie: numeroserie,
          estado: estado,
          fechasalida: fechasalida,
          ram: ram,
          tipodisco: tipodisco,
          modelo: modelo,
        },
      }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Asignar servicio especifico (DOCUTECH)
router.post("/AsignarServicio", jsonParser, async (req, res) => {
  try {
    const { idservicio, estado, comentariossalida } = req.body;
    const collection = database.collection("servicios");
    const result = await collection.updateOne(
      { idservicio: idservicio },
      {
        $set: {
          comentariossalida: comentariossalida,
          estado: estado,
        },
      }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar Asignacion (DOCUTECH)
router.post("/NewAsignado", jsonParser, async (req, res) => {
  try {
    const fechaAsignacion = moment().tz("America/Bogota").format();
    const { idusuario, idservicio } = req.body;
    const collection = database.collection("serviciosasignados");
    const lastAsignacion = await collection.findOne(
      {},
      { sort: { idasignacion: -1 } }
    );
    const newIdAsignacion = lastAsignacion
      ? lastAsignacion.idasignacion + 1
      : 1;

    const result = await collection.insertOne({
      idasignacion: newIdAsignacion,
      idusuario: idusuario,
      idservicio: idservicio,
      fechaAsignacion: fechaAsignacion,
      fechaFinalizacion: null,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Finalizar Asignacion (DOCUTECH)
router.post("/finalizarAsignacion", jsonParser, async (req, res) => {
  try {
    const idservicio = req.body.idservicio;
    const collection = database.collection("serviciosasignados");
    const fechaFinalizacion = moment().tz("America/Bogota").format();
    const result = await collection.updateOne(
      { idservicio: idservicio },
      {
        $set: {
          fechaFinalizacion: fechaFinalizacion,
        },
      }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cargar tecnicos  (DOCUTECH)
router.get("/cargarTecnicos", async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      idrol: 3, // Cambiar según el id del rol de técnico
      estado: true,
    };
    const projection = {
      correo: 1,
      idusuario: 1,
      nombre: 1,
      _id: 0,
    };
    const cursor = await collection.find(query).project(projection);
    const result = await cursor.toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("Técnicos no encontrados");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
