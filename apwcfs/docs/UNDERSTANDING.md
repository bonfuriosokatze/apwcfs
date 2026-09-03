# Project understanding

## One sentence

APWCFS is a Delhi NCR air-quality interface that connects pollution measurements and estimates to the atmospheric conditions that shape their movement and accumulation.

## The user story

```text
Where is pollution?
        |
        v
How severe is it?
        |
        v
What is changing?
        |
        v
Which conditions explain the change?
        |
        v
How certain is the answer?
```

The product should make those answers available to residents, researchers, and operational users without requiring them to understand the full numerical model.

## Three product layers

### Observe

Present current pollutant and weather values with source, timestamp, unit, and status. A station value and a proxy estimate are different facts and should remain visibly different.

### Forecast

Present the expected evolution of AQI and pollutant fields over the target 72-hour window. A forecast must include its run time, valid time, model version, and uncertainty or confidence information.

### Explain

Connect changes to wind, mixing, humidity, temperature, inversion, boundary-layer height, emissions, and regional transport. Explanations describe model relationships and evidence; they do not turn feature importance into proof of physical causality.

## Scientific narrative

```text
Regional emissions increase
        -> winds transport material toward Delhi NCR
        -> weak mixing and a shallow PBL limit dilution
        -> humidity increases particle water uptake and haze
        -> surface PM2.5 rises
        -> AQI category worsens
```

Stronger ventilation, deeper mixing, precipitation, or a changing wind direction may later reduce concentrations. Each link must be checked against the actual data for the selected time and place.

## Data lineage

```text
Open-Meteo weather + air quality
WAQI nearest-station response
Nominatim reverse geocoding
             |
             v
      Merge and fallback logic
             |
             v
       Dashboard state
             |
             v
       Map and explanation
```

When a nearby WAQI station is usable, station pollutant values are preferred. When it is missing or farther than the local monitoring radius, the app can estimate PM2.5 from aerosol optical depth and weather proxies. This estimate is useful for continuity, but it is not ground truth.

## WRF-Chem boundary

WRF-Chem is a possible scientific engine for the target system. It is not currently executed by the React application. A future backend should own model preparation, runs, post-processing, validation, and dataset publication; the browser should consume a stable API.

## What success looks like

- A user can identify severity and pollutant composition at a selected location.
- The user can tell whether a value is observed, estimated, or modelled.
- A forecast can be traced to a run, inputs, and validation results.
- Explanations are understandable without overstating causality.
- Missing, stale, or low-confidence data is visible and does not silently become certainty.
