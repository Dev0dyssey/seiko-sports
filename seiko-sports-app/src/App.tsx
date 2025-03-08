import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import CityList from "./components/CityList";
import AddCityForm from "./components/AddCityForm";
import EditCityForm from "./components/EditCityForm";
import WeatherDisplay from "./components/WeatherDisplay";
import { City, Country } from "./types";

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCity, setEditingCity] = useState<City | null>(null); // New state for editing city
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:3000/cities");
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        } else {
          throw new Error("Failed to fetch cities");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCities();

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

    Promise.all([fetchCities(), fetchCountries()]).catch((error) => {
      console.error("Error fetching data:", error);
    });
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
