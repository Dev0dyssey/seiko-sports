export interface City {
  guid: number;
  cityName: string;
  state: string;
  country: Country;
  touristRating: number;
  // String or Date
  dateEstablished: string;
  estimatedPopulation: number;
  weather?: any;
}

export interface Country {
  countryName: string;
  isoCode: string;
  currencyCode: string;
  capitalCoordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface WeatherData {
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  name: string;
  dt: number; // Unix timestamp
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}
