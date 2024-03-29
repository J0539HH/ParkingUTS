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

//Cargar informacion de espacios del parqueadero / Multiples interfaces (UTS-PARKING)
router.get("/CargarInfoEspacios", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("espaciosDisponibles");
    const query = {
      _id: new ObjectId("65ada073a975d00b83a0c2d9"),
    };
    const result = await collection.findOne(query, { returnDocument: "After" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Validar Documento para pre-registro / GESTOR DE USUARIOS (UTS-PARKING)
router.post("/findPersonByDocument", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("persona");
    const query = {
      documento: req.body.documento,
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.json("Disponible");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Modificar vehiculo / Mis vehiculos (PARKING-UTS)
router.post("/modificarVehiculo", jsonParser, async (req, res) => {
  try {
    const { idusuario, idvehiculo, marca, color, linea } = req.body;
    const queryU = {
      _id: new ObjectId(idusuario),
    };
    const collectionU = database.collection("usuarios");
    const resultU = await collectionU.findOne(queryU, {
      returnDocument: "After",
    });
    if (resultU) {
      const queryV = {
        _id: new ObjectId(idvehiculo),
        "usuario._id": new ObjectId(idusuario),
      };
      const collectionV = database.collection("vehiculos");
      const resultV = await collectionV.findOne(queryV);
      if (resultV === null) {
        res.json("El vehiculo no se puede modificar");
      } else {
        const updateObject = {
          usuario: resultU,
          marca: marca,
          color: color,
          linea: linea,
        };
        const resultVM = await collectionV.findOneAndUpdate(
          {
            _id: new ObjectId(idvehiculo),
            "usuario._id": new ObjectId(idusuario),
          },
          {
            $set: updateObject,
          },
          { returnDocument: "After" }
        );
        res.json(resultVM);
      }
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar movimiento del parqueadero / LectorQR (PARKING-UTS)
router.post("/registrarMovimientoParqueadero", jsonParser, async (req, res) => {
  try {
    const collectionEspaciosDisponibles = database.collection(
      "espaciosDisponibles"
    );
    const queryEspacios = {
      _id: new ObjectId("65ada073a975d00b83a0c2d9"),
    };
    const espacios = await collectionEspaciosDisponibles.findOne(queryEspacios);
    let espaciosDisponibles = espacios.espaciosDisponibles;

    const collectionMovimientos = database.collection("movimientosParqueadero");
    let idvehiculofavorito = req.body.idVehiculoFav;
    let movimientoAregistrar = req.body.tipoDeMovimiento;
    const queryLastMoviment = {
      "vehiculo._id": new ObjectId(idvehiculofavorito),
    };
    const resultLastMoviment = await collectionMovimientos.findOne(
      queryLastMoviment,
      { sort: { fechaMovimiento: -1 } }
    );
    if (resultLastMoviment === null) {
      if (req.body.tipoDeMovimiento === "Salida") {
        res.json("Error primer movimiento");
        return;
      }
    } else if (movimientoAregistrar === resultLastMoviment.tipoMovimiento) {
      res.json("Movimiento sospechoso");
      return;
    }
    const collection = database.collection("usuarios");
    const query = {
      _id: new ObjectId(req.body.idUsuarioOperador),
      estado: true,
    };
    const result = await collection.findOne(query, { returnDocument: "After" });
    if (result) {
      const collectionVF = database.collection("vehiculoFavorito");
      const queryVF = {
        _id: new ObjectId(req.body.idVehiculoFav),
      };
      const resultvf = await collectionVF.findOne(queryVF, {
        returnDocument: "After",
      });

      if (resultvf) {
        const fechaMovimiento = moment().tz("America/Bogota").format();

        const resultInsert = await collectionMovimientos.insertOne({
          vehiculo: resultvf,
          usuarioOperador: result,
          fechaMovimiento: fechaMovimiento,
          tipoMovimiento: req.body.tipoDeMovimiento,
        });
        if (resultInsert) {
          let espaciosActuales = espaciosDisponibles - 1;
          if (req.body.tipoDeMovimiento === "Salida") {
            espaciosActuales = espaciosActuales + 2;
          }
          const updateObjectME = {
            espaciosDisponibles: espaciosActuales,
          };
          const resultModificacionEspacios =
            await collectionEspaciosDisponibles.findOneAndUpdate(
              { _id: new ObjectId("65ada073a975d00b83a0c2d9") },
              {
                $set: updateObjectME,
              }
            );
          res.json("Movimiento registrado");
        } else {
          res.status(400).json({ error: "No se pudo registrar el movimiento" });
        }
      } else {
        res.status(400).json({ error: "Vehiculo invalido" });
      }
    } else {
      res.status(400).json({ error: "Usuario invalido" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Cargar informacion del codigo QR / LectorQR (PARKING-UTS)
router.post("/validarQR", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      _id: new ObjectId(req.body.idusuario),
      estado: true,
    };
    const result = await collection.findOne(query, { returnDocument: "After" });
    if (result) {
      const collectionVF = database.collection("vehiculoFavorito");
      const queryVF = {
        "usuario._id": new ObjectId(req.body.idusuario),
      };
      const resultvf = await collectionVF.findOne(queryVF, {
        returnDocument: "After",
      });
      const respuesta = {
        usuario: result,
        vehiculo: resultvf,
      };

      res.json(respuesta);
    } else {
      res.status(400).json({ error: "Usuario invalido" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      vehiculofavorito: vehiculofavorito,
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
    if (vehiculofavorito !== "") {
      const collectionV = database.collection("vehiculos");
      const queryV = {
        _id: new ObjectId(vehiculofavorito),
      };
      const resultV = await collectionV.findOne(queryV);
      const updateObjectV = {
        usuario: result.value,
      };
      if (resultV) {
        const collectionVF = database.collection("vehiculoFavorito");
        const deleteQuery = {
          "usuario._id": new ObjectId(usuarioModificado._id),
        };
        await collectionVF.deleteMany(deleteQuery);
        await collectionV.findOneAndUpdate(
          { _id: new ObjectId(resultV._id) },
          {
            $set: updateObjectV,
          },
          { returnDocument: "After" }
        );
        await collectionVF.insertOne(resultV);
      } else {
        res.status(404).send("Vehiculo no encontrado");
        return;
      }
    }

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

// Eliminar usuario especifico / GESTOR DE USUARIOS (PARKING-UTS)
router.post("/deleteUser", async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const collectionP = database.collection("persona");
    const queryU = {
      _id: new ObjectId(req.body.idusuario),
    };
    const resultU = await collection.findOne(queryU, {
      returnDocument: "After",
    });

    const result = await collection.deleteOne({
      _id: new ObjectId(req.body.idusuario),
    });
    if (result.deletedCount > 0) {
      const resultDP = await collectionP.deleteOne({
        documento: resultU.persona.documento,
      });
      if (resultDP.deletedCount > 0) {
        res.json({ success: true });
      } else {
        res.status(404).send("No se pudo eliminar");
      }
    } else {
      res.status(404).send("No se pudo eliminar");
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

// Editar usuario especifico desde administracion de usuarios / GESTOR DE USUARIOS (PARKING-UTS)
router.post("/EditUser", jsonParser, async (req, res) => {
  try {
    const {
      idusuario: idusuario,
      usuario: usuario,
      tipoUsuario: tipoUsuario,
      nombre: nombre,
      estado: estado,
      correo: correo,
    } = req.body;
    const estadoBool = estado;
    const collection = database.collection("usuarios");
    const updateObject = {
      usuario: usuario,
      rol: tipoUsuario,
      "persona.nombre": nombre,
      estado: estadoBool,
      "persona.correo": correo,
    };
    const resultM = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(idusuario),
      },
      {
        $set: updateObject,
      },
      { returnDocument: "After" }
    );
    if (resultM.value) {
      const collectionP = database.collection("persona");
      const updateObjectP = {
        nombre: nombre,
        correo: correo,
      };
      const resultMP = await collectionP.findOneAndUpdate(
        {
          _id: new ObjectId(resultM.value.persona._id),
        },
        {
          $set: updateObjectP,
        },
        { returnDocument: "After" }
      );
      res.json(resultM);
    } else {
      res.status(500).json({ error: "No se pudo modificar el usuario" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar nuevo usuario desde administracion de usuarios / GESTOR DE USUARIOS (PARKING-UTS)
router.post("/NewUser", jsonParser, async (req, res) => {
  try {
    const {
      usuario,
      password,
      rol,
      estado,
      nombre,
      documento,
      genero,
      carrera,
      celular,
      direccion,
      correo,
    } = req.body;
    const collectionU = database.collection("usuarios");
    const queryU = {
      usuario: usuario,
    };
    const resultU = await collectionU.findOne(queryU, {
      returnDocument: "After",
    });

    if (resultU === null) {
    } else {
      res.json("Login Utilizado");
    }
    const collectionP = database.collection("persona");
    const resultP = await collectionP.insertOne(
      {
        nombre: nombre,
        documento: documento,
        genero: genero,
        carrera: carrera,
        celular: celular,
        direccion: direccion,
        correo: correo,
      },
      { returnDocument: "After" }
    );
    if (resultP) {
      const queryPF = {
        documento: documento,
      };
      const resultPF = await collectionP.findOne(queryPF, {
        returnDocument: "After",
      });
      const resultIU = await collectionU.insertOne({
        usuario: usuario,
        password: password,
        token: null,
        ultimoingreso: null,
        rol: rol,
        estado: estado,
        persona: resultPF,
      });
      res.json(resultIU);
    }
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

// Cargar todas los movimientos del parqueadero del sistema / AUDITORIAS (PARKING-UTS)
router.get("/movimientosTotal", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("movimientosParqueadero");

    // Obtener los documentos y convertir las fechas de string a objetos de fecha
    const result = await collection.find({}).toArray();
    const resultWithDate = result.map((doc) => ({
      ...doc,
      fecha: new Date(doc.fechaMovimiento),
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

module.exports = router;
