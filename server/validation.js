const db = require("./database.js");

function validateCityName(cityName, callback) {
  db.get(
    "SELECT * FROM cities WHERE cityName = ?",
    [cityName],
    (err, existingCity) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, !!existingCity);
      }
    }
  );
}

module.exports = {
  validateCityName,
};
