import React from 'react';
import { useLocation } from 'react-router-dom';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
// BottomNav removed per design requirements
import StateCard from '../../ui/composites/StateCard';
import { Plus, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../../data';
import type { DashboardSession } from '../../data';
import { getSimState } from '../../dev/simulateState';
import { useScreenView } from '../../analytics/useScreenView';
import { SectionTitle } from '../../components/typography';

// Pure functions - moved outside component to avoid recreation
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
      return 'var(--success)';
    case 'in_progress':
      return 'var(--accent)';
    default:
      return 'var(--text-secondary)';
  }
};

/**
 * DashboardPage
 * Main dashboard using the new UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card
 * Data fetched via useDashboardData hook
 *
 * DEV: Test states via querystring:
 *   /dashboard-v2?state=loading
 *   /dashboard-v2?state=error
 *   /dashboard-v2?state=empty
 */

const DashboardPage: React.FC = () => {
  useScreenView('Dashboard');
  const location = useLocation();
  const simState = getSimState(location.search);

  const hookResult = useDashboardData();

  // Override data based on simState (DEV only)
  const { data, isLoading, error, refetch } = simState
    ? {
        data: simState === 'empty' ? { sessions: [], stats: [] } : null,
        isLoading: simState === 'loading',
        error: simState === 'error' ? 'Simulert feil (DEV)' : null,
        refetch: hookResult.refetch,
      }
    : hookResult;

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
      >
        <section style={styles.section}>
          <StateCard
            variant="info"
            title="Laster..."
            description="Henter dine data"
          />
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
        <StatsGridTemplate items={stats} columns={2} />
      </section>

      {/* Today's Sessions */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Dine økter i dag</SectionTitle>
        <div style={styles.sessionsList}>
          {sessions.length === 0 ? (
            <StateCard
              variant="empty"
              title="Ingen økter i dag"
              description="Planlegg en treningsøkt for å komme i gang"
              action={
                <Button size="sm" leftIcon={<Plus size={14} />}>
                  Ny økt
                </Button>
              }
            />
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
};

export default DashboardPage;
