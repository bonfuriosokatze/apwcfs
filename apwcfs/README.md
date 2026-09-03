# APWCFS

APWCFS (Air Pollution and Weather Coupled Forecasting System) is a Delhi NCR air-quality prototype. It combines live weather and air-quality APIs with a Leaflet map and an optional Gemini-generated explanation so users can inspect pollution, atmospheric conditions, and data confidence together.

The repository is also the product and architecture starting point for the Smart India Hackathon SIH 26082 problem: a production system that couples meteorology, emissions, and atmospheric chemistry for useful regional forecasts. The current web app is a working prototype, not yet a WRF-Chem operational forecast system.

## Current application

- **About** (`/`): product purpose and the weather-pollution relationship.
- **Science** (`/science`): explanations of AOD, the planetary boundary layer, inversions, and hygroscopic growth.
- **Dashboard** (`/dashboard`): Delhi-centered map, CPCB-colored regional heat layer, selectable locations, current pollutant and weather values, and an explanation workflow.
- **Data fallback**: when a nearby WAQI station is unavailable, PM2.5 is estimated from Open-Meteo aerosol optical depth and weather proxies. Estimated values are shown as estimates.
- **AI explanation**: Gemini is optional. Without a Gemini key, the dashboard uses a local fallback explanation.

## Quick start

Requirements: Node.js 18 or newer and npm.

```bash
cd apwcfs
npm install
npm run dev
```

Open `http://localhost:5173`.

Useful commands:

```bash
npm run lint       # Oxlint
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

## Environment variables

Create `.env` in this directory when using protected integrations:

```env
VITE_WAQI_API_KEY=your-waqi-token
VITE_GEMINI_API_KEY=your-gemini-key
```

The WAQI token is required for station-backed dashboard requests. Gemini is optional. Never commit `.env` or expose a production secret in a client-side build; a deployed system should proxy protected requests through a server.

## Technology

React 19, Vite, React Router, Axios, Leaflet, `react-leaflet`, `leaflet.heat`, Google Generative AI, React Markdown, KaTeX, and Oxlint. The separate `server/` package is reserved for backend work and is not required to run the current frontend.

## Documentation

- [Project brief and target system](docs/README.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Architecture and responsibilities](docs/project_roles_and_system_architecture.md)
- [Product understanding and workflows](docs/UNDERSTANDING.md)
- [Interface and interaction design](docs/DESIGN.md)
- [Concept map](docs/concept.md)

## Scope and limitations

The current dashboard is an interactive data-viewing prototype. Its heat layer is a regional visualization based on a Delhi baseline, not a validated gridded forecast. The PM2.5 fallback is an empirical estimate, not a substitute for a calibrated ground sensor or WRF-Chem output. Forecast ingestion, model validation, alerting, authentication, and a production API remain planned work.

This distinction is deliberate: scientific provenance and uncertainty must remain visible as the project grows.
