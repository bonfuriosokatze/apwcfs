'use client';

interface PlumeLayerProps {
  visible?: boolean;
  opacity?: number;
  direction?: string;
}

export default function PlumeLayer({ 
  visible = true, 
  opacity = 0.7,
  direction = 'SE'
}: PlumeLayerProps) {
  return (
    <div className="plume-layer" style={{ display: visible ? 'block' : 'none', opacity }}>
      <h3>Regional Pollution Plume</h3>
      <div className="plume-info">
        <p>Active regional biomass-burning plume detected</p>
        <div className="plume-direction">
          <span className="label">Direction:</span>
          <span className="value">{direction} →</span>
        </div>
      </div>
      <div className="plume-visualization">
        {/* Plume visualization will be rendered on the map */}
        <canvas id="plume-canvas" style={{ width: '100%', height: '200px' }} />
      </div>
    </div>
  );
}
