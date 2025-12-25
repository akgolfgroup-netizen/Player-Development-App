import React from 'react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import StatsGridTemplate, { StatsItem } from '../../ui/templates/StatsGridTemplate';
import Card from '../../ui/primitives/Card';
import BottomNav from '../../ui/composites/BottomNav';

/**
 * DashboardPage
 * Main dashboard using the new UI templates
 * Composes AppShellTemplate + StatsGridTemplate + Card
 */

// Session data (temporary - will be replaced with API data)
interface Session {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'planned' | 'completed' | 'in_progress';
}

const sessions: Session[] = [
  {
    id: '1',
    title: 'Putting-trening',
    start: '09:00',
    end: '10:30',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Driving range',
    start: '14:00',
    end: '15:30',
    status: 'planned',
  },
  {
    id: '3',
    title: 'Kort spill',
    start: '16:00',
    end: '17:00',
    status: 'planned',
  },
];

// Stats data (temporary - will be replaced with API data)
const statsItems: StatsItem[] = [
  {
    id: '1',
    label: 'Økter i dag',
    value: '3',
    sublabel: 'av 3 planlagt',
  },
  {
    id: '2',
    label: 'Treningsminutter',
    value: '180',
    sublabel: 'Denne uken',
    change: {
      value: '12%',
      direction: 'up',
    },
  },
  {
    id: '3',
    label: 'Fullførte økter',
    value: '8',
    sublabel: 'Denne uken',
  },
  {
    id: '4',
    label: 'Progresjon',
    value: '85%',
    sublabel: 'Mot ukemål',
    change: {
      value: '5%',
      direction: 'up',
    },
  },
];

const DashboardPage: React.FC = () => {
  const getStatusText = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return 'Fullført';
      case 'in_progress':
        return 'Pågår';
      default:
        return 'Planlagt';
    }
  };

  const getStatusColor = (status: Session['status']) => {
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
    <button style={styles.actionButton}>+ Ny økt</button>
  );

  return (
    <AppShellTemplate
      title="Dashboard"
      subtitle="Velkommen tilbake"
      actions={headerActions}
      bottomNav={<BottomNav />}
    >
      {/* Stats Grid */}
      <section style={styles.section}>
        <StatsGridTemplate items={statsItems} columns={2} />
      </section>

      {/* Today's Sessions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Dine økter i dag</h2>
        <div style={styles.sessionsList}>
          {sessions.map((session) => (
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

export default DashboardPage;
