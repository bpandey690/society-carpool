import mapboxgl from 'mapbox-gl';
import { useEffect, useMemo, useRef } from 'react';
import { MAPBOX_TOKEN } from '../../services/mapbox';
import type { LngLat } from '../../services/api';

mapboxgl.accessToken = MAPBOX_TOKEN ?? '';

type Props = {
  center?: LngLat | null;
  start?: LngLat | null;
  end?: LngLat | null;
  route?: LngLat[] | null;
};

export function RouteMap(props: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const center = useMemo(() => {
    const c = props.center ?? props.start ?? props.end;
    return c ? ([c.lng, c.lat] as [number, number]) : ([77.5946, 12.9716] as [number, number]); // default Bengaluru
  }, [props.center, props.start, props.end]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: [] },
          },
        });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#2563eb',
            'line-width': 5,
            'line-opacity': 0.8,
          },
        });
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({ center });
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: mapboxgl.Marker[] = [];
    if (props.start) {
      markers.push(new mapboxgl.Marker({ color: '#16a34a' }).setLngLat([props.start.lng, props.start.lat]).addTo(map));
    }
    if (props.end) {
      markers.push(new mapboxgl.Marker({ color: '#dc2626' }).setLngLat([props.end.lng, props.end.lat]).addTo(map));
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [props.start?.lng, props.start?.lat, props.end?.lng, props.end?.lat]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource('route') as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;

    const coords = (props.route ?? []).map((c) => [c.lng, c.lat]);
    src.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    });

    if (coords.length >= 2) {
      const bounds = coords.reduce(
        (b, c) => b.extend(c as [number, number]),
        new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number]),
      );
      map.fitBounds(bounds, { padding: 48, duration: 250 });
    }
  }, [props.route]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#f3f4f6' }} />;
}

