import { useState } from "react";
import { City } from "../types";
import Select, { SingleValue } from "react-select";

interface AddCityFormProps {
  onCancel: () => void;
  onAddCity: (city: Omit<City, "id">) => void;
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
  const [cityName, setName] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [touristRating, setTouristRating] = useState<number>(1);
  const [dateEstablished, setDateEstablished] = useState<string>("");
  const [estimatedPopulation, setEstimatedPopulation] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCountry = countries.find((c) => c.countryName === country);
    const newCity: Omit<City, "id"> = {
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
    onAddCity(newCity);
    onCancel();
  };

  return (
    <section className="add-city-form">
      <h2>Add City</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Add</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </section>
  );
}

export default AddCityForm;
