import React from 'react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import BottomNav from '../../ui/composites/BottomNav';
import { Plus, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../../data';
import type { DashboardSession } from '../../data';

/**
 * DashboardPage
 * Main dashboard using the new UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card
 * Data fetched via useDashboardData hook
 */

const DashboardPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useDashboardData();

  const getStatusText = (status: DashboardSession['status']) => {
    switch (status) {
      case 'completed':
        return 'Fullført';
      case 'in_progress':
        return 'Pågår';
      default:
        return 'Planlagt';
    }
  };

  const getStatusColor = (status: DashboardSession['status']) => {
    switch (status) {
      case 'completed':
        return 'var(--ak-success)';
      case 'in_progress':
        return 'var(--ak-primary)';
      default:
        return 'var(--text-secondary)';
    }
  };

  // Action button for header
  const headerActions = (
    <Button size="sm" leftIcon={<Plus size={16} />}>
      Ny økt
    </Button>
  );

  // Loading state
  if (isLoading && !data) {
    return (
      <AppShellTemplate
        title="Dashboard"
        subtitle="Velkommen tilbake"
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

  const sessions = data?.sessions ?? [];
  const stats = data?.stats ?? [];

  return (
    <AppShellTemplate
      title="Dashboard"
      subtitle="Velkommen tilbake"
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
        <StatsGridTemplate items={stats} columns={2} />
      </section>

      {/* Today's Sessions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Dine økter i dag</h2>
        <div style={styles.sessionsList}>
          {sessions.length === 0 ? (
            <Card>
              <div style={styles.emptyText}>Ingen økter i dag</div>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} style={styles.sessionCard}>
                <div style={styles.sessionHeader}>
                  <span style={styles.sessionTitle}>{session.title}</span>
                  <span
                    style={{
                      ...styles.sessionStatus,
                      color: getStatusColor(session.status),
                    }}
                  >
                    {getStatusText(session.status)}
                  </span>
                </div>
                <div style={styles.sessionTime}>
                  {session.start} - {session.end}
                </div>
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
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  sessionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  sessionStatus: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
  },
  sessionTime: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
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

export default DashboardPage;
