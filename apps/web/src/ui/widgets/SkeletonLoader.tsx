import React from 'react';

/**
 * SkeletonLoader
 * Centralized loading skeleton library with multiple variants
 */

interface SkeletonLoaderProps {
  /** Skeleton variant type */
  variant?: 'pulse' | 'card' | 'stat' | 'list' | 'table' | 'stats-grid' | 'tasks' | 'countdown';
  /** Additional className */
  className?: string;
  /** Number of items for list/table variants */
  count?: number;
  /** Custom children for card variant */
  children?: React.ReactNode;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'pulse',
  className = '',
  count = 3,
  children,
}) => {
  switch (variant) {
    case 'pulse':
      return <SkeletonPulse className={className} />;

    case 'card':
      return <CardSkeleton>{children}</CardSkeleton>;

    case 'stat':
      return <StatSkeleton />;

    case 'list':
      return <ListSkeleton count={count} />;

    case 'table':
      return <TableSkeleton count={count} />;

    case 'stats-grid':
      return <StatsGridSkeleton />;

    case 'tasks':
      return <TasksSkeleton count={count} />;

    case 'countdown':
      return <CountdownSkeleton />;

    default:
      return <SkeletonPulse className={className} />;
  }
};

// Base pulse component
const SkeletonPulse: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    style={{
      ...styles.pulse,
      ...(className && {}),
    }}
    className={className}
  />
);

// Card wrapper skeleton
const CardSkeleton: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={styles.cardSkeleton}>
    {children}
  </div>
);

// Single stat skeleton
const StatSkeleton: React.FC = () => (
  <div style={styles.statSkeleton}>
    <SkeletonPulse className="h-8 w-12 mx-auto mb-2" />
    <SkeletonPulse className="h-3 w-16 mx-auto" />
  </div>
);

// List skeleton
const ListSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div style={styles.listContainer}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} style={styles.listItem}>
        <SkeletonPulse className="h-4 w-3/4 mb-1" />
        <SkeletonPulse className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

// Table skeleton
const TableSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div style={styles.tableContainer}>
    {/* Header */}
    <div style={styles.tableHeader}>
      <SkeletonPulse className="h-4 w-20" />
      <SkeletonPulse className="h-4 w-24" />
      <SkeletonPulse className="h-4 w-16" />
    </div>
    {/* Rows */}
    {Array.from({ length: count }, (_, i) => (
      <div key={i} style={styles.tableRow}>
        <SkeletonPulse className="h-3 w-24" />
        <SkeletonPulse className="h-3 w-32" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    ))}
  </div>
);

// Stats grid skeleton (3 stats in a row)
const StatsGridSkeleton: React.FC = () => (
  <CardSkeleton>
    <SkeletonPulse className="h-5 w-32 mb-4" />
    <div style={styles.statsGrid}>
      {[1, 2, 3].map(i => (
        <div key={i} style={styles.statCard}>
          <SkeletonPulse className="h-8 w-12 mx-auto mb-2" />
          <SkeletonPulse className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
    <div style={styles.progressBars}>
      <SkeletonPulse className="h-2 w-full rounded-full" />
      <SkeletonPulse className="h-2 w-full rounded-full" />
    </div>
  </CardSkeleton>
);

// Tasks skeleton
const TasksSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <CardSkeleton>
    <SkeletonPulse className="h-5 w-28 mb-4" />
    <div style={styles.tasksContainer}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={styles.taskItem}>
          <SkeletonPulse className="h-5 w-5 rounded-full" />
          <div style={{ flex: 1 }}>
            <SkeletonPulse className="h-4 w-3/4 mb-1" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </CardSkeleton>
);

// Countdown skeleton
const CountdownSkeleton: React.FC = () => (
  <CardSkeleton>
    <div style={styles.countdownContainer}>
      <SkeletonPulse className="h-10 w-10 rounded-lg" />
      <div style={{ flex: 1 }}>
        <SkeletonPulse className="h-3 w-20 mb-2" />
        <SkeletonPulse className="h-4 w-32 mb-1" />
        <SkeletonPulse className="h-3 w-24" />
      </div>
      <div style={{ textAlign: 'right' }}>
        <SkeletonPulse className="h-8 w-10 mb-1" />
        <SkeletonPulse className="h-3 w-8" />
      </div>
    </div>
  </CardSkeleton>
);

const styles: Record<string, React.CSSProperties> = {
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: 'var(--bg-neutral-subtle)',
    borderRadius: 'var(--radius-sm)',
  },
  cardSkeleton: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: 'var(--spacing-5)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  statSkeleton: {
    textAlign: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--bg-neutral-subtle)',
    borderRadius: 'var(--radius-lg)',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  tableHeader: {
    display: 'flex',
    gap: 'var(--spacing-4)',
    paddingBottom: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  tableRow: {
    display: 'flex',
    gap: 'var(--spacing-4)',
    padding: 'var(--spacing-2) 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  statCard: {
    textAlign: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--bg-neutral-subtle)',
    borderRadius: 'var(--radius-lg)',
  },
  progressBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  tasksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--bg-neutral-subtle)',
    borderRadius: 'var(--radius-md)',
  },
  countdownContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
};

// CSS animation for pulse
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  try {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  } catch (e) {
    // Keyframes may already exist
  }
}

export default SkeletonLoader;
export { SkeletonPulse, CardSkeleton, StatSkeleton, ListSkeleton, TableSkeleton };
