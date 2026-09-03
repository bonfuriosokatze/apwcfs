export default function Science() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem', background: 'linear-gradient(90deg, var(--primary-color), #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Science Engine
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0, lineHeight: '1.6' }}>
          Delhi NCR's air quality crisis cannot be solved by tracking emissions alone. It is fundamentally a problem of <strong>Atmospheric Physics</strong> and <strong>Meteorological Trapping</strong>.
        </p>
      </div>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ color: '#9333ea', marginBottom: '1.5rem', fontSize: '1.8rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
          Satellite Synthesis & WRF-Chem
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Ground stations are sparse. To provide sub-continental coverage, this platform utilizes satellite-derived <strong>Aerosol Optical Depth (AOD)</strong> from radiometers. However, AOD measures the total column of dust from the ground to space. We employ advanced modeling (inspired by WRF-Chem) to "downscale" this columnar data, factoring in temperature and wind, to estimate the exact PM2.5 concentrations you are breathing at the surface.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>The Planetary Boundary Layer (PBL)</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
            During winter, cold surface temperatures and low solar radiation compress the PBL—the lowest layer of the atmosphere. Instead of pollutants dissipating vertically into the stratosphere, they hit a "ceiling" of warm air (a thermal inversion), trapping vehicular NO₂, dust, and smoke directly in the breathing zone.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>Hygroscopic Swelling</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
            Relative humidity plays a devastating role in PM2.5 levels. Fine particulate matter is highly hydrophilic. Under high humidity (&gt;75%), microscopic dry aerosols absorb water vapor and swell in size (deliquescence). This transforms invisible gases and fine dust into dense, opaque winter smog that blocks sunlight.
          </p>
        </div>
      </div>
    </div>
  );
}
