// src/components/EditCityForm.tsx
import React, { useState } from "react";
import { City } from "../types";
import "./Forms.css";

interface EditCityFormProps {
  city: City;
  onCancel: () => void;
  onUpdateCity: (city: City) => void;
}

function EditCityForm({
  city,
  onCancel,
  onUpdateCity,
}: Readonly<EditCityFormProps>) {
  const [touristRating, setTouristRating] = useState(city.touristRating);
  const [dateEstablished, setDateEstablished] = useState(city.dateEstablished);
  const [estimatedPopulation, setEstimatedPopulation] = useState(
    city.estimatedPopulation
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCity: City = {
      ...city,
      touristRating,
      dateEstablished,
      estimatedPopulation,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/cities/${city.guid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCity),
        }
      );

      if (response.ok) {
        onUpdateCity(updatedCity);
        onCancel();
      } else {
        throw new Error("Failed to update city");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="form-container">
      <h2>Edit City</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditCityForm;
