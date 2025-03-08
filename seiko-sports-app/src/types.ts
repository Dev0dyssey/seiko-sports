export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  touristRating: number;
  // String or Date
  dateEstablished: string;
  estimatedPopulation: number;
  isoCode?: string;
  currencyCode?: string;
  weather?: any;
}
