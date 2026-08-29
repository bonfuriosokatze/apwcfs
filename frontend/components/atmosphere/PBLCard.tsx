'use client';

interface PBLCardProps {
  height?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export default function PBLCard({ height = 280, trend = 'decreasing' }: PBLCardProps) {
  const trendSymbol = trend === 'increasing' ? '↑' : trend === 'decreasing' ? '↓' : '→';
  
  return (
    <div className="pbl-card">
      <h3>Planetary Boundary Layer</h3>
      <div className="metric">
        <span className="label">Height</span>
        <span className="value">{height} m</span>
      </div>
      <div className="metric">
        <span className="label">Trend</span>
        <span className="value">{trendSymbol} {trend}</span>
      </div>
      <p className="description">Lower PBL heights trap pollutants closer to the surface, increasing ground-level concentrations.</p>
    </div>
  );
}
