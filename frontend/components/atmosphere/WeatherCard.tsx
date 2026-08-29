'use client';

interface WeatherCardProps {
  temperature?: number;
  windSpeed?: number;
  windDirection?: string;
  humidity?: number;
}

export default function WeatherCard({ 
  temperature = 28, 
  windSpeed = 2.4, 
  windDirection = 'NE',
  humidity = 65 
}: WeatherCardProps) {
  return (
    <div className="weather-card">
      <h3>Weather</h3>
      <div className="metric">
        <span className="label">Temperature</span>
        <span className="value">{temperature}°C</span>
      </div>
      <div className="metric">
        <span className="label">Wind</span>
        <span className="value">{windSpeed} m/s {windDirection}</span>
      </div>
      <div className="metric">
        <span className="label">Humidity</span>
        <span className="value">{humidity}%</span>
      </div>
    </div>
  );
}
