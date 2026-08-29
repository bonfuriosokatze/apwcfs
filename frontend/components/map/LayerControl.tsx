'use client';

interface Layer {
  name: string;
  enabled: boolean;
}

interface LayerControlProps {
  layers?: Layer[];
  onChange?: (layer: string) => void;
}

export default function LayerControl({ 
  layers = [
    { name: 'AQI', enabled: true },
    { name: 'PM2.5', enabled: false },
    { name: 'PM10', enabled: false },
    { name: 'O₃', enabled: false },
    { name: 'Wind', enabled: true },
    { name: 'PBL', enabled: false },
    { name: 'Inversion', enabled: false },
    { name: 'Fires', enabled: false },
    { name: 'Plume', enabled: false }
  ],
  onChange = () => {}
}: LayerControlProps) {
  return (
    <div className="layer-control">
      <h3>Map Layers</h3>
      
      <div className="layer-group">
        <h4>Pollution</h4>
        {layers.slice(0, 4).map((layer) => (
          <label key={layer.name} className="layer-checkbox">
            <input 
              type="checkbox" 
              defaultChecked={layer.enabled}
              onChange={() => onChange(layer.name)}
            />
            <span>{layer.name}</span>
          </label>
        ))}
      </div>

      <div className="layer-group">
        <h4>Atmosphere</h4>
        {layers.slice(4, 7).map((layer) => (
          <label key={layer.name} className="layer-checkbox">
            <input 
              type="checkbox" 
              defaultChecked={layer.enabled}
              onChange={() => onChange(layer.name)}
            />
            <span>{layer.name}</span>
          </label>
        ))}
      </div>

      <div className="layer-group">
        <h4>Sources</h4>
        {layers.slice(7).map((layer) => (
          <label key={layer.name} className="layer-checkbox">
            <input 
              type="checkbox" 
              defaultChecked={layer.enabled}
              onChange={() => onChange(layer.name)}
            />
            <span>{layer.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
