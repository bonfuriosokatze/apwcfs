'use client';

interface PollutantCardProps {
  name: string;
  concentration?: number;
  unit?: string;
  limit?: number;
  color?: string;
}

export default function PollutantCard({ 
  name = 'PM2.5',
  concentration = 245,
  unit = 'µg/m³',
  limit = 60,
  color = '#FF7F00'
}: PollutantCardProps) {
  const exceedancePercent = ((concentration / limit) * 100).toFixed(0);
  
  return (
    <div className="pollutant-card" style={{ borderColor: color }}>
      <h4>{name}</h4>
      <div className="pollutant-value">
        <span className="value">{concentration}</span>
        <span className="unit">{unit}</span>
      </div>
      <div className="pollutant-bar">
        <div 
          className="pollutant-bar-fill" 
          style={{ 
            width: `${Math.min(parseInt(exceedancePercent), 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
      <p className="pollutant-info">{exceedancePercent}% above WHO limit ({limit} {unit})</p>
    </div>
  );
}
