/**
 * StatusProgressPage - Status & Mål
 * Cockpit view for player's progress towards goals
 * Shows effort vs progress separation for breaking points
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
  Zap,
  Award,
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { SectionTitle } from '../../components/typography/Headings';

import { useBreakingPoints, BreakingPoint, BpStatus } from '../../hooks/useBreakingPoints';
import { useStrokesGained } from '../../hooks/useStrokesGained';
import { useScreenView } from '../../analytics/useScreenView';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

interface StatItem {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

// ═══════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════

function getStatusColor(status: BpStatus): string {
  switch (status) {
    case 'resolved':
      return 'var(--status-success)';
    case 'awaiting_proof':
      return 'var(--status-warning)';
    case 'in_progress':
      return 'var(--accent)';
    case 'regressed':
      return 'var(--status-error)';
    default:
      return 'var(--text-tertiary)';
  }
}

function getStatusLabel(status: BpStatus): string {
  switch (status) {
    case 'not_started':
      return 'Ikke startet';
    case 'identified':
      return 'Identifisert';
    case 'in_progress':
      return 'Pågår';
    case 'awaiting_proof':
      return 'Venter bekreftelse';
    case 'resolved':
      return 'Løst';
    case 'regressed':
      return 'Tilbakefall';
    default:
      return status;
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'var(--status-error)';
    case 'high':
      return 'var(--status-warning)';
    case 'medium':
      return 'var(--text-secondary)';
    case 'low':
      return 'var(--status-success)';
    default:
      return 'var(--text-tertiary)';
  }
}

function formatSG(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  if (value > 0) return `+${value.toFixed(2)}`;
  return value.toFixed(2);
}

function getDaysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ═══════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════

const EffortProgressBar: React.FC<{
  effort: number;
  progress: number;
  showLabels?: boolean;
}> = ({ effort, progress, showLabels = true }) => {
  return (
    <div style={styles.effortProgressContainer}>
      {showLabels && (
        <div style={styles.effortProgressLabels}>
          <span style={styles.effortLabel}>Innsats: {effort}%</span>
          <span style={styles.progressLabel}>Fremgang: {progress}%</span>
        </div>
      )}
      <div style={styles.dualBarContainer}>
        <div style={styles.barRow}>
          <span style={styles.barLabel}>Innsats</span>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${effort}%`,
                backgroundColor: 'var(--accent)',
              }}
            />
          </div>
        </div>
        <div style={styles.barRow}>
          <span style={styles.barLabel}>Resultat</span>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${progress}%`,
                backgroundColor: progress >= 80 ? 'var(--status-success)' : progress >= 50 ? 'var(--status-warning)' : 'var(--status-error)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatItem> = ({ label, value, sublabel, trend, icon, color }) => {
  return (
    <Card>
      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, backgroundColor: `${color}15` }}>
          {icon}
        </div>
        <div style={styles.statContent}>
          <span style={styles.statValue}>{value}</span>
          <span style={styles.statLabel}>{label}</span>
          {sublabel && (
            <div style={styles.statSublabel}>
              {trend === 'up' && <TrendingUp size={12} color="var(--status-success)" />}
              {trend === 'down' && <TrendingDown size={12} color="var(--status-error)" />}
              <span>{sublabel}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const BreakingPointCard: React.FC<{ bp: BreakingPoint; onClick: () => void }> = ({ bp, onClick }) => {
  const daysUntilBenchmark = getDaysUntil(bp.nextBenchmarkDue);

  return (
    <div style={styles.bpCard} onClick={onClick}>
      <div style={styles.bpHeader}>
        <div style={styles.bpTitleRow}>
          <div
            style={{
              ...styles.severityDot,
              backgroundColor: getSeverityColor(bp.severity),
            }}
          />
          <span style={styles.bpTitle}>{bp.specificArea}</span>
        </div>
        <span
          style={{
            ...styles.bpStatus,
            color: getStatusColor(bp.status),
            backgroundColor: `${getStatusColor(bp.status)}15`,
          }}
        >
          {getStatusLabel(bp.status)}
        </span>
      </div>

      <p style={styles.bpDescription}>
        Mål: {bp.targetMeasurement || bp.description}
      </p>

      <EffortProgressBar effort={bp.effortPercent} progress={bp.progressPercent} showLabels={false} />

      {daysUntilBenchmark !== null && daysUntilBenchmark > 0 && (
        <div style={styles.bpFooter}>
          <Clock size={12} color="var(--text-tertiary)" />
          <span style={styles.bpFooterText}>
            Neste benchmark om {daysUntilBenchmark} {daysUntilBenchmark === 1 ? 'dag' : 'dager'}
          </span>
        </div>
      )}

      {bp.status === 'awaiting_proof' && (
        <div style={{ ...styles.bpFooter, color: 'var(--status-success)' }}>
          <CheckCircle2 size={12} />
          <span style={styles.bpFooterText}>Venter på bekreftelse fra coach</span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

const StatusProgressPage: React.FC = () => {
  useScreenView('Status & Mål');
  const navigate = useNavigate();

  const { data: bpData, loading: bpLoading, error: bpError, refetch: refetchBp } = useBreakingPoints();
  const { data: sgData, loading: sgLoading } = useStrokesGained();

  const isLoading = bpLoading || sgLoading;

  // Calculate summary stats
  const summaryStats: StatItem[] = [
    {
      label: 'Gjennomsnittlig fremgang',
      value: `${bpData?.summary.averageProgress || 0}%`,
      sublabel: 'Mot målene',
      icon: <Target size={20} color="var(--accent)" />,
      color: 'var(--accent)',
    },
    {
      label: 'Innsats-score',
      value: `${bpData?.summary.averageEffort || 0}%`,
      sublabel: 'Treningsgjennomføring',
      icon: <Zap size={20} color="var(--status-warning)" />,
      color: 'var(--status-warning)',
    },
    {
      label: 'SG Trend',
      value: formatSG(sgData?.trend),
      sublabel: 'Siste uke',
      trend: (sgData?.trend || 0) >= 0 ? 'up' : 'down',
      icon: <Activity size={20} color="var(--status-success)" />,
      color: 'var(--status-success)',
    },
    {
      label: 'Breaking Points',
      value: `${bpData?.summary.resolved || 0}/${bpData?.summary.total || 0}`,
      sublabel: 'Løst',
      icon: <Award size={20} color="var(--medal-gold)" />,
      color: 'var(--medal-gold)',
    },
  ];

  // Filter active breaking points
  const activeBreakingPoints = bpData?.breakingPoints.filter(
    bp => bp.status !== 'resolved'
  ) || [];

  if (isLoading) {
    return (
      <AppShellTemplate title="Status & Mål" subtitle="Din progresjon mot målsetningene">
        <section style={styles.section}>
          <StateCard
            variant="loading"
            title="Laster status..."
            description="Henter dine data"
          />
        </section>
      </AppShellTemplate>
    );
  }

  if (bpError && !bpData) {
    return (
      <AppShellTemplate title="Status & Mål" subtitle="Din progresjon mot målsetningene">
        <section style={styles.section}>
          <StateCard
            variant="error"
            title="Kunne ikke laste data"
            description={bpError}
            action={
              <Button variant="primary" onClick={refetchBp} leftIcon={<RefreshCw size={14} />}>
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
      title="Status & Mål"
      subtitle="Din progresjon mot målsetningene"
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={refetchBp}
          leftIcon={<RefreshCw size={14} />}
        >
          Oppdater
        </Button>
      }
    >
      {/* KPI Stats Grid */}
      <section style={styles.section}>
        <div style={styles.statsGrid}>
          {summaryStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Effort vs Progress Explanation */}
      <section style={styles.section}>
        <Card>
          <div style={styles.infoCard}>
            <AlertCircle size={18} color="var(--accent)" />
            <div>
              <strong>Innsats vs Fremgang</strong>
              <p style={styles.infoText}>
                <strong>Innsats</strong> viser hvor mye du har trent (fullførte økter).{' '}
                <strong>Fremgang</strong> viser faktisk forbedring målt gjennom benchmark-tester.
                Du kan ha høy innsats uten fremgang - dette betyr at treningsmetoden bør evalueres.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Breaking Points Status */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle>Breaking Points</SectionTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/utvikling/breaking-points')}
            rightIcon={<ChevronRight size={14} />}
          >
            Se alle
          </Button>
        </div>

        {activeBreakingPoints.length === 0 ? (
          <Card>
            <div style={styles.emptyState}>
              <CheckCircle2 size={32} color="var(--status-success)" />
              <p>Ingen aktive breaking points!</p>
              <span style={styles.emptySubtext}>Alle dine utfordringer er løst</span>
            </div>
          </Card>
        ) : (
          <div style={styles.bpList}>
            {activeBreakingPoints.map(bp => (
              <Card key={bp.id}>
                <BreakingPointCard
                  bp={bp}
                  onClick={() => navigate(`/utvikling/breaking-points?id=${bp.id}`)}
                />
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Strokes Gained Summary */}
      {sgData && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <SectionTitle>Strokes Gained Oversikt</SectionTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/statistikk/strokes-gained')}
              rightIcon={<ChevronRight size={14} />}
            >
              Detaljer
            </Button>
          </div>
          <Card>
            <div style={styles.sgCard}>
              <div style={styles.sgTotal}>
                <span style={styles.sgTotalLabel}>Total SG</span>
                <span
                  style={{
                    ...styles.sgTotalValue,
                    color: (sgData.total || 0) >= 0 ? 'var(--status-success)' : 'var(--status-error)',
                  }}
                >
                  {formatSG(sgData.total)}
                </span>
              </div>
              <div style={styles.sgCategories}>
                {sgData.byCategory && Object.entries(sgData.byCategory).map(([key, cat]: [string, any]) => (
                  <div key={key} style={styles.sgCategoryItem}>
                    <span style={styles.sgCategoryLabel}>
                      {key === 'approach' ? 'Approach' : key === 'around_green' ? 'Rundt green' : 'Putting'}
                    </span>
                    <span
                      style={{
                        ...styles.sgCategoryValue,
                        color: cat.value >= 0 ? 'var(--status-success)' : 'var(--status-error)',
                      }}
                    >
                      {formatSG(cat.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Quick Links */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-3)' }}>Utforsk mer</SectionTitle>
        <div style={styles.quickLinks}>
          <Card>
            <div style={styles.quickLink} onClick={() => navigate('/maalsetninger')}>
              <div style={styles.quickLinkIcon}>
                <Target size={20} color="var(--accent)" />
              </div>
              <div style={styles.quickLinkText}>
                <span style={styles.quickLinkTitle}>Mine målsetninger</span>
                <span style={styles.quickLinkDesc}>Se og oppdater dine mål</span>
              </div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </div>
          </Card>
          <Card>
            <div style={styles.quickLink} onClick={() => navigate('/progress')}>
              <div style={styles.quickLinkIcon}>
                <TrendingUp size={20} color="var(--status-success)" />
              </div>
              <div style={styles.quickLinkText}>
                <span style={styles.quickLinkTitle}>Fremgangshistorikk</span>
                <span style={styles.quickLinkDesc}>Se din utvikling over tid</span>
              </div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </div>
          </Card>
        </div>
      </section>
    </AppShellTemplate>
  );
};

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════

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

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-1)',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  statSublabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },

  // Info Card
  infoCard: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-1)',
  },
  infoText: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: '4px 0 0 0',
    lineHeight: 1.5,
  },

  // Effort/Progress Bars
  effortProgressContainer: {
    marginTop: 'var(--spacing-3)',
  },
  effortProgressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
  },
  effortLabel: {
    color: 'var(--accent)',
  },
  progressLabel: {
    color: 'var(--text-secondary)',
  },
  dualBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  barLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    width: '50px',
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: '8px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },

  // Breaking Points
  bpList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  bpCard: {
    padding: 'var(--spacing-1)',
    cursor: 'pointer',
  },
  bpHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-2)',
  },
  bpTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  severityDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  bpTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  bpStatus: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  bpDescription: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: '0 0 var(--spacing-2) 0',
  },
  bpFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  bpFooterText: {
    color: 'inherit',
  },

  // SG Card
  sgCard: {
    padding: 'var(--spacing-1)',
  },
  sgTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-4)',
    paddingBottom: 'var(--spacing-3)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  sgTotalLabel: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  sgTotalValue: {
    fontSize: '32px',
    fontWeight: 700,
  },
  sgCategories: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  sgCategoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sgCategoryLabel: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  sgCategoryValue: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: 'var(--spacing-6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  emptySubtext: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
  },

  // Quick Links
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

export default StatusProgressPage;
