'use client';

interface LocationData {
  name: string;
  lat: number;
  lon: number;
  aqi: number;
  pm25: number;
  pbl: number;
  wind: string;
  inversion: string;
  timestamp: string;
}

interface LocationPanelProps {
  location?: LocationData;
  isOpen?: boolean;
}

export default function LocationPanel({ 
  location = {
    name: 'Delhi',
    lat: 28.7041,
    lon: 77.1025,
    aqi: 386,
    pm25: 245,
    pbl: 280,
    wind: '1.2 m/s → SE',
    inversion: 'Strong',
    timestamp: '2026-08-29 18:00'
  },
  isOpen = true
}: LocationPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="location-panel">
      <h3>{location.name} — {location.timestamp}</h3>
      
      <div className="location-metric">
        <span className="metric-label">AQI</span>
        <span className="metric-value">{location.aqi}</span>
      </div>

      <div className="location-metric">
        <span className="metric-label">PM2.5</span>
        <span className="metric-value">{location.pm25} µg/m³</span>
      </div>

      <div className="location-metric">
        <span className="metric-label">PBL</span>
        <span className="metric-value">{location.pbl} m</span>
      </div>

      <div className="location-metric">
        <span className="metric-label">Wind</span>
        <span className="metric-value">{location.wind}</span>
      </div>

      <div className="location-metric">
        <span className="metric-label">Inversion</span>
        <span className="metric-value">{location.inversion}</span>
      </div>

      <div className="location-forecast">
        <p className="forecast-text">↑ 18% expected in next 6h</p>
      </div>
    </div>
  );
}
