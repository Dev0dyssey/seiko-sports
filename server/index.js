const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/cities", (req, res) => {
  db.all(
    "SELECT guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation FROM cities",
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch cities" });
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/cities", (req, res) => {
  const {
    cityName,
    state,
    country,
    touristRating,
    dateEstablished,
    estimatedPopulation,
  } = req.body;
  const guid = uuidv4();

  db.run(
    `INSERT INTO cities (guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      guid,
      cityName,
      state,
      country,
      touristRating,
      dateEstablished,
      estimatedPopulation,
    ],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
      } else {
        res.json({ guid, ...req.body });
      }
    }
  );
});

app.put("/cities/:guid", (req, res) => {
  const { guid } = req.params;
  const {
    cityName,
    state,
    country,
    touristRating,
    dateEstablished,
    estimatedPopulation,
  } = req.body;

  db.run(
    `UPDATE cities SET cityName = ?, state = ?, country = ?, touristRating = ?, dateEstablished = ?, estimatedPopulation = ? WHERE guid = ?`,
    [
      cityName,
      state,
      country,
      touristRating,
      dateEstablished,
      estimatedPopulation,
      guid,
    ],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
      } else {
        res.json({ guid, ...req.body });
      }
    }
  );
});

app.delete("/cities/:guid", (req, res) => {
  const { guid } = req.params;

  db.run(`DELETE FROM cities WHERE guid = ?`, [guid], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.json({ message: "City Deleted Succesfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
