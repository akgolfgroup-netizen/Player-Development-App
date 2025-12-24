import React from 'react';
import StatsGridTemplate, { StatsItem } from '../templates/StatsGridTemplate';

/**
 * StatsLab - Demo page for StatsGridTemplate
 * Shows examples with and without change indicators
 */
const StatsLab: React.FC = () => {
  // Example 1: Stats without change indicators (simple cards)
  const simpleStats: StatsItem[] = [
    {
      id: '1',
      label: 'Økter',
      value: '12',
    },
    {
      id: '2',
      label: 'Timer',
      value: '18.5t',
      sublabel: 'Denne uken',
    },
    {
      id: '3',
      label: 'Merker',
      value: '4',
    },
    {
      id: '4',
      label: 'Poeng',
      value: '850',
      sublabel: 'Total XP',
    },
  ];

  // Example 2: Stats with change indicators
  const statsWithChange: StatsItem[] = [
    {
      id: '1',
      label: 'Økter',
      value: '12',
      change: {
        value: '5%',
        direction: 'up',
      },
    },
    {
      id: '2',
      label: 'Timer',
      value: '18.5t',
      sublabel: 'Denne uken',
      change: {
        value: '2%',
        direction: 'up',
      },
    },
    {
      id: '3',
      label: 'Fullført',
      value: '85%',
      change: {
        value: '3%',
        direction: 'down',
      },
    },
    {
      id: '4',
      label: 'Gjennomsnitt',
      value: '92',
      change: {
        value: '0%',
        direction: 'neutral',
      },
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>StatsGridTemplate Demo</h1>
          <p style={styles.subtitle}>
            Unified template supporting both simple cards and cards with change indicators
          </p>
        </div>

        {/* Section 1: Simple Stats */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Eksempel 1: Simple Stats (uten endringsindikatorer)
          </h2>
          <p style={styles.sectionDescription}>
            Grunnleggende statskort uten piler eller prosentendring
          </p>
          <StatsGridTemplate items={simpleStats} />
        </section>

        {/* Section 2: Stats with Change */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Eksempel 2: Stats med endringsindikatorer
          </h2>
          <p style={styles.sectionDescription}>
            Statskort med piler og prosentendring (opp/ned/nøytral)
          </p>
          <StatsGridTemplate items={statsWithChange} />
        </section>

        {/* Section 3: Custom Columns */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Eksempel 3: Med 2 kolonner</h2>
          <p style={styles.sectionDescription}>
            Grid med fast antall kolonner (2)
          </p>
          <StatsGridTemplate items={statsWithChange} columns={2} />
        </section>

        {/* Section 4: Custom Columns */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Eksempel 4: Med 4 kolonner</h2>
          <p style={styles.sectionDescription}>
            Grid med fast antall kolonner (4)
          </p>
          <StatsGridTemplate items={simpleStats} columns={4} />
        </section>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--background-default)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'var(--spacing-6)',
  },
  header: {
    marginBottom: 'var(--spacing-8)',
    paddingBottom: 'var(--spacing-4)',
    borderBottom: '2px solid var(--border-subtle)',
  },
  title: {
    fontSize: 'var(--font-size-large-title)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-2)',
  },
  subtitle: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 'var(--spacing-10)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-2)',
  },
  sectionDescription: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--spacing-4)',
    lineHeight: 1.5,
  },
};

export default StatsLab;
