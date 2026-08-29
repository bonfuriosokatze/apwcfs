'use client';

export default function SciencePage() {
  return (
    <div className="science-page">
      <section className="science-hero">
        <div className="container">
          <h1>The Science Behind APWCFS</h1>
          <p>Understanding air pollution through coupled atmospheric modeling</p>
        </div>
      </section>

      <section className="science-section">
        <div className="container">
          <h2>Atmospheric Modeling</h2>
          <p>
            We use WRF-Chem (Weather Research and Forecasting with Chemistry) to simulate interactions between meteorology and atmospheric chemistry at 3km resolution over Delhi NCR.
          </p>
        </div>
      </section>

      <section className="science-section">
        <div className="container">
          <h2>Emission Sources</h2>
          <p>
            Our model incorporates multiple emission sources:
          </p>
          <ul>
            <li>Urban and industrial emissions</li>
            <li>Vehicular pollution</li>
            <li>Biomass burning (stubble)</li>
            <li>Copernicus Atmosphere Monitoring Service (CAMS) data</li>
          </ul>
        </div>
      </section>

      <section className="science-section">
        <div className="container">
          <h2>Explainable AI</h2>
          <p>
            Using SHAP (SHapley Additive exPlanations) and other interpretability techniques, we explain which atmospheric factors most strongly influence pollution forecasts.
          </p>
        </div>
      </section>

      <section className="science-section">
        <div className="container">
          <h2>Data Assimilation</h2>
          <p>
            Ground-based and satellite observations help initialize and validate our forecasts, improving accuracy over time.
          </p>
        </div>
      </section>
    </div>
  );
}
