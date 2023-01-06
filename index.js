const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ia0tdiq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.log(error.name, error.massage);
  }
}

dbConnect();

// All Database Collection
const allTasks = client.db("sumaya-sumu").collection("data");
const allCategories = client.db("sumaya-sumu").collection("categories");

// INSERT TASK TO MONGODB
try {
  app.post("/data", async (req, res) => {
    const task = req.body;
    // console.log(body);
    const result = await allTasks.insertOne(task);
    if (result.acknowledged) {
      res.send({ data: task });
    }
  });
} catch (error) {
  console.log("allTasks", error.name, error.massage, error.stack);
}

// Get task info
try {
  app.get("/categories", async (req, res) => {
    const query = {};
    const result = await allCategories.find(query).toArray();
    res.send(result);
  });
} catch (error) {
  console.log("Get all tasks", error.name, error.massage, error.stack);
}

app.listen(port, () => {
  console.log(`TODOser is running on port ${port}`);
});
