import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  ChevronRight,
  RefreshCw,
  Info,
  ArrowRight,
  Trophy,
  Download
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { ExportButton } from '../../components/common/ExportButton';

import { useStrokesGained } from '../../hooks/useStrokesGained';
import { useScreenView } from '../../analytics/useScreenView';
import { useAuth } from '../../contexts/AuthContext';
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

const PlayerStatsPage: React.FC = () => {
  useScreenView('Statistikk');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useStrokesGained();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const playerId = user?.playerId || user?.id;

  const sgData = data as StrokesGainedData | null;

  const formatSG = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    if (value > 0) return `+${value.toFixed(2)}`;
    return value.toFixed(2);
  };

  const getSGColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'var(--text-tertiary)';
    if (value > 0) return 'var(--status-success)';
    if (value < 0) return 'var(--status-error)';
    return 'var(--text-secondary)';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp size={16} color="var(--status-success)" />;
    if (trend < 0) return <TrendingDown size={16} color="var(--status-error)" />;
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
      <AppShellTemplate
        title="Statistikk"
        subtitle="Din spillstatistikk"
        
      >
        <section style={styles.section}>
          <StateCard
            variant="loading"
            title="Laster statistikk..."
            description="Henter dine data"
          />
        </section>
      </AppShellTemplate>
    );
  }

  if (error && !sgData) {
    return (
      <AppShellTemplate
        title="Statistikk"
        subtitle="Din spillstatistikk"
        
      >
        <section style={styles.section}>
          <StateCard
            variant="error"
            title="Kunne ikke laste data"
            description={error}
            action={
              <Button variant="primary" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
                Prøv igjen
              </Button>
            }
          />
        </section>
      </AppShellTemplate>
    );
  }

  return (
    <AppShellTemplate
      title="Statistikk"
      subtitle="Din spillstatistikk og Strokes Gained"
      
    >
      {/* Demo banner */}
      {sgData?.isDemo && (
        <div style={styles.demoBanner}>
          <Info size={16} color="var(--info)" />
          <span>Viser demodata. Fullfør tester for å se dine egne resultater.</span>
        </div>
      )}

      {/* Export Actions */}
      {playerId && !sgData?.isDemo && (
        <div style={styles.exportRow}>
          <ExportButton
            type="statistics"
            playerId={playerId}
            variant="ghost"
            size="sm"
            label="Eksporter statistikk"
          />
          <ExportButton
            type="testResults"
            playerId={playerId}
            variant="ghost"
            size="sm"
            label="Eksporter testresultater"
          />
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
                    color: (sgData?.trend || 0) >= 0 ? 'var(--status-success)' : 'var(--status-error)',
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
                        <span style={{ color: 'var(--status-success)' }}>{formatSG(cat.pgaElite)}</span>
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
        <div style={styles.sectionHeader}>
          <SectionTitle>Siste tester</SectionTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/statistikk/testresultater')}
            rightIcon={<ArrowRight size={14} />}
          >
            Se alle
          </Button>
        </div>
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
                <Button size="sm" onClick={() => navigate('/testing/registrer')}>
                  Registrer test
                </Button>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Quick Links */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Utforsk mer</SectionTitle>
        <div style={styles.quickLinks}>
          <Card>
            <div
              style={styles.quickLink}
              onClick={() => navigate('/statistikk/strokes-gained')}
            >
              <div style={styles.quickLinkIcon}>
                <BarChart3 size={20} color="var(--accent)" />
              </div>
              <div style={styles.quickLinkText}>
                <span style={styles.quickLinkTitle}>Strokes Gained Detaljer</span>
                <span style={styles.quickLinkDesc}>Dypere analyse og sammenligning</span>
              </div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </div>
          </Card>
          <Card>
            <div
              style={styles.quickLink}
              onClick={() => navigate('/statistikk/testresultater')}
            >
              <div style={styles.quickLinkIcon}>
                <Target size={20} color="var(--accent)" />
              </div>
              <div style={styles.quickLinkText}>
                <span style={styles.quickLinkTitle}>Alle testresultater</span>
                <span style={styles.quickLinkDesc}>Fullstendig historikk</span>
              </div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </div>
          </Card>
          <Card variant="elevated">
            <div
              style={styles.quickLink}
              onClick={() => navigate('/statistikk/benchmark')}
            >
              <div style={{ ...styles.quickLinkIcon, background: 'linear-gradient(135deg, var(--accent), var(--status-success))' }}>
                <Trophy size={20} color="white" />
              </div>
              <div style={styles.quickLinkText}>
                <span style={styles.quickLinkTitle}>Benchmark vs. Elite</span>
                <span style={styles.quickLinkDesc}>Sammenlign med PGA & WAGR</span>
              </div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </div>
          </Card>
        </div>
      </section>
    </AppShellTemplate>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-3)',
  },
  exportRow: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
    justifyContent: 'flex-end',
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
    backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  quickLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    cursor: 'pointer',
    padding: 'var(--spacing-1)',
  },
  quickLinkIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  quickLinkTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  quickLinkDesc: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
  },
};

export default PlayerStatsPage;
