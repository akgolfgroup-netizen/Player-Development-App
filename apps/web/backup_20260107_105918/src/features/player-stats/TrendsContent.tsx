import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Flame,
  Clock,
  Target,
  BarChart3,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import StateCard from '../../ui/composites/StateCard';
import { GolfLineChart, GolfAreaChart, GolfBarChart, chartColors } from '../../components/shadcn/chart';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import { useTrainingAnalytics } from '../../hooks/useTrainingAnalytics';
import { useStrokesGained } from '../../hooks/useStrokesGained';

/**
 * TrendsContent - Historical trends and progress visualization
 * Shows training completion trends, strokes gained over time, and analytics
 */
const TrendsContent: React.FC = () => {
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useTrainingAnalytics();
  const { data: sgData, loading: sgLoading } = useStrokesGained();

  const loading = analyticsLoading || sgLoading;

  // Transform weekly trend data for completion chart
  const completionChartData = useMemo(() => {
    if (!analyticsData?.weeklyTrend) return [];
    return analyticsData.weeklyTrend.map(week => ({
      name: `U${week.weekNumber}`,
      Fullfort: week.completed,
      Planlagt: week.planned,
      Rate: week.completionRate,
    }));
  }, [analyticsData?.weeklyTrend]);

  // Transform weekly trend data for hours chart
  const hoursChartData = useMemo(() => {
    if (!analyticsData?.weeklyTrend) return [];
    return analyticsData.weeklyTrend.map(week => ({
      name: `U${week.weekNumber}`,
      Timer: week.totalHours,
    }));
  }, [analyticsData?.weeklyTrend]);

  // Transform strokes gained trend
  const sgChartData = useMemo(() => {
    if (!sgData?.weeklyTrend) return [];
    return sgData.weeklyTrend.map(week => ({
      name: `U${week.week}`,
      SG: week.total,
    }));
  }, [sgData?.weeklyTrend]);

  // Period breakdown for bar chart
  const periodChartData = useMemo(() => {
    if (!analyticsData?.periodBreakdown) return [];
    return Object.entries(analyticsData.periodBreakdown).map(([period, data]) => ({
      name: period,
      Fullfort: data.completed,
      Planlagt: data.planned,
      Rate: Math.round(data.completionRate),
    }));
  }, [analyticsData?.periodBreakdown]);

  if (loading) {
    return (
      <StateCard
        variant="loading"
        title="Laster trenddata..."
        description="Henter historikk og analyser"
      />
    );
  }

  if (analyticsError) {
    return (
      <StateCard
        variant="error"
        title="Kunne ikke laste data"
        description={analyticsError}
      />
    );
  }

  const overview = analyticsData?.overview;

  return (
    <div style={styles.container}>
      {/* Summary Stats Grid */}
      <section style={styles.section}>
        <SectionTitle className="mb-4">
          Din progresjon
        </SectionTitle>
        <div style={styles.statsGrid}>
          <Card padding="md">
            <div style={styles.statCard}>
              <div className="w-11 h-11 rounded-md flex items-center justify-center bg-success-muted">
                <Target size={20} className="text-success" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>
                  {overview?.completionRate?.toFixed(0) || 0}%
                </span>
                <span style={styles.statLabel}>Gjennomforingsrate</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div style={styles.statCard}>
              <div className="w-11 h-11 rounded-md flex items-center justify-center bg-warning-muted">
                <Flame size={20} className="text-warning" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>
                  {overview?.currentStreak || 0}
                </span>
                <span style={styles.statLabel}>Dagers streak</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div style={styles.statCard}>
              <div className="w-11 h-11 rounded-md flex items-center justify-center bg-accent-muted">
                <Clock size={20} className="text-accent" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>
                  {overview?.totalHoursCompleted?.toFixed(1) || 0}
                </span>
                <span style={styles.statLabel}>Timer trent</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div style={styles.statCard}>
              <div className="w-11 h-11 rounded-md flex items-center justify-center bg-info-muted">
                <Activity size={20} className="text-info" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>
                  {overview?.averageSessionsPerWeek?.toFixed(1) || 0}
                </span>
                <span style={styles.statLabel}>Okter/uke</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Strokes Gained Trend */}
      {sgChartData.length > 1 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <SectionTitle className="m-0">Strokes Gained Utvikling</SectionTitle>
            {sgData?.trend !== undefined && (
              <div style={styles.trendBadge}>
                {sgData.trend >= 0 ? (
                  <TrendingUp size={16} className="text-success" />
                ) : (
                  <TrendingDown size={16} className="text-danger" />
                )}
                <span className={`font-semibold ${sgData.trend >= 0 ? 'text-success' : 'text-danger'}`}>
                  {sgData.trend >= 0 ? '+' : ''}{(sgData.trend * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
          <Card padding="md">
            <GolfLineChart
              data={sgChartData}
              dataKeys={['SG']}
              xAxisKey="name"
              colors={[chartColors.success]}
              height={220}
              showLegend={false}
            />
            <p style={styles.chartHint}>
              Strokes Gained viser hvor mange slag du sparer/taper per runde sammenlignet med scratch
            </p>
          </Card>
        </section>
      )}

      {/* Weekly Completion Trend */}
      {completionChartData.length > 1 && (
        <section style={styles.section}>
          <SectionTitle className="mb-4">
            Ukentlig treningsgjennomforing
          </SectionTitle>
          <Card padding="md">
            <GolfAreaChart
              data={completionChartData}
              dataKeys={['Fullfort', 'Planlagt']}
              xAxisKey="name"
              colors={[chartColors.success, chartColors.mist]}
              height={200}
              stacked={false}
            />
          </Card>
        </section>
      )}

      {/* Hours Per Week */}
      {hoursChartData.length > 1 && (
        <section style={styles.section}>
          <SectionTitle className="mb-4">
            Treningstimer per uke
          </SectionTitle>
          <Card padding="md">
            <GolfBarChart
              data={hoursChartData}
              dataKeys={['Timer']}
              xAxisKey="name"
              colors={[chartColors.primary]}
              height={180}
            />
          </Card>
        </section>
      )}

      {/* Period Breakdown */}
      {periodChartData.length > 0 && (
        <section style={styles.section}>
          <SectionTitle className="mb-4">
            Periodeoversikt
          </SectionTitle>
          <Card padding="md">
            <div style={styles.periodGrid}>
              {periodChartData.map(period => (
                <div key={period.name} style={styles.periodCard}>
                  <div style={styles.periodHeader}>
                    <SubSectionTitle className="m-0">{period.name}</SubSectionTitle>
                    <span className={`text-base font-bold ${
                      period.Rate >= 80 ? 'text-success' :
                      period.Rate >= 60 ? 'text-warning' : 'text-danger'
                    }`}>
                      {period.Rate}%
                    </span>
                  </div>
                  <div className="h-2 bg-border-subtle rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all ${
                        period.Rate >= 80 ? 'bg-success' :
                        period.Rate >= 60 ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${period.Rate}%` }}
                    />
                  </div>
                  <div style={styles.periodStats}>
                    <span>{period.Fullfort} av {period.Planlagt} økter</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Empty State */}
      {completionChartData.length <= 1 && sgChartData.length <= 1 && (
        <Card padding="spacious">
          <div style={styles.emptyState}>
            <BarChart3 size={48} style={{ opacity: 0.3, marginBottom: 16, color: 'var(--text-tertiary)' }} />
            <h3 style={styles.emptyTitle}>Ikke nok data enna</h3>
            <p style={styles.emptyText}>
              Fullfør flere treningsøkter og tester for å se din utvikling over tid.
              Vi trenger minst 2 ukers data for å vise trender.
            </p>
          </div>
        </Card>
      )}

      {/* Streak Info */}
      {overview && overview.longestStreak > 0 && (
        <Card variant="flat" padding="md">
          <div style={styles.streakCard}>
            <Flame size={24} color="var(--status-warning)" />
            <div>
              <span style={styles.streakValue}>
                Beste streak: {overview.longestStreak} dager
              </span>
              <span style={styles.streakHint}>
                {overview.currentStreak > 0
                  ? `Du er på ${overview.currentStreak} dager na - fortsett slik!`
                  : 'Start en ny streak i dag!'
                }
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
  },
  chartHint: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    marginTop: 'var(--spacing-3)',
    textAlign: 'center',
  },
  periodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--spacing-4)',
  },
  periodCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 'var(--radius-md)',
  },
  periodHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodRate: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 700,
  },
  periodProgress: {
    height: '8px',
    backgroundColor: 'var(--border-subtle)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  periodProgressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  periodStats: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8)',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  emptyText: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    margin: 'var(--spacing-2) 0 0 0',
    maxWidth: '320px',
  },
  streakCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  streakValue: {
    display: 'block',
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  streakHint: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
};

export default TrendsContent;
