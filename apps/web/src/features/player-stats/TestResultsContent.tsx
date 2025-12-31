import React, { useState } from 'react';
import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { useStrokesGained } from '../../hooks/useStrokesGained';
import { SectionTitle } from '../../components/typography';
import { getStrokesGainedIcon } from '../../constants/icons';

/**
 * TestResultsContent - All test results
 * Used within StatistikkHub as tab content
 */
const TestResultsContent: React.FC = () => {
  const { data, loading, error } = useStrokesGained();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const formatSG = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    if (value > 0) return `+${value.toFixed(2)}`;
    return value.toFixed(2);
  };

  const getSGColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'var(--text-tertiary)';
    if (value > 0) return 'var(--success)';
    if (value < 0) return 'var(--error)';
    return 'var(--text-secondary)';
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'approach': return 'Approach';
      case 'around_green': return 'Rundt green';
      case 'putting': return 'Putting';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    return getStrokesGainedIcon(category);
  };

  // Generate demo test data
  const demoTests = [
    { date: '2025-12-30', category: 'approach', sg: 0.22, testName: 'Approach 150m', distance: '150m' },
    { date: '2025-12-29', category: 'putting', sg: 0.15, testName: 'Putting 3m', distance: '3m' },
    { date: '2025-12-28', category: 'approach', sg: 0.18, testName: 'Approach 100m', distance: '100m' },
    { date: '2025-12-27', category: 'around_green', sg: -0.05, testName: 'Chipping 20m', distance: '20m' },
    { date: '2025-12-26', category: 'putting', sg: 0.08, testName: 'Putting 5m', distance: '5m' },
    { date: '2025-12-25', category: 'approach', sg: 0.12, testName: 'Approach 175m', distance: '175m' },
    { date: '2025-12-24', category: 'around_green', sg: 0.10, testName: 'Bunkerslag', distance: '15m' },
    { date: '2025-12-23', category: 'putting', sg: 0.25, testName: 'Putting 2m', distance: '2m' },
    { date: '2025-12-22', category: 'approach', sg: -0.08, testName: 'Approach 200m', distance: '200m' },
    { date: '2025-12-21', category: 'around_green', sg: 0.05, testName: 'Pitch 30m', distance: '30m' },
  ];

  const tests = data?.recentTests || demoTests;
  const filteredTests = filterCategory === 'all'
    ? tests
    : tests.filter(t => t.category === filterCategory);

  // Calculate stats
  const totalTests = tests.length;
  const avgSG = tests.reduce((sum, t) => sum + t.sg, 0) / (tests.length || 1);
  const positiveTests = tests.filter(t => t.sg > 0).length;

  if (loading) {
    return (
      <StateCard
        variant="loading"
        title="Laster testresultater..."
        description="Henter dine data"
      />
    );
  }

  if (error && !data) {
    return (
      <StateCard
        variant="error"
        title="Kunne ikke laste data"
        description={error}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Stats Summary */}
      <section style={styles.section}>
        <div style={styles.statsGrid}>
          <Card padding="md">
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <ClipboardList size={20} color="var(--accent)" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>{totalTests}</span>
                <span style={styles.statLabel}>Totalt tester</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Activity size={20} color="var(--accent)" />
              </div>
              <div style={styles.statContent}>
                <span style={{ ...styles.statValue, color: getSGColor(avgSG) }}>
                  {formatSG(avgSG)}
                </span>
                <span style={styles.statLabel}>Snitt SG</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <TrendingUp size={20} color="var(--success)" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>
                  {Math.round((positiveTests / (totalTests || 1)) * 100)}%
                </span>
                <span style={styles.statLabel}>Positive tester</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Filter */}
      <section style={styles.section}>
        <div style={styles.filterBar}>
          <Filter size={18} color="var(--text-secondary)" />
          <div style={styles.filterButtons}>
            {[
              { id: 'all', label: 'Alle' },
              { id: 'approach', label: 'Approach' },
              { id: 'around_green', label: 'Kortspill' },
              { id: 'putting', label: 'Putting' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterCategory(filter.id)}
                style={{
                  ...styles.filterButton,
                  ...(filterCategory === filter.id ? styles.filterButtonActive : {}),
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Test List */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>
          Testhistorikk ({filteredTests.length})
        </SectionTitle>

        <Card padding="none">
          <div style={styles.testList}>
            {filteredTests.map((test, index) => {
              const Icon = getCategoryIcon(test.category);
              return (
                <div key={index} style={styles.testRow}>
                  <div style={styles.testLeft}>
                    <div style={styles.testIconWrapper}>
                      <Icon size={18} color="var(--accent)" />
                    </div>
                    <div style={styles.testInfo}>
                      <span style={styles.testName}>{test.testName}</span>
                      <div style={styles.testMeta}>
                        <Calendar size={12} color="var(--text-tertiary)" />
                        <span>{test.date}</span>
                        <Badge variant="default" size="sm">
                          {getCategoryLabel(test.category)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div style={styles.testRight}>
                    <span style={{ ...styles.testSG, color: getSGColor(test.sg) }}>
                      {formatSG(test.sg)}
                    </span>
                    {test.sg > 0 ? (
                      <TrendingUp size={14} color="var(--success)" />
                    ) : test.sg < 0 ? (
                      <TrendingDown size={14} color="var(--error)" />
                    ) : null}
                  </div>
                </div>
              );
            })}

            {filteredTests.length === 0 && (
              <div style={styles.emptyState}>
                <Target size={32} color="var(--text-tertiary)" />
                <p>Ingen tester i denne kategorien</p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Category Breakdown */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>
          Per kategori
        </SectionTitle>

        <div style={styles.categoryBreakdown}>
          {['approach', 'around_green', 'putting'].map(cat => {
            const catTests = tests.filter(t => t.category === cat);
            const catAvg = catTests.reduce((sum, t) => sum + t.sg, 0) / (catTests.length || 1);
            const Icon = getCategoryIcon(cat);

            return (
              <Card key={cat} padding="md">
                <div style={styles.categoryCard}>
                  <div style={styles.categoryHeader}>
                    <div style={styles.categoryIcon}>
                      <Icon size={18} color="var(--accent)" />
                    </div>
                    <span style={styles.categoryLabel}>{getCategoryLabel(cat)}</span>
                  </div>
                  <div style={styles.categoryStats}>
                    <div style={styles.categoryStat}>
                      <span style={styles.categoryStatValue}>{catTests.length}</span>
                      <span style={styles.categoryStatLabel}>Tester</span>
                    </div>
                    <div style={styles.categoryStat}>
                      <span style={{ ...styles.categoryStatValue, color: getSGColor(catAvg) }}>
                        {formatSG(catAvg)}
                      </span>
                      <span style={styles.categoryStatLabel}>Snitt SG</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 'var(--spacing-5)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  filterButtons: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  filterButtonActive: {
    backgroundColor: 'var(--accent)',
    color: 'white',
  },
  testList: {
    display: 'flex',
    flexDirection: 'column',
  },
  testRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3) var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
    gap: 'var(--spacing-3)',
  },
  testLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flex: 1,
    minWidth: 0,
  },
  testIconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  testInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  testName: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  testMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  testRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flexShrink: 0,
  },
  testSG: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-8)',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
  },
  categoryBreakdown: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  categoryIcon: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  categoryStats: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  categoryStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  categoryStatValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  categoryStatLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
};

export default TestResultsContent;
