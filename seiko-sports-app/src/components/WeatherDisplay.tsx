import { useEffect, useState } from "react";
import { City, WeatherData } from "../types";
import "./WeatherDisplay.css";

interface WeatherDisplayProps {
  city: City;
}

function WeatherDisplay({ city }: Readonly<WeatherDisplayProps>) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { latitude, longitude } = city.country.capitalCoordinates;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/cities/weather?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Unable to load weather information");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeatherData();
    } else {
      setError("No location coordinates available for this city");
      setLoading(false);
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <section className="weather-container weather-loading">
        <h2>Weather for {city.cityName}</h2>
        <div className="loading-spinner">Loading weather information</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="weather-container weather-error">
        <h2>Weather for {city.cityName}</h2>
        <div className="error-message">{error}</div>
      </section>
    );
  }

  if (!weatherData) {
    return (
      <section className="weather-container weather-error">
        <h2>Weather for {city.cityName}</h2>
        <div className="error-message">No weather data available</div>
      </section>
    );
  }

  const kelvinToCelsius = (kelvin: number) => {
    return kelvin - 273.15;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="weather-container">
      <h2>Weather for {city.cityName}</h2>
      <p className="weather-note">
        Data from {weatherData.name}, {weatherData.sys.country}
      </p>

      <div className="current-weather">
        <div className="weather-main">
          <div className="temperature">
            {Math.round(kelvinToCelsius(weatherData.main.temp))}°C
          </div>
          <div className="conditions">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <span>{weatherData.weather[0].description}</span>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">
              {Math.round(kelvinToCelsius(weatherData.main.feels_like))}°C
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Min / Max</span>
            <span className="detail-value">
              {Math.round(kelvinToCelsius(weatherData.main.temp_min))}° /
              {Math.round(kelvinToCelsius(weatherData.main.temp_max))}°
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weatherData.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{weatherData.wind.speed} m/s</span>
          </div>
        </div>
      </div>

      <div className="weather-additional">
        <div className="sun-times">
          <div className="sun-time-item">
            <span className="sun-time-label">Sunrise</span>
            <span className="sun-time-value">
              {formatTime(weatherData.sys.sunrise)}
            </span>
          </div>
          <div className="sun-time-item">
            <span className="sun-time-label">Sunset</span>
            <span className="sun-time-value">
              {formatTime(weatherData.sys.sunset)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeatherDisplay;
