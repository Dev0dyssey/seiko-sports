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
