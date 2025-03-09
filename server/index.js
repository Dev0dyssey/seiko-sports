const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cityRoutes = require("./city-routes");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/cities", cityRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
