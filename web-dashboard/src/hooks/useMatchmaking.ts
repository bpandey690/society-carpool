import { useEffect, useState } from 'react';
import type { RideStatus } from '../services/api';
import { listRequests } from '../services/api';

export function useMatchmakingRequests(rideId?: string, pollMs = 2500) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    const tick = async () => {
      try {
        setLoading(true);
        const data = await listRequests(rideId ? { rideId } : undefined);
        if (mounted) setRequests(data);
        setError(null);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load requests');
      } finally {
        if (mounted) setLoading(false);
        timer = window.setTimeout(tick, pollMs);
      }
    };

    tick();
    return () => {
      mounted = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [rideId, pollMs]);

  return { requests, loading, error } as { requests: any[]; loading: boolean; error: string | null };
}

export function requestStatusLabel(s: RideStatus) {
  return s;
}

