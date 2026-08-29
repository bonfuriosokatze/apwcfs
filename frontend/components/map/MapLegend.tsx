'use client';

interface LegendItem {
  color: string;
  label: string;
  range?: string;
}

interface MapLegendProps {
  title?: string;
  items?: LegendItem[];
}

export default function MapLegend({ 
  title = 'AQI Scale',
  items = [
    { color: '#00FF00', label: 'Good', range: '0-50' },
    { color: '#FFFF00', label: 'Satisfactory', range: '51-100' },
    { color: '#FF7F00', label: 'Moderately Polluted', range: '101-200' },
    { color: '#FF0000', label: 'Poor', range: '201-300' },
    { color: '#8B0000', label: 'Very Poor', range: '300+' }
  ]
}: MapLegendProps) {
  return (
    <div className="map-legend">
      <h4>{title}</h4>
      <div className="legend-items">
        {items.map((item) => (
          <div key={item.label} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">
              {item.label}
              {item.range && <span className="legend-range"> ({item.range})</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
