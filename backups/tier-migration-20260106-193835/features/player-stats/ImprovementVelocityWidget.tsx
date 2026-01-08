/**
 * ImprovementVelocityWidget - Track improvement rate and predict goal achievement
 *
 * Features:
 * - Improvement rate per week/month
 * - Velocity trend (accelerating/decelerating)
 * - Goal prediction with confidence
 * - Historical velocity chart
 */

import React, { useMemo } from 'react';
import {
  Zap,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import useTestResults, { TestResult } from '../../hooks/useTestResults';

// ============================================================================
// TYPES
// ============================================================================

interface VelocityData {
  test: TestResult;
  weeklyRate: number;
  monthlyRate: number;
  velocityTrend: 'accelerating' | 'decelerating' | 'stable';
  predictedDate: Date | null;
  confidence: 'high' | 'medium' | 'low';
  weeksToGoal: number | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateVelocityData(test: TestResult): VelocityData {
  const history = test.history;
  if (history.length < 2) {
    return {
      test,
      weeklyRate: 0,
      monthlyRate: 0,
      velocityTrend: 'stable',
      predictedDate: null,
      confidence: 'low',
      weeksToGoal: null,
    };
  }

  // Calculate weekly rate from overall improvement
  const firstValue = history[0].value;
  const lastValue = history[history.length - 1].value;
  const firstDate = new Date(history[0].testDate);
  const lastDate = new Date(history[history.length - 1].testDate);
  const weeksSpan = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

  const totalChange = test.lowerIsBetter ? firstValue - lastValue : lastValue - firstValue;
  const weeklyRate = totalChange / weeksSpan;
  const monthlyRate = weeklyRate * 4.33;

  // Calculate velocity trend (compare recent rate to older rate)
  let velocityTrend: 'accelerating' | 'decelerating' | 'stable' = 'stable';
  if (history.length >= 4) {
    const midPoint = Math.floor(history.length / 2);
    const firstHalf = history.slice(0, midPoint);
    const secondHalf = history.slice(midPoint);

    const firstHalfChange = test.lowerIsBetter
      ? firstHalf[0].value - firstHalf[firstHalf.length - 1].value
      : firstHalf[firstHalf.length - 1].value - firstHalf[0].value;

    const secondHalfChange = test.lowerIsBetter
      ? secondHalf[0].value - secondHalf[secondHalf.length - 1].value
      : secondHalf[secondHalf.length - 1].value - secondHalf[0].value;

    const firstHalfWeeks = Math.max(1, (new Date(firstHalf[firstHalf.length - 1].testDate).getTime() - new Date(firstHalf[0].testDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const secondHalfWeeks = Math.max(1, (new Date(secondHalf[secondHalf.length - 1].testDate).getTime() - new Date(secondHalf[0].testDate).getTime()) / (7 * 24 * 60 * 60 * 1000));

    const firstHalfRate = firstHalfChange / firstHalfWeeks;
    const secondHalfRate = secondHalfChange / secondHalfWeeks;

    if (secondHalfRate > firstHalfRate * 1.2) {
      velocityTrend = 'accelerating';
    } else if (secondHalfRate < firstHalfRate * 0.8) {
      velocityTrend = 'decelerating';
    }
  }

  // Calculate prediction
  let predictedDate: Date | null = null;
  let weeksToGoal: number | null = null;
  let confidence: 'high' | 'medium' | 'low' = 'low';

  const target = test.targetRequirement ?? test.requirement;
  const remaining = test.lowerIsBetter
    ? test.currentValue - target
    : target - test.currentValue;

  if (remaining <= 0) {
    // Already achieved
    predictedDate = new Date();
    weeksToGoal = 0;
    confidence = 'high';
  } else if (weeklyRate > 0) {
    weeksToGoal = remaining / weeklyRate;
    predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + Math.ceil(weeksToGoal * 7));

    // Determine confidence based on data quality
    if (history.length >= 6 && velocityTrend !== 'decelerating') {
      confidence = 'high';
    } else if (history.length >= 3) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }
  }

  return {
    test,
    weeklyRate: parseFloat(weeklyRate.toFixed(3)),
    monthlyRate: parseFloat(monthlyRate.toFixed(2)),
    velocityTrend,
    predictedDate,
    confidence,
    weeksToGoal: weeksToGoal ? parseFloat(weeksToGoal.toFixed(1)) : null,
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface VelocityCardProps {
  data: VelocityData;
  onViewDetails?: () => void;
}

const VelocityCard: React.FC<VelocityCardProps> = ({ data, onViewDetails }) => {
  const { test, weeklyRate, monthlyRate, velocityTrend, predictedDate, confidence, weeksToGoal } = data;

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Ukjent';
    if (weeksToGoal === 0) return 'Oppnådd!';
    return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTimeRemaining = (): string => {
    if (weeksToGoal === null) return 'Beregner...';
    if (weeksToGoal === 0) return 'Fullført!';
    if (weeksToGoal < 1) return `${Math.ceil(weeksToGoal * 7)} dager`;
    if (weeksToGoal < 4) return `${Math.ceil(weeksToGoal)} uker`;
    if (weeksToGoal < 52) return `${Math.ceil(weeksToGoal / 4.33)} måneder`;
    return `${(weeksToGoal / 52).toFixed(1)} år`;
  };

  const trendIcon = velocityTrend === 'accelerating' ? (
    <TrendingUp size={14} color="var(--success)" />
  ) : velocityTrend === 'decelerating' ? (
    <TrendingDown size={14} color="var(--warning)" />
  ) : (
    <Minus size={14} color="var(--text-tertiary)" />
  );

  const confidenceColors = {
    high: 'var(--success)',
    medium: 'var(--warning)',
    low: 'var(--text-tertiary)',
  };

  return (
    <Card padding="md" style={styles.velocityCard}>
      <div style={styles.cardHeader}>
        <div style={styles.testInfo}>
          <span style={styles.testIcon}>{test.icon}</span>
          <div>
            <span style={styles.testName}>{test.name}</span>
            <Badge
              variant={test.meetsCurrent ? 'success' : 'warning'}
              size="sm"
            >
              {test.meetsCurrent ? 'Oppfylt' : `${Math.abs(test.currentValue - test.requirement).toFixed(1)}${test.unit} igjen`}
            </Badge>
          </div>
        </div>
        <button onClick={onViewDetails} style={styles.viewButton}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={styles.metricsGrid}>
        {/* Weekly Rate */}
        <div style={styles.metric}>
          <div style={styles.metricHeader}>
            <Zap size={14} color="var(--accent)" />
            <span style={styles.metricLabel}>Per uke</span>
          </div>
          <span style={{
            ...styles.metricValue,
            color: weeklyRate > 0 ? 'var(--success)' : weeklyRate < 0 ? 'var(--error)' : 'var(--text-tertiary)',
          }}>
            {weeklyRate > 0 ? '+' : ''}{weeklyRate}{test.unit}
          </span>
        </div>

        {/* Velocity Trend */}
        <div style={styles.metric}>
          <div style={styles.metricHeader}>
            {trendIcon}
            <span style={styles.metricLabel}>Trend</span>
          </div>
          <span style={styles.metricValue}>
            {velocityTrend === 'accelerating' ? 'Økende' :
              velocityTrend === 'decelerating' ? 'Avtagende' : 'Stabil'}
          </span>
        </div>

        {/* Time to Goal */}
        <div style={styles.metric}>
          <div style={styles.metricHeader}>
            <Clock size={14} color="var(--accent)" />
            <span style={styles.metricLabel}>Tid til mål</span>
          </div>
          <span style={{
            ...styles.metricValue,
            color: weeksToGoal === 0 ? 'var(--success)' : 'var(--text-primary)',
          }}>
            {formatTimeRemaining()}
          </span>
        </div>

        {/* Confidence */}
        <div style={styles.metric}>
          <div style={styles.metricHeader}>
            <Target size={14} color={confidenceColors[confidence]} />
            <span style={styles.metricLabel}>Sikkerhet</span>
          </div>
          <span style={{ ...styles.metricValue, color: confidenceColors[confidence] }}>
            {confidence === 'high' ? 'Høy' : confidence === 'medium' ? 'Medium' : 'Lav'}
          </span>
        </div>
      </div>

      {/* Prediction */}
      {predictedDate && weeksToGoal !== 0 && (
        <div style={styles.prediction}>
          <Calendar size={14} color="var(--text-secondary)" />
          <span>Forventet måloppnåelse: <strong>{formatDate(predictedDate)}</strong></span>
        </div>
      )}

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${Math.min(100, test.lowerIsBetter
                ? (test.requirement / test.currentValue) * 100
                : (test.currentValue / test.requirement) * 100)}%`,
              backgroundColor: test.meetsCurrent ? 'var(--success)' : 'var(--accent)',
            }}
          />
        </div>
        <div style={styles.progressLabels}>
          <span>{test.currentValue}{test.unit}</span>
          <span>{test.lowerIsBetter ? '≤' : '≥'} {test.requirement}{test.unit}</span>
        </div>
      </div>
    </Card>
  );
};

interface SummaryStatsProps {
  velocityData: VelocityData[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ velocityData }) => {
  const stats = useMemo(() => {
    const improving = velocityData.filter(d => d.weeklyRate > 0);
    const declining = velocityData.filter(d => d.weeklyRate < 0);
    const accelerating = velocityData.filter(d => d.velocityTrend === 'accelerating');

    const avgWeeksToGoal = velocityData
      .filter(d => d.weeksToGoal !== null && d.weeksToGoal > 0)
      .reduce((sum, d) => sum + (d.weeksToGoal || 0), 0) / velocityData.filter(d => d.weeksToGoal !== null && d.weeksToGoal > 0).length || 0;

    const closestToGoal = velocityData
      .filter(d => !d.test.meetsCurrent && d.weeksToGoal !== null)
      .sort((a, b) => (a.weeksToGoal || Infinity) - (b.weeksToGoal || Infinity))[0];

    return {
      improving: improving.length,
      declining: declining.length,
      accelerating: accelerating.length,
      avgWeeksToGoal: Math.round(avgWeeksToGoal),
      closestToGoal,
    };
  }, [velocityData]);

  return (
    <Card variant="elevated" padding="spacious" style={styles.summaryCard}>
      <div style={styles.summaryGrid}>
        <div style={styles.summaryStat}>
          <div style={{ ...styles.summaryIcon, backgroundColor: 'var(--bg-success-subtle)' }}>
            <TrendingUp size={20} color="var(--success)" />
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryValue}>{stats.improving}</span>
            <span style={styles.summaryLabel}>Forbedrer seg</span>
          </div>
        </div>

        <div style={styles.summaryStat}>
          <div style={{ ...styles.summaryIcon, backgroundColor: 'var(--bg-accent-subtle)' }}>
            <Zap size={20} color="var(--accent)" />
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryValue}>{stats.accelerating}</span>
            <span style={styles.summaryLabel}>Akselererer</span>
          </div>
        </div>

        <div style={styles.summaryStat}>
          <div style={{ ...styles.summaryIcon, backgroundColor: 'var(--bg-warning-subtle)' }}>
            <Clock size={20} color="var(--warning)" />
          </div>
          <div style={styles.summaryContent}>
            <span style={styles.summaryValue}>{stats.avgWeeksToGoal || '-'}</span>
            <span style={styles.summaryLabel}>Gj.snitt uker til mål</span>
          </div>
        </div>

        {stats.closestToGoal && (
          <div style={styles.summaryStat}>
            <div style={{ ...styles.summaryIcon, backgroundColor: 'var(--bg-success-subtle)' }}>
              <Award size={20} color="var(--success)" />
            </div>
            <div style={styles.summaryContent}>
              <span style={styles.summaryValue}>{stats.closestToGoal.test.icon}</span>
              <span style={styles.summaryLabel}>Nærmest mål</span>
            </div>
          </div>
        )}
      </div>

      {stats.declining > 0 && (
        <div style={styles.warningBanner}>
          <AlertTriangle size={16} color="var(--warning)" />
          <span>{stats.declining} test{stats.declining > 1 ? 'er' : ''} viser nedgang. Vurder å justere treningsplanen.</span>
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ImprovementVelocityWidgetProps {
  onViewTestDetails?: (testId: string) => void;
}

const ImprovementVelocityWidget: React.FC<ImprovementVelocityWidgetProps> = ({
  onViewTestDetails,
}) => {
  const { tests, loading } = useTestResults();

  const velocityData = useMemo(() => {
    return tests
      .filter(t => t.history.length >= 2)
      .map(calculateVelocityData)
      .sort((a, b) => {
        // Sort by: achieved first, then by closest to goal
        if (a.weeksToGoal === 0 && b.weeksToGoal !== 0) return -1;
        if (b.weeksToGoal === 0 && a.weeksToGoal !== 0) return 1;
        if (a.weeksToGoal === null) return 1;
        if (b.weeksToGoal === null) return -1;
        return a.weeksToGoal - b.weeksToGoal;
      });
  }, [tests]);

  if (loading) {
    return (
      <Card padding="spacious">
        <div style={styles.loadingState}>Beregner forbedringshastighet...</div>
      </Card>
    );
  }

  if (velocityData.length === 0) {
    return (
      <Card padding="spacious">
        <div style={styles.emptyState}>
          <Zap size={32} color="var(--text-tertiary)" />
          <p>Trenger minst 2 tester per kategori for å beregne hastighet</p>
        </div>
      </Card>
    );
  }

  // Separate achieved vs in-progress
  const achieved = velocityData.filter(d => d.weeksToGoal === 0);
  const inProgress = velocityData.filter(d => d.weeksToGoal !== 0);

  return (
    <div style={styles.container}>
      {/* Summary Stats */}
      <SummaryStats velocityData={velocityData} />

      {/* Achieved Goals */}
      {achieved.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <CheckCircle2 size={18} color="var(--success)" />
            <SectionTitle style={styles.sectionTitle}>Oppnådde mål ({achieved.length})</SectionTitle>
          </div>
          <div style={styles.achievedGrid}>
            {achieved.map(d => (
              <Card key={d.test.id} padding="sm" style={styles.achievedCard}>
                <span style={styles.achievedIcon}>{d.test.icon}</span>
                <span style={styles.achievedName}>{d.test.name}</span>
                <CheckCircle2 size={14} color="var(--success)" />
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>Pågående forbedring</SectionTitle>
          <div style={styles.velocityList}>
            {inProgress.map(d => (
              <VelocityCard
                key={d.test.id}
                data={d}
                onViewDetails={() => onViewTestDetails?.(d.test.id)}
              />
            ))}
          </div>
        </section>
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
    gap: 'var(--spacing-5)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  sectionTitle: {
    margin: 0,
  },
  summaryCard: {
    background: 'linear-gradient(135deg, var(--background-white) 0%, var(--background-surface) 100%)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
  },
  summaryStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryValue: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  summaryLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  warningBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginTop: 'var(--spacing-4)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--bg-warning-subtle)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
  },
  achievedGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2)',
  },
  achievedCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    backgroundColor: 'var(--bg-success-subtle)',
    border: '1px solid var(--success)',
  },
  achievedIcon: {
    fontSize: '16px',
  },
  achievedName: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  velocityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  velocityCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  testIcon: {
    fontSize: '28px',
  },
  testName: {
    display: 'block',
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-1)',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--spacing-3)',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  metricLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  metricValue: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  prediction: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8)',
    color: 'var(--text-tertiary)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-8)',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
  },
};

export default ImprovementVelocityWidget;
