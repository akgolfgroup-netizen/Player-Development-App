import React, { useState, useEffect } from 'react';
import { tokens, typographyStyle } from '../design-tokens';
import { PageTitle, SectionTitle } from '../components/typography';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import apiClient from '../services/apiClient';

export default function MobileHome() {
  const [state, setState] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setState('loading');
      const [meRes, dashRes] = await Promise.all([
        apiClient.get('/me'),
        apiClient.get('/dashboard/player').catch(() => ({ data: null })),
      ]);
      setData({ user: meRes.data, dashboard: dashRes.data });
      setState('idle');
    } catch (err) {
      setError(err);
      setState('error');
    }
  };

  if (state === 'loading') return <LoadingState />;
  if (state === 'error') return <ErrorState errorType={error?.type} message={error?.message} onRetry={fetchData} />;
  if (!data?.user) return <EmptyState title="Ingen data" />;

  return (
    <div style={{ padding: tokens.spacing.md }}>
      <PageTitle style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal, margin: `${tokens.spacing.lg} 0` }}>
        Hei, {data.user.firstName}!
      </PageTitle>
      <div style={{
        backgroundColor: tokens.colors.white,
        padding: tokens.spacing.lg,
        borderRadius: tokens.borderRadius.md,
        boxShadow: tokens.shadows.card,
      }}>
        <SectionTitle style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal, margin: `0 0 ${tokens.spacing.sm}` }}>
          Dagens fokus
        </SectionTitle>
        <p style={{ ...typographyStyle('body'), color: tokens.colors.steel, margin: 0 }}>
          {data.dashboard?.focus || 'Ingen planlagt aktivitet i dag'}
        </p>
      </div>
    </div>
  );
}
