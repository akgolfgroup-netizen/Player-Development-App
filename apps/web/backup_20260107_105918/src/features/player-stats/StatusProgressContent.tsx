import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Circle,
  Zap,
  Calendar,
  Star
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { useStrokesGained } from '../../hooks/useStrokesGained';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

/**
 * StatusProgressContent - Status & Goals progress
 * Used within StatistikkHub as tab content
 */
const StatusProgressContent: React.FC = () => {
  const { data, loading } = useStrokesGained();

  // Demo goals data
  const goals = [
    {
      id: 1,
      title: 'Approach SG > +0.3',
      description: 'Forbedre approach-slag til over +0.3 strokes gained',
      category: 'approach',
      target: 0.3,
      current: data?.byCategory?.approach?.value || 0.15,
      deadline: '2025-03-01',
      status: 'in_progress',
    },
    {
      id: 2,
      title: 'Gjennomfør 50 tester',
      description: 'Fullfør minst 50 testslagsmålinger',
      category: 'general',
      target: 50,
      current: Object.values(data?.byCategory || {}).reduce((sum: number, cat: any) => sum + (cat.testCount || 0), 0),
      deadline: '2025-06-01',
      status: 'in_progress',
    },
    {
      id: 3,
      title: 'Putting forbedring',
      description: 'Nå +0.2 SG på putting',
      category: 'putting',
      target: 0.2,
      current: data?.byCategory?.putting?.value || 0.12,
      deadline: '2025-04-01',
      status: 'in_progress',
    },
  ];

  // Demo milestones
  const milestones = [
    { id: 1, title: 'Første test gjennomført', achieved: true, date: '2025-12-15' },
    { id: 2, title: 'Positiv total SG', achieved: (data?.total || 0) > 0, date: '2025-12-20' },
    { id: 3, title: '10 tester fullført', achieved: true, date: '2025-12-25' },
    { id: 4, title: 'Approach SG > 0', achieved: (data?.byCategory?.approach?.value || 0) > 0, date: null },
    { id: 5, title: 'Alle kategorier testet', achieved: true, date: '2025-12-22' },
  ];

  const getProgressPercent = (current: number, target: number) => {
    return Math.min(100, Math.max(0, (current / target) * 100));
  };

  const formatValue = (value: number, isCount: boolean = false) => {
    if (isCount) return Math.round(value).toString();
    if (value > 0) return `+${value.toFixed(2)}`;
    return value.toFixed(2);
  };

  if (loading) {
    return (
      <StateCard
        variant="loading"
        title="Laster status..."
        description="Henter dine mål og progresjon"
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Current Status Summary */}
      <section style={styles.section}>
        <Card variant="elevated" padding="spacious">
          <div style={styles.statusCard}>
            <div style={styles.statusHeader}>
              <div style={styles.statusIcon}>
                <Zap size={24} color="white" />
              </div>
              <div>
                <h2 style={styles.statusTitle}>Din status</h2>
                <p style={styles.statusSubtitle}>Basert på dine siste resultater</p>
              </div>
            </div>

            <div style={styles.statusGrid}>
              <div style={styles.statusItem}>
                <span style={styles.statusItemLabel}>Total SG</span>
                <span style={{
                  ...styles.statusItemValue,
                  color: (data?.total || 0) >= 0 ? 'var(--status-success)' : 'var(--status-error)',
                }}>
                  {formatValue(data?.total || 0)}
                </span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusItemLabel}>Percentil</span>
                <span style={styles.statusItemValue}>{data?.percentile || 0}%</span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusItemLabel}>Trend</span>
                <span style={{
                  ...styles.statusItemValue,
                  color: (data?.trend || 0) >= 0 ? 'var(--status-success)' : 'var(--status-error)',
                }}>
                  {formatValue(data?.trend || 0)}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div style={styles.statusBadgeContainer}>
              <Badge
                variant={(data?.total || 0) >= 0.3 ? 'success' : (data?.total || 0) >= 0 ? 'accent' : 'warning'}
                size="md"
              >
                {(data?.total || 0) >= 0.5 ? 'Elite-nivå' :
                  (data?.total || 0) >= 0.2 ? 'Over gjennomsnitt' :
                    (data?.total || 0) >= 0 ? 'Gjennomsnitt' : 'Under gjennomsnitt'}
              </Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* Goals Progress */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ margin: 0 }}>Aktive mål</SectionTitle>
          <Target size={20} color="var(--text-secondary)" />
        </div>

        <div style={styles.goalsList}>
          {goals.map(goal => {
            const progress = getProgressPercent(goal.current, goal.target);
            const isCount = goal.category === 'general';

            return (
              <Card key={goal.id} padding="md">
                <div style={styles.goalCard}>
                  <div style={styles.goalHeader}>
                    <div style={styles.goalInfo}>
                      <SubSectionTitle style={{ margin: 0 }}>{goal.title}</SubSectionTitle>
                      <p style={styles.goalDescription}>{goal.description}</p>
                    </div>
                    <Badge
                      variant={progress >= 100 ? 'success' : progress >= 50 ? 'accent' : 'warning'}
                      size="sm"
                    >
                      {Math.round(progress)}%
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div style={styles.progressContainer}>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progress}%`,
                          backgroundColor: progress >= 100 ? 'var(--status-success)' :
                            progress >= 50 ? 'var(--accent)' : 'var(--status-warning)',
                        }}
                      />
                    </div>
                    <div style={styles.progressLabels}>
                      <span>Nå: {formatValue(goal.current, isCount)}</span>
                      <span>Mål: {formatValue(goal.target, isCount)}</span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div style={styles.goalFooter}>
                    <Calendar size={14} color="var(--text-tertiary)" />
                    <span style={styles.goalDeadline}>Frist: {goal.deadline}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Milestones */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ margin: 0 }}>Milepæler</SectionTitle>
          <Award size={20} color="var(--text-secondary)" />
        </div>

        <Card padding="md">
          <div style={styles.milestonesList}>
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                style={{
                  ...styles.milestoneItem,
                  opacity: milestone.achieved ? 1 : 0.6,
                }}
              >
                <div style={styles.milestoneIcon}>
                  {milestone.achieved ? (
                    <CheckCircle2 size={20} color="var(--status-success)" />
                  ) : (
                    <Circle size={20} color="var(--text-tertiary)" />
                  )}
                </div>
                <div style={styles.milestoneContent}>
                  <span style={{
                    ...styles.milestoneTitle,
                    textDecoration: milestone.achieved ? 'none' : 'none',
                  }}>
                    {milestone.title}
                  </span>
                  {milestone.achieved && milestone.date && (
                    <span style={styles.milestoneDate}>{milestone.date}</span>
                  )}
                </div>
                {milestone.achieved && (
                  <Star size={16} color="var(--achievement)" fill="var(--achievement)" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Recommendations */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>
          Anbefalinger
        </SectionTitle>

        <div style={styles.recommendationsGrid}>
          {[
            {
              icon: Target,
              title: 'Fokuser på Approach',
              description: 'Approach-slag gir størst forbedringspotensial',
              color: 'var(--accent)',
            },
            {
              icon: TrendingUp,
              title: 'Fortsett trenden',
              description: 'Du er på rett vei med positiv utvikling',
              color: 'var(--status-success)',
            },
            {
              icon: Calendar,
              title: 'Test regelmessig',
              description: 'Gjennomfør tester hver uke for bedre data',
              color: 'var(--status-warning)',
            },
          ].map((rec, index) => {
            const Icon = rec.icon;
            return (
              <Card key={index} padding="md">
                <div style={styles.recommendationCard}>
                  <div style={{ ...styles.recommendationIcon, backgroundColor: `${rec.color}15` }}>
                    <Icon size={20} color={rec.color} />
                  </div>
                  <div>
                    <span style={styles.recommendationTitle}>{rec.title}</span>
                    <p style={styles.recommendationDesc}>{rec.description}</p>
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
    marginBottom: 'var(--spacing-6)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },
  statusCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
  },
  statusIcon: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--status-success) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  statusTitle: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  statusSubtitle: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-4)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  statusItemLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  statusItemValue: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  statusBadgeContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  goalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  goalCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
  goalInfo: {
    flex: 1,
  },
  goalDescription: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 'var(--spacing-1) 0 0 0',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },
  progressTrack: {
    height: '8px',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  goalFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  goalDeadline: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  milestonesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.15s ease',
  },
  milestoneIcon: {
    flexShrink: 0,
  },
  milestoneContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  milestoneTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  milestoneDate: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  recommendationCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
  recommendationIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recommendationTitle: {
    display: 'block',
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  recommendationDesc: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    margin: 'var(--spacing-1) 0 0 0',
  },
};

export default StatusProgressContent;
