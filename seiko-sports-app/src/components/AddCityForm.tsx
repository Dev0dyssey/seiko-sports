import { useState } from "react";
import { City } from "../types";
import Select, { SingleValue } from "react-select";
import "./Forms.css";

interface AddCityFormProps {
  onCancel: () => void;
  onAddCity: (city: City) => void;
  countries: {
    countryName: string;
    isoCode: string;
    currencyCode: string;
    capitalCoordinates: { latitude: number; longitude: number };
  }[];
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

function AddCityForm({
  onCancel,
  onAddCity,
  countries,
}: Readonly<AddCityFormProps>) {
  const [cityName, setCityName] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [touristRating, setTouristRating] = useState<number>(1);
  const [dateEstablished, setDateEstablished] = useState<string>("");
  const [estimatedPopulation, setEstimatedPopulation] = useState<number>(0);

  const createCityObject = (): Omit<City, "guid"> => {
    const selectedCountry = countries.find((c) => c.countryName === country);
    return {
      cityName,
      state,
      country: {
        countryName: selectedCountry ? selectedCountry.countryName : "",
        isoCode: selectedCountry ? selectedCountry.isoCode : "",
        currencyCode: selectedCountry ? selectedCountry.currencyCode : "",
        capitalCoordinates: selectedCountry
          ? selectedCountry.capitalCoordinates
          : { latitude: 0, longitude: 0 },
      },
      touristRating,
      dateEstablished,
      estimatedPopulation,
    };
  };

  const formatResponseToCity = (responseData: any): City => {
    const rowData = responseData.row;
    return {
      guid: rowData.guid,
      cityName: rowData.cityName,
      state: rowData.state,
      country: {
        countryName: rowData.country,
        isoCode: rowData.isoCode || "",
        currencyCode: rowData.currencyCode || "",
        capitalCoordinates: {
          latitude: rowData.capitalLatitude || 0,
          longitude: rowData.capitalLongitude || 0,
        },
      },
      touristRating: rowData.touristRating,
      dateEstablished: rowData.dateEstablished,
      estimatedPopulation: rowData.estimatedPopulation,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCity = createCityObject();

    try {
      const response = await fetch("http://localhost:3000/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      if (response.ok) {
        const responseData = await response.json();
        const formattedCity = formatResponseToCity(responseData);
        onAddCity(formattedCity);
        onCancel();
      } else {
        throw new Error("Failed to add city");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formFields: FormField[] = [
    {
      id: "name",
      label: "Name",
      type: "text",
      value: cityName,
      onChange: (value) => setCityName(value),
      required: true,
    },
    {
      id: "state",
      label: "State",
      type: "text",
      value: state,
      onChange: (value) => setState(value),
      required: true,
    },
    {
      id: "rating",
      label: "Rating",
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
      label: "Population",
      type: "number",
      value: estimatedPopulation,
      onChange: (value) => setEstimatedPopulation(Number(value)),
      required: true,
    },
  ];

  const countryOptions = countries.map((country) => ({
    value: country.countryName,
    label: country.countryName,
  }));

  return (
    <section className="form-container">
      <h2>Add City</h2>
      <form onSubmit={handleSubmit}>
        {formFields.slice(0, 2).map((field) => (
          <FormField key={field.id} {...field} />
        ))}

        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <Select
            className="country-select"
            classNamePrefix="country-select"
            options={countryOptions}
            value={country ? { value: country, label: country } : null}
            onChange={(e: SingleValue<{ value: string; label: string }>) =>
              setCountry(e ? e.value : "")
            }
          />
        </div>

        {formFields.slice(2).map((field) => (
          <FormField key={field.id} {...field} />
        ))}

        <div className="button-group">
          <button type="submit">Add</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddCityForm;
