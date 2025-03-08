const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");
const { v4: uuidv4 } = require("uuid");
const { validateCityName } = require("./validation");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/cities", (req, res) => {
  db.all(
    "SELECT guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation, isoCode, currencyCode, capitalLatitude, capitalLongitude FROM cities",
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch cities" });
      } else {
        const citiesWithCoordinates = rows.map((city) => ({
          ...city,
          capitalCoordinates: {
            latitude: city.capitalLatitude,
            longitude: city.capitalLongitude,
          },
        }));
        res.json(citiesWithCoordinates);
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

  const { countryName, isoCode, currencyCode, capitalCoordinates } = country;

  const guid = uuidv4();

  validateCityName(cityName, (err, cityExists) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else if (cityExists) {
      res.status(400).send({ error: "City with this name already exists" });
    } else {
      db.run(
        `INSERT INTO cities (guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation, isoCode, currencyCode, capitalLatitude, capitalLongitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          guid,
          cityName,
          state,
          countryName,
          touristRating,
          dateEstablished,
          estimatedPopulation,
          isoCode,
          currencyCode,
          capitalCoordinates.latitude,
          capitalCoordinates.longitude,
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
    }
  });

  // function (err) {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send({ error: err.message });
  //   } else {
  //     res.json({ guid, ...req.body });
  //   }
  // }
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
    `UPDATE cities SET touristRating = ?, dateEstablished = ?, estimatedPopulation = ? WHERE guid = ?`,
    [touristRating, dateEstablished, estimatedPopulation, guid],
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
