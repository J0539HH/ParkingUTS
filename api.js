// Api que gestiona peticiones a MONGODB by Jhosep Florez //

const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { MongoClient } = require("mongodb");




// Conexion activa a la base de datos
const uri =
  "mongodb+srv://J0539H:RsBp6RTSnD3w8nr6@clusterdocutech.5iod7gv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas --> DOCUTECHCLUSTER (4000-JDFM)");
  } catch (err) {
    console.error(err);
  }
})();
const database = client.db("docutech");

router.get("/", (req, res) => {
  res.send("API funcionando by Jhosep Florez");
});

// Registrar Auditoria

router.post("/NewAudtoria", jsonParser, async (req, res) => {
  try {
    const fechaAuditoria = moment().tz("America/Bogota").format();
    const { idusuario, descripcion } = req.body;
    const collection = database.collection("auditoria");

    const result = await collection.insertOne({
      idusuario: idusuario,
      fecha: fechaAuditoria,
      descripcion: descripcion,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Login de un usuario
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
// Cargar usuario especifico
router.post("/EspecificUser", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      idusuario: req.body.idusuario,
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
// Validar usuario especifico
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

// Cargar tecnicos
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
// Eliminar usuario especifico
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
// Cargar todos los usuarios
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
// Editar usuario especifico
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
// Registrar nuevo usuario
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
// Consultar Por filtros
router.post("/FiltrarUsuarios", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {};
    if (req.body.nombre) {
      query.nombre = { $regex: req.body.nombre, $options: "i" };
    }
    if (req.body.idrol) {
      query.idrol = req.body.idrol;
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
// Registrar nuevo formulario
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

// Cargar todos los servicios
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

// Cargar servicios en cola
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

// Cargar servicios de un tecnico
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

// Cargar servicios finalizados de un tecnico
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

// Cargar servicio especifico
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

// Cargar servicios de usuario especifico
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

// Cargar servicios Gestionados de usuario especifico
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

// Editar servicio especifico
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

// Asignar servicio especifico
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

// Registrar Asignacion
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

// Finalizar Asignacion
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

// Cargar todas las auditorias
router.get("/auditoriasTotal", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("auditoria");
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
          $sort: {
            fecha: -1,
          },
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

module.exports = router;
