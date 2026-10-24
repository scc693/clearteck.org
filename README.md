# Cycleway

A fresh cycling route planner for `clearteck.org`. The previous IT-support site is preserved in the GitHub branch `archive/pre-cycleway-2026-10-24` at `1ff54e998cdaf0a0781668ed518ed331d69ee69b`. Existing commit history is retained.

## Run and deploy

Requires Node 20+. No package installation or API key is needed for the default services.

```sh
npm test
npm run build
npm run dev
```

The generated `dist/` directory is a static site. Existing Cloudflare assets hosting can build with `npm run build` and serve `dist`. `wrangler.jsonc` keeps the `clearteck` Worker name. Sites hosting is also configured in `.openai/hosting.json`. No DNS or existing Cloudflare account settings are changed by this source configuration.

## Features

- OSM-based vector basemap from OpenFreeMap, rendered with OpenLayers Canvas (no GPU/WebGL dependency).
- Explicit-submit Photon address/place search; cached responses; no background geocoding. Map taps and browser geolocation can set points too.
- Bicycle-specific BRouter profiles: trekking, fastbike, fastbike-verylowtraffic; two on-demand alternatives. Route geometry follows the road network.
- Custom via points, marker dragging, point reordering, route reversal. Changing a point invalidates old results. Up to 30 points.
- Adjustable moving speed, light count, stop probability, conditional wait time, and additional delay. Required overall and moving average for a target duration.
- Approximate signalized intersection counts from **the chosen route's BRouter OSM node tags**, with signal/crossing nodes within 45 metres grouped. No city-wide proximity queries or car-routing substitutions.
- Elevation profile, filtered ascent, bridge/tunnel/steps/unpaved notices when tagged, turn cues from BRouter.
- Local route saving (up to 30), GPX import/export, coordinate-only route sharing via URL fragment.
- Health workout JSON import, manual rides, explicit assistance labels, selection and distance filters, median trip pace, middle 50% observed pace range, and combined-delay calibration. Exports preserve labels.
- Separate assisted/unpowered profiles; custom service endpoints; responsive phone layout; labelled form controls and native dialogs.

## Estimate model and limits

Manual mode uses `minutes = miles / moving_mph * 60 + signal_clusters * stop_probability * stopped_seconds / 60 + extra_minutes`. Speed is the route-average **while moving**, already accounting for hills. It is not maximum/cruise speed. Signal defaults (50% stopping, 30 seconds conditional wait) are uncalibrated planning assumptions, not measured timing.

History mode uses median elapsed trip speed, including all delay. It adds no stop allowance again. The middle 50% interval is descriptive, not a prediction/confidence interval, and comparable routes/conditions matter. One ride is reported as one sample.

Delay calibration uses median `elapsed_minutes - distance / assumed_moving_mph * 60`, floored at zero after computing the median. This cannot isolate traffic lights from congestion, hills, breaks or assistance. Applying combined delay sets per-light wait to zero to prevent double counting. A negative residual flags an inconsistent assumed moving speed. Unassigned assistance records are excluded, never silently treated as assisted. Bulk labelling is an explicit user action.

Workouts with start/end timestamps use wall-clock elapsed time, avoiding optimistic auto-pause duration. Imported JSON workout duration is used only when elapsed timestamps are absent. Generic JSON schema: an array of `{date, activity: "cycling", miles, minutes, mode: "assisted" | "unpowered"}`; Health's `{workout: [...]}` schema is supported as well. This web app does **not** directly synchronize Apple Health; import is local.

GPX tracks keep exact geometry and lack signal counts/turn cues unless provided by a new routing request. Multiple disconnected track segments are rejected rather than joined across gaps. Editing/rebuilding an imported track re-routes between pins and can change its shape. Saved geometry is a snapshot; recalculate for fresh mapping.

This is route planning, not live navigation. There is no live traffic, closure, weather, signal-phase or e-bike-specific legal feed. BRouter profiles are bicycle profiles, not a guarantee of legal access for every e-bike class. Tags may be missing or incorrect. Never interpret zero mapped lights, steps or tunnels as verified absence. Third-party providers update on their own schedules and have no availability guarantee.

## Privacy and service operation

The repository contains **no personal health records or commute addresses**. Imported workouts, calibration and saved routes stay in localStorage on the current origin/device. They do not sync across devices and may be lost if browser storage is cleared. Export important rides/routes. History is visible to anyone using the same browser profile.

Search queries/coordinates go to Photon; routing coordinates go to BRouter; map tile requests go to OpenFreeMap. Shared links include start, destination and via-point coordinates, but no ride history. Do not share a home/work route link publicly if those locations are private. Service URLs can be changed in settings. Use compatible HTTPS/CORS-enabled endpoints and correct attribution. XYZ tile replacements may require additional provider-specific attribution.

Defaults use public community services, suitable for light personal use, not unlimited production service. Search and routing cache responses for 24 hours, route alternatives run only when requested, and place searches run only on submission. For substantial public usage, obtain provider approval or host BRouter/Photon and a basemap endpoint. No Nominatim public endpoint is used.

## Verification

`npm test` covers trip/time arithmetic, impossible arrival targets, historical stop double-counting, signal clustering, elapsed-duration import semantics, assisted/unpowered filtering, GPS validation and GPX escaping. Browser QA verified live routing, map rendering, speed/target changes and local saving. The file chooser timed out during import testing, so browser-level GPX/Health imports and exports remain unverified. Parser/calibration arithmetic is unit-tested. External service failures are surfaced rather than replaced with fabricated routes.

Pinned CDN runtime versions: OpenLayers 10.6.1, ol-mapbox-style 12.6.0. Their licenses are in `vendor/LICENSES.md`.
