import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Crosshair,
  CircleDot,
  Flag,
  Activity,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';

import { useStrokesGained } from '../../hooks/useStrokesGained';
import { useScreenView } from '../../analytics/useScreenView';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

interface CategoryData {
  value: number;
  tourAvg: number;
  pgaElite: number;
  testCount: number;
}

interface StrokesGainedData {
  hasData: boolean;
  isDemo?: boolean;
  total: number;
  trend: number;
  percentile: number;
  byCategory: {
    approach: CategoryData;
    around_green: CategoryData;
    putting: CategoryData;
  };
  recentTests: Array<{ date: string; category: string; sg: number; testName: string }>;
  weeklyTrend: Array<{ week: number; total: number }>;
}

const StrokesGainedPage: React.FC = () => {
  useScreenView('Strokes Gained');
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useStrokesGained();
  const [selectedTour, setSelectedTour] = useState<'pga' | 'euro' | 'kft'>('pga');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['approach', 'around_green', 'putting']));

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
    if (trend > 0) return <TrendingUp size={14} color="var(--success)" />;
    if (trend < 0) return <TrendingDown size={14} color="var(--error)" />;
    return <Activity size={14} color="var(--text-tertiary)" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'approach': return Crosshair;
      case 'around_green': return Flag;
      case 'putting': return CircleDot;
      default: return Target;
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'approach':
        return {
          label: 'Innspill',
          description: 'Slag fra fairway/rough inn mot green (50-200m)',
          tips: ['Fokuser på presisjon fremfor distanse', 'Tren på ulike avstander', 'Jobb med lie-variasjon']
        };
      case 'around_green':
        return {
          label: 'Rundt Green',
          description: 'Chipping, pitching og bunkerslag innenfor 50m',
          tips: ['Utvikle varierte slag', 'Prioriter oppslagsøvelser', 'Tren på ulike underlag']
        };
      case 'putting':
        return {
          label: 'Putting',
          description: 'Alle slag på green',
          tips: ['Jobb med avstander 1-3m', 'Tren på lange putter for lagkontroll', 'Fokuser på lesing av green']
        };
      default:
        return { label: category, description: '', tips: [] };
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const calculateProgress = (current: number, elite: number) => {
    if (elite <= 0) return 0;
    const progress = ((current + 1) / (elite + 1)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return (
      <AppShellTemplate
        title="Strokes Gained"
        subtitle="Detaljert analyse"
        
      >
        <section style={styles.section}>
          <StateCard
            variant="loading"
            title="Laster Strokes Gained..."
            description="Beregner dine data"
          />
        </section>
      </AppShellTemplate>
    );
  }

  if (error && !sgData) {
    return (
      <AppShellTemplate
        title="Strokes Gained"
        subtitle="Detaljert analyse"
        
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
      title="Strokes Gained"
      subtitle="Detaljert analyse og sammenligning"
      
    >
      {/* Info Banner */}
      <section style={styles.section}>
        <div style={styles.infoBanner}>
          <Info size={18} color="var(--datagolf-accent)" />
          <div style={{ flex: 1 }}>
            <p style={styles.infoText}>
              <strong>Strokes Gained</strong> måler hvor mange slag du tjener eller taper sammenlignet med en referansespiller.
              Positive verdier = bedre enn gjennomsnitt.
            </p>
          </div>
        </div>
      </section>

      {/* Tour Selection */}
      <section style={styles.section}>
        <div style={styles.tourSelection}>
          <span style={styles.tourLabel}>Sammenlign med:</span>
          <div style={styles.tourButtons}>
            {(['pga', 'euro', 'kft'] as const).map(tour => (
              <button
                key={tour}
                onClick={() => setSelectedTour(tour)}
                style={{
                  ...styles.tourButton,
                  backgroundColor: selectedTour === tour ? 'var(--datagolf-accent)' : 'var(--background-surface)',
                  color: selectedTour === tour ? 'white' : 'var(--text-secondary)',
                }}
              >
                {tour.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Total Overview */}
      <section style={styles.section}>
        <Card>
          <div style={styles.totalCard}>
            <div style={styles.totalHeader}>
              <div style={styles.totalIcon}>
                <BarChart3 size={24} color="white" />
              </div>
              <div>
                <CardTitle style={styles.totalTitle}>Strokes Gained Total</CardTitle>
                <p style={styles.totalSubtitle}>
                  Basert på {sgData?.byCategory ?
                    Object.values(sgData.byCategory).reduce((sum, cat) => sum + cat.testCount, 0) : 0} tester
                </p>
              </div>
            </div>
            <div style={styles.totalContent}>
              <div style={styles.totalValue}>
                <span style={{ ...styles.totalNumber, color: getSGColor(sgData?.total) }}>
                  {formatSG(sgData?.total)}
                </span>
                <div style={styles.totalTrend}>
                  {getTrendIcon(sgData?.trend || 0)}
                  <span style={{ color: (sgData?.trend || 0) >= 0 ? 'var(--success)' : 'var(--error)' }}>
                    {formatSG(sgData?.trend)} fra forrige
                  </span>
                </div>
              </div>
              <div style={styles.percentileSection}>
                <div style={styles.percentileCircle}>
                  <span style={styles.percentileValue}>{sgData?.percentile || 0}</span>
                  <span style={styles.percentileUnit}>%</span>
                </div>
                <span style={styles.percentileLabel}>
                  Du er bedre enn {sgData?.percentile || 0}% av spillere på ditt nivå
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Category Breakdown */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Kategori-analyse</SectionTitle>
        <div style={styles.categoryList}>
          {sgData?.byCategory && Object.entries(sgData.byCategory).map(([key, cat]) => {
            const Icon = getCategoryIcon(key);
            const info = getCategoryInfo(key);
            const isExpanded = expandedCategories.has(key);
            const progress = calculateProgress(cat.value, cat.pgaElite);

            return (
              <Card key={key}>
                <div style={styles.categoryCard}>
                  <div
                    style={styles.categoryHeader}
                    onClick={() => toggleCategory(key)}
                  >
                    <div style={styles.categoryLeft}>
                      <div style={styles.categoryIcon}>
                        <Icon size={20} color="var(--accent)" />
                      </div>
                      <div>
                        <SubSectionTitle style={styles.categoryTitle}>{info.label}</SubSectionTitle>
                        <p style={styles.categoryDesc}>{info.description}</p>
                      </div>
                    </div>
                    <div style={styles.categoryRight}>
                      <span style={{ ...styles.categoryValue, color: getSGColor(cat.value) }}>
                        {formatSG(cat.value)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={20} color="var(--text-tertiary)" />
                      ) : (
                        <ChevronDown size={20} color="var(--text-tertiary)" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.categoryExpanded}>
                      {/* Progress bar */}
                      <div style={styles.progressSection}>
                        <div style={styles.progressLabels}>
                          <span>Din verdi</span>
                          <span>PGA Elite ({formatSG(cat.pgaElite)})</span>
                        </div>
                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${progress}%`,
                              backgroundColor: getSGColor(cat.value),
                            }}
                          />
                          <div style={styles.progressMarker} />
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div style={styles.statsGrid}>
                        <div style={styles.statItem}>
                          <span style={styles.statLabel}>Din SG</span>
                          <span style={{ ...styles.statValue, color: getSGColor(cat.value) }}>
                            {formatSG(cat.value)}
                          </span>
                        </div>
                        <div style={styles.statItem}>
                          <span style={styles.statLabel}>Tour Avg</span>
                          <span style={styles.statValue}>{formatSG(cat.tourAvg)}</span>
                        </div>
                        <div style={styles.statItem}>
                          <span style={styles.statLabel}>PGA Elite</span>
                          <span style={{ ...styles.statValue, color: 'var(--success)' }}>
                            {formatSG(cat.pgaElite)}
                          </span>
                        </div>
                        <div style={styles.statItem}>
                          <span style={styles.statLabel}>Gap til Elite</span>
                          <span style={{ ...styles.statValue, color: getSGColor(cat.value - cat.pgaElite) }}>
                            {formatSG(cat.value - cat.pgaElite)}
                          </span>
                        </div>
                      </div>

                      {/* Tips */}
                      <div style={styles.tipsSection}>
                        <CardTitle style={styles.tipsTitle}>Tips for forbedring</CardTitle>
                        <ul style={styles.tipsList}>
                          {info.tips.map((tip, i) => (
                            <li key={i} style={styles.tipItem}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Test count */}
                      <div style={styles.testCountBadge}>
                        <Target size={14} color="var(--text-tertiary)" />
                        <span>{cat.testCount} tester registrert</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Weekly Trend */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Ukentlig utvikling</SectionTitle>
        <Card>
          <div style={styles.trendChart}>
            {sgData?.weeklyTrend?.map((week, index) => (
              <div key={week.week} style={styles.trendBar}>
                <div style={styles.trendBarFill}>
                  <div
                    style={{
                      ...styles.trendBarInner,
                      height: `${Math.max(20, (week.total + 0.5) * 100)}%`,
                      backgroundColor: week.total >= 0 ? 'var(--success)' : 'var(--error)',
                    }}
                  />
                </div>
                <span style={styles.trendBarLabel}>Uke {week.week}</span>
                <span style={{ ...styles.trendBarValue, color: getSGColor(week.total) }}>
                  {formatSG(week.total)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Demo notice */}
      {sgData?.isDemo && (
        <div style={styles.demoNotice}>
          <Info size={16} color="var(--info)" />
          <span>Viser demodata. Fullfør flere tester for å se dine egne resultater.</span>
        </div>
      )}
    </AppShellTemplate>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  infoText: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: 1.5,
  },
  tourSelection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  tourLabel: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  tourButtons: {
    display: 'flex',
    gap: 'var(--spacing-2)',
  },
  tourButton: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  totalCard: {
    padding: 'var(--spacing-2)',
  },
  totalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    marginBottom: 'var(--spacing-4)',
  },
  totalIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, var(--datagolf-accent), var(--datagolf-accent-dark))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  totalSubtitle: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  totalContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 'var(--spacing-4)',
  },
  totalValue: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  totalNumber: {
    fontSize: '36px',
    fontWeight: 700,
  },
  totalTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-footnote)',
  },
  percentileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  percentileCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'var(--background-surface)',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingTop: '20px',
  },
  percentileValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  percentileUnit: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
  },
  percentileLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
    maxWidth: '150px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  categoryCard: {
    padding: 'var(--spacing-1)',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 'var(--spacing-2)',
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  categoryIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    margin: 0,
  },
  categoryDesc: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  categoryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  categoryValue: {
    fontSize: '24px',
    fontWeight: 700,
  },
  categoryExpanded: {
    paddingTop: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
    marginTop: 'var(--spacing-3)',
  },
  progressSection: {
    marginBottom: 'var(--spacing-4)',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    marginBottom: 'var(--spacing-2)',
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressMarker: {
    position: 'absolute',
    right: '0',
    top: '-2px',
    width: '2px',
    height: '12px',
    backgroundColor: 'var(--success)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
    marginBottom: 'var(--spacing-4)',
  },
  statItem: {
    backgroundColor: 'var(--background-surface)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    marginBottom: '2px',
  },
  statValue: {
    display: 'block',
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  tipsSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 'var(--spacing-3)',
  },
  tipsTitle: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: '0 0 var(--spacing-2) 0',
  },
  tipsList: {
    margin: 0,
    paddingLeft: 'var(--spacing-4)',
  },
  tipItem: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--spacing-1)',
  },
  testCountBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
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
  trendBarFill: {
    width: '100%',
    maxWidth: '40px',
    height: '80px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  trendBarInner: {
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
  demoNotice: {
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
};

export default StrokesGainedPage;
