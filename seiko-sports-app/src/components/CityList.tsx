import { City } from "../types";
import "./CityList.css";

// Helper component for clickable cells
const ClickableCell = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <td className="clickable-cell" onClick={onClick}>
    {children}
  </td>
);

interface CityListProps {
  cities: City[];
  onAddCity: () => void;
  onSelectCity: (city: City) => void;
  onEditCity: (city: City) => void;
  onDeleteCity: (city: City) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  isAddingCity: boolean;
}

function CityList({
  cities,
  onAddCity,
  onSelectCity,
  onEditCity,
  onDeleteCity,
  searchQuery,
  onSearch,
  isAddingCity,
}: Readonly<CityListProps>) {
  // Use table data mapping to avoid repetition
  const renderCityRow = (city: City) => {
    // Handler creation for each city
    const handleSelect = () => onSelectCity(city);

    return (
      <tr key={city.guid}>
        <ClickableCell onClick={handleSelect}>
          {city.guid.toString().substring(0, 8)}...
        </ClickableCell>
        <ClickableCell onClick={handleSelect}>{city.cityName}</ClickableCell>
        <ClickableCell onClick={handleSelect}>{city.state}</ClickableCell>
        <ClickableCell onClick={handleSelect}>
          {city.country.countryName}
        </ClickableCell>
        <ClickableCell onClick={handleSelect}>
          {city.touristRating}
        </ClickableCell>
        <ClickableCell onClick={handleSelect}>
          {city.dateEstablished}
        </ClickableCell>
        <ClickableCell onClick={handleSelect}>
          {city.estimatedPopulation?.toLocaleString()}
        </ClickableCell>
        <ClickableCell onClick={handleSelect}>
          {city.country.isoCode}
        </ClickableCell>
        <ClickableCell onClick={handleSelect}>
          {city.country.currencyCode}
        </ClickableCell>

        <td className="actions-column">
          <button
            className="city-table-button edit-button"
            onClick={() => onEditCity(city)}
          >
            Edit
          </button>
          <button
            className="city-table-button delete-button"
            onClick={() => onDeleteCity(city)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <section>
      <h2>City List</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by city name..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {cities.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>State</th>
              <th>Country</th>
              <th>Rating</th>
              <th>Date Established</th>
              <th>Population</th>
              <th>ISO Code</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => city.country && renderCityRow(city))}
          </tbody>
        </table>
      ) : (
        <p className="no-cities-message">
          No cities found matching your search.
        </p>
      )}

      {!isAddingCity && (
        <button className="city-table-button add-button" onClick={onAddCity}>
          Add City
        </button>
      )}
    </section>
  );
}

export default CityList;
