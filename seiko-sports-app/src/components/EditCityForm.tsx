import React, { useState } from "react";
import { City } from "../types";
import "./Forms.css";

interface EditCityFormProps {
  city: City;
  onCancel: () => void;
  onUpdateCity: (city: City) => void;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "number";
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  min?: number;
  max?: number;
}

const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  required,
  min,
  max,
}: FormField) => (
  <div className="form-group">
    <label htmlFor={id}>{label}:</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      min={min}
      max={max}
    />
  </div>
);

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

  const createUpdatedCityObject = (): City => {
    return {
      ...city,
      touristRating,
      dateEstablished,
      estimatedPopulation,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCity = createUpdatedCityObject();

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

  const formFields: FormField[] = [
    {
      id: "rating",
      label: "Tourist Rating",
      type: "number",
      value: touristRating,
      onChange: (value) => setTouristRating(Number(value)),
      min: 1,
      max: 5,
      required: true,
    },
    {
      id: "date",
      label: "Date Established",
      type: "text",
      value: dateEstablished,
      onChange: (value) => setDateEstablished(value),
      required: true,
    },
    {
      id: "population",
      label: "Estimated Population",
      type: "number",
      value: estimatedPopulation,
      onChange: (value) => setEstimatedPopulation(Number(value)),
      required: true,
    },
  ];

  return (
    <section className="form-container">
      <h2>Edit City: {city.cityName}</h2>
      <form onSubmit={handleSubmit}>
        <div className="city-info">
          <p>
            <strong>City:</strong> {city.cityName}
          </p>
          <p>
            <strong>State/Province:</strong> {city.state}
          </p>
          <p>
            <strong>Country:</strong> {city.country.countryName}
          </p>
        </div>

        {formFields.map((field) => (
          <FormField key={field.id} {...field} />
        ))}

        {/* Action buttons */}
        <div className="button-group">
          <button type="submit">Update</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditCityForm;
