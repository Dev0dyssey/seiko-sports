const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/cities", (req, res) => {
  // Logic here
});

app.post("/cities", (req, res) => {
  // Logic here
});

app.put("/cities/:id", (req, res) => {
  // Logic here
});

app.delete("/cities/:id", (req, res) => {
  // Logic here
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
