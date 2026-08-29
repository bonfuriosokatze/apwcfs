'use client';

interface InversionCardProps {
  strength?: 'weak' | 'moderate' | 'strong';
  temperature?: number;
  height?: number;
}

export default function InversionCard({ 
  strength = 'strong', 
  temperature = 5,
  height = 450
}: InversionCardProps) {
  const strengthColor = {
    weak: '#FFD700',
    moderate: '#FFA500',
    strong: '#DC143C'
  }[strength];
  
  return (
    <div className="inversion-card">
      <h3>Temperature Inversion</h3>
      <div className="metric">
        <span className="label">Strength</span>
        <span className="value" style={{ color: strengthColor }}>{strength}</span>
      </div>
      <div className="metric">
        <span className="label">Height</span>
        <span className="value">{height} m</span>
      </div>
      <div className="metric">
        <span className="label">Temperature Difference</span>
        <span className="value">+{temperature}°C</span>
      </div>
      <p className="description">Strong inversions prevent vertical mixing and trap pollutants at the surface.</p>
    </div>
  );
}
