// Forecast utility functions

export interface ForecastPoint {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  temperature: number;
  windSpeed: number;
  windDirection: string;
  pblHeight: number;
  humidity: number;
}

export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderately Polluted';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00FF00';
  if (aqi <= 100) return '#FFFF00';
  if (aqi <= 200) return '#FF7F00';
  if (aqi <= 300) return '#FF0000';
  if (aqi <= 400) return '#8B0000';
  return '#4B0082';
}

export function calculateTrend(
  currentValue: number,
  nextValue: number
): 'up' | 'down' | 'stable' {
  const change = nextValue - currentValue;
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
}

export function formatForecastTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
