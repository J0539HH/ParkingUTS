const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

// Ruta de ejemplo para obtener todos los documentos de una colección
router.get("/usuarios", (req, res) => {
  // Conexión a la base de datos
  const uri = "mongodb+srv://J0539H:mTOvskP74buqKogn@clusterdocutech.mongodb.net/docutech?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("<database>").collection("<collection>");
    // Consulta para obtener todos los documentos de la colección
    collection.find({}).toArray((err, result) => {
      if (err) throw err;
      // Devolver los resultados como respuesta HTTP al navegador
      res.send(result);
      client.close();
    });
  });
});

module.exports = router;
