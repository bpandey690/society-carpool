import { useEffect, useState } from 'react';
import type { LngLat } from '../services/api';

export function useLocation() {
  const [location, setLocation] = useState<LngLat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  return { location, error };
}

