'use client';

interface TimePoint {
  hour: number;
  aqi: number;
}

interface ForecastTimelineProps {
  data?: TimePoint[];
  selectedHour?: number;
  onSelectHour?: (hour: number) => void;
}

export default function ForecastTimeline({ 
  data = [
    { hour: 0, aqi: 320 },
    { hour: 6, aqi: 295 },
    { hour: 12, aqi: 310 },
    { hour: 18, aqi: 325 },
    { hour: 24, aqi: 340 },
    { hour: 30, aqi: 350 },
    { hour: 36, aqi: 345 },
    { hour: 48, aqi: 320 },
    { hour: 60, aqi: 280 },
    { hour: 72, aqi: 250 }
  ],
  selectedHour = 0,
  onSelectHour = () => {}
}: ForecastTimelineProps) {
  return (
    <div className="forecast-timeline">
      <div className="timeline-container">
        {data.map((point) => (
          <div 
            key={point.hour}
            className={`timeline-point ${selectedHour === point.hour ? 'active' : ''}`}
            onClick={() => onSelectHour(point.hour)}
          >
            <div className="timeline-marker" style={{ height: `${(point.aqi / 400) * 100}%` }} />
            <span className="timeline-label">{point.hour}h</span>
          </div>
        ))}
      </div>
      <div className="timeline-info">
        <span>00 — 72 HOURS</span>
      </div>
    </div>
  );
}
