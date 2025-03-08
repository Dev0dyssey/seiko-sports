const db = require("../database.js");
const { v4: uuidv4 } = require("uuid");
const { validateCityName } = require("../validation");
const sanitizeHtml = require("sanitize-html"); // Import sanitize-html

const getCities = (req, res) => {
  db.all(
    `SELECT guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation, isoCode, currencyCode, capitalLatitude, capitalLongitude FROM cities`,
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
};

const createCity = (req, res) => {
  const {
    cityName,
    state,
    country,
    touristRating,
    dateEstablished,
    estimatedPopulation,
  } = req.body;

  const { countryName, isoCode, currencyCode, capitalCoordinates } = country;

  const sanitizedCityName = sanitizeHtml(cityName);
  const sanitizedState = sanitizeHtml(state);

  validateCityName(sanitizedCityName, (err, isDuplicate) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to check for duplicate city" });
    } else if (isDuplicate) {
      res.status(400).json({ error: "City with this name already exists" });
    } else {
      const guid = uuidv4();
      db.run(
        `INSERT INTO cities (guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation, isoCode, currencyCode, capitalLatitude, capitalLongitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          guid,
          sanitizedCityName,
          sanitizedState,
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
            res.status(500).json({ error: "Failed to create city" });
          } else {
            res.json({
              guid,
              cityName,
              state,
              country,
              touristRating,
              dateEstablished,
              estimatedPopulation,
            });
          }
        }
      );
    }
  });
};

const updateCity = (req, res) => {
  const { touristRating, dateEstablished, estimatedPopulation } = req.body;
  const { guid } = req.params;

  db.run(
    `UPDATE cities SET touristRating = ?, dateEstablished = ?, estimatedPopulation = ? WHERE guid = ?`,
    [touristRating, dateEstablished, estimatedPopulation, guid],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update city" });
      } else if (this.changes === 0) {
        res.status(404).json({ error: "City not found" });
      } else {
        res.json({ message: "City updated successfully" });
      }
    }
  );
};

const deleteCity = (req, res) => {
  const { guid } = req.params;

  db.run(`DELETE FROM cities WHERE guid = ?`, [guid], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete city" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "City not found" });
    } else {
      res.json({ message: "City deleted successfully" });
    }
  });
};

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity,
};
