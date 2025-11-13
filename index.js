const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://assignment-10-db:qBegcJ8rxdDnU2YL@cluster0.kxlnv3m.mongodb.net/?appName=Cluster0";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    // assignment-10-db
    //ass-10-server
    const db = client.db("assignment-10-db");
    const foodCollection = db.collection("ass-10-server");
    const dbFood = client.db("food-request");
    const foodRequestCollection = dbFood.collection("food-collection");

    //find
    app.get("/foods", async (req, res) => {
      const result = await foodCollection.find().sort({ _id: -1 }).toArray();
      res.send(result);
    });

    //insert
    app.post("/foods", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await foodCollection.insertOne(data);
      res.send(result);
    });

    //view details
    app.get("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);

      const result = await foodCollection.findOne({ _id: objectId });

      res.send({
        success: true,
        result,
      });
    });

    // updating API
    app.put("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };

      const result = await foodCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });

    //delete API
    app.delete("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const result = await foodCollection.deleteOne(filter);
      res.send({
        success: true,
        result,
      });
    });

    // latest data
    app.get("/latest-foods", async (req, res) => {
      const result = await foodCollection
        .find()
        .sort({ created_at: "desc" })
        .limit(6)
        .toArray();
      res.send(result);
    });
    app.get("/my-foods", async (req, res) => {
      const email = req.query.email;
      const query = { user_email: email };
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });

    // Get Food Requests
    app.get("/foodRequests", async (req, res) => {
      const result = await foodRequestCollection
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // Post Food Requests
    app.post("/foodRequests", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await foodRequestCollection.insertOne(data);
      res.send(result);
    });

    // Update (accept/reject)
    app.patch("/foodRequests/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await foodRequestCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    });

    //Get manage-foods
    app.get("/manage-foods", async (req, res) => {
      const authorEmail = req.query.authorEmail || req.query.email;

      let query = {};
      if (authorEmail) query.authorEmail = authorEmail;

      const foods = await foodCollection.find(query).toArray();
      res.send(foods);
    });

    //***************************** */
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//----------
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
