/**
 * TestResultsContent - Comprehensive test results view
 * Used within StatistikkHub as tab content
 *
 * Features:
 * - Test history list with filtering
 * - Category progression visualization
 * - Test comparison tools
 * - Improvement velocity tracking
 * - Coach notes integration
 */

import React, { useState, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Target,
  Activity,
  GitCompare,
  Zap,
  MessageSquare,
  Award,
  ChevronRight,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';
import useTestResults from '../../hooks/useTestResults';

// Lazy load sub-widgets for performance
const CategoryProgressionWidget = lazy(() => import('./CategoryProgressionWidget'));
const TestComparisonWidget = lazy(() => import('./TestComparisonWidget'));
const ImprovementVelocityWidget = lazy(() => import('./ImprovementVelocityWidget'));
const CoachNotesPanel = lazy(() => import('./CoachNotesPanel'));

// ============================================================================
// TYPES
// ============================================================================

type SubView = 'list' | 'progression' | 'compare' | 'velocity' | 'notes';

const SUB_VIEWS: { id: SubView; label: string; icon: React.ReactNode }[] = [
  { id: 'list', label: 'Oversikt', icon: <ClipboardList size={16} /> },
  { id: 'progression', label: 'Progresjon', icon: <Award size={16} /> },
  { id: 'compare', label: 'Sammenlign', icon: <GitCompare size={16} /> },
  { id: 'velocity', label: 'Hastighet', icon: <Zap size={16} /> },
  { id: 'notes', label: 'Notater', icon: <MessageSquare size={16} /> },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TestResultsContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const subView = (searchParams.get('subview') as SubView) || 'list';
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const {
    tests,
    testsByCategory,
    categories,
    totalTests,
    passedTests,
    improvingTests,
    loading,
    error,
  } = useTestResults();

  const setSubView = (view: SubView) => {
    searchParams.set('subview', view);
    setSearchParams(searchParams);
  };

  const handleViewTestDetails = (testId: string) => {
    navigate(`/statistikk?tab=testresultater&testId=${testId}`);
  };

  const filteredTests = filterCategory === 'all'
    ? tests
    : tests.filter(t => t.category === filterCategory);

  if (loading) {
    return (
      <StateCard
        variant="loading"
        title="Laster testresultater..."
        description="Henter dine data"
      />
    );
  }

  if (error && tests.length === 0) {
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
      {/* Quick Stats */}
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
              <div style={{ ...styles.statIcon, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Target size={20} color="var(--status-success)" />
              </div>
              <div style={styles.statContent}>
                <span style={{ ...styles.statValue, color: 'var(--status-success)' }}>
                  {passedTests}/{totalTests}
                </span>
                <span style={styles.statLabel}>Oppfylt</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                <TrendingUp size={20} color="var(--accent)" />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statValue}>{improvingTests}</span>
                <span style={styles.statLabel}>Forbedrer seg</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Sub-navigation */}
      <section style={styles.section}>
        <div style={styles.subNav}>
          {SUB_VIEWS.map(view => (
            <button
              key={view.id}
              onClick={() => setSubView(view.id)}
              style={{
                ...styles.subNavButton,
                ...(subView === view.id ? styles.subNavButtonActive : {}),
              }}
            >
              {view.icon}
              {view.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content based on sub-view */}
      <Suspense fallback={<StateCard variant="loading" title="Laster..." />}>
        {subView === 'list' && (
          <>
            {/* Filter */}
            <section style={styles.section}>
              <div style={styles.filterBar}>
                <Filter size={18} color="var(--text-secondary)" />
                <div style={styles.filterButtons}>
                  <button
                    onClick={() => setFilterCategory('all')}
                    style={{
                      ...styles.filterButton,
                      ...(filterCategory === 'all' ? styles.filterButtonActive : {}),
                    }}
                  >
                    Alle ({tests.length})
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      style={{
                        ...styles.filterButton,
                        ...(filterCategory === cat ? styles.filterButtonActive : {}),
                      }}
                    >
                      {cat} ({testsByCategory[cat]?.length || 0})
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Test List */}
            <section style={styles.section}>
              <SectionTitle style={styles.sectionTitle}>
                Testresultater ({filteredTests.length})
              </SectionTitle>

              <div style={styles.testList}>
                {filteredTests.map(test => (
                  <Card
                    key={test.id}
                    padding="md"
                    style={styles.testCard}
                    onClick={() => handleViewTestDetails(test.id)}
                  >
                    <div style={styles.testRow}>
                      <div style={styles.testLeft}>
                        <span style={styles.testIcon}>{test.icon}</span>
                        <div style={styles.testInfo}>
                          <span style={styles.testName}>{test.name}</span>
                          <div style={styles.testMeta}>
                            <Badge variant="accent" size="sm">{test.category}</Badge>
                            <span style={styles.testDate}>
                              Sist: {test.lastTestDate
                                ? new Date(test.lastTestDate).toLocaleDateString('no-NO', {
                                  day: 'numeric',
                                  month: 'short',
                                })
                                : '-'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={styles.testRight}>
                        <div style={styles.testValue}>
                          <span style={{
                            ...styles.currentValue,
                            color: test.meetsCurrent ? 'var(--status-success)' : 'var(--status-warning)',
                          }}>
                            {test.currentValue}{test.unit}
                          </span>
                          <span style={styles.requirement}>
                            Krav: {test.lowerIsBetter ? '≤' : '≥'}{test.requirement}{test.unit}
                          </span>
                        </div>

                        <div style={styles.testTrend}>
                          {test.trend === 'improving' ? (
                            <TrendingUp size={16} color="var(--status-success)" />
                          ) : test.trend === 'declining' ? (
                            <TrendingDown size={16} color="var(--status-error)" />
                          ) : null}
                          <ChevronRight size={16} color="var(--text-tertiary)" />
                        </div>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${Math.min(100, test.lowerIsBetter
                            ? (test.requirement / test.currentValue) * 100
                            : (test.currentValue / test.requirement) * 100)}%`,
                          backgroundColor: test.meetsCurrent ? 'var(--status-success)' : 'var(--accent)',
                        }}
                      />
                    </div>
                  </Card>
                ))}

                {filteredTests.length === 0 && (
                  <StateCard
                    variant="empty"
                    icon={Target}
                    title="Ingen tester funnet"
                    description="Ingen tester matcher filteret"
                  />
                )}
              </div>
            </section>
          </>
        )}

        {subView === 'progression' && (
          <CategoryProgressionWidget onViewTestDetails={handleViewTestDetails} />
        )}

        {subView === 'compare' && (
          <TestComparisonWidget />
        )}

        {subView === 'velocity' && (
          <ImprovementVelocityWidget onViewTestDetails={handleViewTestDetails} />
        )}

        {subView === 'notes' && (
          <CoachNotesPanel onViewTestDetails={handleViewTestDetails} />
        )}
      </Suspense>
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 'var(--spacing-5)',
  },
  sectionTitle: {
    margin: 0,
    marginBottom: 'var(--spacing-3)',
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
  subNav: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-1)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    overflowX: 'auto',
  },
  subNavButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease',
  },
  subNavButtonActive: {
    backgroundColor: 'var(--background-white)',
    color: 'var(--accent)',
    boxShadow: 'var(--shadow-sm)',
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
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textTransform: 'capitalize',
  },
  filterButtonActive: {
    backgroundColor: 'var(--accent)',
    color: 'white',
  },
  testList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  testCard: {
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease',
  },
  testRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
    marginBottom: 'var(--spacing-2)',
  },
  testLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flex: 1,
    minWidth: 0,
  },
  testIcon: {
    fontSize: '24px',
  },
  testInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  testName: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  testMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  testDate: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  testRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flexShrink: 0,
  },
  testValue: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  requirement: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  testTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
};

export default TestResultsContent;
