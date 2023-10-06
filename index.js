// console clear
console.clear();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("School management is available");
});

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.USER_KEY}@cluster0.ex2dsg0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// database collections
const db = client.db("school-management-project");
const usersCollection = db.collection("usersCollection");

app.get("/users", async (req, res) => {
  console.log("connecting");
  const result = await usersCollection.find().toArray();
  res.send(result);
});

app.post("/users", async (req, res) => {
  try {
    console.log("Received POST request");
    const data = req.body;
    console.log("Received data:", data);
    const result = await usersCollection.insertOne(data);
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`School management api is running on port${port}`);
});
