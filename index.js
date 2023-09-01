const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbname = "jornada-backend-agosto-23";
const client = new MongoClient(url);

async function main() {
  
  console.log('Conectadndo ao banco de dados!');
  await client.connect();
  console.log('Banco de Dados conectado com sucesso!'); 
  const db = client.db(dbname);
  const colecao = db.collection('herois');

  const app = express();
  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  app.get("/oi", function (req, res) {
    res.send("Bem Vindo!!!!");
  });

  app.get("/herois", async function (req, res) {
    console.log('Consultando todos os heróis!')
    const itens = await colecao.find().toArray();
    res.send(itens);
    console.log('Registros retornados com sucesso!')
  });

  app.post("/herois", async function (req, res) {
    // console.log(req.body, typeof req.body)
    const item = req.body;
    await colecao.insertOne(item);
    res.send("Incluído com sucesso!");
  });

  app.delete("/herois/:id", async function (req, res) {
    const id = req.params.id;

    await colecao.deleteOne(
      {_id: new ObjectId(id)}
    )

    res.send("Apagar heroi!");
  });

  app.get("/herois/:id", async function (req, res) {
    const id = req.params.id;

    const item = await colecao.findOne({
      _id: new ObjectId(id),
    });

    res.send("Ler pelo ID: " + id + "-> " + item.nome);
  });

  app.put("/herois/:id", async function (req, res) {
    const id = req.params.id;

    const item = req.body;

    await colecao.updateOne(
     {_id: new ObjectId(id)},
     {$set: item},
    );
    res.send("Atualizado com sucesso!!");
  });

  app.listen(3000);
}

main();
