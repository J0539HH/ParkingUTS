// Api que conecta a MONGODB by Jhosep Florez //

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://J0539H:mTOvskP74buqKogn@clusterdocutech.5iod7gv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

router.get("/", (req, res) => {
  res.send("API funcionando by Jhosep Florez");
});

router.post("/usuarios", jsonParser, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("docutech");
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
  } finally {
    await client.close();
  }
});

router.post("/EspecificUser", jsonParser, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("docutech");
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
  } finally {
    await client.close();
  }
});

router.post("/usuariosTotal", jsonParser, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("docutech");
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
  } finally {
    await client.close();
  }
});

router.post("/NewUser", jsonParser, async (req, res) => {
  try {
    const { usuario, password, idrol, nombre } = req.body;

    await client.connect();
    const database = client.db("docutech");
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
  } finally {
    await client.close();
  }
});

module.exports = router;
