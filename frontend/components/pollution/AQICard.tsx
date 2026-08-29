'use client';

interface AQICardProps {
  value?: number;
  category?: string;
  color?: string;
}

export default function AQICard({ 
  value = 386,
  category = 'Poor',
  color = '#DC143C'
}: AQICardProps) {
  return (
    <div className="aqi-card" style={{ borderColor: color }}>
      <h3>AQI</h3>
      <div className="aqi-value-display" style={{ color }}>
        <span className="value">{value}</span>
      </div>
      <p className="aqi-category">{category}</p>
      <p className="aqi-warning">High pollution levels detected. Vulnerable groups should limit outdoor activities.</p>
    </div>
  );
}
