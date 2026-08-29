'use client';

interface Reason {
  title: string;
  description: string;
  factor?: string;
  change?: string;
}

interface ForecastReasonProps {
  reasons?: Reason[];
  direction?: 'up' | 'down';
}

export default function ForecastReason({ 
  reasons = [
    {
      title: 'Boundary Layer Collapse',
      description: 'PBL height expected to drop 15% in the next 6 hours due to radiative cooling.',
      factor: 'PBL Height',
      change: '↓ -15%'
    },
    {
      title: 'Wind Stagnation',
      description: 'Surface wind speeds will reduce significantly, limiting horizontal pollutant transport.',
      factor: 'Wind Speed',
      change: '↓ -22%'
    },
    {
      title: 'Regional Plume Approach',
      description: 'Stubble-burning plume from Punjab will reach the region by evening.',
      factor: 'Fire Plume',
      change: '→ Incoming'
    }
  ],
  direction = 'up'
}: ForecastReasonProps) {
  return (
    <div className="forecast-reason">
      <h3>Why is it {direction === 'up' ? 'worsening' : 'improving'}?</h3>
      
      <div className="reasons-list">
        {reasons.map((reason, idx) => (
          <div key={idx} className="reason-card">
            <div className="reason-header">
              <h4>{reason.title}</h4>
              {reason.change && <span className="reason-change">{reason.change}</span>}
            </div>
            <p className="reason-description">{reason.description}</p>
            {reason.factor && (
              <span className="reason-factor">Primary factor: {reason.factor}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
