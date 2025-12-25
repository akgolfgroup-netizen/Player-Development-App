import React from 'react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import BottomNav from '../../ui/composites/BottomNav';
import { Plus, RefreshCw } from 'lucide-react';
import { useGoals } from '../../data';
import type { Goal } from '../../data';

/**
 * GoalsPage
 * Goals/Mål page using UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card
 * Data fetched via useGoals hook
 */

const GoalsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useGoals();

  const getProgressPercent = (current: number, target: number): number => {
    const percent = (current / target) * 100;
    return Math.min(Math.max(percent, 0), 100);
  };

  // Action button for header
  const headerActions = (
    <Button size="sm" leftIcon={<Plus size={16} />}>
      Nytt mål
    </Button>
  );

  // Loading state
  if (isLoading && !data) {
    return (
      <AppShellTemplate
        title="Mine mål"
        subtitle="Denne uken"
        bottomNav={<BottomNav />}
      >
        <section style={styles.section}>
          <Card>
            <div style={styles.loadingText}>Laster...</div>
          </Card>
        </section>
      </AppShellTemplate>
    );
  }

  const goals = data?.goals ?? [];
  const stats = data?.stats ?? [];
  const activeGoals = goals.filter((g) => g.type === 'short' && g.status === 'active');
  const longTermGoals = goals.filter((g) => g.type === 'long');

  return (
    <AppShellTemplate
      title="Mine mål"
      subtitle="Denne uken"
      actions={headerActions}
      bottomNav={<BottomNav />}
    >
      {/* Error message */}
      {error && (
        <section style={styles.section}>
          <Card>
            <div style={styles.errorContainer}>
              <span style={styles.errorText}>{error}</span>
              <Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={refetch}>
                Prøv igjen
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Stats Grid */}
      <section style={styles.section}>
        <StatsGridTemplate items={stats} columns={3} />
      </section>

      {/* Active Goals */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Aktive mål</h2>
        <div style={styles.goalsList}>
          {activeGoals.length === 0 ? (
            <Card>
              <div style={styles.emptyText}>Ingen aktive mål</div>
            </Card>
          ) : (
            activeGoals.map((goal) => {
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
            })
          )}
        </div>
      </section>

      {/* Long-term Goals */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Langsiktige mål</h2>
        <div style={styles.goalsList}>
          {longTermGoals.length === 0 ? (
            <Card>
              <div style={styles.emptyText}>Ingen langsiktige mål</div>
            </Card>
          ) : (
            longTermGoals.map((goal) => (
              <Card key={goal.id} style={styles.goalCard}>
                <div style={styles.goalHeader}>
                  <span style={styles.goalTitle}>{goal.title}</span>
                  <span style={styles.statusBadge}>
                    {goal.status === 'completed' ? 'Fullført' : 'Pågår'}
                  </span>
                </div>
                {goal.description && (
                  <p style={styles.goalDescription}>{goal.description}</p>
                )}
              </Card>
            ))
          )}
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
  loadingText: {
    textAlign: 'center',
    padding: 'var(--spacing-4)',
    color: 'var(--text-secondary)',
  },
  emptyText: {
    textAlign: 'center',
    padding: 'var(--spacing-4)',
    color: 'var(--text-secondary)',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
  },
  errorText: {
    color: 'var(--color-danger)',
    fontSize: 'var(--font-size-footnote)',
  },
};

export default GoalsPage;
