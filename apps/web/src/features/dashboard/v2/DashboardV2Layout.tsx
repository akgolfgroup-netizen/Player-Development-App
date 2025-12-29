import React from 'react';

/**
 * DashboardV2Layout
 *
 * Premium dashboard layout component with strict 12-column grid system.
 * Follows Apple/Stripe design principles: precision, restraint, clarity.
 *
 * LAYOUT SPEC:
 * - Mobile (0-767px): Single column, card-for-card rhythm
 * - Tablet (768-1023px): 8-column grid, 2-col sections
 * - Desktop (1024px+): 12-column grid, asymmetric hero/stats split
 *
 * GRID STRUCTURE (Desktop):
 * Row 1: Hero (col-span-7) | Stats Grid (col-span-5)
 * Row 2: Next Up (col-span-7) | Daily Plan (col-span-5)
 * Row 3: Strokes Gained (col-span-7) | Activity Feed (col-span-5)
 */

interface DashboardV2LayoutProps {
  /** Header component (greeting, profile summary) */
  header: React.ReactNode;
  /** Hero card component (primary focus/priority) */
  hero: React.ReactNode;
  /** Stats grid component (2x2 metric cards) */
  statsGrid: React.ReactNode;
  /** Next up section (tournament + test countdowns) */
  nextUp: React.ReactNode;
  /** Daily plan/schedule component */
  dailyPlan: React.ReactNode;
  /** Strokes gained visualization */
  strokesGained: React.ReactNode;
  /** Activity feed component */
  activityFeed: React.ReactNode;
  /** Additional className */
  className?: string;
}

const DashboardV2Layout: React.FC<DashboardV2LayoutProps> = ({
  header,
  hero,
  statsGrid,
  nextUp,
  dailyPlan,
  strokesGained,
  activityFeed,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={styles.container}
    >
      {/* Header - Full width on all breakpoints */}
      <header style={styles.header}>
        {header}
      </header>

      {/* Main Dashboard Grid */}
      <main style={styles.main}>
        {/* Row 1: Hero + Stats */}
        <section style={styles.row1} className="dashboard-row-1">
          <div style={styles.heroSlot} className="dashboard-hero">
            {hero}
          </div>
          <div style={styles.statsSlot} className="dashboard-stats">
            {statsGrid}
          </div>
        </section>

        {/* Row 2: Next Up + Daily Plan */}
        <section style={styles.row2} className="dashboard-row-2">
          <div style={styles.nextUpSlot} className="dashboard-nextup">
            {nextUp}
          </div>
          <div style={styles.dailyPlanSlot} className="dashboard-dailyplan">
            {dailyPlan}
          </div>
        </section>

        {/* Row 3: Strokes Gained + Activity */}
        <section style={styles.row3} className="dashboard-row-3">
          <div style={styles.strokesSlot} className="dashboard-strokes">
            {strokesGained}
          </div>
          <div style={styles.activitySlot} className="dashboard-activity">
            {activityFeed}
          </div>
        </section>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--background-default)',
    paddingBottom: 'calc(56px + var(--safe-area-inset-bottom))', // Mobile nav offset
  },
  header: {
    padding: 'var(--spacing-4)',
    paddingTop: 'calc(var(--safe-area-inset-top) + var(--spacing-4))',
  },
  main: {
    padding: 'var(--spacing-4)',
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-5)', // 20px between rows
  },
  // Row 1: Hero + Stats
  row1: {
    display: 'grid',
    gap: 'var(--spacing-4)',
    gridTemplateColumns: '1fr', // Mobile: single column
  },
  heroSlot: {},
  statsSlot: {},
  // Row 2: Next Up + Daily Plan
  row2: {
    display: 'grid',
    gap: 'var(--spacing-4)',
    gridTemplateColumns: '1fr',
  },
  nextUpSlot: {},
  dailyPlanSlot: {},
  // Row 3: Strokes Gained + Activity
  row3: {
    display: 'grid',
    gap: 'var(--spacing-4)',
    gridTemplateColumns: '1fr',
  },
  strokesSlot: {},
  activitySlot: {},
};

export default DashboardV2Layout;

// CSS to be added to index.css or a separate file
export const dashboardV2CSS = `
/* ═══════════════════════════════════════════
   DASHBOARD V2 - RESPONSIVE GRID
   Premium Layout System
   ═══════════════════════════════════════════ */

/* Tablet (768px+) - 2-column balanced grid */
@media (min-width: 768px) {
  .dashboard-row-1,
  .dashboard-row-2,
  .dashboard-row-3 {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop (1024px+) - 12-column asymmetric grid */
@media (min-width: 1024px) {
  .dashboard-row-1,
  .dashboard-row-2,
  .dashboard-row-3 {
    grid-template-columns: 7fr 5fr;
    gap: var(--spacing-6);
  }
}

/* Desktop Large (1280px+) - Increased padding and max-width */
@media (min-width: 1280px) {
  .dashboard-row-1,
  .dashboard-row-2,
  .dashboard-row-3 {
    max-width: 1440px;
    margin: 0 auto;
  }
}
`;
