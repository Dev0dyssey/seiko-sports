# City Weather Application

A web application for managing city records and viewing weather conditions, built with React.js for the frontend and Node.js/Express for the backend. The application allows users to search, add, edit, and delete city records, along with viewing real-time weather data for selected cities.

![image](https://github.com/user-attachments/assets/780588a1-35fd-4f59-b3f4-8fa668fc2348)


## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [UI Components](#ui-components)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## Features

- **City Management:**
  - Add new cities with information such as name, state, country, tourist rating, date established, and population
  - Edit existing city information
  - Delete city records
  - Search for cities by name

- **Weather Information:**
  - View current weather conditions for any selected city
  - Display temperature, weather conditions, humidity, wind speed, and pressure
  - Show sunrise and sunset times

- **Country Data Integration:**
  - Automatically fetch country details including ISO code and currency
  - Store capital city coordinates for weather information

## Technology Stack

### Frontend
- React.js (with TypeScript)
- CSS for styling
- React Select for dropdown components

### Backend
- Node.js
- Express.js framework
- SQLite database
- RESTful API architecture

### External APIs
- OpenWeatherMap API for weather data
- REST Countries API for country information

## Project Structure

```
seiko-sports/
├── seiko-sports-app/                   # React frontend
│   ├── src/
│   │   ├── components/         # UI Components
│   │   │   ├── AddCityForm.tsx # Form for adding cities
│   │   │   ├── CityList.tsx    # List of cities
│   │   │   ├── EditCityForm.tsx# Form for editing cities
│   │   │   ├── Header.tsx      # App header
│   │   │   └── WeatherDisplay.tsx # Weather information
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── App.tsx             # Main application component
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   └── package.json            # Frontend dependencies
│
├── server/                     # Node.js backend
│   ├── controllers/
│   │   └── cityController.js   # City API endpoints
│   ├── database.js             # SQLite database setup
│   ├── validation.js           # Data validation functions
│   ├── city-routes.js          # Express routes
│   ├── index.js                # Server entry point
│   └── package.json            # Backend dependencies
│
└── README.md                   # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Dev0dyssey/seiko-sports.git
   cd seiko-sports/server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
   ```

4. Start the backend server:
   ```bash
   node index.js
   ```
   The server will run on http://localhost:3000 by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../seiko-sports-app
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173 (or another port if 5173 is in use).

## Configuration

### Environment Variables

#### Backend (.env file)
- `OPENWEATHERMAP_API_KEY`: Your API key from OpenWeatherMap (required for weather data)

### API Keys

You'll need to obtain an API key from OpenWeatherMap:
1. Register at [OpenWeatherMap](https://openweathermap.org/)
2. Generate an API key in your account dashboard
3. Add this key to your `.env` file

## API Documentation

The application uses a RESTful API for communication between the frontend and backend.

### City Endpoints

#### Get All Cities
- **URL**: `/cities`
- **Method**: `GET`
- **Response**: Array of city objects with their details

#### Add New City
- **URL**: `/cities`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "cityName": "New York",
    "state": "NY",
    "country": {
      "countryName": "United States",
      "isoCode": "USA",
      "currencyCode": "USD",
      "capitalCoordinates": {
        "latitude": 38.89511,
        "longitude": -77.03637
      }
    },
    "touristRating": 5,
    "dateEstablished": "1624",
    "estimatedPopulation": 8804190
  }
  ```
- **Response**: Created city object

#### Update City
- **URL**: `/cities/:guid`
- **Method**: `PUT`
- **Parameters**: `guid` - City identifier
- **Body**:
  ```json
  {
    "touristRating": 4,
    "dateEstablished": "1624",
    "estimatedPopulation": 8804190
  }
  ```
- **Response**: Success message

#### Delete City
- **URL**: `/cities/:guid`
- **Method**: `DELETE`
- **Parameters**: `guid` - City identifier
- **Response**: Success message

#### Get Weather for City
- **URL**: `/cities/weather`
- **Method**: `GET`
- **Query Parameters**:
  - `lat` - Latitude coordinate
  - `lon` - Longitude coordinate
- **Response**: Weather data object from OpenWeatherMap API

## UI Components

### CityList
Displays all cities in a table format with options to search, select, edit, or delete cities.

### AddCityForm
Form for adding a new city with fields for city details and country selection.

### EditCityForm
Form for updating an existing city's tourist rating, establishment date, and population.

### WeatherDisplay
Shows weather information for the selected city, including current conditions, temperature, and other weather details.

### Header
Application title bar.

## Database Schema

The application uses SQLite with a single `cities` table:

```sql
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guid TEXT NOT NULL UNIQUE,
    cityName TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    touristRating INTEGER NOT NULL,
    dateEstablished TEXT NOT NULL,
    estimatedPopulation INTEGER NOT NULL,
    isoCode TEXT,
    currencyCode TEXT,
    capitalLatitude REAL,
    capitalLongitude REAL
)
```

## Usage Guide

### Adding a City
1. Click the "Add City" button below the city list
2. Fill in the city details:
   - Name (required)
   - State/Province (required)
   - Country (select from dropdown)
   - Tourist Rating (1-5)
   - Date Established
   - Estimated Population
3. Click "Add" to save the city

### Viewing Weather
1. Click on any city row in the city list
2. The weather information for the selected city will appear below the list
3. The weather display shows:
   - Current temperature (in Celsius)
   - Weather conditions with icon
   - "Feels like" temperature
   - Min/max temperatures
   - Humidity percentage
   - Wind speed
   - Sunrise and sunset times

### Searching for Cities
Use the search bar above the city list to filter cities by name.

### Editing a City
1. Click the "Edit" button next to the city you want to modify
2. Update the tourist rating, date established, or population
3. Click "Update" to save changes

### Deleting a City
Click the "Delete" button next to the city you want to remove. This action cannot be undone.

## Troubleshooting

### Common Issues

#### Weather Data Not Loading
- Verify your OpenWeatherMap API key is correctly set in the `.env` file
- Check browser console for any API errors
- Ensure the city has valid coordinates

#### City Already Exists Error
The application prevents duplicate city names. If you receive this error, use a different name or edit the existing city.

#### Database Connection Issues
If the server fails to connect to the database:
1. Ensure the SQLite database file has appropriate permissions
2. Check if any other process is using the database file
3. Restart the server

## Future Enhancements

- User authentication system
- Dark mode support
- Expanded weather information with forecasts
- Map visualization for cities
- Offline support
- Mobile application version
- Additional statistical data about cities
- Multiple language support

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenWeatherMap for weather data API
- REST Countries API for country information
- Seiko Sports Technologies for the project requirements

---

Developed by [Your Name] for Seiko Sports Technologies
