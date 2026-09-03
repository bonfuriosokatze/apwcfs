import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Next-Gen Air Quality Forecaster</h1>
        <p className="hero-subtitle" style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>
          A deeply integrated platform combining live Ground-Station Telemetry, WRF-Chem inspired Satellite Synthesis, and an advanced <strong>Explainable AI Neural Pipeline</strong> to not just track, but predict and diagnose the atmospheric physics of regional pollution.
        </p>
      </div>
      
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', marginTop: 0 }}>Beyond the AQI Number</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.7', fontSize: '1.05rem' }}>
              The traditional Air Quality Index tells you the air is bad, but it doesn't tell you <em>why</em>. Our platform crosses satellite-derived Aerosol Optical Depth (AOD) with live meteorological vectors (Boundary Layers, Inversions, Humidity) to diagnose the exact physical traps causing the smog.
            </p>
          </div>
          <Link to="/dashboard" className="btn-primary" style={{ textAlign: 'center', padding: '1rem', fontSize: '1.1rem' }}>Enter the Dashboard</Link>
        </div>
        
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#8b5cf6', marginTop: 0 }}>The Neural Pipeline</h2>
          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.9', paddingLeft: '1.2rem', fontSize: '1.05rem' }}>
            <li>📡 <strong>Satellite Failover:</strong> Seamless fallback to NASA/Copernicus satellite data if local ground stations drop offline.</li>
            <li>🔬 <strong>Chemical Trace:</strong> Real-time tracking of CO and SO₂ to identify active agricultural stubble burning plumes.</li>
            <li>🤖 <strong>X-AI Diagnostics:</strong> Generative AI models instantly explain the current physical drivers trapping pollution over the city.</li>
            <li>⏳ <strong>72-Hour X-AI Prediction:</strong> A 3-day simulated trajectory explaining exactly how and why pollution will shift based on incoming weather vectors.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
