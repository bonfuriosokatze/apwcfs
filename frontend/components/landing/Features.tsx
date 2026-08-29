'use client';

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Weather ↔ Chemistry</h3>
            <p>Coupled atmospheric and chemical modelling to capture real pollution dynamics</p>
          </div>
          <div className="feature-card">
            <h3>72-hour Forecast</h3>
            <p>Detailed hourly predictions showing where pollution will go and how it will change</p>
          </div>
          <div className="feature-card">
            <h3>Explainable AI</h3>
            <p>Understand why pollution is high and what factors drive forecast changes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
