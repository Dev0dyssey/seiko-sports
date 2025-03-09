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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCountry = countries.find((c) => c.countryName === country);
    const newCity: Omit<City, "guid"> = {
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

        const rowData = responseData.row;

        const formattedCity: City = {
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

        onAddCity(formattedCity);
        onCancel();
      } else {
        throw new Error("Failed to add city");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="form-container">
      <h2>Add City</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
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
          options={countries.map((country) => ({
            value: country.countryName,
            label: country.countryName,
          }))}
          value={{ value: country, label: country }}
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
