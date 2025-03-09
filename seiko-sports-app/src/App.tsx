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
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const filteredCities = cities.filter((city) =>
    city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isAdding || isEditing) {
      setTimeout(() => {
        const formElement = document.querySelector(
          ".form-transition-container.open"
        );
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [isAdding, isEditing]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchCities(), fetchCountries()]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

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
      console.error("Error fetching cities:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (response.ok) {
        const data = await response.json();
        const countryNames = data.map((country: any) => ({
          countryName: country.name.common,
          isoCode: country.cca3,
          currencyCode: Object.keys(country.currencies || {})[0],
          capitalCoordinates: {
            latitude: country.capitalInfo?.latlng?.[0] ?? 0,
            longitude: country.capitalInfo?.latlng?.[1] ?? 0,
          },
        }));
        setCountries(countryNames);
      } else {
        throw new Error("Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectedCity = (city: City) => {
    setSelectedCity(city);
    if (isEditing) {
      setEditingCity(city);
    }
  };

  const handleAddCityClick = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingCity(null);
  };

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAddCity = (newCity: City) => {
    setCities([...cities, newCity]);
    setIsAdding(false);
  };

  const handleUpdateCity = (updatedCity: City) => {
    setCities(
      cities.map((city) =>
        city.guid === updatedCity.guid ? updatedCity : city
      )
    );
    setIsEditing(false);
    setEditingCity(null);
  };

  const handleDeleteCity = async (cityToDelete: City) => {
    try {
      const response = await fetch(
        `http://localhost:3000/cities/${cityToDelete.guid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setCities(cities.filter((city) => city.guid !== cityToDelete.guid));

        if (selectedCity?.guid === cityToDelete.guid) {
          setSelectedCity(null);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to delete city:", errorData.error);
        alert(`Failed to delete city: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("An error occurred while trying to delete the city.");
    }
  };

  return (
    <div className="App">
      <Header />

      <main>
        {/* City listing with search */}
        <CityList
          cities={filteredCities}
          onAddCity={handleAddCityClick}
          onSelectCity={handleSelectedCity}
          onEditCity={handleEditCity}
          onDeleteCity={handleDeleteCity}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          isAddingCity={isAdding}
        />

        <div className={`form-transition-container ${isAdding ? "open" : ""}`}>
          {isAdding && (
            <AddCityForm
              countries={countries}
              onCancel={() => setIsAdding(false)}
              onAddCity={handleAddCity}
            />
          )}
        </div>

        <div className={`form-transition-container ${isEditing ? "open" : ""}`}>
          {isEditing && editingCity && (
            <EditCityForm
              key={editingCity.guid}
              city={editingCity}
              onCancel={() => setIsEditing(false)}
              onUpdateCity={handleUpdateCity}
            />
          )}
        </div>

        {selectedCity && <WeatherDisplay cityName={selectedCity.cityName} />}
      </main>
    </div>
  );
}

export default App;
