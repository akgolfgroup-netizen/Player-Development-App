/**
 * CategoryProgressionWidget Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 *
 * Features:
 * - Visual timeline from current to target category
 * - Per-test progress indicators
 * - Estimated time to reach target
 * - Milestone tracking
 */

import React, { useMemo } from 'react';
import {
  Trophy,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import Button from '../../ui/primitives/Button';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';
import useTestResults, { TestResult, PlayerCategory } from '../../hooks/useTestResults';

// ============================================================================
// TYPES
// ============================================================================

interface CategoryInfo {
  level: PlayerCategory;
  name: string;
  description: string;
  color: string;
}

const CATEGORY_INFO: Record<PlayerCategory, CategoryInfo> = {
  K: { level: 'K', name: 'Rekrutt', description: 'Startpunkt', color: 'rgb(var(--text-tertiary))' },
  J: { level: 'J', name: 'Junior 3', description: 'Grunnleggende', color: 'rgb(var(--text-secondary))' },
  I: { level: 'I', name: 'Junior 2', description: 'Utviklende', color: 'rgb(var(--tier-navy))' },
  H: { level: 'H', name: 'Junior 1', description: 'Progresjon', color: 'rgb(var(--status-success))' },
  G: { level: 'G', name: 'Aspirant', description: 'Fremadstormende', color: 'rgb(var(--status-success))' },
  F: { level: 'F', name: 'Klubb', description: 'Konkurransenivå', color: 'rgb(var(--status-info))' },
  E: { level: 'E', name: 'Region', description: 'Regionalt nivå', color: 'rgb(var(--status-info))' },
  D: { level: 'D', name: 'Nasjonal', description: 'Nasjonalt nivå', color: 'rgb(var(--category-j))' },
  C: { level: 'C', name: 'Talent', description: 'Høyt talent', color: 'rgb(var(--category-j))' },
  B: { level: 'B', name: 'Elite', description: 'Elitenivå', color: 'rgb(var(--status-warning))' },
  A: { level: 'A', name: 'Proff', description: 'Profesjonelt', color: 'rgb(var(--tier-gold))' },
};

const CATEGORY_ORDER: PlayerCategory[] = ['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

// ============================================================================
// COMPONENTS
// ============================================================================

interface CategoryBadgeProps {
  category: PlayerCategory;
  isCurrent?: boolean;
  isTarget?: boolean;
  isCompleted?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  isCurrent,
  isTarget,
  isCompleted,
  size = 'md',
}) => {
  const info = CATEGORY_INFO[category];
  const sizeMap = {
    sm: { width: 32, height: 32, fontSize: 14 },
    md: { width: 48, height: 48, fontSize: 18 },
    lg: { width: 64, height: 64, fontSize: 24 },
  };
  const s = sizeMap[size];

  return (
    <div
      style={{
        width: s.width,
        height: s.height,
        borderRadius: '50%',
        backgroundColor: isCompleted ? info.color : `${info.color}20`,
        border: `3px solid ${info.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: isCurrent ? `0 0 0 4px ${info.color}30` : 'none',
      }}
    >
      <span
        style={{
          fontSize: s.fontSize,
          fontWeight: 700,
          color: isCompleted ? 'white' : info.color,
        }}
      >
        {category}
      </span>
      {isTarget && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Target size={10} color="white" />
        </div>
      )}
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: info.color,
            color: 'white',
            fontSize: 8,
            fontWeight: 600,
            padding: '1px 4px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}
        >
          DU
        </div>
      )}
    </div>
  );
};

interface TestProgressItemProps {
  test: TestResult;
  onViewDetails?: () => void;
}

const TestProgressItem: React.FC<TestProgressItemProps> = ({ test, onViewDetails }) => {
  const progress = useMemo(() => {
    if (!test.targetRequirement) return 100;
    if (test.lowerIsBetter) {
      return Math.min(100, (test.targetRequirement / test.currentValue) * 100);
    }
    return Math.min(100, (test.currentValue / test.targetRequirement) * 100);
  }, [test]);

  const remaining = useMemo(() => {
    if (!test.targetRequirement) return 0;
    if (test.lowerIsBetter) {
      return Math.max(0, test.currentValue - test.targetRequirement);
    }
    return Math.max(0, test.targetRequirement - test.currentValue);
  }, [test]);

  return (
    <div style={styles.testItem}>
      <div style={styles.testIcon}>{test.icon}</div>
      <div style={styles.testInfo}>
        <div style={styles.testHeader}>
          <span style={styles.testName}>{test.name}</span>
          {test.meetsTarget ? (
            <CheckCircle2 size={16} color="var(--status-success)" />
          ) : (
            <span style={styles.testRemaining}>
              {remaining.toFixed(test.unit === '' ? 1 : 0)}{test.unit} igjen
            </span>
          )}
        </div>
        <div style={styles.testProgress}>
          <div style={styles.testProgressTrack}>
            <div
              style={{
                ...styles.testProgressFill,
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? 'var(--status-success)' :
                  progress >= 80 ? 'var(--status-warning)' : 'var(--accent)',
              }}
            />
          </div>
          <span style={styles.testProgressValue}>
            {test.currentValue}{test.unit} / {test.targetRequirement}{test.unit}
          </span>
        </div>
      </div>
      <button
        onClick={onViewDetails}
        style={styles.testAction}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CategoryProgressionWidgetProps {
  onViewTestDetails?: (testId: string) => void;
}

const CategoryProgressionWidget: React.FC<CategoryProgressionWidgetProps> = ({
  onViewTestDetails,
}) => {
  const {
    tests,
    playerCategory,
    targetCategory,
    categoryProgress,
    loading,
  } = useTestResults();

  const timelineCategories = useMemo(() => {
    const currentIdx = CATEGORY_ORDER.indexOf(playerCategory);
    const targetIdx = CATEGORY_ORDER.indexOf(targetCategory);

    // Show 2 before current (if exist), current, and up to target + 1
    const startIdx = Math.max(0, currentIdx - 2);
    const endIdx = Math.min(CATEGORY_ORDER.length - 1, targetIdx + 1);

    return CATEGORY_ORDER.slice(startIdx, endIdx + 1);
  }, [playerCategory, targetCategory]);

  const estimatedTimeToTarget = useMemo(() => {
    if (!categoryProgress) return null;

    // Average the predicted days from all remaining tests
    const remainingTests = categoryProgress.remainingTests;
    if (remainingTests.length === 0) return 0;

    const validPredictions = remainingTests
      .filter(t => t.predictedDaysToTarget !== null && t.predictedDaysToTarget > 0)
      .map(t => t.predictedDaysToTarget as number);

    if (validPredictions.length === 0) return null;

    // Use the maximum time (bottleneck)
    return Math.max(...validPredictions);
  }, [categoryProgress]);

  const formatTime = (days: number | null): string => {
    if (days === null) return 'Beregner...';
    if (days === 0) return 'Nesten der!';
    if (days < 7) return `${days} dager`;
    if (days < 30) return `${Math.ceil(days / 7)} uker`;
    if (days < 365) return `${Math.ceil(days / 30)} måneder`;
    return `${(days / 365).toFixed(1)} år`;
  };

  if (loading) {
    return (
      <Card padding="spacious">
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <span>Laster progresjon...</span>
        </div>
      </Card>
    );
  }

  const currentInfo = CATEGORY_INFO[playerCategory];
  const targetInfo = CATEGORY_INFO[targetCategory];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <Card variant="elevated" padding="spacious" style={styles.heroCard}>
        <div style={styles.heroContent}>
          {/* Current Category */}
          <div style={styles.categorySection}>
            <span style={styles.categoryLabel}>Nåværende</span>
            <CategoryBadge category={playerCategory} isCurrent size="lg" />
            <span style={styles.categoryName}>{currentInfo.name}</span>
          </div>

          {/* Progress Arrow */}
          <div style={styles.arrowSection}>
            <div style={styles.progressRing}>
              <svg viewBox="0 0 36 36" style={styles.progressSvg}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={targetInfo.color}
                  strokeWidth="3"
                  strokeDasharray={`${categoryProgress?.progress || 0}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span style={styles.progressPercent}>
                {Math.round(categoryProgress?.progress || 0)}%
              </span>
            </div>
            <ArrowRight size={24} color="var(--text-tertiary)" />
          </div>

          {/* Target Category */}
          <div style={styles.categorySection}>
            <span style={styles.categoryLabel}>Mål</span>
            <CategoryBadge category={targetCategory} isTarget size="lg" />
            <span style={styles.categoryName}>{targetInfo.name}</span>
          </div>
        </div>

        {/* Time Estimate */}
        <div style={styles.timeEstimate}>
          <Clock size={16} color="var(--text-secondary)" />
          <span>Estimert tid: </span>
          <strong style={{ color: targetInfo.color }}>
            {formatTime(estimatedTimeToTarget)}
          </strong>
        </div>
      </Card>

      {/* Category Timeline */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Kategorireise</SectionTitle>
        <Card padding="md">
          <div style={styles.timeline}>
            {timelineCategories.map((cat, i) => {
              const isCompleted = CATEGORY_ORDER.indexOf(cat) < CATEGORY_ORDER.indexOf(playerCategory);
              const isCurrent = cat === playerCategory;
              const isTarget = cat === targetCategory;

              return (
                <React.Fragment key={cat}>
                  <div style={styles.timelineItem}>
                    <CategoryBadge
                      category={cat}
                      isCurrent={isCurrent}
                      isTarget={isTarget}
                      isCompleted={isCompleted}
                      size="sm"
                    />
                    <span style={{
                      ...styles.timelineName,
                      color: isCurrent ? CATEGORY_INFO[cat].color : 'var(--text-secondary)',
                      fontWeight: isCurrent ? 600 : 400,
                    }}>
                      {CATEGORY_INFO[cat].name}
                    </span>
                  </div>
                  {i < timelineCategories.length - 1 && (
                    <div
                      style={{
                        ...styles.timelineConnector,
                        backgroundColor: isCompleted ? CATEGORY_INFO[cat].color : 'var(--border-subtle)',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Requirements Status */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={styles.sectionTitle}>
            Krav for {targetInfo.name} ({targetCategory})
          </SectionTitle>
          <Badge variant={categoryProgress?.progress === 100 ? 'success' : 'accent'} size="sm">
            {categoryProgress?.testsMet}/{categoryProgress?.testsRequired} oppfylt
          </Badge>
        </div>

        {/* Completed Tests */}
        {tests.filter(t => t.meetsTarget).length > 0 && (
          <Card padding="md" style={styles.completedCard}>
            <div style={styles.completedHeader}>
              <CheckCircle2 size={18} color="var(--status-success)" />
              <SubSectionTitle style={styles.completedTitle}>
                Oppfylte krav ({tests.filter(t => t.meetsTarget).length})
              </SubSectionTitle>
            </div>
            <div style={styles.completedGrid}>
              {tests.filter(t => t.meetsTarget).map(test => (
                <div key={test.id} style={styles.completedItem}>
                  <span>{test.icon}</span>
                  <span style={styles.completedName}>{test.name}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Remaining Tests */}
        {categoryProgress?.remainingTests && categoryProgress.remainingTests.length > 0 && (
          <Card padding="md">
            <SubSectionTitle style={styles.remainingTitle}>
              Gjenstående ({categoryProgress.remainingTests.length})
            </SubSectionTitle>
            <div style={styles.testsList}>
              {categoryProgress.remainingTests
                .sort((a, b) => {
                  // Sort by closest to completion
                  const aProgress = a.lowerIsBetter
                    ? (a.targetRequirement! / a.currentValue) * 100
                    : (a.currentValue / a.targetRequirement!) * 100;
                  const bProgress = b.lowerIsBetter
                    ? (b.targetRequirement! / b.currentValue) * 100
                    : (b.currentValue / b.targetRequirement!) * 100;
                  return bProgress - aProgress;
                })
                .map(test => (
                  <TestProgressItem
                    key={test.id}
                    test={test}
                    onViewDetails={() => onViewTestDetails?.(test.id)}
                  />
                ))}
            </div>
          </Card>
        )}

        {/* Additional Requirements */}
        {categoryProgress?.additionalRequirements && (
          <Card padding="md">
            <SubSectionTitle style={styles.remainingTitle}>
              Tilleggskrav
            </SubSectionTitle>
            <div style={styles.additionalGrid}>
              <div style={styles.additionalItem}>
                <span style={styles.additionalLabel}>Runder spilt</span>
                <div style={styles.additionalValue}>
                  <span>
                    {categoryProgress.additionalRequirements.roundsCompleted}/
                    {categoryProgress.additionalRequirements.roundsRequired}
                  </span>
                  {(categoryProgress.additionalRequirements.roundsCompleted ?? 0) >=
                    (categoryProgress.additionalRequirements.roundsRequired ?? 0) ? (
                    <CheckCircle2 size={14} color="var(--status-success)" />
                  ) : (
                    <Circle size={14} color="var(--text-tertiary)" />
                  )}
                </div>
              </div>
              <div style={styles.additionalItem}>
                <span style={styles.additionalLabel}>Handicap</span>
                <div style={styles.additionalValue}>
                  <span>
                    {categoryProgress.additionalRequirements.currentHandicap}
                    {' '}(krav: ≤{categoryProgress.additionalRequirements.handicapRequired})
                  </span>
                  {(categoryProgress.additionalRequirements.currentHandicap ?? 999) <=
                    (categoryProgress.additionalRequirements.handicapRequired ?? 0) ? (
                    <CheckCircle2 size={14} color="var(--status-success)" />
                  ) : (
                    <Circle size={14} color="var(--text-tertiary)" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Motivation */}
      <Card variant="elevated" padding="md" style={styles.motivationCard}>
        <div style={styles.motivationContent}>
          <div style={styles.motivationIcon}>
            <Zap size={20} color="white" />
          </div>
          <div>
            <SubSectionTitle style={styles.motivationTitle}>
              Du er på god vei!
            </SubSectionTitle>
            <p style={styles.motivationText}>
              {categoryProgress?.progress && categoryProgress.progress >= 80
                ? 'Nesten fremme! Bare litt til så når du neste nivå.'
                : categoryProgress?.progress && categoryProgress.progress >= 50
                  ? 'Halvveis der! Fortsett det gode arbeidet.'
                  : 'Hver test bringer deg nærmere målet. Stå på!'}
            </p>
          </div>
        </div>
      </Card>
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
  heroCard: {
    background: 'linear-gradient(135deg, var(--background-white) 0%, var(--background-surface) 100%)',
  },
  heroContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  categorySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  categoryLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  categoryName: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  arrowSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  progressRing: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  progressSvg: {
    width: '100%',
    height: '100%',
    transform: 'rotate(-90deg)',
  },
  progressPercent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'var(--font-size-body)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  timeEstimate: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
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
    justifyContent: 'space-between',
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) 0',
    overflowX: 'auto',
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    minWidth: 60,
  },
  timelineName: {
    fontSize: 'var(--font-size-caption2)',
  },
  timelineConnector: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  completedCard: {
    backgroundColor: 'var(--bg-success-subtle)',
    border: '1px solid var(--status-success)',
  },
  completedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-3)',
  },
  completedTitle: {
    margin: 0,
    color: 'var(--status-success)',
  },
  completedGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2)',
  },
  completedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    backgroundColor: 'white',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-footnote)',
  },
  completedName: {
    color: 'var(--text-primary)',
  },
  remainingTitle: {
    margin: 0,
    marginBottom: 'var(--spacing-3)',
  },
  testsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  testItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-2)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  testIcon: {
    fontSize: '24px',
  },
  testInfo: {
    flex: 1,
    minWidth: 0,
  },
  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-1)',
  },
  testName: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  testRemaining: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--status-warning)',
    fontWeight: 500,
  },
  testProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  testProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  testProgressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  testProgressValue: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
  },
  testAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
  additionalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
  },
  additionalItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
  },
  additionalLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  additionalValue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  motivationCard: {
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--status-success) 100%)',
  },
  motivationContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
  },
  motivationIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  motivationTitle: {
    margin: 0,
    color: 'white',
    fontWeight: 700,
  },
  motivationText: {
    margin: 'var(--spacing-1) 0 0 0',
    fontSize: 'var(--font-size-footnote)',
    color: 'rgba(255,255,255,0.9)',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-8)',
    color: 'var(--text-tertiary)',
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid var(--border-subtle)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default CategoryProgressionWidget;
