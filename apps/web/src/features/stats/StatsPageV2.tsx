import React from 'react';
import { useLocation } from 'react-router-dom';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import BottomNav from '../../ui/composites/BottomNav';
import StateCard from '../../ui/composites/StateCard';
import { RefreshCw, Plus } from 'lucide-react';
import { useStats } from '../../data';
import type { StatsOverviewItem } from '../../data';
import { getSimState } from '../../dev/simulateState';
import { useScreenView } from '../../analytics/useScreenView';

// Pure function - moved outside component to avoid recreation
const getTrendColor = (trend?: 'positive' | 'negative' | 'neutral') => {
  switch (trend) {
    case 'positive':
      return 'var(--success)';
    case 'negative':
      return 'var(--error)';
    default:
      return 'var(--text-secondary)';
  }
};

/**
 * StatsPageV2
 * Statistics page using UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card + BottomNav
 * Data fetched via useStats hook
 *
 * DEV: Test states via querystring:
 *   /stats?state=loading
 *   /stats?state=error
 *   /stats?state=empty
 */

const StatsPageV2: React.FC = () => {
  useScreenView('Statistikk');
  const location = useLocation();
  const simState = getSimState(location.search);

  const hookResult = useStats();

  // Override data based on simState (DEV only)
  const { data, isLoading, error, refetch } = simState
    ? {
        data: simState === 'empty' ? { kpis: [], overview: [], recentSessions: [] } : null,
        isLoading: simState === 'loading',
        error: simState === 'error' ? 'Simulert feil (DEV)' : null,
        refetch: hookResult.refetch,
      }
    : hookResult;

  // Loading state
  if (isLoading && !data) {
    return (
      <AppShellTemplate
        title="Statistikk"
        subtitle="Siste 7 dager"
        bottomNav={<BottomNav />}
      >
        <section style={styles.section}>
          <StateCard
            variant="loading"
            title="Laster..."
            description="Henter din statistikk"
          />
        </section>
      </AppShellTemplate>
    );
  }

  const kpis = data?.kpis ?? [];
  const overview = data?.overview ?? [];
  const recentSessions = data?.recentSessions ?? [];

  return (
    <AppShellTemplate
      title="Statistikk"
      subtitle="Siste 7 dager"
      bottomNav={<BottomNav />}
    >
      {/* Error message */}
      {error && (
        <section style={styles.section}>
          <StateCard
            variant="error"
            title="Noe gikk galt"
            description={error}
            action={
              <Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={refetch}>
                Prøv igjen
              </Button>
            }
          />
        </section>
      )}

      {/* Stats Grid */}
      <section style={styles.section}>
        <StatsGridTemplate items={kpis} columns={3} />
      </section>

      {/* Overview Card */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Oversikt</h2>
        <Card>
          <div style={styles.overviewList}>
            {overview.map((item) => (
              <div key={item.id} style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{item.label}</span>
                <span
                  style={{
                    ...styles.overviewValue,
                    color: getTrendColor(item.trend),
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Recent Sessions Card */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Siste økter</h2>
        {recentSessions.length === 0 ? (
          <StateCard
            variant="empty"
            title="Ingen data ennå"
            description="Fullfør treningsøkter for å se statistikk"
            action={
              <Button size="sm" leftIcon={<Plus size={14} />}>
                Ny økt
              </Button>
            }
          />
        ) : (
          <Card>
            <div style={styles.sessionsList}>
              {recentSessions.map((session) => (
                <div key={session.id} style={styles.sessionItem}>
                  <div style={styles.sessionInfo}>
                    <span style={styles.sessionTitle}>{session.title}</span>
                    <span style={styles.sessionMeta}>
                      {session.type} • {session.duration}
                    </span>
                  </div>
                  <span style={styles.sessionDate}>{session.date}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Trend Chart Placeholder */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Trend</h2>
        <Card>
          <div style={styles.chartPlaceholder}>
            <div style={styles.chartIcon}>📈</div>
            <p style={styles.chartText}>Graf kommer snart</p>
            <p style={styles.chartSubtext}>
              Visualisering av fremgang over tid
            </p>
          </div>
        </Card>
      </section>
    </AppShellTemplate>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-3)',
  },
  overviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  overviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-2) 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  overviewLabel: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
  },
  overviewValue: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  sessionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sessionTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  sessionMeta: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  sessionDate: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  chartPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8) var(--spacing-4)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  chartIcon: {
    fontSize: '48px',
    marginBottom: 'var(--spacing-3)',
  },
  chartText: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  chartSubtext: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
    marginTop: 'var(--spacing-1)',
  },
};

export default StatsPageV2;
