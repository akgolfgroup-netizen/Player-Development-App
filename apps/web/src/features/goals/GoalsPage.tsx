import React from 'react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate, { StatsItem } from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import BottomNav from '../../ui/composites/BottomNav';

/**
 * GoalsPage
 * Goals/Mål page using UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card
 */

// Goal data types
interface Goal {
  id: string;
  title: string;
  description?: string;
  current: number;
  target: number;
  unit: string;
  status: 'active' | 'completed' | 'paused';
}

// Active goals data (temporary - will be replaced with API data)
const activeGoals: Goal[] = [
  {
    id: '1',
    title: 'Putting under 30 putts',
    description: 'Gjennomsnittlig antall putts per runde',
    current: 35,
    target: 50,
    unit: 'runder',
    status: 'active',
  },
  {
    id: '2',
    title: 'Treningsøkter per uke',
    description: 'Minimum 4 økter hver uke',
    current: 3,
    target: 4,
    unit: 'økter',
    status: 'active',
  },
  {
    id: '3',
    title: 'Driving accuracy',
    description: 'Treff fairway på minst 60%',
    current: 55,
    target: 60,
    unit: '%',
    status: 'active',
  },
];

// Long-term goals data
const longTermGoals: Goal[] = [
  {
    id: '4',
    title: 'Nå kategori C',
    description: 'Oppnå alle krav for kategori C innen sesongslutt',
    current: 0,
    target: 100,
    unit: '%',
    status: 'active',
  },
  {
    id: '5',
    title: 'Handicap under 10',
    description: 'Reduser handicap fra 12.5 til under 10',
    current: 12.5,
    target: 10,
    unit: 'hcp',
    status: 'active',
  },
];

// Stats data
const statsItems: StatsItem[] = [
  {
    id: '1',
    label: 'Aktive mål',
    value: '5',
  },
  {
    id: '2',
    label: 'Fullført',
    value: '2',
    sublabel: 'Denne måneden',
  },
  {
    id: '3',
    label: 'Progresjon',
    value: '68%',
    sublabel: 'Gjennomsnitt',
    change: {
      value: '8%',
      direction: 'up',
    },
  },
];

const GoalsPage: React.FC = () => {
  const getProgressPercent = (current: number, target: number): number => {
    const percent = (current / target) * 100;
    return Math.min(Math.max(percent, 0), 100);
  };

  // Action button for header
  const headerActions = (
    <button style={styles.actionButton}>+ Nytt mål</button>
  );

  return (
    <AppShellTemplate
      title="Mine mål"
      subtitle="Denne uken"
      actions={headerActions}
      bottomNav={<BottomNav />}
    >
      {/* Stats Grid */}
      <section style={styles.section}>
        <StatsGridTemplate items={statsItems} columns={3} />
      </section>

      {/* Active Goals */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Aktive mål</h2>
        <div style={styles.goalsList}>
          {activeGoals.map((goal) => {
            const progressPercent = getProgressPercent(goal.current, goal.target);
            return (
              <Card key={goal.id} style={styles.goalCard}>
                <div style={styles.goalHeader}>
                  <span style={styles.goalTitle}>{goal.title}</span>
                </div>
                {goal.description && (
                  <p style={styles.goalDescription}>{goal.description}</p>
                )}
                <div style={styles.progressContainer}>
                  <div style={styles.progressInfo}>
                    <span style={styles.progressText}>
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                    <span style={styles.progressPercent}>
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${progressPercent}%`,
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Long-term Goals */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Langsiktige mål</h2>
        <div style={styles.goalsList}>
          {longTermGoals.map((goal) => (
            <Card key={goal.id} style={styles.goalCard}>
              <div style={styles.goalHeader}>
                <span style={styles.goalTitle}>{goal.title}</span>
                <span style={styles.statusBadge}>Pågår</span>
              </div>
              {goal.description && (
                <p style={styles.goalDescription}>{goal.description}</p>
              )}
            </Card>
          ))}
        </div>
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
  goalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  goalCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  goalDescription: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: 1.4,
  },
  progressContainer: {
    marginTop: 'var(--spacing-2)',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-1)',
  },
  progressText: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  progressPercent: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
    color: 'var(--ak-primary)',
  },
  progressBar: {
    height: '6px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--ak-primary)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  statusBadge: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--ak-primary)',
    backgroundColor: 'rgba(16, 69, 106, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: 'var(--ak-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default GoalsPage;
