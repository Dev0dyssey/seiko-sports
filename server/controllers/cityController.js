const db = require("../database.js");
const { v4: uuidv4 } = require("uuid");
const { validateCityName } = require("../validation");
const sanitizeHtml = require("sanitize-html");
const axios = require("axios");

const getCities = (req, res) => {
  db.all(
    `SELECT guid, cityName, state, country, touristRating, dateEstablished, estimatedPopulation, isoCode, currencyCode, capitalLatitude, capitalLongitude FROM cities`,
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch cities" });
      } else {
        const citiesWithCoordinates = rows.map((city) => {
          return {
            guid: city.guid,
            cityName: city.cityName,
            state: city.state,
            touristRating: city.touristRating,
            dateEstablished: city.dateEstablished,
            estimatedPopulation: city.estimatedPopulation,
            country: {
              countryName: city.country,
              isoCode: city.isoCode,
              currencyCode: city.currencyCode,
              capitalCoordinates: {
                latitude: city.capitalLatitude,
                longitude: city.capitalLongitude,
              },
            },
          };
        });
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
            db.get(`SELECT * FROM cities WHERE guid =?`, [guid], (err, row) => {
              if (err) {
                console.error(err);
              } else {
                res.json({ row });
              }
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

const getWeatherForCity = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

    if (!API_KEY) {
      console.error("OpenWeatherMap API key not configured");
      return res.status(500).json({ error: "Weather service not available" });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);
    if (error.response?.data?.message) {
      return res.status(error.response.status || 500).json({
        error: `Weather API error: ${error.response.data.message}`,
      });
    }
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity,
  getWeatherForCity,
};
