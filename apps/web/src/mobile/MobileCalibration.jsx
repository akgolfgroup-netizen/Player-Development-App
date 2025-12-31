import React, { useState } from 'react';
import { tokens, typographyStyle } from '../design-tokens';
import { PageTitle } from '../components/typography';
import LoadingState from '../components/ui/LoadingState';
import SuccessState from '../components/ui/SuccessState';
import ErrorState from '../components/ui/ErrorState';
import apiClient from '../services/apiClient';

export default function MobileCalibration() {
  const [state, setState] = useState('idle');
  const [sessionId, setSessionId] = useState(null);
  const [samples, setSamples] = useState([]);
  const [error, setError] = useState(null);

  const startSession = async () => {
    try {
      setState('loading');
      const res = await apiClient.post('/calibration/start');
      setSessionId(res.data.sessionId);
      setState('idle');
    } catch (err) {
      setError(err); setState('error');
    }
  };

  const addSample = () => {
    setSamples([...samples, { clubType: 'driver', distance: 250, timestamp: new Date().toISOString() }]);
  };

  const submitCalibration = async () => {
    try {
      setState('loading');
      await apiClient.post('/calibration/submit', { sessionId, samples });
      setState('success');
    } catch (err) {
      setError(err); setState('error');
    }
  };

  if (state === 'loading') return <LoadingState />;
  if (state === 'error') return <ErrorState errorType={error?.type} message={error?.message} onRetry={() => setState('idle')} />;
  if (state === 'success') return <SuccessState message="Kalibrering fullført!" onDismiss={() => { setState('idle'); setSamples([]); setSessionId(null); }} />;

  return (
    <div style={{ padding: tokens.spacing.md }}>
      <PageTitle style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal, margin: `${tokens.spacing.lg} 0` }}>Kalibrering</PageTitle>
      {!sessionId ? (
        <button onClick={startSession} style={{ ...typographyStyle('label'), padding: tokens.spacing.md, backgroundColor: tokens.colors.primary, color: tokens.colors.white, border: 'none', borderRadius: tokens.borderRadius.sm, cursor: 'pointer' }}>
          Start Kalibrering
        </button>
      ) : (
        <div>
          <p style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>Samples: {samples.length}/5</p>
          <button onClick={addSample} disabled={samples.length >= 5} style={{ ...typographyStyle('label'), padding: tokens.spacing.sm, marginRight: tokens.spacing.sm, backgroundColor: tokens.colors.primaryLight, color: tokens.colors.white, border: 'none', borderRadius: tokens.borderRadius.sm }}>
            Legg til sample
          </button>
          <button onClick={submitCalibration} disabled={samples.length < 5} style={{ ...typographyStyle('label'), padding: tokens.spacing.sm, backgroundColor: tokens.colors.primary, color: tokens.colors.white, border: 'none', borderRadius: tokens.borderRadius.sm, opacity: samples.length < 5 ? 0.5 : 1 }}>
            Send inn
          </button>
        </div>
      )}
    </div>
  );
}
