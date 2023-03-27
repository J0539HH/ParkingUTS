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
      contraseña: req.body.contrasena,
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

module.exports = router;
