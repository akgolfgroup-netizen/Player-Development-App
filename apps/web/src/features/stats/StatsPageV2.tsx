import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
// BottomNav removed per design requirements
import StateCard from '../../ui/composites/StateCard';
import { RefreshCw, Plus, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useStats } from '../../data';
import type { StatsOverviewItem } from '../../data';
import { getSimState } from '../../dev/simulateState';
import { useScreenView } from '../../analytics/useScreenView';
import { SectionTitle } from '../../components/typography/Headings';
import { useTrainingAnalytics } from '../../hooks/useTrainingAnalytics';
import { GolfAreaChart, chartColors } from '../../components/shadcn/chart';

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
  const { data: analyticsData } = useTrainingAnalytics();

  // Transform weekly trend data for chart
  const trendChartData = useMemo(() => {
    if (!analyticsData?.weeklyTrend) return [];
    return analyticsData.weeklyTrend.map(week => ({
      name: `U${week.weekNumber}`,
      Fullfort: week.completed,
      Planlagt: week.planned,
    }));
  }, [analyticsData?.weeklyTrend]);

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
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Oversikt</SectionTitle>
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
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Siste økter</SectionTitle>
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

      {/* Trend Chart */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ margin: 0 }}>Treningstrend</SectionTitle>
          {analyticsData?.overview && (
            <div style={styles.trendBadge}>
              {analyticsData.overview.completionRate >= 70 ? (
                <TrendingUp size={14} color="var(--success)" />
              ) : (
                <TrendingDown size={14} color="var(--warning)" />
              )}
              <span style={{
                fontSize: 'var(--font-size-caption1)',
                fontWeight: 600,
                color: analyticsData.overview.completionRate >= 70 ? 'var(--success)' : 'var(--warning)',
              }}>
                {analyticsData.overview.completionRate.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
        <Card>
          {trendChartData.length > 1 ? (
            <div style={{ padding: 'var(--spacing-2)' }}>
              <GolfAreaChart
                data={trendChartData}
                dataKeys={['Fullfort', 'Planlagt']}
                xAxisKey="name"
                colors={[chartColors.success, chartColors.mist]}
                height={180}
                stacked={false}
              />
              <p style={styles.chartHint}>
                Ukentlig gjennomforing av treningsokter
              </p>
            </div>
          ) : (
            <div style={styles.chartPlaceholder}>
              <BarChart3 size={40} style={{ marginBottom: 'var(--spacing-3)', opacity: 0.3, color: 'var(--text-tertiary)' }} />
              <p style={styles.chartText}>Ikke nok data enna</p>
              <p style={styles.chartSubtext}>
                Fullfør flere treningsokter for å se din trend
              </p>
            </div>
          )}
        </Card>
      </section>
    </AppShellTemplate>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
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
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-3)',
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 'var(--radius-md)',
  },
  chartHint: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
    marginTop: 'var(--spacing-2)',
    marginBottom: 0,
  },
};

export default StatsPageV2;
