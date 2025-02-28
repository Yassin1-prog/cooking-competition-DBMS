const express = require("express");
const cors = require("cors");
const recipeRouter = require("./routes/recipeRouter");
const cookRouter = require("./routes/cookRouter");
const episodeRouter = require("./routes/episodeRouter");
const generalRouter = require("./routes/generalRouter");
const db = require("./db");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //parse json  body of requests
app.use(cors());
app.use("/recipes", recipeRouter);
app.use("/cooks", cookRouter);
app.use("/episodes", episodeRouter);
app.use("/general", generalRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
