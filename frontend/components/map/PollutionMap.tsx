'use client';

interface PollutionMapProps {
  center?: [number, number];
  zoom?: number;
  layer?: 'aqi' | 'pm25' | 'pm10' | 'o3';
}

export default function PollutionMap({ 
  center = [28.7041, 77.1025], 
  zoom = 10,
  layer = 'aqi'
}: PollutionMapProps) {
  return (
    <div className="pollution-map">
      <div className="map-container" id="map" style={{ width: '100%', height: '500px' }}>
        {/* Map will be rendered here using Leaflet or similar */}
        <div className="map-placeholder">
          Loading map for Delhi NCR... (lat: {center[0]}, lon: {center[1]})
          <br />
          Zoom: {zoom}, Layer: {layer}
        </div>
      </div>
    </div>
  );
}
