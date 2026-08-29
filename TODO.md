# APWCFS To-Do List

## ✅ Completed

### Project Setup
- [x] Rename all "Palm Beach" references to "APWCFS"
- [x] Create frontend folder structure (app, components, lib)
- [x] Create all component folders (landing, atmosphere, plume, map, forecast, pollution, xai, navigation)

### Frontend Components
- [x] Navigation (Navbar)
- [x] Landing page components (Hero, Problem, Features, CTA)
- [x] Atmosphere components (WeatherCard, PBLCard, InversionCard)
- [x] Plume components (FireLayer, PlumeLayer)
- [x] Map components (PollutionMap, LayerControl, MapLegend, LocationPanel)
- [x] Forecast components (ForecastTimeline, ForecastChart, ForecastSummary)
- [x] Pollution components (AQICard, PollutantCard, AQILegend)
- [x] XAI components (XAIExplanation, FeatureContribution, ForecastReason)

### Frontend Pages
- [x] Root layout.tsx
- [x] Landing page (/)
- [x] About page (/about)
- [x] Science page (/science)
- [x] Dashboard page (/dashboard)

### Frontend Libraries
- [x] API client (generic)
- [x] Forecast API functions
- [x] Forecast utilities
- [x] Formatting utilities

---

## 📋 Pending

### Frontend - Styling & Setup
- [ ] Create global CSS/styling (globals.css)
- [ ] Set up CSS modules or Tailwind CSS
- [ ] Add responsive design
- [ ] Create color scheme based on DESIGN.md
- [ ] Add animations and transitions
- [ ] Setup fonts (Inter, Geist, or IBM Plex Sans)

### Frontend - Integration
- [ ] Integrate map library (Leaflet or Mapbox)
- [ ] Integrate charting library (Chart.js or Recharts)
- [ ] Connect components to API endpoints
- [ ] Add state management (React Context or Zustand)
- [ ] Implement error boundaries
- [ ] Add loading states and skeletons

### Frontend - Features
- [ ] Implement real-time time slider interaction
- [ ] Add map layer toggling
- [ ] Implement location search/selection
- [ ] Add forecast comparison view
- [ ] Create mobile-responsive dashboard
- [ ] Add accessibility features (ARIA labels, keyboard nav)

### Backend API
- [ ] Setup Flask/FastAPI server structure
- [ ] Create forecast endpoint (`/api/forecast`)
- [ ] Create location endpoint (`/api/forecast/location/{name}`)
- [ ] Create XAI endpoint (`/api/xai/explanation/{forecastId}`)
- [ ] Implement model inference pipeline
- [ ] Setup database for caching forecasts
- [ ] Add data validation and error handling
- [ ] Implement rate limiting

### WRF-Chem Integration
- [ ] Configure WRF-Chem domain (Delhi NCR, 3km resolution)
- [ ] Setup meteorological initial conditions (IFS/ECMWF)
- [ ] Configure emissions inventory (CAMS, local sources)
- [ ] Integrate with WRF-Chem execution
- [ ] Setup post-processing pipeline
- [ ] Implement bias correction

### Data & Database
- [ ] Setup database schema
- [ ] Create tables for forecasts, observations, model runs
- [ ] Implement data ingestion pipeline
- [ ] Add historical data storage
- [ ] Setup caching layer (Redis)

### Testing
- [ ] Write unit tests for frontend components
- [ ] Write unit tests for backend API
- [ ] Write integration tests
- [ ] Setup E2E tests
- [ ] Add test coverage reporting

### DevOps & Deployment
- [ ] Setup Docker containers (frontend, backend, WRF-Chem)
- [ ] Create docker-compose.yml
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Configure environment variables
- [ ] Setup logging and monitoring
- [ ] Deploy to cloud platform

### Documentation
- [ ] Complete API documentation (Swagger/OpenAPI)
- [ ] Write component documentation
- [ ] Add deployment guide
- [ ] Create user guide
- [ ] Document WRF-Chem configuration

### Explainable AI (XAI)
- [ ] Integrate SHAP library
- [ ] Implement feature attribution calculation
- [ ] Add SHAP visualization components
- [ ] Create researcher mode view
- [ ] Add confidence metrics

### Advanced Features
- [ ] Add forecast comparison across models
- [ ] Implement sensitivity analysis
- [ ] Add historical accuracy metrics
- [ ] Create stubble burn detection
- [ ] Add alert system

---

## 🎯 Priority Breakdown

### Phase 1: MVP (Core Dashboard)
- [ ] Frontend styling (globals.css)
- [ ] Map integration
- [ ] Chart integration
- [ ] Basic API endpoints
- [ ] Core dashboard functional

### Phase 2: Intelligence Layer
- [ ] WRF-Chem integration
- [ ] XAI implementation
- [ ] Database setup
- [ ] Forecast caching

### Phase 3: Polish & Scale
- [ ] Advanced features
- [ ] Performance optimization
- [ ] Deployment setup
- [ ] Documentation

---

## 📝 Notes

- All component files follow TypeScript + Next.js best practices
- Components are ready for styling and integration
- API client structure supports both REST and potential future GraphQL
- Utilities are agnostic to data sources (can be mocked or real)

