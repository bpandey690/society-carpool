import type { LngLat } from './api';

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

if (!MAPBOX_TOKEN) {
  // Throwing at import time makes config issues obvious during dev.
  // eslint-disable-next-line no-console
  console.warn('Missing VITE_MAPBOX_TOKEN. Mapbox requests will fail until you add it.');
}

export type GeocodeSuggestion = {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
};

export async function geocodeSuggest(query: string, proximity?: LngLat) {
  if (!MAPBOX_TOKEN) throw new Error('Missing VITE_MAPBOX_TOKEN');
  const trimmed = query.trim();
  if (!trimmed) return [] as GeocodeSuggestion[];

  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json`);
  url.searchParams.set('access_token', MAPBOX_TOKEN);
  url.searchParams.set('autocomplete', 'true');
  url.searchParams.set('limit', '6');
  if (proximity) url.searchParams.set('proximity', `${proximity.lng},${proximity.lat}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = await res.json();
  return (data.features ?? []) as GeocodeSuggestion[];
}

export async function directionsRoute(start: LngLat, end: LngLat) {
  if (!MAPBOX_TOKEN) throw new Error('Missing VITE_MAPBOX_TOKEN');
  const coords = `${start.lng},${start.lat};${end.lng},${end.lat}`;
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`);
  url.searchParams.set('access_token', MAPBOX_TOKEN);
  url.searchParams.set('geometries', 'geojson');
  url.searchParams.set('overview', 'full');
  url.searchParams.set('alternatives', 'false');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Directions failed (${res.status})`);
  const data = await res.json();
  const route = data.routes?.[0];
  if (!route?.geometry?.coordinates?.length) throw new Error('No route found');
  const coordsLngLat: LngLat[] = route.geometry.coordinates.map((c: [number, number]) => ({ lng: c[0], lat: c[1] }));
  return {
    distanceMeters: route.distance as number,
    durationSeconds: route.duration as number,
    geometry: coordsLngLat,
  };
}

