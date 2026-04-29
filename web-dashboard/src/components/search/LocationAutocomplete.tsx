import { useEffect, useMemo, useRef, useState } from 'react';
import type { LngLat } from '../../services/api';
import { geocodeSuggest, type GeocodeSuggestion } from '../../services/mapbox';

export type LocationValue = {
  name: string;
  lngLat: LngLat;
};

export function LocationAutocomplete(props: {
  label: string;
  value: LocationValue | null;
  onChange: (v: LocationValue | null) => void;
  proximity?: LngLat | null;
  placeholder?: string;
}) {
  const [q, setQ] = useState(props.value?.name ?? '');
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastReq = useRef(0);

  useEffect(() => {
    setQ(props.value?.name ?? '');
  }, [props.value?.name]);

  const prox = props.proximity ?? null;
  const proxKey = prox ? `${prox.lng.toFixed(4)},${prox.lat.toFixed(4)}` : '';

  useEffect(() => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const reqId = ++lastReq.current;
    setLoading(true);
    setError(null);

    const t = window.setTimeout(async () => {
      try {
        const s = await geocodeSuggest(trimmed, prox ?? undefined);
        if (reqId !== lastReq.current) return;
        setSuggestions(s);
        setOpen(true);
      } catch (e: any) {
        if (reqId !== lastReq.current) return;
        setError(e?.message ?? 'Failed to fetch suggestions');
        setSuggestions([]);
        setOpen(true);
      } finally {
        if (reqId === lastReq.current) setLoading(false);
      }
    }, 200);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, proxKey]);

  const showEmpty = useMemo(() => open && !loading && !error && suggestions.length === 0, [open, loading, error, suggestions.length]);

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 6 }}>{props.label}</label>
      <input
        value={q}
        placeholder={props.placeholder ?? 'Start typing...'}
        onChange={(e) => {
          setQ(e.target.value);
          props.onChange(null);
        }}
        onFocus={() => {
          if ((q.trim() && suggestions.length) || error) setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          outline: 'none',
        }}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            top: 66,
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.10)',
          }}
        >
          {loading && <div style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>Searching…</div>}
          {error && <div style={{ padding: 10, fontSize: 12, color: '#b91c1c' }}>{error}</div>}
          {showEmpty && <div style={{ padding: 10, fontSize: 12, color: '#6b7280' }}>No results</div>}
          {!loading &&
            !error &&
            suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const v: LocationValue = { name: s.place_name, lngLat: { lng: s.center[0], lat: s.center[1] } };
                  props.onChange(v);
                  setQ(v.name);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  border: 'none',
                  background: '#fff',
                  cursor: 'pointer',
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <div style={{ fontSize: 13, color: '#111827' }}>{s.place_name}</div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

