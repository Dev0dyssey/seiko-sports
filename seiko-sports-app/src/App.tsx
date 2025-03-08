import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import CityList from "./components/CityList";
import AddCityForm from "./components/AddCityForm";
import EditCityForm from "./components/EditCityForm";
import WeatherDisplay from "./components/WeatherDisplay";
import { City } from "./types";

function App() {
  const [cities, setCities] = useState<City[]>([
    {
      id: 1,
      name: "London",
      state: "England",
      country: "United Kingdom",
      touristRating: 4,
      dateEstablished: "43 AD",
      estimatedPopulation: 8900000,
    },
    {
      id: 2,
      name: "New York",
      state: "New York",
      country: "United States",
      touristRating: 5,
      dateEstablished: "1624",
      estimatedPopulation: 8400000,
    },
    {
      id: 3,
      name: "Tokyo",
      state: "Tokyo",
      country: "Japan",
      touristRating: 4,
      dateEstablished: "1457",
      estimatedPopulation: 13960000,
    },
    {
      id: 4,
      name: "Sydney",
      state: "New South Wales",
      country: "Australia",
      touristRating: 5,
      dateEstablished: "1788",
      estimatedPopulation: 5312000,
    },
    {
      id: 5,
      name: "Paris",
      state: "Île-de-France",
      country: "France",
      touristRating: 5,
      dateEstablished: "3rd century BC",
      estimatedPopulation: 2141000,
    },
  ]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCity, setEditingCity] = useState<City | null>(null); // New state for editing city
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (response.ok) {
          const data = await response.json();
          const countryNamesFilter = data.map(
            (country: any) => country.name.common
          );
          const countryNames = countryNamesFilter.map((country: string) => ({
            value: country,
            label: country,
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
        {selectedCity && <WeatherDisplay cityName={selectedCity.name} />}
      </main>
    </div>
  );
}

export default App;
