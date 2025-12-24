import React, { useState, useEffect } from 'react';
import { tokens, typographyStyle } from '../design-tokens';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import apiClient from '../services/apiClient';

export default function MobilePlan() {
  const [state, setState] = useState('loading');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchPlan(); }, []);

  const fetchPlan = async () => {
    try {
      setState('loading');
      const res = await apiClient.get('/plan/current');
      setPlan(res.data);
      setState('idle');
    } catch (err) {
      if (err.status === 404) setState('empty');
      else { setError(err); setState('error'); }
    }
  };

  if (state === 'loading') return <LoadingState message="Henter plan..." />;
  if (state === 'error') return <ErrorState errorType={error?.type} message={error?.message} onRetry={fetchPlan} />;
  if (state === 'empty') return <EmptyState title="Ingen aktiv plan" message="Du har ikke en treningsplan ennå." />;

  return (
    <div style={{ padding: tokens.spacing.md }}>
      <h1 style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal, margin: `${tokens.spacing.lg} 0` }}>
        {plan.name}
      </h1>
      <div style={{ backgroundColor: tokens.colors.white, padding: tokens.spacing.lg, borderRadius: tokens.borderRadius.md, boxShadow: tokens.shadows.card }}>
        <p style={{ ...typographyStyle('body'), color: tokens.colors.steel, margin: 0 }}>
          Uke {plan.currentWeek} av {plan.totalWeeks} • {plan.focus}
        </p>
        <div style={{ marginTop: tokens.spacing.md, display: 'flex', gap: tokens.spacing.md }}>
          <div><strong>{plan.weekOverview.completed}</strong> fullført</div>
          <div><strong>{plan.weekOverview.planned}</strong> planlagt</div>
        </div>
      </div>
    </div>
  );
}
