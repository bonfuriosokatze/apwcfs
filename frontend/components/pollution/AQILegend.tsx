'use client';

export default function AQILegend() {
  const aqiCategories = [
    { min: 0, max: 50, category: 'Good', color: '#00FF00' },
    { min: 51, max: 100, category: 'Satisfactory', color: '#FFFF00' },
    { min: 101, max: 200, category: 'Moderately Polluted', color: '#FF7F00' },
    { min: 201, max: 300, category: 'Poor', color: '#FF0000' },
    { min: 301, max: 400, category: 'Very Poor', color: '#8B0000' },
    { min: 401, max: 500, category: 'Severe', color: '#4B0082' }
  ];

  return (
    <div className="aqi-legend">
      <h3>AQI Scale</h3>
      <div className="legend-items">
        {aqiCategories.map((cat) => (
          <div key={cat.category} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: cat.color }}
            />
            <div className="legend-text">
              <span className="category-name">{cat.category}</span>
              <span className="category-range">{cat.min}–{cat.max}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
