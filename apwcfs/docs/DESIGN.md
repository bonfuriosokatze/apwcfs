# Product and interface design

## Design goal

APWCFS should help a person move from a regional signal to a defensible explanation in seconds. The interface is a monitoring tool: dense where comparison matters, quiet where the data is uncertain, and explicit about what is observed versus inferred.

## Primary workflow

```text
Select a location -> inspect current state -> move through time -> open explanation
```

The dashboard should answer, in order:

1. How bad is the air here now?
2. Which pollutant is driving the result?
3. What are the atmospheric conditions?
4. What changes across the forecast window?
5. How reliable and actionable is this result?

## Dashboard layout

```text
+--------------------------------------------------------------+
| Navigation | location | last updated | data status           |
+-------------------------------+------------------------------+
|                               | AQI and pollutant summary   |
|                               +------------------------------+
|          Map and legend       | Weather and dispersion       |
|                               +------------------------------+
|                               | Explanation and provenance  |
+-------------------------------+------------------------------+
| Forecast timeline and selected timestamp                    |
+--------------------------------------------------------------+
```

The map is the visual anchor. Summary panels should support it, not obscure it. On small screens, stack the summary above the map, keep the selected timestamp visible, and place the explanation below the location data.

## Map requirements

Planned layers should be grouped by meaning:

| Group | Layers |
| --- | --- |
| Pollution | AQI, PM2.5, PM10, O3, NO2 |
| Atmosphere | wind, temperature, humidity, PBL, inversion |
| Sources | active fires, emissions, plume trajectory |

Selecting a point should show the nearest available station or grid cell, the distance to that source, the timestamp, units, and a status badge. A regional interpolation must never look like a sensor reading.

## Time control

The timeline is a first-class control for the planned forecast view. It should include a selected timestamp, current-time marker, forecast boundary, play/pause, and keyboard-accessible scrubbing. Changing time must update the map, cards, legend, and explanation together.

## AQI communication

Show the numeric AQI beside the category and the standard used. Show pollutant concentration separately because AQI hides the composition of risk. Keep health guidance tied to the category and avoid implying that one number represents every pollutant equally.

## Explanation panel

```text
WHY THIS VALUE?

Observed or modelled state
Top contributing conditions
Data gaps and confidence
Plain-language interpretation
```

An AI-generated explanation may translate data, but it must receive the source values and status labels in its prompt. It should use language such as "consistent with" or "associated with" unless a causal method supports stronger wording.

## Visual language

- Use a restrained, high-contrast palette whose AQI colors are reserved for severity.
- Keep units, timestamps, and source labels close to the value they qualify.
- Use color plus text or icon; color alone is not sufficient for status.
- Prefer short labels and progressive disclosure over paragraphs in the dashboard.
- Preserve fixed map and chart dimensions so loading or long labels do not shift the layout.
- Provide loading, stale, no-data, estimated, and error states for every data-dependent panel.

## Accessibility and responsive behavior

All controls need visible focus states, keyboard access, readable contrast, and text alternatives for map-only information. The map must not be the only way to select a location. On mobile, controls should remain reachable without covering the selected value or legend.

## Prototype boundary

The current frontend implements navigation, the Science page, a Leaflet map, a regional heat layer, location selection, current-data cards, and an explanation workflow. The timeline, multi-layer controls, fire layer, plume layer, confidence visualization, and production alert workflow are design targets rather than completed features.
