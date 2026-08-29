'use client';

interface Explanation {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  value?: string | number;
}

interface XAIExplanationProps {
  explanations?: Explanation[];
  summary?: string;
}

export default function XAIExplanation({ 
  explanations = [
    { factor: 'PBL Height', impact: 'high', value: '280 m' },
    { factor: 'Wind Speed', impact: 'high', value: '1.2 m/s' },
    { factor: 'Fire Plume', impact: 'medium', value: 'Regional' },
    { factor: 'Inversion', impact: 'high', value: 'Strong' },
    { factor: 'Humidity', impact: 'low', value: '65%' }
  ],
  summary = 'Low wind speeds and a shallow boundary layer are limiting pollutant dispersion. A regional biomass-burning plume is also projected to influence the region.'
}: XAIExplanationProps) {
  const getImpactWidth = (impact: string) => {
    switch(impact) {
      case 'high': return '85%';
      case 'medium': return '55%';
      case 'low': return '30%';
      default: return '0%';
    }
  };

  return (
    <div className="xai-explanation">
      <h3>Why is pollution high?</h3>
      <p className="xai-intro">Strong pollution accumulation is expected because:</p>
      
      <div className="xai-factors">
        {explanations.map((exp) => (
          <div key={exp.factor} className="xai-factor">
            <span className="factor-name">{exp.factor}</span>
            <div className="factor-bar-container">
              <div 
                className={`factor-bar factor-${exp.impact}`}
                style={{ width: getImpactWidth(exp.impact) }}
              />
            </div>
            <span className="factor-impact">{exp.impact}</span>
            {exp.value && <span className="factor-value">{exp.value}</span>}
          </div>
        ))}
      </div>

      <div className="xai-interpretation">
        <h4>Interpretation</h4>
        <p>{summary}</p>
      </div>
    </div>
  );
}
