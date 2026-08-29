// Formatting utility functions

export function formatAQI(value: number): string {
  return value.toFixed(0);
}

export function formatConcentration(value: number, unit: string): string {
  return `${value.toFixed(1)} ${unit}`;
}

export function formatTemperature(value: number): string {
  return `${value.toFixed(1)}°C`;
}

export function formatWindSpeed(speed: number, direction: string): string {
  return `${speed.toFixed(1)} m/s ${direction}`;
}

export function formatHeight(value: number): string {
  return `${value.toFixed(0)} m`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
