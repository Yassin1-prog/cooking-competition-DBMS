const express = require("express");
const cors = require("cors");
//const recipeRouter = require("./routes/recipeRouter");
//const cookRouter = require("./routes/cookRouter");
//const compController = require("./routes/compRouter");
const generalRouter = require("./routes/generalRouter");
const db = require("./db");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //parse json  body of requests
app.use(cors());
//app.use("/recipes", recipeRouter);
//app.use("/cooks", cookRouter);
//app.use("/competition", compRouter);
app.use("/general", generalRouter);

app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recipe");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
