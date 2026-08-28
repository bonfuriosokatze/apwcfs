# Palm Beach — Project Understanding

## 1. One-Line Understanding

Palm Beach is a **Delhi NCR-focused 72-hour air-pollution forecasting and explanation platform** that combines atmospheric modelling, regional emission context, geospatial visualization, and XAI.

---

# 2. The Core Problem

Delhi NCR pollution is not controlled by emissions alone.

The same amount of pollution can produce very different surface concentrations depending on:

- wind
- atmospheric mixing
- PBL height
- temperature
- humidity
- inversion
- precipitation
- regional transport

At the same time, aerosols can influence atmospheric radiation and therefore atmospheric conditions.

This is why the project is framed as:

> **Weather ↔ Chemistry**

rather than simply:

> Weather + AQI.

---

# 3. What the User Should Experience

The user should not need to understand WRF-Chem.

They should see:

```text
Where is pollution?
        ↓
How bad will it get?
        ↓
When will it peak?
        ↓
Where is it coming from?
        ↓
Why is it accumulating?
        ↓
When might it improve?
```

The dashboard translates the scientific pipeline into those answers.

---

# 4. Three Product Layers

## Layer 1 — Observe

Show what is happening.

- Current AQI
- PM2.5
- PM10
- O₃
- NOx
- Fire activity
- Weather

## Layer 2 — Forecast

Show what is expected.

- 72-hour heat map
- Time-series forecast
- Plume movement
- Future weather
- Future PBL/inversion conditions

## Layer 3 — Explain

Show why the forecast changes.

- Meteorological drivers
- Chemical drivers
- Biomass-burning influence
- XAI feature attribution
- Uncertainty

---

# 5. Product Story

A good demo should tell a story such as:

> A regional biomass-burning episode is detected.

↓

> Winds are transporting the plume toward the Delhi NCR region.

↓

> Atmospheric mixing is weak and the PBL is shallow.

↓

> Pollutants accumulate near the surface.

↓

> PM2.5 increases.

↓

> AQI is forecast to deteriorate.

↓

> XAI identifies weak winds, low PBL height, inversion strength and biomass-burning influence as important drivers.

↓

> Later, stronger winds and improved mixing reduce concentrations.

This is the experience that connects the project statement to the dashboard.

---

# 6. Relationship Between Components

```text
STUBBLE BURNING
      │
      ▼
 EMISSIONS
      │
      ▼
 ┌─────────────┐
 │ ATMOSPHERE  │
 │             │
 │ Wind        │
 │ PBL         │
 │ Inversion   │
 │ Temperature │
 └──────┬──────┘
        │
        ▼
 POLLUTANT TRANSPORT
        │
        ▼
 PM2.5 / PM10 / O3 / NOx
        │
        ▼
      AQI
        │
        ├──────────► HEAT MAP
        │
        └──────────► XAI
```

The scientific model generates the state.

The product interprets the state.

---

# 7. WRF-Chem's Role

WRF-Chem should be considered the **scientific engine**, not the entire product.

It belongs behind the API/data layer.

```text
WRF-Chem
   ↓
Scientific forecast
   ↓
Post-processing
   ↓
Forecast dataset
   ↓
API
   ↓
Dashboard
```

This separation is important because it lets the frontend continue evolving independently of the scientific model.

---

# 8. XAI's Role

XAI should answer:

> What factors contributed to this forecast?

It should not pretend to prove a causal relationship that the model cannot establish.

For example:

### Good

> Low wind speed is strongly associated with the predicted increase in PM2.5 for this forecast location and time.

### Too strong

> Low wind speed caused 37% of the pollution.

Unless the scientific methodology genuinely supports that causal statement, avoid it.

---

# 9. Heat Map as the Final Output

The pollution heat map should be the **primary visual output**.

Everything else should support it.

```text
             72-HOUR FORECAST
                    │
                    ▼
           POLLUTION HEAT MAP
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Weather     Plume        XAI
        │           │           │
        └───────────┼───────────┘
                    ▼
             User understanding
```

The map should never become a decorative visualization.

It is the core forecast interface.

---

# 10. Suggested Demo Flow

For a competition demonstration:

### Step 1

Open the landing page.

Explain:

> Delhi pollution is a weather–chemistry problem.

### Step 2

Enter dashboard.

Show current AQI map.

### Step 3

Move timeline forward.

Show pollution building in Delhi NCR.

### Step 4

Enable fire layer.

Show regional burning activity.

### Step 5

Enable plume.

Show projected transport.

### Step 6

Open atmospheric conditions.

Show:

- low wind
- shallow PBL
- inversion

### Step 7

Open XAI.

Show why the model predicts deterioration.

### Step 8

Move further forward.

Show conditions improving.

This creates a complete narrative rather than a collection of unrelated charts.

---

# 11. What Makes the Project Different

A basic AQI app:

```text
AQI → Number
```

A normal forecast app:

```text
AQI → Number + Future Number
```

Palm Beach:

```text
AQI
 ↓
Spatial forecast
 ↓
72-hour evolution
 ↓
Meteorological context
 ↓
Regional plume
 ↓
Stubble-burning context
 ↓
XAI explanation
```

That is the core differentiator.

---

# 12. Technical Philosophy

The system should combine:

### Physics

WRF-Chem / atmospheric modelling

### Observations

Ground + satellite + weather data

### Data science

Bias correction / forecasting / validation

### XAI

Feature attribution and interpretable explanations

### Geospatial engineering

Raster/vector forecasting and plume visualization

### Product design

Simple communication of complex science

No single layer is sufficient on its own.

---

# 13. Key Principle for Future Decisions

Whenever a new feature is proposed, ask:

> Does this help the user understand **where, when, why, or what next**?

If not, it probably does not belong in the first product version.

---

# 14. Current Working Definition

**Palm Beach is a scientific visualization and forecasting product for Delhi NCR that turns coupled atmospheric and pollution modelling into a simple, interactive 72-hour map-based experience with explainable predictions.**

This definition can evolve as the scientific architecture is validated.
