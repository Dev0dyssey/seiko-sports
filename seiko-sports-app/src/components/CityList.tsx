import { City } from "../types";
import "./CityList.css";

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
          {cities.map(
            (city) =>
              city.country && (
                <tr key={city.guid}>
                  {/* Make individual cells clickable instead of the entire row */}
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.guid.toString().substring(0, 8)}...
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.cityName}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.state}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.country.countryName}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.touristRating}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.dateEstablished}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.estimatedPopulation?.toLocaleString()}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.country.isoCode}
                  </td>
                  <td
                    className="clickable-cell"
                    onClick={() => onSelectCity(city)}
                  >
                    {city.country.currencyCode}
                  </td>

                  {/* Actions column - no onSelectCity handler */}
                  <td className="actions-column">
                    <button
                      className="city-table-button edit-button"
                      onClick={() => {
                        onEditCity(city);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="city-table-button delete-button"
                      onClick={() => {
                        onDeleteCity(city);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      {!isAddingCity && (
        <button className="city-table-button add-button" onClick={onAddCity}>
          Add City
        </button>
      )}
    </section>
  );
}

export default CityList;
