'use client';

interface ForecastSummaryProps {
  currentAQI?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  trendPercent?: number;
  timeframe?: string;
}

export default function ForecastSummary({ 
  currentAQI = 386,
  trend = 'increasing',
  trendPercent = 18,
  timeframe = 'next 6h'
}: ForecastSummaryProps) {
  const trendSymbol = trend === 'increasing' ? '↑' : trend === 'decreasing' ? '↓' : '→';
  
  return (
    <div className="forecast-summary">
      <h3>Forecast Trend</h3>
      <div className="summary-content">
        <div className="aqi-display">
          <span className="aqi-value">{currentAQI}</span>
          <span className="aqi-label">Current AQI</span>
        </div>
        <div className="trend-display">
          <span className="trend-indicator">{trendSymbol}</span>
          <span className="trend-text">{trendPercent}% {trend} {timeframe}</span>
        </div>
      </div>
      <p className="summary-description">
        Air quality is expected to {trend} due to meteorological changes and atmospheric circulation patterns.
      </p>
    </div>
  );
}
