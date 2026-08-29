'use client';

import PollutionMap from '@/components/map/PollutionMap';
import LayerControl from '@/components/map/LayerControl';
import LocationPanel from '@/components/map/LocationPanel';
import ForecastTimeline from '@/components/forecast/ForecastTimeline';
import ForecastChart from '@/components/forecast/ForecastChart';
import ForecastSummary from '@/components/forecast/ForecastSummary';
import AQICard from '@/components/pollution/AQICard';
import PollutantCard from '@/components/pollution/PollutantCard';
import XAIExplanation from '@/components/xai/XAIExplanation';
import WeatherCard from '@/components/atmosphere/WeatherCard';
import PBLCard from '@/components/atmosphere/PBLCard';
import InversionCard from '@/components/atmosphere/InversionCard';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>APWCFS Dashboard</h1>
        <p>Delhi NCR 72-hour Air Quality Forecast</p>
      </header>

      <div className="dashboard-container">
        {/* Map Section */}
        <section className="dashboard-section map-section">
          <div className="map-main">
            <PollutionMap />
          </div>
          <div className="map-sidebar">
            <AQICard />
            <PollutantCard name="PM2.5" concentration={245} />
            <PollutantCard name="PM10" concentration={380} />
          </div>
        </section>

        {/* Timeline Section */}
        <section className="dashboard-section timeline-section">
          <ForecastTimeline />
        </section>

        {/* Forecast & Analysis Section */}
        <section className="dashboard-section forecast-analysis">
          <div className="forecast-column">
            <ForecastSummary />
            <ForecastChart title="AQI Forecast" />
          </div>
          <div className="analysis-column">
            <div className="atmosphere-cards">
              <WeatherCard />
              <PBLCard />
              <InversionCard />
            </div>
          </div>
        </section>

        {/* XAI Section */}
        <section className="dashboard-section xai-section">
          <XAIExplanation />
        </section>

        {/* Layer Control */}
        <aside className="dashboard-sidebar">
          <LayerControl />
          <LocationPanel />
        </aside>
      </div>
    </div>
  );
}
