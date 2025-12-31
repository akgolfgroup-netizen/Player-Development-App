/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Calendar,
  CheckCircle,
  Circle
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';

import apiClient from '../../services/apiClient';
import { useScreenView } from '../../analytics/useScreenView';
import { useAuth } from '../../contexts/AuthContext';

interface TestResult {
  id: string;
  testId: string;
  testName: string;
  testNumber: number;
  category: string;
  value: number;
  unit: string;
  requirement: number;
  lowerIsBetter: boolean;
  testDate: string;
  passed: boolean;
  trend?: 'up' | 'down' | 'stable';
  previousValue?: number;
}

interface GroupedTests {
  [category: string]: TestResult[];
}

const TestResultsPage: React.FC = () => {
  useScreenView('Alle Testresultater');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'result'>('date');

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const playerId = user?.playerId || user?.id;
      const response = await apiClient.get(`/tests/results`, {
        params: {
          playerId,
          limit: 200,
          sortBy: 'testDate',
          sortOrder: 'desc'
        }
      });

      if (response.data?.success) {
        // Process and enrich results
        const enrichedResults = processResults(response.data.data || []);
        setResults(enrichedResults);
      } else {
        setResults([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch test results:', err);
      setError(err.response?.data?.error || 'Kunne ikke hente testresultater');
      // Use demo data as fallback
      setResults(getDemoResults());
    } finally {
      setLoading(false);
    }
  };

  const processResults = (rawResults: any[]): TestResult[] => {
    // Group by test to calculate trends
    const byTest: { [key: string]: any[] } = {};
    rawResults.forEach(r => {
      const key = r.testId || r.test?.id;
      if (!byTest[key]) byTest[key] = [];
      byTest[key].push(r);
    });

    return rawResults.map(r => {
      const testId = r.testId || r.test?.id;
      const testResults = byTest[testId] || [];
      const sortedResults = testResults.sort((a, b) =>
        new Date(b.testDate || b.createdAt).getTime() - new Date(a.testDate || a.createdAt).getTime()
      );

      const currentIndex = sortedResults.findIndex(tr => tr.id === r.id);
      const previousResult = sortedResults[currentIndex + 1];

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (previousResult) {
        const diff = r.value - previousResult.value;
        const lowerIsBetter = r.test?.lowerIsBetter || r.lowerIsBetter;
        if (lowerIsBetter) {
          trend = diff < 0 ? 'up' : diff > 0 ? 'down' : 'stable';
        } else {
          trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
        }
      }

      const requirement = r.test?.requirement || r.requirement || 0;
      const lowerIsBetter = r.test?.lowerIsBetter || r.lowerIsBetter || false;
      const passed = lowerIsBetter ? r.value <= requirement : r.value >= requirement;

      return {
        id: r.id,
        testId: testId,
        testName: r.test?.name || r.testName || 'Ukjent test',
        testNumber: r.test?.testNumber || r.testNumber || 0,
        category: r.test?.category || r.category || 'Annet',
        value: r.value,
        unit: r.test?.unit || r.unit || '',
        requirement,
        lowerIsBetter,
        testDate: r.testDate || r.createdAt,
        passed,
        trend,
        previousValue: previousResult?.value,
      };
    });
  };

  const categories = useMemo(() => {
    const cats = new Set(results.map(r => r.category));
    return ['all', ...Array.from(cats)];
  }, [results]);

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.testName.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.testName.localeCompare(b.testName));
        break;
      case 'result':
        filtered.sort((a, b) => (b.passed ? 1 : 0) - (a.passed ? 1 : 0));
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
    }

    return filtered;
  }, [results, searchQuery, selectedCategory, sortBy]);

  const groupedResults = useMemo((): GroupedTests => {
    const grouped: GroupedTests = {};
    filteredResults.forEach(r => {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    });
    return grouped;
  }, [filteredResults]);

  const stats = useMemo(() => {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const improving = results.filter(r => r.trend === 'up').length;
    return { total, passed, improving, passRate: total > 0 ? Math.round((passed / total) * 100) : 0 };
  }, [results]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} color="var(--success)" />;
      case 'down': return <TrendingDown size={14} color="var(--error)" />;
      default: return <Activity size={14} color="var(--text-tertiary)" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'm') return `${value.toFixed(1)}m`;
    return `${value.toFixed(2)} ${unit}`.trim();
  };

  if (loading) {
    return (
      <AppShellTemplate
        title="Testresultater"
        subtitle="Alle dine resultater"
        
      >
        <section style={styles.section}>
          <StateCard
            variant="loading"
            title="Laster testresultater..."
            description="Henter dine data"
          />
        </section>
      </AppShellTemplate>
    );
  }

  return (
    <AppShellTemplate
      title="Testresultater"
      subtitle="Fullstendig oversikt"
      
    >
      {/* Stats Overview */}
      <section style={styles.section}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <Target size={20} color="var(--accent)" />
            <div>
              <span style={styles.statValue}>{stats.total}</span>
              <span style={styles.statLabel}>Tester</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <CheckCircle size={20} color="var(--success)" />
            <div>
              <span style={styles.statValue}>{stats.passRate}%</span>
              <span style={styles.statLabel}>Bestått</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <TrendingUp size={20} color="var(--info)" />
            <div>
              <span style={styles.statValue}>{stats.improving}</span>
              <span style={styles.statLabel}>Forbedret</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section style={styles.section}>
        <div style={styles.searchRow}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Søk etter test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
        <div style={styles.filterRow}>
          <div style={styles.categoryFilters}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.filterButton,
                  backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--background-surface)',
                  color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                }}
              >
                {cat === 'all' ? 'Alle' : cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={styles.sortSelect}
          >
            <option value="date">Nyeste først</option>
            <option value="name">Navn</option>
            <option value="result">Bestått først</option>
          </select>
        </div>
      </section>

      {/* Results List */}
      {Object.keys(groupedResults).length === 0 ? (
        <section style={styles.section}>
          <StateCard
            variant="empty"
            title="Ingen testresultater"
            description="Du har ingen registrerte testresultater enda."
            action={
              <Button onClick={() => navigate('/testing/registrer')}>
                Registrer test
              </Button>
            }
          />
        </section>
      ) : (
        Object.entries(groupedResults).map(([category, tests]) => (
          <section key={category} style={styles.section}>
            <div style={styles.categoryHeader}>
              <SectionTitle>{category}</SectionTitle>
              <span style={styles.categoryCount}>{tests.length} tester</span>
            </div>
            <div style={styles.testList}>
              {tests.map((test) => (
                <Card key={test.id}>
                  <div style={styles.testCard}>
                    <div style={styles.testHeader}>
                      <div style={styles.testInfo}>
                        <div style={styles.testNameRow}>
                          <span style={styles.testNumber}>#{test.testNumber}</span>
                          <SubSectionTitle style={styles.testName}>{test.testName}</SubSectionTitle>
                        </div>
                        <div style={styles.testMeta}>
                          <Calendar size={12} color="var(--text-tertiary)" />
                          <span>{formatDate(test.testDate)}</span>
                        </div>
                      </div>
                      <div style={styles.testResult}>
                        <div style={styles.resultValue}>
                          <span style={{
                            ...styles.valueNumber,
                            color: test.passed ? 'var(--success)' : 'var(--error)'
                          }}>
                            {formatValue(test.value, test.unit)}
                          </span>
                          {test.trend && (
                            <div style={styles.trendBadge}>
                              {getTrendIcon(test.trend)}
                            </div>
                          )}
                        </div>
                        <div style={styles.requirementRow}>
                          <span style={styles.requirementLabel}>Krav:</span>
                          <span style={styles.requirementValue}>
                            {test.lowerIsBetter ? '≤' : '≥'} {formatValue(test.requirement, test.unit)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${Math.min(100, (test.value / test.requirement) * 100)}%`,
                          backgroundColor: test.passed ? 'var(--success)' : 'var(--warning)',
                        }}
                      />
                    </div>
                    <div style={styles.testFooter}>
                      {test.passed ? (
                        <span style={styles.passedBadge}>
                          <CheckCircle size={14} />
                          Bestått
                        </span>
                      ) : (
                        <span style={styles.notPassedBadge}>
                          <Circle size={14} />
                          Ikke bestått
                        </span>
                      )}
                      {test.previousValue !== undefined && (
                        <span style={styles.previousValue}>
                          Forrige: {formatValue(test.previousValue, test.unit)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Error handling */}
      {error && (
        <section style={styles.section}>
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={fetchTestResults} leftIcon={<RefreshCw size={14} />}>
              Prøv igjen
            </Button>
          </div>
        </section>
      )}
    </AppShellTemplate>
  );
};

function getDemoResults(): TestResult[] {
  return [
    {
      id: '1',
      testId: 't1',
      testName: 'Approach 100m',
      testNumber: 12,
      category: 'Approach',
      value: 8.5,
      unit: 'm',
      requirement: 10,
      lowerIsBetter: true,
      testDate: '2025-12-28',
      passed: true,
      trend: 'up',
      previousValue: 9.2,
    },
    {
      id: '2',
      testId: 't2',
      testName: 'Putting 3m',
      testNumber: 21,
      category: 'Putting',
      value: 72,
      unit: '%',
      requirement: 70,
      lowerIsBetter: false,
      testDate: '2025-12-27',
      passed: true,
      trend: 'up',
      previousValue: 68,
    },
    {
      id: '3',
      testId: 't3',
      testName: 'Chipping',
      testNumber: 31,
      category: 'Rundt green',
      value: 4.2,
      unit: 'm',
      requirement: 4,
      lowerIsBetter: true,
      testDate: '2025-12-26',
      passed: false,
      trend: 'down',
      previousValue: 3.8,
    },
    {
      id: '4',
      testId: 't4',
      testName: 'Bunker',
      testNumber: 32,
      category: 'Rundt green',
      value: 5.1,
      unit: 'm',
      requirement: 6,
      lowerIsBetter: true,
      testDate: '2025-12-25',
      passed: true,
      trend: 'stable',
      previousValue: 5.0,
    },
  ];
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--background-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  statValue: {
    display: 'block',
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  searchRow: {
    marginBottom: 'var(--spacing-3)',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)',
  },
  searchInput: {
    width: '100%',
    padding: 'var(--spacing-3) var(--spacing-3) var(--spacing-3) 40px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-card)',
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flexWrap: 'wrap',
  },
  categoryFilters: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sortSelect: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-card)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-3)',
  },
  categoryCount: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 400,
    color: 'var(--text-tertiary)',
  },
  testList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  testCard: {
    padding: 'var(--spacing-1)',
  },
  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-3)',
  },
  testInfo: {
    flex: 1,
  },
  testNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: '4px',
  },
  testNumber: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  testName: {
    margin: 0,
  },
  testMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  testResult: {
    textAlign: 'right',
  },
  resultValue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-2)',
  },
  valueNumber: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
  },
  requirementRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    justifyContent: 'flex-end',
    marginTop: '2px',
  },
  requirementLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  requirementValue: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  progressBar: {
    height: '4px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: 'var(--spacing-3)',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  testFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--success)',
    fontWeight: 500,
  },
  notPassedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  previousValue: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  errorBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'rgba(var(--error-rgb), 0.1)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--error)',
  },
};

export default TestResultsPage;
