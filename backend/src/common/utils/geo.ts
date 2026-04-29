export type LngLat = { lng: number; lat: number };

export function pointWkt(p: LngLat) {
  // WKT expects "lng lat" (x y)
  return `POINT(${p.lng} ${p.lat})`;
}

export function lineStringWkt(coords: LngLat[]) {
  if (!coords.length) throw new Error('route coordinates are required');
  const pairs = coords.map((c) => `${c.lng} ${c.lat}`).join(', ');
  return `LINESTRING(${pairs})`;
}

export function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

