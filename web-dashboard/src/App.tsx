import { useMemo, useState } from 'react';
import DriverDashboard from './pages/DriverDashboard';
import RiderDashboard from './pages/RiderDashboard';
import { AppLayout } from './components/layout/AppLayout';

type Mode = 'driver' | 'rider';

export default function App() {
  const [mode, setMode] = useState<Mode>('driver');

  const content = useMemo(() => {
    if (mode === 'driver') return <DriverDashboard />;
    return <RiderDashboard />;
  }, [mode]);

  return (
    <AppLayout
      mode={mode}
      onModeChange={setMode}
      content={content}
    />
  );
}

