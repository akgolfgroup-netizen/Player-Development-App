/**
 * TestComparisonWidget - Compare multiple tests side by side
 *
 * Features:
 * - Multi-test selection
 * - Overlaid history charts
 * - Correlation analysis
 * - Relative performance comparison
 */

import React, { useState, useMemo } from 'react';
import {
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  GitCompare,
  ChevronDown,
  Check,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import Button from '../../ui/primitives/Button';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';
import useTestResults, { TestResult, TestCategory } from '../../hooks/useTestResults';

// ============================================================================
// TYPES
// ============================================================================

interface ComparisonData {
  test: TestResult;
  normalizedHistory: { date: string; value: number }[];
  color: string;
}

const CHART_COLORS = [
  'var(--accent)',
  'var(--status-success)',
  'var(--status-warning)',
  'var(--status-error)',
  'rgb(var(--category-j))',
  'rgb(var(--status-error))',
];

// ============================================================================
// COMPONENTS
// ============================================================================

interface TestSelectorProps {
  tests: TestResult[];
  selectedIds: string[];
  onToggle: (testId: string) => void;
  maxSelections?: number;
}

const TestSelector: React.FC<TestSelectorProps> = ({
  tests,
  selectedIds,
  onToggle,
  maxSelections = 4,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<TestCategory | 'all'>('all');

  const categories = useMemo(() => {
    return [...new Set(tests.map(t => t.category))];
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (categoryFilter === 'all') return tests;
    return tests.filter(t => t.category === categoryFilter);
  }, [tests, categoryFilter]);

  return (
    <div style={styles.selectorContainer}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.selectorButton}
      >
        <Plus size={16} />
        <span>Legg til test ({selectedIds.length}/{maxSelections})</span>
        <ChevronDown
          size={16}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {isOpen && (
        <div style={styles.selectorDropdown}>
          {/* Category Filter */}
          <div style={styles.categoryTabs}>
            <button
              onClick={() => setCategoryFilter('all')}
              style={{
                ...styles.categoryTab,
                backgroundColor: categoryFilter === 'all' ? 'var(--accent)' : 'transparent',
                color: categoryFilter === 'all' ? 'white' : 'var(--text-secondary)',
              }}
            >
              Alle
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  ...styles.categoryTab,
                  backgroundColor: categoryFilter === cat ? 'var(--accent)' : 'transparent',
                  color: categoryFilter === cat ? 'white' : 'var(--text-secondary)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Test List */}
          <div style={styles.testList}>
            {filteredTests.map(test => {
              const isSelected = selectedIds.includes(test.id);
              const isDisabled = !isSelected && selectedIds.length >= maxSelections;

              return (
                <button
                  key={test.id}
                  onClick={() => !isDisabled && onToggle(test.id)}
                  disabled={isDisabled}
                  style={{
                    ...styles.testOption,
                    opacity: isDisabled ? 0.5 : 1,
                    backgroundColor: isSelected ? 'var(--bg-accent-subtle)' : 'transparent',
                  }}
                >
                  <span style={styles.testOptionIcon}>{test.icon}</span>
                  <span style={styles.testOptionName}>{test.name}</span>
                  {isSelected && <Check size={16} color="var(--accent)" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface ComparisonChartProps {
  data: ComparisonData[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ testIdx: number; pointIdx: number } | null>(null);

  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    // Find the date range across all tests
    const allDates = data.flatMap(d => d.normalizedHistory.map(h => h.date));
    const uniqueDates = [...new Set(allDates)].sort();

    // Find min/max normalized values
    const allValues = data.flatMap(d => d.normalizedHistory.map(h => h.value));
    const maxValue = Math.max(...allValues, 100);
    const minValue = Math.min(...allValues, 0);
    const range = maxValue - minValue || 1;

    return {
      dates: uniqueDates,
      maxValue,
      minValue,
      range,
      getY: (value: number) => 100 - ((value - minValue) / range) * 80 - 10,
      getX: (date: string) => {
        const idx = uniqueDates.indexOf(date);
        return uniqueDates.length > 1 ? (idx / (uniqueDates.length - 1)) * 100 : 50;
      },
    };
  }, [data]);

  if (!chartData || data.length === 0) {
    return (
      <div style={styles.emptyChart}>
        <GitCompare size={32} color="var(--text-tertiary)" />
        <p>Velg minst én test for å vise sammenligning</p>
      </div>
    );
  }

  return (
    <div style={styles.chartContainer}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.chart}>
        {/* Grid lines */}
        {[20, 40, 60, 80].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="var(--border-subtle)"
            strokeWidth="0.2"
          />
        ))}

        {/* 100% line (target) */}
        <line
          x1="0"
          y1={chartData.getY(100)}
          x2="100"
          y2={chartData.getY(100)}
          stroke="var(--status-success)"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />

        {/* Data lines for each test */}
        {data.map((d, testIdx) => {
          const points = d.normalizedHistory
            .map(h => `${chartData.getX(h.date)},${chartData.getY(h.value)}`)
            .join(' ');

          return (
            <g key={d.test.id}>
              {/* Line */}
              <polyline
                fill="none"
                stroke={d.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                opacity={hoveredPoint && hoveredPoint.testIdx !== testIdx ? 0.3 : 1}
              />

              {/* Points */}
              {d.normalizedHistory.map((h, pointIdx) => {
                const isHovered = hoveredPoint?.testIdx === testIdx && hoveredPoint?.pointIdx === pointIdx;

                return (
                  <circle
                    key={pointIdx}
                    cx={chartData.getX(h.date)}
                    cy={chartData.getY(h.value)}
                    r={isHovered ? '3' : '2'}
                    fill="white"
                    stroke={d.color}
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint({ testIdx, pointIdx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            ...styles.tooltip,
            left: `${chartData.getX(data[hoveredPoint.testIdx].normalizedHistory[hoveredPoint.pointIdx].date)}%`,
            top: `${chartData.getY(data[hoveredPoint.testIdx].normalizedHistory[hoveredPoint.pointIdx].value) - 15}%`,
            borderColor: data[hoveredPoint.testIdx].color,
          }}
        >
          <span style={styles.tooltipName}>{data[hoveredPoint.testIdx].test.name}</span>
          <span style={styles.tooltipValue}>
            {data[hoveredPoint.testIdx].normalizedHistory[hoveredPoint.pointIdx].value.toFixed(0)}%
          </span>
        </div>
      )}

      {/* Y-axis labels */}
      <div style={styles.yAxis}>
        <span>100%</span>
        <span>50%</span>
        <span>0%</span>
      </div>
    </div>
  );
};

interface TestLegendProps {
  data: ComparisonData[];
  onRemove: (testId: string) => void;
}

const TestLegend: React.FC<TestLegendProps> = ({ data, onRemove }) => {
  return (
    <div style={styles.legend}>
      {data.map(d => (
        <div key={d.test.id} style={styles.legendItem}>
          <span style={{ ...styles.legendColor, backgroundColor: d.color }} />
          <span style={styles.legendIcon}>{d.test.icon}</span>
          <span style={styles.legendName}>{d.test.name}</span>
          <button
            onClick={() => onRemove(d.test.id)}
            style={styles.legendRemove}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

interface ComparisonTableProps {
  data: ComparisonData[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Test</th>
            <th style={styles.tableHeader}>Nåværende</th>
            <th style={styles.tableHeader}>Mål</th>
            <th style={styles.tableHeader}>Progresjon</th>
            <th style={styles.tableHeader}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => {
            const progress = d.normalizedHistory[d.normalizedHistory.length - 1]?.value ?? 0;

            return (
              <tr key={d.test.id}>
                <td style={styles.tableCell}>
                  <div style={styles.tableCellContent}>
                    <span style={{ ...styles.tableColorDot, backgroundColor: d.color }} />
                    <span>{d.test.icon}</span>
                    <span>{d.test.name}</span>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  {d.test.currentValue}{d.test.unit}
                </td>
                <td style={styles.tableCell}>
                  {d.test.lowerIsBetter ? '≤' : '≥'} {d.test.requirement}{d.test.unit}
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.progressCell}>
                    <div style={styles.miniProgress}>
                      <div
                        style={{
                          ...styles.miniProgressFill,
                          width: `${Math.min(100, progress)}%`,
                          backgroundColor: progress >= 100 ? 'var(--status-success)' : d.color,
                        }}
                      />
                    </div>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.trendCell}>
                    {d.test.trend === 'improving' ? (
                      <>
                        <TrendingUp size={14} color="var(--status-success)" />
                        <span style={{ color: 'var(--status-success)' }}>+{d.test.trendPercent}%</span>
                      </>
                    ) : d.test.trend === 'declining' ? (
                      <>
                        <TrendingDown size={14} color="var(--status-error)" />
                        <span style={{ color: 'var(--status-error)' }}>-{d.test.trendPercent}%</span>
                      </>
                    ) : (
                      <>
                        <Minus size={14} color="var(--text-tertiary)" />
                        <span style={{ color: 'var(--text-tertiary)' }}>Stabil</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface TestComparisonWidgetProps {
  initialTestIds?: string[];
}

const TestComparisonWidget: React.FC<TestComparisonWidgetProps> = ({
  initialTestIds = [],
}) => {
  const { tests, loading } = useTestResults();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialTestIds);

  const handleToggle = (testId: string) => {
    setSelectedIds(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleRemove = (testId: string) => {
    setSelectedIds(prev => prev.filter(id => id !== testId));
  };

  const comparisonData: ComparisonData[] = useMemo(() => {
    return selectedIds
      .map((id, idx) => {
        const test = tests.find(t => t.id === id);
        if (!test) return null;

        // Normalize history to percentage of requirement
        const normalizedHistory = test.history.map(h => ({
          date: h.testDate.split('T')[0],
          value: test.lowerIsBetter
            ? (test.requirement / h.value) * 100
            : (h.value / test.requirement) * 100,
        }));

        return {
          test,
          normalizedHistory,
          color: CHART_COLORS[idx % CHART_COLORS.length],
        };
      })
      .filter((d): d is ComparisonData => d !== null);
  }, [selectedIds, tests]);

  // Calculate insights
  const insights = useMemo(() => {
    if (comparisonData.length < 2) return [];

    const result: string[] = [];

    // Find best performer
    const sorted = [...comparisonData].sort((a, b) => {
      const aProgress = a.normalizedHistory[a.normalizedHistory.length - 1]?.value ?? 0;
      const bProgress = b.normalizedHistory[b.normalizedHistory.length - 1]?.value ?? 0;
      return bProgress - aProgress;
    });

    if (sorted.length >= 2) {
      result.push(`${sorted[0].test.name} har best progresjon (${sorted[0].normalizedHistory[sorted[0].normalizedHistory.length - 1]?.value.toFixed(0)}%)`);
      result.push(`${sorted[sorted.length - 1].test.name} trenger mest fokus`);
    }

    // Check for correlations (simple: both improving or both declining)
    const improving = comparisonData.filter(d => d.test.trend === 'improving');
    const declining = comparisonData.filter(d => d.test.trend === 'declining');

    if (improving.length === comparisonData.length) {
      result.push('Alle valgte tester viser positiv utvikling!');
    } else if (declining.length > 0) {
      result.push(`${declining.length} test${declining.length > 1 ? 'er' : ''} viser nedgang`);
    }

    return result;
  }, [comparisonData]);

  if (loading) {
    return (
      <Card padding="spacious">
        <div style={styles.loadingState}>Laster tester...</div>
      </Card>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <GitCompare size={20} color="var(--accent)" />
          <SectionTitle style={styles.title}>Sammenlign tester</SectionTitle>
        </div>
        <TestSelector
          tests={tests}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          maxSelections={4}
        />
      </div>

      {/* Legend */}
      {comparisonData.length > 0 && (
        <TestLegend data={comparisonData} onRemove={handleRemove} />
      )}

      {/* Chart */}
      <Card padding="md">
        <SubSectionTitle style={styles.chartTitle}>
          Normalisert progresjon mot krav
        </SubSectionTitle>
        <ComparisonChart data={comparisonData} />
      </Card>

      {/* Comparison Table */}
      {comparisonData.length > 0 && (
        <Card padding="md">
          <SubSectionTitle style={styles.chartTitle}>Detaljert sammenligning</SubSectionTitle>
          <ComparisonTable data={comparisonData} />
        </Card>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Card padding="md" style={styles.insightsCard}>
          <div style={styles.insightsHeader}>
            <BarChart3 size={16} color="var(--accent)" />
            <SubSectionTitle style={styles.insightsTitle}>Innsikt</SubSectionTitle>
          </div>
          <ul style={styles.insightsList}>
            {insights.map((insight, i) => (
              <li key={i} style={styles.insightItem}>{insight}</li>
            ))}
          </ul>
        </Card>
      )}
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
    gap: 'var(--spacing-4)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--spacing-3)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  title: {
    margin: 0,
  },
  selectorContainer: {
    position: 'relative',
  },
  selectorButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-white)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  selectorDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 'var(--spacing-1)',
    width: 280,
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 50,
    overflow: 'hidden',
  },
  categoryTabs: {
    display: 'flex',
    padding: 'var(--spacing-2)',
    gap: 'var(--spacing-1)',
    borderBottom: '1px solid var(--border-subtle)',
    overflowX: 'auto',
  },
  categoryTab: {
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontSize: 'var(--font-size-caption1)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textTransform: 'capitalize',
  },
  testList: {
    maxHeight: 240,
    overflowY: 'auto',
  },
  testOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    width: '100%',
    padding: 'var(--spacing-2) var(--spacing-3)',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'var(--font-size-footnote)',
    textAlign: 'left',
    cursor: 'pointer',
  },
  testOptionIcon: {
    fontSize: '16px',
  },
  testOptionName: {
    flex: 1,
    color: 'var(--text-primary)',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-footnote)',
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendIcon: {
    fontSize: '14px',
  },
  legendName: {
    color: 'var(--text-primary)',
  },
  legendRemove: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'var(--background-elevated)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  chartContainer: {
    position: 'relative',
    height: 200,
    paddingLeft: 30,
  },
  chart: {
    width: '100%',
    height: '100%',
  },
  chartTitle: {
    margin: 0,
    marginBottom: 'var(--spacing-3)',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  emptyChart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    height: 160,
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-footnote)',
  },
  tooltip: {
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    backgroundColor: 'var(--background-elevated)',
    padding: 'var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-md)',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 10,
  },
  tooltipName: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
  },
  tooltipValue: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--font-size-footnote)',
  },
  tableHeader: {
    textAlign: 'left',
    padding: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  tableCell: {
    padding: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
  },
  tableCellContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  tableColorDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  progressCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  miniProgress: {
    width: 60,
    height: 6,
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  trendCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  insightsCard: {
    backgroundColor: 'var(--bg-accent-subtle)',
    border: '1px solid var(--accent)',
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-2)',
  },
  insightsTitle: {
    margin: 0,
    color: 'var(--accent)',
  },
  insightsList: {
    margin: 0,
    paddingLeft: 'var(--spacing-5)',
  },
  insightItem: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-1)',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8)',
    color: 'var(--text-tertiary)',
  },
};

export default TestComparisonWidget;
