import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Info,
  ArrowRight
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';

import { useStrokesGained } from '../../hooks/useStrokesGained';
import { SectionTitle, CardTitle } from '../../components/typography';
import { getStrokesGainedIcon } from '../../constants/icons';

interface StrokesGainedData {
  hasData: boolean;
  isDemo?: boolean;
  total: number;
  trend: number;
  percentile: number;
  byCategory: {
    approach: { value: number; tourAvg: number; pgaElite: number; testCount: number };
    around_green: { value: number; tourAvg: number; pgaElite: number; testCount: number };
    putting: { value: number; tourAvg: number; pgaElite: number; testCount: number };
  };
  recentTests: Array<{ date: string; category: string; sg: number; testName: string }>;
  weeklyTrend: Array<{ week: number; total: number }>;
}

/**
 * PlayerStatsContent - Main statistics overview content
 * Used within StatistikkHub as tab content
 */
const PlayerStatsContent: React.FC = () => {
  const { data, loading, error, refetch } = useStrokesGained();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sgData = data as StrokesGainedData | null;

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

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp size={16} color="var(--success)" />;
    if (trend < 0) return <TrendingDown size={16} color="var(--error)" />;
    return <Activity size={16} color="var(--text-tertiary)" />;
  };

  const getCategoryIcon = (category: string) => {
    return getStrokesGainedIcon(category);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'approach': return 'Approach';
      case 'around_green': return 'Rundt green';
      case 'putting': return 'Putting';
      default: return category;
    }
  };

  if (loading) {
    return (
      <StateCard
        variant="loading"
        title="Laster statistikk..."
        description="Henter dine data"
      />
    );
  }

  if (error && !sgData) {
    return (
      <StateCard
        variant="error"
        title="Kunne ikke laste data"
        description={error}
        action={
          <Button variant="primary" onClick={refetch}>
            Prøv igjen
          </Button>
        }
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Demo banner */}
      {sgData?.isDemo && (
        <div style={styles.demoBanner}>
          <Info size={16} color="var(--info)" />
          <span>Viser demodata. Fullfør tester for å se dine egne resultater.</span>
        </div>
      )}

      {/* Total SG Card */}
      <section style={styles.section}>
        <Card>
          <div style={styles.totalSGCard}>
            <div style={styles.totalSGHeader}>
              <div style={styles.sgIconWrapper}>
                <BarChart3 size={24} color="white" />
              </div>
              <div>
                <CardTitle style={styles.totalSGLabel}>Strokes Gained Total</CardTitle>
                <p style={styles.totalSGSubtext}>Estimert basert på testresultater</p>
              </div>
            </div>
            <div style={styles.totalSGContent}>
              <div style={styles.totalSGValue}>
                <span style={{ ...styles.sgNumber, color: getSGColor(sgData?.total) }}>
                  {formatSG(sgData?.total)}
                </span>
                <div style={styles.trendBadge}>
                  {getTrendIcon(sgData?.trend || 0)}
                  <span style={{
                    color: (sgData?.trend || 0) >= 0 ? 'var(--success)' : 'var(--error)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    {formatSG(sgData?.trend)} siste uke
                  </span>
                </div>
              </div>
              <div style={styles.percentileBox}>
                <span style={styles.percentileValue}>{sgData?.percentile || 0}%</span>
                <span style={styles.percentileLabel}>Percentil</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* SG Breakdown */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Strokes Gained Breakdown</SectionTitle>
        <div style={styles.sgGrid}>
          {sgData?.byCategory && Object.entries(sgData.byCategory).map(([key, cat]) => {
            const Icon = getCategoryIcon(key);
            return (
              <Card key={key}>
                <div
                  style={styles.sgCategoryCard}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                >
                  <div style={styles.sgCategoryHeader}>
                    <div style={styles.sgCategoryIcon}>
                      <Icon size={18} color="var(--accent)" />
                    </div>
                    <span style={styles.sgCategoryLabel}>{getCategoryLabel(key)}</span>
                  </div>
                  <div style={styles.sgCategoryValue}>
                    <span style={{ ...styles.sgCategoryNumber, color: getSGColor(cat.value) }}>
                      {formatSG(cat.value)}
                    </span>
                    <span style={styles.sgCategoryTestCount}>{cat.testCount} tester</span>
                  </div>
                  {selectedCategory === key && (
                    <div style={styles.sgCategoryDetails}>
                      <div style={styles.sgDetailRow}>
                        <span>Tour gjennomsnitt</span>
                        <span>{formatSG(cat.tourAvg)}</span>
                      </div>
                      <div style={styles.sgDetailRow}>
                        <span>PGA Elite</span>
                        <span style={{ color: 'var(--success)' }}>{formatSG(cat.pgaElite)}</span>
                      </div>
                      <div style={styles.sgDetailRow}>
                        <span>Din gap til elite</span>
                        <span style={{ color: getSGColor(cat.value - cat.pgaElite) }}>
                          {formatSG(cat.value - cat.pgaElite)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Recent Tests */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Siste tester</SectionTitle>
        <Card>
          <div style={styles.testList}>
            {sgData?.recentTests?.slice(0, 5).map((test, index) => {
              const Icon = getCategoryIcon(test.category);
              return (
                <div key={index} style={styles.testItem}>
                  <div style={styles.testItemLeft}>
                    <div style={styles.testIcon}>
                      <Icon size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <span style={styles.testName}>{test.testName}</span>
                      <span style={styles.testDate}>{test.date}</span>
                    </div>
                  </div>
                  <span style={{ ...styles.testSG, color: getSGColor(test.sg) }}>
                    {formatSG(test.sg)}
                  </span>
                </div>
              );
            })}
            {(!sgData?.recentTests || sgData.recentTests.length === 0) && (
              <div style={styles.emptyTests}>
                <p>Ingen tester registrert enda</p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Weekly Trend Chart */}
      {sgData?.weeklyTrend && sgData.weeklyTrend.length > 0 && (
        <section style={styles.section}>
          <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Ukentlig utvikling</SectionTitle>
          <Card>
            <div style={styles.trendChart}>
              {sgData.weeklyTrend.map((week) => (
                <div key={week.week} style={styles.trendBar}>
                  <div style={styles.trendBarContainer}>
                    <div
                      style={{
                        ...styles.trendBarFill,
                        height: `${Math.max(20, (week.total + 0.5) * 80)}%`,
                        backgroundColor: week.total >= 0 ? 'var(--success)' : 'var(--error)',
                      }}
                    />
                  </div>
                  <span style={styles.trendBarLabel}>U{week.week}</span>
                  <span style={{ ...styles.trendBarValue, color: getSGColor(week.total) }}>
                    {formatSG(week.total)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  demoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'var(--info-muted)',
    border: '1px solid rgba(2, 132, 199, 0.2)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--spacing-4)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  totalSGCard: {
    padding: 'var(--spacing-2)',
  },
  totalSGHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    marginBottom: 'var(--spacing-4)',
  },
  sgIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, var(--datagolf-accent), var(--datagolf-accent-dark))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalSGLabel: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  totalSGSubtext: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  totalSGContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalSGValue: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  sgNumber: {
    fontSize: '36px',
    fontWeight: 700,
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  percentileBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  percentileValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  percentileLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  sgGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  sgCategoryCard: {
    cursor: 'pointer',
    padding: 'var(--spacing-1)',
  },
  sgCategoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-3)',
  },
  sgCategoryIcon: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sgCategoryLabel: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  sgCategoryValue: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sgCategoryNumber: {
    fontSize: '24px',
    fontWeight: 700,
  },
  sgCategoryTestCount: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  sgCategoryDetails: {
    marginTop: 'var(--spacing-3)',
    paddingTop: 'var(--spacing-3)',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  sgDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  testList: {
    display: 'flex',
    flexDirection: 'column',
  },
  testItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-3) 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  testItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  testIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--background-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testName: {
    display: 'block',
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  testDate: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  testSG: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
  },
  emptyTests: {
    textAlign: 'center',
    padding: 'var(--spacing-6)',
    color: 'var(--text-tertiary)',
  },
  trendChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '150px',
    padding: 'var(--spacing-4)',
  },
  trendBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    flex: 1,
  },
  trendBarContainer: {
    width: '100%',
    maxWidth: '40px',
    height: '80px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 'var(--radius-sm)',
    transition: 'height 0.3s ease',
  },
  trendBarLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  trendBarValue: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
  },
};

export default PlayerStatsContent;
