import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import CityList from "./components/CityList";
import AddCityForm from "./components/AddCityForm";
import EditCityForm from "./components/EditCityForm";
import WeatherDisplay from "./components/WeatherDisplay";
import { City, Country } from "./types";

function App() {
  const [cities, setCities] = useState<City[]>([
    {
      id: 1,
      cityName: "London",
      state: "England",
      country: {
        countryName: "United Kingdom",
        isoCode: "GBR",
        currencyCode: "GBP",
        capitalCoordinates: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      },
      touristRating: 4,
      dateEstablished: "43 AD",
      estimatedPopulation: 8900000,
    },
    {
      id: 2,
      cityName: "New York",
      state: "New York",
      country: {
        countryName: "United States",
        isoCode: "USA",
        currencyCode: "USD",
        capitalCoordinates: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
      touristRating: 5,
      dateEstablished: "1624",
      estimatedPopulation: 8400000,
    },
    {
      id: 3,
      cityName: "Tokyo",
      state: "Tokyo",
      country: {
        countryName: "Japan",
        isoCode: "JPN",
        currencyCode: "JPY",
        capitalCoordinates: {
          latitude: 35.6895,
          longitude: 139.6917,
        },
      },
      touristRating: 4,
      dateEstablished: "1457",
      estimatedPopulation: 13960000,
    },
    {
      id: 4,
      cityName: "Sydney",
      state: "New South Wales",
      country: {
        countryName: "Australia",
        isoCode: "AUS",
        currencyCode: "AUD",
        capitalCoordinates: {
          latitude: -33.8688,
          longitude: 151.2093,
        },
      },
      touristRating: 5,
      dateEstablished: "1788",
      estimatedPopulation: 5312000,
    },
    {
      id: 5,
      cityName: "Paris",
      state: "Île-de-France",
      country: {
        countryName: "France",
        isoCode: "FRA",
        currencyCode: "EUR",
        capitalCoordinates: {
          latitude: 48.8566,
          longitude: 2.3522,
        },
      },
      touristRating: 5,
      dateEstablished: "3rd century BC",
      estimatedPopulation: 2141000,
    },
  ]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCity, setEditingCity] = useState<City | null>(null); // New state for editing city
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (response.ok) {
          const data = await response.json();
          const countryNames = data.map((country: any) => ({
            countryName: country.name.common,
            isoCode: country.cca3,
            currencyCode: Object.keys(country.currencies || {})[0],
            capitalCoordinates: country.capitalInfo?.latlng?.[0] ?? 0,
            longitude: country.capitalInfo?.latlng?.[1] ?? 0,
          }));
          setCountries(countryNames);
        } else {
          throw new Error("Failed to fetch countries");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
  }, []);

  const handleSelectedCity = (city: City) => {
    setSelectedCity(city);
    if (isEditing) {
      setEditingCity(city);
    }
  };

  const handleAddCity = (newCity: Omit<City, "id">) => {
    const nextId =
      cities.length > 0 ? Math.max(...cities.map((city) => city.id)) + 1 : 1;
    setCities([...cities, { ...newCity, id: nextId }]);
    setIsAdding(false);
  };

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setIsEditing(true);
  };

  const handleUpdateCity = (updatedCity: City) => {
    setCities(
      cities.map((city) => (city.id === updatedCity.id ? updatedCity : city))
    );
    setIsEditing(false);
    setEditingCity(null);
  };

  const handleDeleteCity = (cityToDelete: City) => {
    setCities(cities.filter((city) => city.id !== cityToDelete.id));
  };

  return (
    <div className="App">
      <Header />

      <main>
        <CityList
          cities={cities}
          onAddCity={() => setIsAdding(true)}
          onSelectCity={handleSelectedCity}
          onEditCity={handleEditCity}
          onDeleteCity={handleDeleteCity}
        />
        {isAdding && (
          <AddCityForm
            countries={countries}
            onCancel={() => setIsAdding(false)}
            onAddCity={handleAddCity}
          />
        )}
        {isEditing &&
          editingCity && ( // Conditionally render EditCityForm with editingCity data
            <EditCityForm
              key={editingCity.id}
              city={editingCity}
              countries={countries}
              onCancel={() => setIsEditing(false)}
              onUpdateCity={handleUpdateCity}
            />
          )}
        {selectedCity && <WeatherDisplay cityName={selectedCity.cityName} />}
      </main>
    </div>
  );
}

export default App;
