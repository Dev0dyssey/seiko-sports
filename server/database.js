const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./cities.db");

db.run(`
    CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guid TEXT NOT NULL UNIQUE,
    cityName TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    touristRating INTEGER NOT NULL,
    dateEstablished TEXT NOT NULL,
    estimatedPopulation INTEGER NOT NULL
    )    
`);

module.exports = db;
