const express = require("express");
const db = require("./db");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

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
