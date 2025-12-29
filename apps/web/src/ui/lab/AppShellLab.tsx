import React, { useState } from 'react';
import AppShellTemplate from '../templates/AppShellTemplate';
import StatsGridTemplate, { StatsItem } from '../templates/StatsGridTemplate';

/**
 * AppShellLab - Demo page for AppShellTemplate
 * Shows examples with and without actions
 */
const AppShellLab: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'with-actions' | 'without-actions'>('with-actions');

  // Sample stats for placeholder content
  const sampleStats: StatsItem[] = [
    { id: '1', label: 'Økter', value: '12', sublabel: 'Denne måneden' },
    { id: '2', label: 'Timer', value: '18.5t', sublabel: 'Total treningstid' },
    { id: '3', label: 'Merker', value: '4', sublabel: 'Opptjent' },
    { id: '4', label: 'Poeng', value: '850', sublabel: 'Total XP' },
  ];

  // Sample bottom navigation
  const bottomNavContent = (
    <div style={styles.bottomNavContent}>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>🏠</span>
        <span style={styles.navLabel}>Hjem</span>
      </button>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>📊</span>
        <span style={styles.navLabel}>Statistikk</span>
      </button>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>🏆</span>
        <span style={styles.navLabel}>Merker</span>
      </button>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>⚙️</span>
        <span style={styles.navLabel}>Innstillinger</span>
      </button>
    </div>
  );

  // Sample action buttons
  const actionButtons = (
    <>
      <button style={styles.actionButton}>
        Ny økt
      </button>
      <button style={styles.iconButton}>
        🔔
      </button>
    </>
  );

  return (
    <div style={styles.labContainer}>
      {/* Demo Selector */}
      <div style={styles.selector}>
        <button
          style={{
            ...styles.selectorButton,
            ...(activeDemo === 'with-actions' && styles.selectorButtonActive),
          }}
          onClick={() => setActiveDemo('with-actions')}
        >
          Med actions
        </button>
        <button
          style={{
            ...styles.selectorButton,
            ...(activeDemo === 'without-actions' && styles.selectorButtonActive),
          }}
          onClick={() => setActiveDemo('without-actions')}
        >
          Uten actions
        </button>
      </div>

      {/* Demo Container */}
      <div style={styles.demoFrame}>
        {activeDemo === 'with-actions' ? (
          <AppShellTemplate
            title="Dashboard"
            subtitle="Velkommen tilbake, Anders"
            actions={actionButtons}
            bottomNav={bottomNavContent}
          >
            <div style={styles.contentSection}>
              <h2 style={styles.sectionTitle}>Din statistikk</h2>
              <StatsGridTemplate items={sampleStats} />
            </div>

            <div style={styles.contentSection}>
              <h2 style={styles.sectionTitle}>Siste aktivitet</h2>
              <div style={styles.placeholder}>
                Placeholder for aktivitetsliste
              </div>
            </div>
          </AppShellTemplate>
        ) : (
          <AppShellTemplate
            title="Innstillinger"
            bottomNav={bottomNavContent}
          >
            <div style={styles.contentSection}>
              <h2 style={styles.sectionTitle}>Kontoinnstillinger</h2>
              <div style={styles.placeholder}>
                Placeholder for innstillingsform
              </div>
            </div>

            <div style={styles.contentSection}>
              <h2 style={styles.sectionTitle}>Varslinger</h2>
              <div style={styles.placeholder}>
                Placeholder for varslingsinnstillinger
              </div>
            </div>
          </AppShellTemplate>
        )}
      </div>

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <h3 style={styles.infoTitle}>AppShellTemplate Props</h3>
        <ul style={styles.propsList}>
          <li><code>title?: string</code> - Sidetittel i header</li>
          <li><code>subtitle?: string</code> - Undertittel (valgfri)</li>
          <li><code>actions?: ReactNode</code> - Handlingsknapper høyre side</li>
          <li><code>children: ReactNode</code> - Hovedinnhold</li>
          <li><code>bottomNav?: ReactNode</code> - Bunnnavigasjon (fixed)</li>
          <li><code>className?: string</code> - Ekstra CSS-klasse</li>
        </ul>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  labContainer: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    padding: 'var(--spacing-6)',
  },
  selector: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
    justifyContent: 'center',
  },
  selectorButton: {
    padding: 'var(--spacing-2) var(--spacing-4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    fontSize: 'var(--font-size-body)',
  },
  selectorButtonActive: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'white',
  },
  demoFrame: {
    maxWidth: '480px',
    margin: '0 auto',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    height: '700px',
    position: 'relative',
  },
  contentSection: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-3)',
  },
  placeholder: {
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-6)',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    border: '1px dashed var(--border-subtle)',
  },
  bottomNavContent: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 'var(--spacing-2) 0',
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 'var(--spacing-1)',
  },
  navIcon: {
    fontSize: '20px',
  },
  navLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
  },
  actionButton: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  iconButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
  },
  infoPanel: {
    maxWidth: '480px',
    margin: 'var(--spacing-6) auto 0',
    padding: 'var(--spacing-4)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-md)',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoTitle: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    marginBottom: 'var(--spacing-3)',
    color: 'white',
  },
  propsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 1.8,
  },
};

export default AppShellLab;
