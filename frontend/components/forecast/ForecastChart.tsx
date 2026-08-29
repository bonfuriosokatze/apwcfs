'use client';

interface ChartData {
  time: string;
  value: number;
}

interface ForecastChartProps {
  data?: ChartData[];
  title?: string;
  unit?: string;
}

export default function ForecastChart({ 
  data = [
    { time: '00h', value: 320 },
    { time: '06h', value: 310 },
    { time: '12h', value: 340 },
    { time: '18h', value: 360 },
    { time: '24h', value: 350 },
    { time: '30h', value: 330 },
    { time: '36h', value: 310 },
    { time: '42h', value: 290 },
    { time: '48h', value: 280 },
    { time: '54h', value: 270 },
    { time: '60h', value: 260 },
    { time: '66h', value: 250 },
    { time: '72h', value: 240 }
  ],
  title = 'AQI Forecast',
  unit = 'AQI'
}: ForecastChartProps) {
  return (
    <div className="forecast-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        <canvas id="forecast-chart" style={{ width: '100%', height: '250px' }}>
          {/* Chart will be rendered here using Chart.js or similar */}
        </canvas>
        <div className="chart-placeholder">
          Line chart showing {title} trend over 72 hours
          <br />
          Unit: {unit}
        </div>
      </div>
    </div>
  );
}
