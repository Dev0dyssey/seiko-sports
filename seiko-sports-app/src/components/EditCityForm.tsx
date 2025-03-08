// src/components/EditCityForm.tsx
import React, { useState } from "react";
import { City } from "../types";
import Select, { SingleValue } from "react-select";

interface EditCityFormProps {
  city: City;
  onCancel: () => void;
  onUpdateCity: (city: City) => void;
  countries: { value: string; label: string }[];
}

function EditCityForm({
  city,
  onCancel,
  onUpdateCity,
  countries,
}: Readonly<EditCityFormProps>) {
  const [cityName, setName] = useState(city.cityName);
  const [state, setState] = useState(city.state);
  const [country, setCountry] = useState(city.country);
  const [touristRating, setTouristRating] = useState(city.touristRating);
  const [dateEstablished, setDateEstablished] = useState(city.dateEstablished);
  const [estimatedPopulation, setEstimatedPopulation] = useState(
    city.estimatedPopulation
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCity: City = {
      ...city, // Keep the original city ID
      cityName,
      state,
      country,
      touristRating,
      dateEstablished,
      estimatedPopulation,
    };
    onUpdateCity(updatedCity);
    onCancel();
  };

  return (
    <section>
      <h2>Edit City</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields similar to AddCityForm, but with values pre-filled from the city prop */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={cityName}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <Select
          // TODO: MOVE STYLES TO CSS STYLESHEET
          styles={{
            menu: (provided) => ({
              ...provided,
              backgroundColor: "lightgray",
            }),
            option: (provided, state) => ({
              ...provided,
              color: "black", // Default option text color
              backgroundColor: state.isFocused ? "lightgray" : "white",
            }),
          }}
          options={countries}
          value={countries.find((c) => c.value === country)}
          onChange={(e: SingleValue<{ value: string; label: string }>) =>
            setCountry(e ? e.value : "")
          }
        />
        <div>
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            value={touristRating}
            onChange={(e) => setTouristRating(Number(e.target.value))}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date Established:</label>
          <input
            type="text"
            id="date"
            value={dateEstablished}
            onChange={(e) => setDateEstablished(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="population">Population:</label>
          <input
            type="number"
            id="population"
            value={estimatedPopulation}
            onChange={(e) => setEstimatedPopulation(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </section>
  );
}

export default EditCityForm;
