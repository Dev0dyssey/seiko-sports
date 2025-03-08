import { City } from "../types";
import "./CityList.css";

interface CityListProps {
  cities: City[];
  onAddCity: () => void;
  onSelectCity: (city: City) => void;
  onEditCity: (city: City) => void;
  onDeleteCity: (city: City) => void;
}

function CityList({
  cities,
  onAddCity,
  onSelectCity,
  onEditCity,
  onDeleteCity,
}: Readonly<CityListProps>) {
  return (
    <section>
      <h2>City List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Country</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id} onClick={() => onSelectCity(city)}>
              <td>{city.cityName}</td>
              <td>{city.state}</td>
              <td>{city.country.countryName}</td>
              <td>{city.touristRating}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCity(city);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCity(city);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAddCity}>Add City</button>
    </section>
  );
}

export default CityList;
