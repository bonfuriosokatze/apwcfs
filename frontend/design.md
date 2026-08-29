Absolutely. For **APWCFS**, I would make the frontend specification much more page-oriented and product-focused than the earlier generic `DESIGN.md`.

Your core idea is:

> **A clean public-facing experience → explain the problem/science → enter a serious Delhi NCR forecasting dashboard.**

And the **dashboard is the actual product**, while the other pages build context and credibility.

Below is the proposed `FRONTEND_DESIGN.md` you can put under `docs/`.

````markdown
# APWCFS — Frontend Design Specification

**Project:** Air Pollution Weather-Coupled Forecasting System  
**Focus:** Delhi NCR  
**Frontend Role:** Public product experience + scientific communication + forecasting dashboard

---

# 1. Frontend Vision

APWCFS should provide a clean, modern interface for understanding air pollution across Delhi NCR.

The frontend has two responsibilities:

1. **Explain the problem and technology**
2. **Present the forecast in a simple, highly visual way**

The product should not feel like a traditional AQI monitoring website.

The primary experience should be:

> **See the pollution → Explore the forecast → Understand the cause → Understand what happens next.**

The central visual element of the application is the **Delhi NCR pollution heat map**.

---

# 2. Frontend Page Structure

The initial frontend will contain four primary routes:

```text
/
├── Home
│
├── /about
│   └── About APWCFS
│
├── /science
│   └── Scientific Approach
│
└── /dashboard
    └── 72-Hour Delhi NCR Forecast
````

Future pages may include:

```text
/ methodology
/ data
/ validation
/ research
/ team
```

These should NOT be implemented in the first version unless required.

---

# 3. Global Navigation

The navigation should remain minimal.

```text
┌──────────────────────────────────────────────────────────┐
│ APWCFS       Forecast     About     Science     [Dashboard]│
└──────────────────────────────────────────────────────────┘
```

## Navigation Items

### APWCFS

Logo / home navigation.

### Forecast

Links directly to:

```text
/dashboard
```

### About

Project motivation and problem.

### Science

Weather–chemistry coupling, WRF-Chem, stubble burning and XAI.

### Dashboard

Primary CTA.

The dashboard button should visually stand out from normal navigation links.

---

# 4. Page 01 — Landing Page

Route:

```text
/
```

Purpose:

The landing page should immediately communicate:

* What APWCFS is
* Why it matters
* What makes it different
* Where the user can explore the forecast

It should NOT attempt to explain the entire scientific methodology.

---

# 5. Landing Page — Hero

The hero is the most important section of the landing page.

Suggested structure:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                     APWCFS                               │
│                                                          │
│         UNDERSTAND THE AIR.                              │
│         FORECAST WHAT COMES NEXT.                        │
│                                                          │
│   Weather-coupled air pollution forecasting              │
│   focused on Delhi NCR.                                  │
│                                                          │
│        [ Explore 72-Hour Forecast ]                      │
│                                                          │
│                                                          │
│              Delhi NCR Map Preview                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Alternative headline:

> **Where pollution goes depends on the weather.**

Supporting copy:

> APWCFS combines atmospheric conditions, pollution dynamics and regional emission signals to forecast air quality across Delhi NCR for the next 72 hours.

Primary CTA:

```text
Explore Forecast →
```

Secondary CTA:

```text
How It Works
```

---

# 6. Landing Page — Problem

Immediately after the hero:

```text
THE DELHI NCR PROBLEM
```

Explain briefly:

Delhi NCR pollution is influenced by much more than local emissions.

Factors include:

* Atmospheric inversions
* Weak winds
* Low PBL height
* Regional transport
* Biomass burning
* Chemical transformation

The section should visually introduce:

```text
Emissions
     +
Weather
     +
Atmospheric Chemistry
     ↓
Air Pollution
```

Keep the text short.

---

# 7. Landing Page — Why Conventional Forecasting Is Difficult

Show the limitation of treating pollution and meteorology independently.

```text
TRADITIONAL APPROACH

Weather ──────────► Pollution


APWCFS APPROACH

             ┌─────────────┐
             │   WEATHER   │
             └──────┬──────┘
                    ↕
             ┌──────┴──────┐
             │  CHEMISTRY  │
             └─────────────┘
```

The visual should communicate the core project innovation.

---

# 8. Landing Page — What APWCFS Does

Three or four feature cards:

### Forecast

```text
72 HOURS
```

High-resolution pollution forecast across Delhi NCR.

### Heat Map

```text
SPATIAL
```

Understand where pollution is expected to concentrate.

### Regional Transport

```text
SOURCE → PLUME → IMPACT
```

Explore potential influence from regional biomass burning.

### XAI

```text
WHY?
```

Understand the major factors influencing the forecast.

---

# 9. Landing Page — Forecast Preview

This section should visually preview the actual dashboard.

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│              DELHI NCR FORECAST                     │
│                                                     │
│            [ POLLUTION HEAT MAP ]                   │
│                                                     │
│                                                     │
│  AQI  ────────────────────────────────              │
│                                                     │
│       06h    12h    24h    48h    72h               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

This should be a visual teaser rather than a complete duplicate of the dashboard.

CTA:

```text
Explore the full forecast →
```

---

# 10. Landing Page — Explainability

Introduce XAI before the user reaches the dashboard.

Example:

```text
WHY IS POLLUTION INCREASING?

        Low Wind             █████████████
        Shallow PBL          ███████████
        Inversion             █████████
        Fire Influence        ███████
```

Supporting text:

> APWCFS does not only show the forecast. It helps explain the environmental conditions associated with forecast changes.

Do not claim causal attribution unless the scientific methodology supports it.

---

# 11. Landing Page — Final CTA

End with a strong CTA.

```text
READY TO EXPLORE THE FORECAST?

See how Delhi NCR pollution is expected
to evolve over the next 72 hours.

        [ Open Forecast Dashboard ]
```

---

# 12. Page 02 — About

Route:

```text
/about
```

Purpose:

Explain the project motivation and problem statement.

This page should feel editorial rather than like a dashboard.

---

# 13. About — Hero

Suggested heading:

> **Why Delhi NCR needs better pollution forecasting**

Supporting text:

> Air pollution episodes emerge from the interaction of emissions, atmospheric transport, chemical processes and weather conditions.

---

# 14. About — The Problem

Explain:

### Local pollution

Traffic, industry, construction, domestic sources and other emissions.

### Regional pollution

Pollution transported from surrounding areas.

### Meteorology

Weather determines how efficiently pollutants disperse.

### Seasonal episodes

Winter conditions can produce particularly severe pollution accumulation.

---

# 15. About — Stubble Burning

This should be a major section.

Show a visual sequence:

```text
Agricultural Burning
        ↓
Emissions
        ↓
Atmospheric Transport
        ↓
Delhi NCR
        ↓
Pollution Episode
```

Explain that the system aims to model and visualize potential regional influence.

The frontend must distinguish:

```text
OBSERVED FIRE
```

from:

```text
MODELLED PLUME
```

and:

```text
ESTIMATED INFLUENCE
```

These are not equivalent.

---

# 16. About — Project Objective

Present the objective clearly:

> Develop a high-resolution, Delhi NCR-focused system capable of forecasting air quality for the next 72 hours while explicitly representing the interaction between atmospheric conditions and pollution.

---

# 17. Page 03 — Science

Route:

```text
/science
```

Purpose:

Explain how APWCFS works technically.

This is where WRF-Chem belongs.

The landing page should say:

> Weather and chemistry are coupled.

The Science page should explain **how we intend to model that coupling**.

---

# 18. Science — System Overview

Main visual:

```text
Weather Data
     │
     ▼
┌───────────────┐
│   WRF-Chem    │
└───────┬───────┘
        │
 ┌──────┴──────┐
 ▼             ▼
Weather     Chemistry
 │             │
 └──────┬──────┘
        │
        ▼
  Forecast Fields
        │
        ▼
   Post Processing
        │
        ▼
      XAI
        │
        ▼
    Dashboard
```

---

# 19. Science — Weather

Explain the important variables:

* Temperature
* Wind speed
* Wind direction
* Humidity
* PBL height
* Atmospheric stability
* Precipitation

Explain their relationship with pollution dispersion.

---

# 20. Science — Chemistry

Explain the important pollutants:

* PM2.5
* PM10
* O₃
* NOx

Avoid displaying chemical equations in the first version unless necessary.

The page should focus on system understanding rather than becoming a chemistry textbook.

---

# 21. Science — Atmospheric Inversion

Explain:

```text
Normal Mixing

     ↑
     │
  Pollution
     │
─────┴─────
Surface
```

versus:

```text
Temperature Inversion

──────────────
Warm air
──────────────
     ↓
Pollution trapped
     ↓
──────────────
Surface
```

The frontend can later include an animated visual.

The dashboard will expose an inversion indicator.

---

# 22. Science — PBL

Explain the importance of Planetary Boundary Layer height.

Concept:

```text
Higher PBL
     ↓
More vertical mixing
     ↓
Better dispersion

Lower PBL
     ↓
Less vertical mixing
     ↓
Surface accumulation
```

---

# 23. Science — Stubble Burning

Explain the modelling workflow:

```text
Satellite Fire Detection
          ↓
Emission Estimate
          ↓
Regional Transport
          ↓
Plume Forecast
          ↓
Delhi NCR Influence
```

The page should clearly label the difference between observation and model prediction.

---

# 24. Science — XAI

Explain the purpose:

> A forecast should not only provide a number. It should provide interpretable context around that number.

Example:

```text
Forecast AQI
     ↓
Why?
     ├── Wind
     ├── PBL
     ├── Inversion
     ├── PM background
     └── Biomass-burning influence
```

Potential implementation:

* SHAP
* Feature attribution
* Physics-based explanations
* Model uncertainty

The exact technique should be finalized after the forecasting architecture is finalized.

---

# 25. Page 04 — Dashboard

Route:

```text
/dashboard
```

This is the **main product page**.

The dashboard should be map-first.

---

# 26. Dashboard — Overall Layout

Desktop:

```text
┌──────────────────────────────────────────────────────────┐
│ APWCFS                 Forecast  About  Science           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌───────────────────────────────────────┐ ┌────────────┐ │
│ │                                       │ │ AQI        │ │
│ │                                       │ │  ---       │ │
│ │                                       │ ├────────────┤ │
│ │          DELHI NCR MAP               │ │ PM2.5      │ │
│ │                                       │ │ ---        │ │
│ │                                       │ ├────────────┤ │
│ │                                       │ │ PBL        │ │
│ │                                       │ │ ---        │ │
│ └───────────────────────────────────────┘ └────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 72-HOUR FORECAST TIMELINE                                │
│                                                          │
│ NOW ─── 6H ─── 12H ─── 24H ─── 48H ─── 72H              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────┐ ┌─────────────────────────┐ │
│ │ FORECAST TREND           │ │ WHY THIS FORECAST?      │ │
│ │                          │ │                         │ │
│ │        AQI               │ │ Wind       ████████     │ │
│ │      ╭──╮                │ │ PBL        █████████    │ │
│ │  ╭───╯  ╰───             │ │ Inversion  ███████      │ │
│ │                          │ │ Fire       █████        │ │
│ └──────────────────────────┘ └─────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# 27. Dashboard — Main Map

The map is the **primary component**.

Default:

```text
AQI Heat Map
```

The map should eventually support:

### Pollution

* AQI
* PM2.5
* PM10
* O₃
* NOx

### Atmosphere

* Wind
* PBL height
* Inversion

### Sources

* Fire hotspots
* Plume

---

# 28. Dashboard — Map Controls

Use a simple layer control.

```text
POLLUTION

● AQI
○ PM2.5
○ PM10
○ O₃
○ NOx


ATMOSPHERE

○ Wind
○ PBL
○ Inversion


SOURCES

○ Fire Activity
○ Pollution Plume
```

Do not enable every layer simultaneously.

---

# 29. Dashboard — AQI Summary

The current selected location/time should show:

```text
AQI

386

Very Poor

PM2.5
245

PM10
291
```

Actual values will come from the forecast backend.

During the barebones phase:

```text
AQI
—

PM2.5
—

PM10
—
```

Never insert fake scientific values.

---

# 30. Dashboard — 72-Hour Timeline

This is one of the most important interactions.

The timeline controls the entire dashboard.

```text
NOW
 │
 ├──── 6H
 │
 ├──── 12H
 │
 ├──── 24H
 │
 ├──── 48H
 │
 └──── 72H
```

Changing time should update:

* Map
* AQI
* Pollutants
* Weather
* PBL
* Inversion
* Plume
* XAI

---

# 31. Dashboard — Forecast Chart

Show:

```text
AQI
PM2.5
```

The initial version should support switching between them.

Example:

```text
AQI

400 ┤                 ╭───╮
350 ┤             ╭───╯   ╰──╮
300 ┤        ╭────╯           ╰──
250 ┤    ╭───╯
200 ┤────╯
    └─────────────────────────────
     0   12   24   36   48   60  72h
```

The selected point should correspond to the map timestamp.

---

# 32. Dashboard — Stubble Burning

Dedicated panel:

```text
REGIONAL BIOMASS-BURNING ACTIVITY

Active fire signals
        ↓
Regional source area
        ↓
Wind direction
        ↓
Predicted plume
        ↓
Delhi NCR influence
```

Potential information:

```text
Fire Activity       Detected
Transport Direction → Delhi NCR
Estimated Influence Medium
Arrival Window      8–14 hours
```

These values must eventually be backed by the scientific pipeline.

---

# 33. Dashboard — Pollution Plume

The plume should appear as a geospatial overlay.

Conceptually:

```text
Source Region
     🔥
      \
       \
        → → → → Delhi NCR
                   ███████
                   ███████
```

The visual should communicate:

* Direction
* Spatial extent
* Intensity/probability
* Time evolution

Avoid representing a modelled plume as an exact physical boundary.

---

# 34. Dashboard — Atmospheric Conditions

Show compact cards:

```text
TEMPERATURE
—

WIND
—

PBL HEIGHT
—

INVERSION
—

HUMIDITY
—
```

These are primarily explanatory variables.

---

# 35. Dashboard — XAI

The XAI panel should be directly connected to the selected location and time.

Heading:

> **Why is pollution changing?**

Example:

```text
FORECAST DRIVER

PBL HEIGHT
High influence

████████████████


WIND SPEED
High influence

██████████████


INVERSION
Medium influence

██████████


BIOMASS BURNING
Medium influence

████████
```

Then provide a natural-language summary.

Example:

> Low wind speeds and a shallow boundary layer are associated with reduced dispersion during this forecast period. Regional biomass-burning activity may further increase pollution levels.

---

# 36. Dashboard — Forecast Confidence

The dashboard should eventually show uncertainty.

Example:

```text
FORECAST CONFIDENCE

██████████████░░
Moderate
```

Clicking it could explain:

> Confidence reflects uncertainty in the model inputs, forecast spread and/or validation framework.

The exact confidence methodology must be documented before displaying a numerical score.

---

# 37. Dashboard — Location Inspection

Clicking a location on the map opens a panel.

```text
DELHI

Forecast time
18:00

AQI
386

PM2.5
245

PBL
280 m

Wind
1.2 m/s

Inversion
Strong
```

Future:

```text
[Explain this location]
```

opens the XAI view.

---

# 38. Dashboard — Forecast States

The dashboard must clearly distinguish:

### Observed

Data measured/detected now.

### Forecast

Model prediction.

### Derived

Values calculated from model/observational inputs.

### Estimated

Values with additional uncertainty or attribution assumptions.

Example:

```text
● Observed Fire
● Forecast AQI
● Modelled Plume
● Estimated Influence
```

This is important for scientific credibility.

---

# 39. Barebones Frontend State

Before connecting real data, the dashboard should use explicit empty states.

Example:

```text
AQI
—

Waiting for forecast data
```

Map:

```text
Delhi NCR

Forecast layer unavailable.
Connect forecast API to display model output.
```

XAI:

```text
No explanation available.

XAI will appear when forecast data is connected.
```

This is preferable to fake values.

---

# 40. Frontend Data Contract

The frontend should consume a model-independent API.

Conceptually:

```text
Frontend
   │
   ▼
Forecast API
   │
   ▼
Forecast Dataset
   │
   ▼
WRF-Chem / ML / Observations
```

The frontend must NOT directly depend on WRF-Chem files.

---

# 41. Component Architecture

Suggested structure:

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── science/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx
│
├── components/
│   ├── navigation/
│   │   └── Navbar
│   │
│   ├── landing/
│   │   ├── Hero
│   │   ├── Problem
│   │   ├── Features
│   │   └── CTA
│   │
│   ├── map/
│   │   ├── PollutionMap
│   │   ├── LayerControl
│   │   ├── MapLegend
│   │   └── LocationPanel
│   │
│   ├── forecast/
│   │   ├── ForecastTimeline
│   │   ├── ForecastChart
│   │   └── ForecastSummary
│   │
│   ├── pollution/
│   │   ├── AQICard
│   │   ├── PollutantCard
│   │   └── AQILegend
│   │
│   ├── atmosphere/
│   │   ├── WeatherCard
│   │   ├── PBLCard
│   │   └── InversionCard
│   │
│   ├── plume/
│   │   ├── FireLayer
│   │   └── PlumeLayer
│   │
│   └── xai/
│       ├── XAIExplanation
│       ├── FeatureContribution
│       └── ForecastReason
│
├── maps/
├── charts/
└── lib/
    ├── api/
    ├── forecast/
    └── formatting/
```

---

# 42. Frontend Technology Direction

Recommended:

| Area       | Technology                            |
| ---------- | ------------------------------------- |
| Framework  | Next.js                               |
| Language   | TypeScript                            |
| Styling    | Tailwind CSS                          |
| Mapping    | MapLibre GL                           |
| Charts     | Recharts                              |
| State      | React state / Zustand if required     |
| API        | REST initially                        |
| Geospatial | GeoJSON + raster tiles                |
| Deployment | Docker / Vercel / appropriate hosting |

The exact stack can change if the existing repository already uses something else.

---

# 43. Responsive Design

Desktop is the primary target because the dashboard is data-dense.

### Desktop

```text
Large map
+
Right information panel
+
Bottom timeline
+
Forecast/XAI panels
```

### Tablet

```text
Map
↓
Summary
↓
Timeline
↓
XAI
```

### Mobile

Prioritize:

1. AQI
2. Map
3. Timeline
4. Forecast
5. XAI
6. Additional layers

---

# 44. Visual Design Principles

## Principle 1 — Map First

The dashboard should visually prioritize the map.

## Principle 2 — Don't Overcrowd

Not every dataset should be visible simultaneously.

## Principle 3 — Progressive Disclosure

Simple by default.

Technical information available when requested.

## Principle 4 — Scientific Honesty

Never present model estimates as observations.

## Principle 5 — Explain Numbers

Every important forecast value should have context.

## Principle 6 — Time Is Central

The user should always know:

> **What time am I looking at?**

---

# 45. Core UX Loop

The entire dashboard should support one loop:

```text
SELECT TIME
     ↓
VIEW MAP
     ↓
SELECT LOCATION
     ↓
SEE FORECAST
     ↓
ASK "WHY?"
     ↓
VIEW XAI
     ↓
INSPECT WEATHER / FIRE / PLUME
     ↓
MOVE FORWARD IN TIME
     ↓
SEE HOW CONDITIONS CHANGE
```

This should be the central interaction model.

---

# 46. Final Product Hierarchy

The frontend hierarchy should ultimately be:

```text
                APWCFS
                  │
        ┌─────────┴─────────┐
        │                   │
    EXPLAIN              FORECAST
        │                   │
   About / Science      Dashboard
                            │
                     ┌──────┴──────┐
                     │             │
                   WHERE         WHEN
                     │             │
                  Heat Map      72 Hours
                     │
                     ▼
                    WHY
                     │
                    XAI
                     │
                     ▼
                  CONTEXT
                     │
              Weather / Fire
                     │
                     ▼
                   WHAT NEXT
```

---

# 47. First Implementation Priority

Do NOT implement the entire design at once.

Build in this order:

### Phase 1 — Shell

* Navigation
* Routing
* Global layout
* Typography
* Basic responsive structure

### Phase 2 — Landing

* Hero
* Problem
* Product concept
* Forecast preview
* CTA

### Phase 3 — About

* Problem
* Delhi NCR
* Stubble burning
* Project objective

### Phase 4 — Science

* Weather
* Chemistry
* WRF-Chem
* Inversion
* PBL
* Stubble burning
* XAI

### Phase 5 — Dashboard skeleton

* Map container
* AQI cards
* Timeline
* Forecast chart
* XAI panel
* Fire/plume placeholders

### Phase 6 — Real map

* Delhi NCR boundary
* MapLibre
* Heat-map layer
* Legend
* Location interaction

### Phase 7 — Data

Connect the forecast API.

### Phase 8 — Scientific layers

Add:

* Weather
* PBL
* Inversion
* Fire
* Plume

### Phase 9 — XAI

Connect actual model explanations.

---

# 48. Definition of Frontend MVP

The frontend MVP is complete when a user can:

1. Open APWCFS.
2. Understand the project within 30 seconds.
3. Navigate to the dashboard.
4. See a Delhi NCR map.
5. Select a forecast time.
6. View pollution information.
7. Understand the 72-hour forecast concept.
8. See stubble-burning context.
9. See atmospheric context.
10. Open an explanation of forecast drivers.

Real WRF-Chem output can be integrated after this shell is stable.

---

# 49. Core Design Statement

APWCFS should never feel like:

> **"Here is a map with AQI numbers."**

It should feel like:

> **"Here is what Delhi NCR's air is expected to do, where it will happen, when it will happen, and the atmospheric factors behind the forecast."**

That is the frontend product.

```

### One architectural decision I strongly recommend

Don't make **Home → About → Science → Dashboard** four unrelated pages.

Make them a progression:

**Home:** *Why should I care?*  
↓  
**About:** *What problem are you solving?*  
↓  
**Science:** *How are you solving it?*  
↓  
**Dashboard:** *Show me the actual forecast.*

That gives the SIH demo a very natural narrative.

And for the dashboard, I would make **the heat map the undisputed hero**. Everything else—72-hour timeline, stubble burning, inversion, PBL, weather and XAI—should explain or enrich what the map is showing.
```
