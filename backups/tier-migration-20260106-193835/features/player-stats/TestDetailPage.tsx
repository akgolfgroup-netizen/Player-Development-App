/**
 * TestDetailPage - Detailed view for a single test
 *
 * Features:
 * - Full test history with interactive chart
 * - Trend analysis and improvement rate
 * - Prediction for reaching target
 * - Coach notes integration
 * - Recommendations
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  Award,
  MessageSquare,
  Zap,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  User,
  Send,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import useTestResults, { TestResult, CoachNote } from '../../hooks/useTestResults';

// ============================================================================
// COMPONENTS
// ============================================================================

interface HistoryChartProps {
  history: TestResult['history'];
  requirement: number;
  targetRequirement?: number;
  lowerIsBetter: boolean;
  unit: string;
}

const HistoryChart: React.FC<HistoryChartProps> = ({
  history,
  requirement,
  targetRequirement,
  lowerIsBetter,
  unit,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (history.length === 0) return null;

    const values = history.map(h => h.value);
    const allValues = [...values, requirement];
    if (targetRequirement) allValues.push(targetRequirement);

    const maxValue = Math.max(...allValues) * 1.1;
    const minValue = Math.min(...allValues) * 0.9;
    const range = maxValue - minValue || 1;

    return {
      values,
      maxValue,
      minValue,
      range,
      getY: (value: number) => 100 - ((value - minValue) / range) * 80 - 10,
      getX: (index: number) => (history.length > 1 ? (index / (history.length - 1)) * 100 : 50),
    };
  }, [history, requirement, targetRequirement]);

  if (!chartData) return null;

  const points = history.map((h, i) =>
    `${chartData.getX(i)},${chartData.getY(h.value)}`
  ).join(' ');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
  };

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

        {/* Current requirement line */}
        <line
          x1="0"
          y1={chartData.getY(requirement)}
          x2="100"
          y2={chartData.getY(requirement)}
          stroke="var(--warning)"
          strokeWidth="0.4"
          strokeDasharray="2,2"
        />

        {/* Target requirement line */}
        {targetRequirement && (
          <line
            x1="0"
            y1={chartData.getY(targetRequirement)}
            x2="100"
            y2={chartData.getY(targetRequirement)}
            stroke="var(--success)"
            strokeWidth="0.4"
            strokeDasharray="3,3"
          />
        )}

        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradient)"
          opacity="0.3"
        />

        {/* Data line */}
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {history.map((h, i) => {
          const x = chartData.getX(i);
          const y = chartData.getY(h.value);
          const isHovered = hoveredPoint === i;

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? '3' : '2'}
                fill="white"
                stroke="var(--accent)"
                strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div
          style={{
            ...styles.tooltip,
            left: `${chartData.getX(hoveredPoint)}%`,
            top: `${chartData.getY(history[hoveredPoint].value) - 15}%`,
          }}
        >
          <span style={styles.tooltipValue}>
            {history[hoveredPoint].value}{unit}
          </span>
          <span style={styles.tooltipDate}>
            {formatDate(history[hoveredPoint].testDate)}
          </span>
        </div>
      )}

      {/* X-axis labels */}
      <div style={styles.xAxis}>
        {history.length <= 8 ? (
          history.map((h, i) => (
            <span key={i} style={styles.xLabel}>
              {formatDate(h.testDate)}
            </span>
          ))
        ) : (
          <>
            <span style={styles.xLabel}>{formatDate(history[0].testDate)}</span>
            <span style={styles.xLabel}>{formatDate(history[Math.floor(history.length / 2)].testDate)}</span>
            <span style={styles.xLabel}>{formatDate(history[history.length - 1].testDate)}</span>
          </>
        )}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendLine, borderStyle: 'dashed', borderColor: 'var(--warning)' }} />
          <span>Krav</span>
        </div>
        {targetRequirement && (
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendLine, borderStyle: 'dashed', borderColor: 'var(--success)' }} />
            <span>Mål</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ icon, label, value, subValue, color }) => (
  <div style={styles.statBox}>
    <div style={{ ...styles.statIcon, color: color || 'var(--accent)' }}>
      {icon}
    </div>
    <div style={styles.statContent}>
      <span style={styles.statLabel}>{label}</span>
      <span style={{ ...styles.statValue, color: color || 'var(--text-primary)' }}>
        {value}
      </span>
      {subValue && <span style={styles.statSubValue}>{subValue}</span>}
    </div>
  </div>
);

interface CoachNoteCardProps {
  note: CoachNote;
}

const CoachNoteCard: React.FC<CoachNoteCardProps> = ({ note }) => {
  const typeStyles: Record<CoachNote['type'], { bg: string; icon: React.ReactNode }> = {
    observation: { bg: 'var(--bg-neutral-subtle)', icon: <MessageSquare size={14} /> },
    recommendation: { bg: 'var(--bg-warning-subtle)', icon: <Lightbulb size={14} /> },
    praise: { bg: 'var(--bg-success-subtle)', icon: <Award size={14} /> },
    focus: { bg: 'var(--bg-accent-subtle)', icon: <Target size={14} /> },
  };

  const style = typeStyles[note.type];

  return (
    <div style={{ ...styles.noteCard, backgroundColor: style.bg }}>
      <div style={styles.noteHeader}>
        <div style={styles.noteAuthor}>
          <div style={styles.noteAvatar}>
            <User size={12} />
          </div>
          <span style={styles.noteCoachName}>{note.coachName}</span>
        </div>
        <span style={styles.noteDate}>
          {new Date(note.createdAt).toLocaleDateString('no-NO', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>
      <p style={styles.noteContent}>{note.content}</p>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TestDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const navigate = useNavigate();

  const { tests, loading, playerCategory, targetCategory } = useTestResults();
  const [newNote, setNewNote] = useState('');

  const test = useMemo(() => {
    return tests.find(t => t.id === testId);
  }, [tests, testId]);

  if (loading) {
    return (
      <StateCard
        variant="loading"
        title="Laster testdetaljer..."
        description="Henter historikk og analyse"
      />
    );
  }

  if (!test) {
    return (
      <StateCard
        variant="empty"
        icon={Target}
        title="Test ikke funnet"
        description="Kunne ikke finne den forespurte testen"
        action={
          <Button onClick={() => navigate('/statistikk?tab=testresultater')}>
            Tilbake til testresultater
          </Button>
        }
      />
    );
  }

  const trendIcon = test.trend === 'improving' ? (
    <TrendingUp size={16} color="var(--success)" />
  ) : test.trend === 'declining' ? (
    <TrendingDown size={16} color="var(--error)" />
  ) : (
    <Minus size={16} color="var(--text-tertiary)" />
  );

  const formatPrediction = (days: number | null): string => {
    if (days === null) return 'Ukjent';
    if (days === 0) return 'Oppnådd!';
    if (days < 7) return `${days} dager`;
    if (days < 30) return `${Math.ceil(days / 7)} uker`;
    return `${Math.ceil(days / 30)} mnd`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/statistikk?tab=testresultater')}
          style={styles.backButton}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={styles.headerContent}>
          <div style={styles.testIcon}>{test.icon}</div>
          <div>
            <h1 style={styles.testName}>{test.name}</h1>
            <p style={styles.testCategory}>{test.category}</p>
          </div>
        </div>
        <Badge
          variant={test.meetsCurrent ? 'success' : 'warning'}
          size="md"
        >
          {test.meetsCurrent ? 'Oppfylt' : 'Under krav'}
        </Badge>
      </div>

      {/* Current Value Hero */}
      <Card variant="elevated" padding="spacious" style={styles.heroCard}>
        <div style={styles.heroContent}>
          <div style={styles.currentValueSection}>
            <span style={styles.currentLabel}>Nåværende</span>
            <span style={{
              ...styles.currentValue,
              color: test.meetsCurrent ? 'var(--success)' : 'var(--warning)',
            }}>
              {test.currentValue}{test.unit}
            </span>
            <div style={styles.trendBadge}>
              {trendIcon}
              <span style={{
                color: test.trend === 'improving' ? 'var(--success)' :
                  test.trend === 'declining' ? 'var(--error)' : 'var(--text-tertiary)',
              }}>
                {test.trendPercent > 0 ? `${test.trendPercent.toFixed(1)}%` : 'Stabil'}
              </span>
            </div>
          </div>

          <div style={styles.heroSeparator} />

          <div style={styles.requirementSection}>
            <div style={styles.reqItem}>
              <span style={styles.reqLabel}>Krav (Kat. {playerCategory})</span>
              <span style={styles.reqValue}>
                {test.lowerIsBetter ? '≤' : '≥'} {test.requirement}{test.unit}
              </span>
            </div>
            {test.targetRequirement && (
              <div style={styles.reqItem}>
                <span style={styles.reqLabel}>Mål (Kat. {targetCategory})</span>
                <span style={styles.reqValue}>
                  {test.lowerIsBetter ? '≤' : '≥'} {test.targetRequirement}{test.unit}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* History Chart */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Historikk</SectionTitle>
        <Card padding="md">
          <HistoryChart
            history={test.history}
            requirement={test.requirement}
            targetRequirement={test.targetRequirement}
            lowerIsBetter={test.lowerIsBetter}
            unit={test.unit}
          />
        </Card>
      </section>

      {/* Stats Grid */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Statistikk</SectionTitle>
        <div style={styles.statsGrid}>
          <Card padding="md">
            <StatBox
              icon={<Target size={18} />}
              label="Beste resultat"
              value={`${test.bestValue}${test.unit}`}
              color="var(--success)"
            />
          </Card>
          <Card padding="md">
            <StatBox
              icon={<Calendar size={18} />}
              label="Antall tester"
              value={test.testCount.toString()}
              subValue="totalt"
            />
          </Card>
          <Card padding="md">
            <StatBox
              icon={<Zap size={18} />}
              label="Forbedring/uke"
              value={`${test.improvementRate > 0 ? '+' : ''}${test.improvementRate}${test.unit}`}
              color={test.improvementRate > 0 ? 'var(--success)' : 'var(--text-tertiary)'}
            />
          </Card>
          <Card padding="md">
            <StatBox
              icon={<Clock size={18} />}
              label="Tid til mål"
              value={formatPrediction(test.predictedDaysToTarget)}
              color={test.predictedDaysToTarget === 0 ? 'var(--success)' : 'var(--accent)'}
            />
          </Card>
        </div>
      </section>

      {/* Progress to Target */}
      {test.targetRequirement && (
        <section style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>Progresjon mot mål</SectionTitle>
          <Card padding="md">
            <div style={styles.progressContent}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>
                  Fra {test.lowerIsBetter ? 'over' : 'under'} krav til kategori {targetCategory}
                </span>
                <span style={styles.progressPercent}>
                  {Math.min(100, Math.round(
                    test.lowerIsBetter
                      ? (test.targetRequirement / test.currentValue) * 100
                      : (test.currentValue / test.targetRequirement) * 100
                  ))}%
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.min(100, Math.round(
                      test.lowerIsBetter
                        ? (test.targetRequirement / test.currentValue) * 100
                        : (test.currentValue / test.targetRequirement) * 100
                    ))}%`,
                  }}
                />
              </div>
              <div style={styles.progressMarkers}>
                <span>{test.history[0]?.value ?? '-'}{test.unit}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {test.currentValue}{test.unit}
                </span>
                <span>{test.targetRequirement}{test.unit}</span>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Recommendations */}
      {test.recommendations.length > 0 && (
        <section style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>Anbefalinger</SectionTitle>
          <Card padding="md">
            <div style={styles.recommendationsList}>
              {test.recommendations.map((rec, i) => (
                <div key={i} style={styles.recommendationItem}>
                  <Lightbulb size={16} color="var(--warning)" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Coach Notes */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={styles.sectionTitle}>Trenernotater</SectionTitle>
          <Badge variant="accent" size="sm">{test.coachNotes.length}</Badge>
        </div>

        {test.coachNotes.length > 0 ? (
          <div style={styles.notesList}>
            {test.coachNotes.map(note => (
              <CoachNoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <Card padding="md">
            <div style={styles.emptyNotes}>
              <MessageSquare size={24} color="var(--text-tertiary)" />
              <p>Ingen trenernotater ennå</p>
            </div>
          </Card>
        )}

        {/* Add note (coach view) */}
        <Card padding="md" style={{ marginTop: 'var(--spacing-3)' }}>
          <div style={styles.addNoteForm}>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Skriv en kommentar til spilleren..."
              style={styles.noteInput}
              rows={2}
            />
            <Button
              variant="primary"
              size="sm"
              disabled={!newNote.trim()}
              style={styles.sendButton}
            >
              <Send size={14} />
              Send
            </Button>
          </div>
        </Card>
      </section>

      {/* Quick Actions */}
      <div style={styles.actions}>
        <Button
          variant="secondary"
          onClick={() => navigate(`/testing/registrer?testId=${test.id}`)}
        >
          <Target size={16} />
          Registrer ny test
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/statistikk?tab=testresultater')}
        >
          Tilbake til oversikt
        </Button>
      </div>
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
    gap: 'var(--spacing-5)',
    padding: 'var(--spacing-4)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    backgroundColor: 'var(--background-surface)',
    cursor: 'pointer',
    color: 'var(--text-primary)',
  },
  headerContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  testIcon: {
    fontSize: '32px',
  },
  testName: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  testCategory: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
    textTransform: 'capitalize',
  },
  heroCard: {
    background: 'linear-gradient(135deg, var(--background-white) 0%, var(--background-surface) 100%)',
  },
  heroContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-6)',
  },
  currentValueSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  currentLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  currentValue: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    marginTop: 'var(--spacing-2)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
  },
  heroSeparator: {
    width: '1px',
    height: '80px',
    backgroundColor: 'var(--border-subtle)',
  },
  requirementSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
    flex: 1,
  },
  reqItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  reqLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  reqValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  sectionTitle: {
    margin: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  chartContainer: {
    position: 'relative',
    height: '200px',
    paddingBottom: 'var(--spacing-6)',
  },
  chart: {
    width: '100%',
    height: '160px',
  },
  tooltip: {
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    backgroundColor: 'var(--background-elevated)',
    padding: 'var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 10,
  },
  tooltipValue: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  tooltipDate: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  xLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  legend: {
    position: 'absolute',
    top: 'var(--spacing-2)',
    right: 'var(--spacing-2)',
    display: 'flex',
    gap: 'var(--spacing-3)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  legendLine: {
    width: '16px',
    height: 0,
    borderTop: '2px dashed',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
  },
  statBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
  statIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-surface)',
    flexShrink: 0,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  statValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
  },
  statSubValue: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  progressContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  progressPercent: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--accent)',
  },
  progressTrack: {
    height: '12px',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent) 0%, var(--success) 100%)',
    borderRadius: '6px',
    transition: 'width 0.3s ease',
  },
  progressMarkers: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  recommendationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  noteCard: {
    padding: 'var(--spacing-4)',
    borderRadius: 'var(--radius-md)',
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-2)',
  },
  noteAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  noteAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteCoachName: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  noteDate: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  noteContent: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.5,
  },
  emptyNotes: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-4)',
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-footnote)',
  },
  addNoteForm: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    alignItems: 'flex-end',
  },
  noteInput: {
    flex: 1,
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    fontSize: 'var(--font-size-body)',
    resize: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  actions: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    paddingTop: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
  },
};

export default TestDetailPage;
