import React, { useState } from 'react';
import { tokens, typographyStyle } from '../design-tokens';
import { PageTitle } from '../components/typography';
import SuccessState from '../components/ui/SuccessState';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import apiClient from '../services/apiClient';

export default function MobileQuickLog() {
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ type: 'golf', duration: 60, intensity: 'medium', date: new Date().toISOString().split('T')[0], notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState('loading');
      await apiClient.post('/training/sessions', form, { headers: { 'Idempotency-Key': `log_${Date.now()}` } });
      setState('success');
    } catch (err) {
      setError(err); setState('error');
    }
  };

  if (state === 'loading') return <LoadingState message="Lagrer..." />;
  if (state === 'error') return <ErrorState errorType={error?.type} message={error?.message} onRetry={() => setState('idle')} />;
  if (state === 'success') return <SuccessState message="Trening lagret!" onDismiss={() => { setState('idle'); setForm({ type: 'golf', duration: 60, intensity: 'medium', date: new Date().toISOString().split('T')[0], notes: '' }); }} />;

  return (
    <div style={{ padding: tokens.spacing.md }}>
      <PageTitle style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal, margin: `${tokens.spacing.lg} 0` }}>Logg Trening</PageTitle>
      <form onSubmit={handleSubmit} style={{ backgroundColor: tokens.colors.white, padding: tokens.spacing.lg, borderRadius: tokens.borderRadius.md }}>
        <label style={{ ...typographyStyle('label'), display: 'block', marginBottom: tokens.spacing.sm }}>Type
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ width: '100%', padding: tokens.spacing.sm, marginTop: tokens.spacing.xs, borderRadius: tokens.borderRadius.sm, border: `1px solid ${tokens.colors.mist}` }}>
            <option value="golf">Golf</option><option value="gym">Gym</option><option value="cardio">Cardio</option><option value="flexibility">Flexibility</option>
          </select>
        </label>
        <label style={{ ...typographyStyle('label'), display: 'block', marginTop: tokens.spacing.md }}>Varighet (min)
          <input type="number" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} style={{ width: '100%', padding: tokens.spacing.sm, marginTop: tokens.spacing.xs, borderRadius: tokens.borderRadius.sm, border: `1px solid ${tokens.colors.mist}` }} />
        </label>
        <button type="submit" style={{ ...typographyStyle('label'), marginTop: tokens.spacing.lg, width: '100%', padding: tokens.spacing.md, backgroundColor: tokens.colors.primary, color: tokens.colors.white, border: 'none', borderRadius: tokens.borderRadius.sm, cursor: 'pointer' }}>
          Lagre
        </button>
      </form>
    </div>
  );
}
