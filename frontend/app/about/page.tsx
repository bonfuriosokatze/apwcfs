'use client';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About APWCFS</h1>
          <p>Air Pollution Weather Coupled Forecasting System</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>The Problem</h2>
          <p>
            Delhi NCR faces severe air pollution challenges, especially during winter months when atmospheric conditions trap pollutants and stubble burning intensifies regional plumes.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>Our Approach</h2>
          <p>
            APWCFS combines atmospheric modeling (WRF-Chem), regional emission data, geospatial visualization, and explainable AI to provide a trustworthy 72-hour pollution forecast.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>Key Features</h2>
          <ul>
            <li>Coupled meteorology and chemistry modeling</li>
            <li>72-hour hourly forecasts</li>
            <li>Interactive map-based visualization</li>
            <li>Explainable AI insights</li>
            <li>Real-time fire and plume tracking</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
