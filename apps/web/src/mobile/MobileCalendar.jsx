import React, { useState, useEffect } from 'react';
import { tokens, typographyStyle } from '../design-tokens';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import apiClient from '../services/apiClient';

export default function MobileCalendar() {
  const [state, setState] = useState('loading');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setState('loading');
      const res = await apiClient.get('/calendar/events');
      setEvents(res.data);
      setState(res.data.length > 0 ? 'idle' : 'empty');
    } catch (err) {
      setError(err); setState('error');
    }
  };

  if (state === 'loading') return <LoadingState message="Henter kalender..." />;
  if (state === 'error') return <ErrorState errorType={error?.type} message={error?.message} onRetry={fetchEvents} />;
  if (state === 'empty') return <EmptyState title="Ingen hendelser" message="Ingen planlagte aktiviteter." />;

  return (
    <div style={{ padding: tokens.spacing.md }}>
      <h1 style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal, margin: `${tokens.spacing.lg} 0` }}>Kalender</h1>
      {events.map(evt => (
        <div key={evt.id} style={{ backgroundColor: tokens.colors.white, padding: tokens.spacing.md, marginBottom: tokens.spacing.sm, borderRadius: tokens.borderRadius.sm, boxShadow: tokens.shadows.card }}>
          <h3 style={{ ...typographyStyle('title3'), margin: `0 0 ${tokens.spacing.xs}` }}>{evt.title}</h3>
          <p style={{ ...typographyStyle('callout'), color: tokens.colors.steel, margin: 0 }}>{new Date(evt.date).toLocaleDateString('no')} • {evt.duration} min</p>
        </div>
      ))}
    </div>
  );
}
