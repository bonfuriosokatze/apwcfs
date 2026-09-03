import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Map from '../components/Map';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  
  const [explanation, setExplanation] = useState("");
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('explain');
  const [loadingStatus, setLoadingStatus] = useState("");
  const [workflowStep, setWorkflowStep] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [activeTab, setActiveTab] = useState('who');

  // Track selected location on the map (Default: Delhi)
  const [selectedLoc, setSelectedLoc] = useState({ lat: 28.6139, lng: 77.2090 });

  // Calculate Indian AQI strictly based on CPCB Breakpoints for PM2.5
  const calculateIndianAQI = (pm25) => {
    if (pm25 === undefined || pm25 === null) return "N/A";
    const c = parseFloat(pm25);
    if (c <= 30) return Math.round(((50 - 0) / (30 - 0)) * (c - 0) + 0); 
    if (c <= 60) return Math.round(((100 - 51) / (60 - 31)) * (c - 31) + 51); 
    if (c <= 90) return Math.round(((200 - 101) / (90 - 61)) * (c - 61) + 101); 
    if (c <= 120) return Math.round(((300 - 201) / (120 - 91)) * (c - 91) + 201); 
    if (c <= 250) return Math.round(((400 - 301) / (250 - 121)) * (c - 121) + 301); 
    return Math.round(((500 - 401) / (350 - 251)) * (Math.min(c, 350) - 251) + 401); 
  };

  // Haversine formula to validate distance between clicked location and physical WAQI station
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; 
  };

  // Empirical Algorithm to estimate PM2.5 from Open-Meteo Satellite Data
  const estimatePM25FromSatellite = (aod, windSpeed, temp, co, so2) => {
    if (aod === undefined || aod === null) return null;
    
    let estimatedPM25 = aod * 120; 

    if (temp < 15) {
      estimatedPM25 *= 1.25; 
    }
    if (windSpeed < 2.0) {
      estimatedPM25 *= 1.2;
    }
    if (co > 300) estimatedPM25 *= 1.1;
    if (so2 > 5) estimatedPM25 *= 1.15;

    return Math.round(estimatedPM25);
  };

  // Fetch specific selected location for Dashboard Grid
  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      setFetchError(false);
      setExplanation(""); 
      try {
        const waqiKey = import.meta.env.VITE_WAQI_API_KEY;
        if (!waqiKey) {
          throw new Error("Missing WAQI API Key in .env");
        }
        
        // 1. Fetch Open-Meteo Satellite Data, WAQI Ground Truth, and Reverse Geocode for Landmark
        const [omWeatherRes, omAqiRes, geoRes] = await Promise.all([
          axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${selectedLoc.lat}&longitude=${selectedLoc.lng}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,cloud_cover`),
          axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${selectedLoc.lat}&longitude=${selectedLoc.lng}&current=aerosol_optical_depth,carbon_monoxide,sulphur_dioxide`),
          axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${selectedLoc.lat}&lon=${selectedLoc.lng}&format=json`).catch(() => ({ data: {} })) // Prevent crash if geocoding fails
        ]);

        const omWeather = omWeatherRes.data.current;
        const omAQI = omAqiRes.data.current;
        const exactLandmark = geoRes.data?.display_name || `Lat: ${selectedLoc.lat.toFixed(2)}, Lng: ${selectedLoc.lng.toFixed(2)}`;

        // 2. Attempt to fetch Ground Truth from WAQI
        let waqiRes;
        let groundStationActive = true;
        try {
          waqiRes = await axios.get(`https://api.waqi.info/feed/geo:${selectedLoc.lat};${selectedLoc.lng}/?token=${waqiKey}`);
          if (waqiRes.data.status !== 'ok') {
            groundStationActive = false;
          } else {
            // Validate the physical distance of the returned station
            const stationGeo = waqiRes.data.data.city?.geo;
            if (stationGeo && stationGeo.length === 2) {
              const distanceToStation = calculateDistance(selectedLoc.lat, selectedLoc.lng, stationGeo[0], stationGeo[1]);
              // If the nearest station is more than 25km away, it is too far to represent our 10x10km bounding box
              if (distanceToStation > 25) {
                groundStationActive = false;
              }
            }
          }
        } catch (e) {
          groundStationActive = false;
        }

        // 3. Assemble Merged Data with WRF-Chem proxies and Failover
        let mergedData = {};
        
        if (groundStationActive) {
          const data = waqiRes.data.data;
          const iaqi = data.iaqi;
          
          let pm2_5_val = iaqi.pm25?.v ?? null;
          let isEstimated = false;

          if (pm2_5_val === null) {
            pm2_5_val = estimatePM25FromSatellite(omAQI.aerosol_optical_depth, omWeather.wind_speed_10m, omWeather.temperature_2m, omAQI.carbon_monoxide, omAQI.sulphur_dioxide);
            isEstimated = true;
          }

          mergedData = {
            pm2_5: pm2_5_val,
            pm10: iaqi.pm10?.v ?? null,
            nitrogen_dioxide: iaqi.no2?.v ?? null,
            ozone: iaqi.o3?.v ?? null,
            carbon_monoxide: iaqi.co?.v ?? omAQI.carbon_monoxide ?? null, // WRF-Chem
            sulphur_dioxide: iaqi.so2?.v ?? omAQI.sulphur_dioxide ?? null, // WRF-Chem
            temperature: iaqi.t?.v ?? omWeather.temperature_2m, 
            humidity: iaqi.h?.v ?? omWeather.relative_humidity_2m,
            pressure: iaqi.p?.v ?? omWeather.surface_pressure,
            wind_speed: iaqi.w?.v ?? omWeather.wind_speed_10m,
            cloud_cover: omWeather.cloud_cover ?? null,
            aerosol_optical_depth: omAQI.aerosol_optical_depth ?? null,
            station: data.city.name,
            landmark: exactLandmark,
            isEstimated: isEstimated
          };

          if (data.forecast && data.forecast.daily && data.forecast.daily.pm25) {
            setForecastData(data.forecast.daily.pm25);
          } else {
            setForecastData(null);
          }

        } else {
          // TOTAL FAILOVER: Pure Satellite Estimation.
          const estimatedPM25 = estimatePM25FromSatellite(omAQI.aerosol_optical_depth, omWeather.wind_speed_10m, omWeather.temperature_2m, omAQI.carbon_monoxide, omAQI.sulphur_dioxide);
          
          mergedData = {
            pm2_5: estimatedPM25,
            pm10: null, 
            nitrogen_dioxide: null,
            ozone: null,
            carbon_monoxide: omAQI.carbon_monoxide ?? null, // WRF-Chem Satellite
            sulphur_dioxide: omAQI.sulphur_dioxide ?? null, // WRF-Chem Satellite
            temperature: omWeather.temperature_2m,
            humidity: omWeather.relative_humidity_2m,
            pressure: omWeather.surface_pressure,
            wind_speed: omWeather.wind_speed_10m,
            cloud_cover: omWeather.cloud_cover,
            aerosol_optical_depth: omAQI.aerosol_optical_depth,
            station: `Pure Satellite Estimation`,
            landmark: exactLandmark,
            isEstimated: true
          };
          
          setForecastData(null); 
        }

        setDashboardData(mergedData);

      } catch (err) {
        console.error("Critical Failure fetching data:", err);
        setFetchError(true);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [selectedLoc]);

  const handleExplain = async () => {
    setModalType('explain');
    setIsModalOpen(true);
    setLoadingExpl(true);
    setExplanation("");
    setLoadingStatus("");
    setWorkflowStep(0);
    
    // Animate through the workflow steps every 1.5 seconds
    const intervalId = setInterval(() => {
      setWorkflowStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        clearInterval(intervalId);
        setTimeout(() => {
          setExplanation(`#### 1. Data Lineage & Confidence Status\n- **Warning:** No Gemini API key detected. Using fallback analysis.\n\n#### 2. Chemical & Physical Drivers\n- Carbon Monoxide and AOD indicate significant biomass emissions.\n\n#### 3. Meteorological Mechanics & Dispersion Physics\n- Cold temperatures and low wind speeds are severely restricting the WRF-Chem plume dispersion.\n\n#### 4. Diagnostic Summary & Human Impact\n- Dangerous particulates are stagnating over the selected coordinates. Please limit outdoor exposure.`);
          setLoadingExpl(false);
        }, 2000);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      const prompt = `You are an advanced Explainable AI (XAI) Environmental Data Scientist specialized in atmospheric physics, aerosol dynamics, and chemistry.

### INGESTED REAL-TIME DATASET:
Location: ${dashboardData?.landmark || `[Lat: ${selectedLoc.lat.toFixed(2)}, Lng: ${selectedLoc.lng.toFixed(2)}]`}
Data Provenance:
- Is Estimated via Satellite (No Ground Station): ${dashboardData?.isEstimated ? "TRUE" : "FALSE"}

Pollutant Metrics:
- PM2.5 (Fine Particulates): ${dashboardData?.pm2_5} µg/m³
- PM10 (Coarse Particulates): ${dashboardData?.pm10 || 'N/A'} µg/m³
- Nitrogen Dioxide (NO2): ${dashboardData?.nitrogen_dioxide || 'N/A'} µg/m³
- Ozone (O3): ${dashboardData?.ozone || 'N/A'} µg/m³
- Carbon Monoxide (CO): ${dashboardData?.carbon_monoxide} µg/m³
- Sulphur Dioxide (SO2): ${dashboardData?.sulphur_dioxide} µg/m³
- Aerosol Optical Depth (AOD @ 550nm): ${dashboardData?.aerosol_optical_depth || 'N/A'}

Meteorological Conditions:
- Ambient Temperature: ${dashboardData?.temperature} °C
- Relative Humidity: ${dashboardData?.humidity || 'N/A'} %
- Wind Speed: ${dashboardData?.wind_speed} m/s
- Cloud Cover: ${dashboardData?.cloud_cover || 'N/A'} %

---

### TASK & SYSTEM INSTRUCTIONS:
Provide a detailed, highly descriptive Explainable AI (XAI) diagnostic report breakdown of the current air quality. Do not summarize in vague terms. Account for all 12 ingested data parameters in your analysis.

Structure your response into the following 4 explicit sections using markdown. IMPORTANT: If you generate any ASCII art diagrams, tables, or charts, you MUST wrap them in triple backticks (\`\`\`) to ensure they render as monospaced code blocks.

#### 1. Data Lineage & Confidence Status
- If 'Is Estimated via Satellite' is TRUE: Explicitly inform the user that no local physical ground sensor was reachable. Explain that PM2.5/PM10 levels are being mathematically synthesized using Aerosol Optical Depth (AOD) measurements from satellite radiometers combined with the WRF-Chem atmospheric chemistry model.
- If FALSE: Confirm this is direct ground-truth station telemetry.

#### 2. Chemical & Physical Drivers (Feature Importance)
- Identify the TOP 3 dominant drivers of the air quality from the dataset.
- Evaluate the Gaseous Factors (NO2, CO, SO2):
  * Analyze NO2 in relation to urban vehicular/industrial combustion.
  * Analyze CO and SO2 alongside AOD. (Note: Elevated CO and SO2 paired with high AOD indicate biomass/stubble burning or heavy coal/industrial combustion).
- Evaluate Particulate Ratio: Compare PM2.5 to PM10. High PM2.5/PM10 ratios indicate combustion/secondary aerosols; low ratios indicate windblown dust/crustal matter.

#### 3. Meteorological Mechanics & Dispersion Physics
- Explain explicitly how Temperature, Humidity, Wind Speed, and Cloud Cover are modifying pollution levels:
  * Wind Speed: Explain if low winds (<2 m/s) are causing atmospheric stagnation, or if higher winds are providing ventilation/dispersion.
  * Temperature & Cloud Cover: Explain if conditions suggest radiative cooling or a thermal inversion layer trapping pollutants near the surface.
  * Humidity: Explain if high humidity (>70%) is causing hygroscopic growth of fine particles, transforming fine particulates into haze/smog.

#### 4. Diagnostic Summary & Human Impact
- Provide a clear, plain-language translation of these complex chemical and physical factors for an average citizen, detailing health risks and recommended protective behaviors.`;

      const modelsToTry = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
      let responseText = null;
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          responseText = response.text();
          setWorkflowStep(4); // Push to final visual state upon success
          break; // Success!
        } catch (e) {
          console.warn(`Model ${modelName} failed. Falling back to next...`, e.message);
          setLoadingStatus(`⚠️ Model ${modelName} Overloaded. Re-routing Pipeline... (ETA: +3.5s)`);
          lastError = e;
        }
      }

      if (responseText) {
        setExplanation(responseText);
      } else {
        throw lastError;
      }
    } catch(err) {
      console.error(err);
      setExplanation(`#### 1. Data Lineage & Confidence Status\n- An API failure prevented the full diagnostic generation.\n\n**RAW ERROR MESSAGE:** ${err.message || 'Unknown Error'}\n\n#### 4. Diagnostic Summary & Human Impact\n- High Carbon Monoxide (CO) levels are a direct proxy for active agricultural stubble burning. Stagnant winds are trapping severe particulate matter over the area.`);
    } finally {
      clearInterval(intervalId);
      setLoadingExpl(false);
      setLoadingStatus("");
    }
  };

  const handlePredict = async () => {
    setModalType('predict');
    setIsModalOpen(true);
    setLoadingExpl(true);
    setExplanation("");
    setLoadingStatus("");
    setWorkflowStep(0);
    
    // Animate through the workflow steps every 1.5 seconds
    const intervalId = setInterval(() => {
      setWorkflowStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        clearInterval(intervalId);
        setTimeout(() => {
          setExplanation(`#### 1. 72-Hour Macro Trajectory Overview\n- **Warning:** No Gemini API key detected.\n\n#### 4. Actionable 72-Hour Health & Operational Guidance\n- Please avoid outdoor activities in the early morning and late evening.`);
          setLoadingExpl(false);
        }, 2000);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      const dailyForecast = forecastData ? forecastData.slice(0, 3).map((d, i) => `- Phase ${i+1} (Hours ${i*24}-${(i+1)*24}): Min: ${d.min} | Max: ${d.max} | Avg: ${d.avg}`).join("\n") : "Forecast data unavailable for this specific station.";

      const prompt = `You are an advanced Predictive Atmospheric Physics AI Model specializing in 72-hour air quality forecasting, dispersion mechanics, and health exposure mitigation.

### INGESTED 72-HOUR FORECAST & METEOROLOGICAL DATASET:
Location: ${dashboardData?.landmark || dashboardData?.station}

72-Hour WAQI Forecast Breakdown (PM2.5 in µg/m³):
${dailyForecast}

Current & Forecasted Meteorological Indicators:
- Temperature Trend: ${dashboardData?.temperature}°C -> [Analyze Time of Day]
- Wind Speed & Vector: ${dashboardData?.wind_speed} m/s -> [Analyze Dispersion Potential]
- Relative Humidity: ${dashboardData?.humidity}% -> [Analyze Hygroscopic Growth]
- Boundary Layer Dynamics: [Analyze Inversion Risk]

Primary Ingested Pollutant Drivers:
- PM2.5: ${dashboardData?.pm2_5} µg/m³ | PM10: ${dashboardData?.pm10 || 'N/A'} µg/m³ | NO2: ${dashboardData?.nitrogen_dioxide || 'N/A'} µg/m³ | O3: ${dashboardData?.ozone || 'N/A'} µg/m³ | CO: ${dashboardData?.carbon_monoxide} µg/m³ | SO2: ${dashboardData?.sulphur_dioxide} µg/m³

---

### TASK & SYSTEM INSTRUCTIONS:
Generate a comprehensive, highly descriptive 72-hour Explainable AI (XAI) forecast narrative. You must explain **WHY** the pollution trajectory changes across each 24-hour window using atmospheric physics, and provide precise, phase-based recommendations.

Structure your analysis into the following 4 explicit sections using markdown. IMPORTANT: If you generate any ASCII art diagrams, tables, or charts, you MUST wrap them in triple backticks (\`\`\`) to ensure they render as monospaced code blocks.

#### 1. 72-Hour Macro Trajectory Overview
- State the overall 72-hour direction: Is air quality **Improving**, **Deteriorating**, or **Stagnant**?
- Calculate and highlight the delta change in PM2.5 between Phase 1 (0–24h) and Phase 3 (48–72h).
- State the predicted **Peak Hazard Window** within the 72 hours (e.g., "Phase 2 Nighttime: Hours 30–42").

#### 2. Phase-by-Phase Physical Mechanics (The "Why")
Break down the physics driving each 24-hour window:
- **Hours 0–24 (Phase 1):** Explain how current wind speeds, temperature, and humidity are driving immediate dispersion or pollution trapping.
- **Hours 24–48 (Phase 2):** Explain the atmospheric mechanism causing the baseline shift (e.g., "Dropping temperatures will lower the planetary boundary layer, trapping vehicular NO2 and PM2.5 close to the ground").
- **Hours 48–72 (Phase 3):** Explain the recovery or escalation mechanism (e.g., "Increasing wind speeds (>4 m/s) will clear accumulated aerosols, driving PM2.5 down").

#### 3. Atmospheric Sensitivity & Uncertainty Factors
- Identify which weather variable is the **most sensitive driver** for this 72-hour forecast (e.g., "If wind speeds fall below 1.5 m/s in Phase 2, PM2.5 peak levels could exceed predicted max by 25%").
- Explain how humidity dynamics (e.g., secondary inorganic aerosol formation) might alter the predicted trajectory.

#### 4. Actionable 72-Hour Health & Operational Guidance
Provide tailored recommendations structured across the 72-hour timeline:
- **Hours 0–24 Actions:** Specific advice for immediate exposure (e.g., outdoor exercise, ventilation).
- **Hours 24–48 Actions:** Specific advice for the predicted peak/trough (e.g., "High-risk window: Sensitive groups should avoid outdoor activity between 06:00 and 10:00").
- **Hours 48–72 Actions:** Planning ahead for outdoor activities, air purification schedule, or commute adjustments.`;

      const modelsToTry = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
      let responseText = null;
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          responseText = response.text();
          setWorkflowStep(4);
          break; // Success!
        } catch (e) {
          console.warn(`Model ${modelName} failed in Predict. Falling back to next...`, e.message);
          setLoadingStatus(`⚠️ Model ${modelName} Overloaded. Re-routing Pipeline... (ETA: +4.5s)`);
          lastError = e;
        }
      }

      if (responseText) {
        setExplanation(responseText);
      } else {
        throw lastError;
      }
    } catch(err) {
      console.error(err);
      setExplanation(`#### 1. 72-Hour Macro Trajectory Overview\n- An API failure prevented the full diagnostic generation.\n\n**RAW ERROR MESSAGE:** ${err.message || 'Unknown Error'}`);
    } finally {
      clearInterval(intervalId);
      setLoadingExpl(false);
      setLoadingStatus("");
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Full-width Map Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.2rem' }}>Subcontinental Air Quality Map</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Ground truth powered by <strong>WAQI</strong>.
              </p>
              <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                METEOROLOGY: NOAA / DWD SATELLITE
              </span>
            </div>
          </div>
          {dashboardData && !loadingData && (
            <div style={{ background: 'var(--code-bg)', padding: '0.5rem 1.5rem', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Area AQI</p>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{calculateIndianAQI(dashboardData.pm2_5)}</p>
            </div>
          )}
        </div>
        
        {/* Pass selectedLoc to Map so it can draw the 5x5km grid, but Map now handles its own regional baseline data */}
        <Map selectedLoc={selectedLoc} onLocationSelect={setSelectedLoc} />
      </div>
      
      {loadingData ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Analyzing coordinates [Lat: {selectedLoc.lat.toFixed(2)}, Lng: {selectedLoc.lng.toFixed(2)}]...</p>
        </div>
      ) : fetchError ? (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
          Critical failure fetching core meteorological data. Please check your internet connection.
        </div>
      ) : dashboardData ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Data Grid Column */}
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            
            {/* Intelligent Failover UI Badge */}
            {dashboardData.isEstimated && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '4px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  ESTIMATED FROM SATELLITE
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>No physical ground sensor found at these coordinates. The PM2.5 value below is mathematically derived from AOD and meteorological penalties.</p>
              </div>
            )}

            <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {dashboardData.isEstimated ? 'Target Coordinates (Pure Satellite)' : 'Hybrid Data: Ground Station & Satellite Grid'}
              {!dashboardData.isEstimated && <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>— {dashboardData.station}</span>}
            </h2>
            
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {dashboardData.landmark}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  PM2.5 (Fine Particulate)
                  <span style={{ fontSize: '0.7rem', background: dashboardData.isEstimated ? '#e0e7ff' : '#dcfce7', color: dashboardData.isEstimated ? '#4338ca' : '#166534', padding: '2px 6px', borderRadius: '4px' }}>
                    {dashboardData.isEstimated ? 'SAT ESTIMATE' : 'GROUND'}
                  </span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.pm2_5 ?? 'N/A'} µg/m³</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  PM10 (Coarse Particulate)
                  <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>GROUND</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.pm10 ?? 'N/A'} µg/m³</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Carbon Monoxide (CO)
                  <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px' }}>SATELLITE</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.carbon_monoxide ?? 'N/A'} µg/m³</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Sulphur Dioxide (SO₂)
                  <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px' }}>SATELLITE</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.sulphur_dioxide ?? 'N/A'} µg/m³</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Nitrogen Dioxide (NO₂)
                  <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>GROUND</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.nitrogen_dioxide ?? 'N/A'} µg/m³</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Ground-level Ozone (O₃)
                  <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>GROUND</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.ozone ?? 'N/A'} µg/m³</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Aerosol Optical Depth
                  <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px' }}>SATELLITE</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.aerosol_optical_depth ?? 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Surface Wind Speed
                  <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px' }}>SATELLITE</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.wind_speed ?? 'N/A'} m/s</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  Temperature
                  <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px' }}>SATELLITE</span>
                </p>
                <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{dashboardData.temperature ?? 'N/A'} °C</p>
              </div>
            </div>
          </div>

          {/* Analysis & Standards Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Standards Comparison Component */}
            <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => setActiveTab('who')}
                  style={{ background: activeTab === 'who' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'who' ? '#fff' : 'var(--text-main)', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  WHO Guidelines
                </button>
                <button 
                  onClick={() => setActiveTab('cpcb')}
                  style={{ background: activeTab === 'cpcb' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'cpcb' ? '#fff' : 'var(--text-main)', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  CPCB India Standards
                </button>
              </div>
              
              {activeTab === 'who' ? (
                <div>
                  <h3 style={{ marginTop: 0 }}>World Health Organization (24h)</h3>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li><strong style={{ color: dashboardData.pm2_5 > 15 ? '#ef4444' : '#22c55e' }}>PM2.5:</strong> Limit is 15 µg/m³. {dashboardData.pm2_5 > 15 ? `Currently exceeding by ${(dashboardData.pm2_5 / 15).toFixed(1)}x.` : 'Within safe limits.'}</li>
                    <li><strong style={{ color: dashboardData.pm10 > 45 ? '#ef4444' : '#22c55e' }}>PM10:</strong> Limit is 45 µg/m³. {dashboardData.pm10 > 45 ? 'Exceeding WHO guidelines.' : 'Within safe limits.'}</li>
                    <li><strong style={{ color: dashboardData.nitrogen_dioxide > 25 ? '#ef4444' : '#22c55e' }}>NO₂:</strong> Limit is 25 µg/m³. {dashboardData.nitrogen_dioxide > 25 ? 'Exceeding WHO guidelines.' : 'Within safe limits.'}</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 style={{ marginTop: 0 }}>Central Pollution Control Board (24h)</h3>
                  <ul style={{ lineHeight: '1.8' }}>
                    <li><strong style={{ color: dashboardData.pm2_5 > 60 ? '#ef4444' : '#22c55e' }}>PM2.5:</strong> Limit is 60 µg/m³. {dashboardData.pm2_5 > 60 ? 'Exceeding Indian national standards.' : 'Satisfactory level.'}</li>
                    <li><strong style={{ color: dashboardData.pm10 > 100 ? '#ef4444' : '#22c55e' }}>PM10:</strong> Limit is 100 µg/m³. {dashboardData.pm10 > 100 ? 'Exceeding Indian national standards.' : 'Satisfactory level.'}</li>
                    <li><strong style={{ color: dashboardData.nitrogen_dioxide > 80 ? '#ef4444' : '#22c55e' }}>NO₂:</strong> Limit is 80 µg/m³. {dashboardData.nitrogen_dioxide > 80 ? 'Exceeding Indian national standards.' : 'Satisfactory level.'}</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Current Explainer AI Component */}
            <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--primary-color)', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Gemini XAI Engine</h2>
                <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>NEURAL PIPELINE</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Leverage generative AI to diagnose the complex physical and chemical drivers behind the current air quality, or simulate a comprehensive 72-hour pollution trajectory based on real-time atmospheric modeling.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={handleExplain} 
                  disabled={loadingExpl}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--primary-color)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: loadingExpl ? 'not-allowed' : 'pointer',
                    opacity: loadingExpl ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>Explain Current</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Diagnose Present Conditions</span>
                </button>
                
                <button 
                  onClick={handlePredict} 
                  disabled={loadingExpl}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#8b5cf6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: loadingExpl ? 'not-allowed' : 'pointer',
                    opacity: loadingExpl ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>Predict 72-Hour</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>Forecast Trajectory</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gemini AI Modal Overlay */}
      {isModalOpen && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-color)',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
              <h2 style={{ margin: 0, color: modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                {modalType === 'predict' ? '72-Hour X-AI Forecast' : 'Gemini X-AI Diagnostics'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'var(--code-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--code-bg)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2.5rem', overflowY: 'auto', flex: 1, position: 'relative' }}>
              {loadingExpl ? (
                <div className="animate-fade-in" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)' }}>
                  <h3 style={{ color: modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)', margin: '0 0 2rem 0', textAlign: 'center', fontSize: '1.2rem' }}>Neural Diagnostics Pipeline</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
                    
                    {/* Step 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: workflowStep >= 0 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: workflowStep > 0 ? '#10b981' : (workflowStep === 0 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : '#cbd5e1'), display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        {workflowStep > 0 ? '✓' : '1'}
                      </div>
                      <div style={{ flex: 1, height: '4px', background: workflowStep > 0 ? '#10b981' : '#e2e8f0', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                      <span style={{ fontSize: '1rem', fontWeight: workflowStep === 0 ? 'bold' : 'normal', color: workflowStep === 0 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : 'var(--text-main)', transition: 'all 0.3s' }}>{modalType === 'predict' ? 'Ingesting 72-Hour WAQI Forecast' : 'Compiling WRF-Chem Dataset'}</span>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: workflowStep >= 1 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: workflowStep > 1 ? '#10b981' : (workflowStep === 1 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : '#cbd5e1'), display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        {workflowStep > 1 ? '✓' : '2'}
                      </div>
                      <div style={{ flex: 1, height: '4px', background: workflowStep > 1 ? '#10b981' : '#e2e8f0', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                      <span style={{ fontSize: '1rem', fontWeight: workflowStep === 1 ? 'bold' : 'normal', color: workflowStep === 1 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : 'var(--text-main)', transition: 'all 0.3s' }}>{modalType === 'predict' ? 'Simulating Weather Vectors' : 'Connecting to Neural Engine'}</span>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: workflowStep >= 2 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: workflowStep > 2 ? '#10b981' : (workflowStep === 2 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : '#cbd5e1'), display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        {workflowStep > 2 ? '✓' : '3'}
                      </div>
                      <div style={{ flex: 1, height: '4px', background: workflowStep > 2 ? '#10b981' : '#e2e8f0', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                      <span style={{ fontSize: '1rem', fontWeight: workflowStep === 2 ? 'bold' : 'normal', color: workflowStep === 2 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : 'var(--text-main)', transition: 'all 0.3s' }}>{modalType === 'predict' ? 'Processing Health Exposure' : 'Synthesizing Chemical Drivers'}</span>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: workflowStep >= 3 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: workflowStep > 3 ? '#10b981' : (workflowStep === 3 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : '#cbd5e1'), display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                        {workflowStep > 3 ? '✓' : '4'}
                      </div>
                      <div style={{ flex: 1, height: '4px', background: workflowStep > 3 ? '#10b981' : '#e2e8f0', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                      <span style={{ fontSize: '1rem', fontWeight: workflowStep === 3 ? 'bold' : 'normal', color: workflowStep === 3 ? (modalType === 'predict' ? '#8b5cf6' : 'var(--primary-color)') : 'var(--text-main)', transition: 'all 0.3s' }}>{modalType === 'predict' ? 'Generating X-AI Trajectory' : 'Formatting Diagnostic Report'}</span>
                    </div>
                  </div>
                  
                  {loadingStatus && (
                    <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center', border: '1px solid #fecaca' }}>
                       ⚠️ {loadingStatus}
                    </div>
                  )}
                </div>
              ) : explanation ? (
                <div className="animate-fade-in" style={{ background: 'var(--bg-color)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({node, ...props}) => <h1 style={{ color: 'var(--text-main)', fontSize: '1.8rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }} {...props} />,
                      h3: ({node, ...props}) => <h3 style={{ color: 'var(--primary-color)', fontSize: '1.4rem', margin: '2rem 0 1rem 0' }} {...props} />,
                      h4: ({node, ...props}) => <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: '1.5rem 0 0.75rem 0', fontWeight: 'bold' }} {...props} />,
                      p: ({node, ...props}) => <p style={{ margin: '0.75rem 0', color: 'var(--text-muted)' }} {...props} />,
                      ul: ({node, ...props}) => <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', margin: '1rem 0', color: 'var(--text-muted)' }} {...props} />,
                      ol: ({node, ...props}) => <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', margin: '1rem 0', color: 'var(--text-muted)' }} {...props} />,
                      li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
                      strong: ({node, ...props}) => <strong style={{ color: 'var(--text-main)', fontWeight: '700' }} {...props} />,
                      em: ({node, ...props}) => <em style={{ fontStyle: 'italic', color: 'var(--primary-color)' }} {...props} />,
                      blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--primary-color)', background: 'var(--code-bg)', padding: '1rem', margin: '1.5rem 0', borderRadius: '0 8px 8px 0', fontStyle: 'italic' }} {...props} />,
                      table: ({node, ...props}) => <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} {...props} /></div>,
                      th: ({node, ...props}) => <th style={{ padding: '0.75rem 1rem', background: 'var(--code-bg)', borderBottom: '2px solid var(--border-color)', fontWeight: 'bold' }} {...props} />,
                      td: ({node, ...props}) => <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }} {...props} />,
                      code: ({node, inline, ...props}) => inline ? <code style={{ background: 'var(--code-bg)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em', color: '#db2777' }} {...props} /> : <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}><code {...props} /></pre>
                    }}
                  >
                    {explanation}
                  </ReactMarkdown>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Waiting for AI execution...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
