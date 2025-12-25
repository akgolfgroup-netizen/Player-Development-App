import React from 'react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate, { StatsItem } from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import BottomNav from '../../ui/composites/BottomNav';

/**
 * StatsPageV2
 * Statistics page using UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card + BottomNav
 */

// Stats KPI data
const statsItems: StatsItem[] = [
  {
    id: '1',
    label: 'Treningsminutter',
    value: '420',
    sublabel: 'Denne uken',
    change: {
      value: '15%',
      direction: 'up',
    },
  },
  {
    id: '2',
    label: 'Økter fullført',
    value: '6',
    sublabel: 'Av 8 planlagt',
  },
  {
    id: '3',
    label: 'Putting snitt',
    value: '29.2',
    sublabel: 'Putts per runde',
    change: {
      value: '0.8',
      direction: 'down',
    },
  },
  {
    id: '4',
    label: 'Range snitt',
    value: '245m',
    sublabel: 'Driver distance',
  },
  {
    id: '5',
    label: 'Progresjon',
    value: '78%',
    sublabel: 'Mot sesongmål',
    change: {
      value: '12%',
      direction: 'up',
    },
  },
  {
    id: '6',
    label: 'GIR',
    value: '62%',
    sublabel: 'Greens in regulation',
    change: {
      value: '3%',
      direction: 'up',
    },
  },
];

// Overview data
interface OverviewItem {
  id: string;
  label: string;
  value: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

const overviewItems: OverviewItem[] = [
  { id: '1', label: 'Beste runde', value: '72 (+0)', trend: 'positive' },
  { id: '2', label: 'Snitt siste 5 runder', value: '76.4', trend: 'neutral' },
  { id: '3', label: 'Handicap', value: '8.2', trend: 'positive' },
  { id: '4', label: 'Fairway treff', value: '58%', trend: 'neutral' },
  { id: '5', label: 'Sand saves', value: '42%', trend: 'negative' },
];

// Recent sessions data
interface RecentSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: string;
}

const recentSessions: RecentSession[] = [
  { id: '1', title: 'Putting drill', date: 'I dag', duration: '45 min', type: 'Kort spill' },
  { id: '2', title: 'Driving range', date: 'I går', duration: '60 min', type: 'Langt spill' },
  { id: '3', title: 'Chipping øvelser', date: '2 dager siden', duration: '30 min', type: 'Kort spill' },
];

const StatsPageV2: React.FC = () => {
  const getTrendColor = (trend?: OverviewItem['trend']) => {
    switch (trend) {
      case 'positive':
        return 'var(--ak-success)';
      case 'negative':
        return 'var(--ak-error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <AppShellTemplate
      title="Statistikk"
      subtitle="Siste 7 dager"
      bottomNav={<BottomNav />}
    >
      {/* Stats Grid */}
      <section style={styles.section}>
        <StatsGridTemplate items={statsItems} columns={3} />
      </section>

      {/* Overview Card */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Oversikt</h2>
        <Card>
          <div style={styles.overviewList}>
            {overviewItems.map((item) => (
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
