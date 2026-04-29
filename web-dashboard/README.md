# CarPool Web Dashboard

## Setup

1) Create `web-dashboard/.env` from the example:

```
cp .env.example .env
```

2) Put your Mapbox token in `VITE_MAPBOX_TOKEN`.

3) Install + run:

```
npm install
npm run dev
```

## What works in this phase

- Driver: autocomplete start/end, fetch route (Mapbox Directions), publish ride to backend
- Rider: autocomplete start/end, search matches (backend PostGIS), request ride
- Driver: accept/reject requests (polling)

