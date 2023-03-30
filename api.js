// Api que gestiona peticiones a MONGODB by Jhosep Florez //

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { MongoClient } = require("mongodb");

// Conexion activa a la base de datos
const uri =
  "mongodb+srv://J0539H:mTOvskP74buqKogn@clusterdocutech.5iod7gv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas / DOCUTECHCLUSTER ");
  } catch (err) {
    console.error(err);
  }
})();
const database = client.db("docutech");

router.get("/", (req, res) => {
  res.send("API funcionando by Jhosep Florez");
});

// Login de un usuario
router.post("/usuarios", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("usuarios");
    const query = {
      usuario: req.body.usuario,
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
router.post("/usuariosTotal", jsonParser, async (req, res) => {
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
    const { usuario, password, idrol, nombre } = req.body;
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
    } = req.body;
    const collection = database.collection("servicios");
    const lastUser = await collection.findOne({}, { sort: { idservicio: -1 } });
    const newId = lastUser ? lastUser.idservicio + 1 : 1;
    const fechaEntrada = new Date();
    const result = await collection.insertOne({
      idservicio: newId,
      comentariosentrada,
      marca,
      tipodispositivo,
      modelo: "",
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
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Cargar todos los servicios
router.post("/serviciosTotal", jsonParser, async (req, res) => {
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
// Cargar servicio especifico
router.post("/servicioEspecifico", jsonParser, async (req, res) => {
  try {
    const collection = database.collection("servicios");
    const query = {
      idservicio: req.body.idservicio,
    };
    const result = await collection.findOne(query);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Servicio no encontrado");
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
    } = req.body;
    const collection = database.collection("servicios");
    const fechasalida = new Date();
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
        },
      }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
