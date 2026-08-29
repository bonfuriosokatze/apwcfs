'use client';

interface Fire {
  id: string;
  lat: number;
  lon: number;
  intensity: number;
  name?: string;
}

interface FireLayerProps {
  fires?: Fire[];
  visible?: boolean;
}

export default function FireLayer({ fires = [], visible = true }: FireLayerProps) {
  return (
    <div className="fire-layer" style={{ display: visible ? 'block' : 'none' }}>
      <h3>Active Fire Sources</h3>
      {fires.length === 0 ? (
        <p>No active fires detected in the region</p>
      ) : (
        <ul className="fires-list">
          {fires.map((fire) => (
            <li key={fire.id}>
              <span className="fire-icon">🔥</span>
              <span className="fire-name">{fire.name || `Fire at ${fire.lat.toFixed(2)}, ${fire.lon.toFixed(2)}`}</span>
              <span className="fire-intensity">Intensity: {fire.intensity}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
