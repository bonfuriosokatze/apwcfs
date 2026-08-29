'use client';

interface Feature {
  name: string;
  contribution: number;
  direction: 'positive' | 'negative' | 'neutral';
  value?: string | number;
}

interface FeatureContributionProps {
  features?: Feature[];
}

export default function FeatureContribution({ 
  features = [
    { name: 'PBL Height', contribution: -45, direction: 'negative', value: '280 m' },
    { name: 'Wind Speed', contribution: -38, direction: 'negative', value: '1.2 m/s' },
    { name: 'Fire Intensity', contribution: 32, direction: 'positive', value: 'High' },
    { name: 'Temperature', contribution: 15, direction: 'positive', value: '28°C' },
    { name: 'Humidity', contribution: 8, direction: 'positive', value: '65%' }
  ]
}: FeatureContributionProps) {
  return (
    <div className="feature-contribution">
      <h3>Feature Contributions (SHAP)</h3>
      <div className="contribution-chart">
        {features.map((feat) => (
          <div key={feat.name} className="contribution-row">
            <span className="feat-name">{feat.name}</span>
            <div className="contribution-bar-container">
              <div 
                className={`contribution-bar ${feat.direction}`}
                style={{ 
                  width: `${Math.abs(feat.contribution)}%`,
                  marginLeft: feat.direction === 'negative' ? `${Math.abs(feat.contribution)}%` : '0'
                }}
              />
            </div>
            <span className="feat-value">{feat.contribution > 0 ? '+' : ''}{feat.contribution}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
