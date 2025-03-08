interface WeatherDisplayProps {
  cityName: string;
}

function WeatherDisplay({ cityName }: WeatherDisplayProps) {
  return (
    <section>
      <h2>{cityName} Weather</h2>
      {/* Placeholder for weather display */}
    </section>
  );
}

export default WeatherDisplay;
