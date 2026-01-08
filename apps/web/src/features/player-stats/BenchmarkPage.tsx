import React, { useState } from 'react';
import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Crosshair,
  Flag,
  CircleDot,
  Zap,
  Award,
  Globe,
  ChevronRight,
  Star,
  Activity,
  BarChart3,
  Users,
} from 'lucide-react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
/**
 * BenchmarkPage Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import Card from '../../ui/primitives/Card';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { useProBenchmark, ApproachSkillData } from '../../hooks/useProBenchmark';
import { useStrokesGained } from '../../hooks/useStrokesGained';
import { useScreenView } from '../../analytics/useScreenView';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';

/**
 * BenchmarkPage - Visuelt inspirerende sammenligning med PGA-proffer og amatører
 *
 * Features:
 * 1. Elite SG Benchmark - Sammenlign med Top 10, Top 50, Tour Average
 * 2. WAGR Rankings - Se hvor amatørene ligger
 * 3. Approach Analysis - Detaljert breakdown per avstand
 */

const BenchmarkPage: React.FC = () => {
  useScreenView('Benchmark');
  const { eliteBenchmarks, topPlayers, approachSkills, wagrRankings, loading, error } = useProBenchmark();
  const { data: sgData } = useStrokesGained();
  const [selectedCategory, setSelectedCategory] = useState<'total' | 'approach' | 'putting' | 'aroundGreen'>('total');
  const [selectedTour, setSelectedTour] = useState<'pga' | 'euro' | 'lpga'>('pga');

  const formatSG = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    if (value > 0) return `+${value.toFixed(2)}`;
    return value.toFixed(2);
  };

  const getSGColor = (value: number) => {
    if (value >= 0.5) return 'var(--status-success)';
    if (value >= 0) return 'var(--accent)';
    if (value >= -0.5) return 'var(--status-warning)';
    return 'var(--status-error)';
  };

  const getGapToElite = (category: 'total' | 'approach' | 'putting' | 'aroundGreen') => {
    if (!sgData?.byCategory || !eliteBenchmarks) return null;

    const categoryMap: Record<string, keyof typeof eliteBenchmarks.top10> = {
      total: 'total',
      approach: 'approach',
      putting: 'putting',
      aroundGreen: 'aroundGreen',
    };

    const eliteValue = eliteBenchmarks.top10[categoryMap[category]];
    let playerValue = 0;

    if (category === 'total') {
      playerValue = sgData.total || 0;
    } else {
      const catKey = category === 'aroundGreen' ? 'around_green' : category;
      playerValue = sgData.byCategory[catKey]?.value || 0;
    }

    return {
      gap: playerValue - eliteValue,
      playerValue,
      eliteValue,
    };
  };

  if (loading) {
    return (
      <AppShellTemplate
        title="Benchmark"
        subtitle="Sammenlign med de beste"
        helpText="Benchmark-analyse som sammenligner din prestasjon mot PGA Tour-profesjonelle og verdens beste amatører (WAGR). Se din posisjon relativt til Tour Average, Top 50 og Top 10. Detaljert kategori-sammenligning for Approach, Putting og Around Green med gap-analyse. Approach-breakdown per avstand (50-200m) fra både fairway og rough med SG, proksimitet og GIR-prosent. Se topp 5 PGA Tour-spillere med totalt SG og turneringsstatistikk. WAGR-rangeringer for menn og kvinner med poeng og trendbevegelse. Bruk for å forstå hvor du ligger an mot de beste og identifisere målsettinger."
      >
        <StateCard
          variant="loading"
          title="Laster benchmark-data..."
          description="Henter data fra PGA Tour og WAGR"
        />
      </AppShellTemplate>
    );
  }

  if (error) {
    return (
      <AppShellTemplate
        title="Benchmark"
        subtitle="Sammenlign med de beste"
        helpText="Benchmark-analyse som sammenligner din prestasjon mot PGA Tour-profesjonelle og verdens beste amatører (WAGR). Se din posisjon relativt til Tour Average, Top 50 og Top 10. Detaljert kategori-sammenligning for Approach, Putting og Around Green med gap-analyse. Approach-breakdown per avstand (50-200m) fra både fairway og rough med SG, proksimitet og GIR-prosent. Se topp 5 PGA Tour-spillere med totalt SG og turneringsstatistikk. WAGR-rangeringer for menn og kvinner med poeng og trendbevegelse. Bruk for å forstå hvor du ligger an mot de beste og identifisere målsettinger."
      >
        <StateCard
          variant="error"
          title="Kunne ikke laste data"
          description={error}
        />
      </AppShellTemplate>
    );
  }

  return (
    <AppShellTemplate
      title="Benchmark"
      subtitle="Sammenlign med de beste"
      helpText="Benchmark-analyse som sammenligner din prestasjon mot PGA Tour-profesjonelle og verdens beste amatører (WAGR). Se din posisjon relativt til Tour Average, Top 50 og Top 10. Detaljert kategori-sammenligning for Approach, Putting og Around Green med gap-analyse. Approach-breakdown per avstand (50-200m) fra både fairway og rough med SG, proksimitet og GIR-prosent. Se topp 5 PGA Tour-spillere med totalt SG og turneringsstatistikk. WAGR-rangeringer for menn og kvinner med poeng og trendbevegelse. Bruk for å forstå hvor du ligger an mot de beste og identifisere målsettinger."
    >
      {/* Hero Section - Your Current Position */}
      <section style={styles.section}>
        <Card variant="elevated" padding="spacious">
          <div style={styles.heroCard}>
            <div style={styles.heroHeader}>
              <div style={styles.heroIcon}>
                <Trophy size={28} color="white" />
              </div>
              <div>
                <h2 style={styles.heroTitle}>Din posisjon</h2>
                <p style={styles.heroSubtitle}>Slik ligger du an mot de beste</p>
              </div>
            </div>

            <div style={styles.heroStats}>
              {/* Total SG */}
              <div style={styles.heroStatMain}>
                <span style={styles.heroStatLabel}>Total SG</span>
                <span style={{
                  ...styles.heroStatValue,
                  color: getSGColor(sgData?.total || 0),
                }}>
                  {formatSG(sgData?.total)}
                </span>
                <span style={styles.heroStatMeta}>per runde</span>
              </div>

              {/* Gap to Elite */}
              <div style={styles.heroStatSecondary}>
                <div style={styles.gapIndicator}>
                  <span style={styles.gapLabel}>Gap til Top 10</span>
                  <div style={styles.gapValue}>
                    {(() => {
                      const gap = getGapToElite('total');
                      if (!gap) return '-';
                      return (
                        <span style={{ color: gap.gap >= 0 ? 'var(--status-success)' : 'var(--status-error)' }}>
                          {formatSG(gap.gap)}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div style={styles.gapIndicator}>
                  <span style={styles.gapLabel}>PGA Elite</span>
                  <div style={styles.gapValue}>
                    <span style={{ color: 'var(--status-success)' }}>
                      {formatSG(eliteBenchmarks?.top10.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress to Elite Visualization */}
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span>Din progresjon mot elite-nivå</span>
                <span style={styles.progressPercent}>
                  {Math.round(Math.max(0, Math.min(100, ((sgData?.total || 0) + 1) / (eliteBenchmarks?.top10.total || 2.5 + 1) * 100)))}%
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.max(5, Math.min(100, ((sgData?.total || 0) + 1) / ((eliteBenchmarks?.top10.total || 2.5) + 1) * 100))}%`,
                  }}
                />
                {/* Markers */}
                <div style={{ ...styles.progressMarker, left: '40%' }} title="Tour Average" />
                <div style={{ ...styles.progressMarker, left: '70%', backgroundColor: 'var(--status-warning)' }} title="Top 50" />
                <div style={{ ...styles.progressMarker, left: '100%', backgroundColor: 'var(--status-success)' }} title="Top 10" />
              </div>
              <div style={styles.progressLabels}>
                <span>Scratch</span>
                <span>Tour Avg</span>
                <span>Top 50</span>
                <span>Top 10</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Category Comparison */}
      <section style={styles.section}>
        <SectionTitle style={{ marginBottom: 'var(--spacing-4)' }}>
          Kategori-sammenligning
        </SectionTitle>

        <div style={styles.categoryGrid}>
          {[
            { key: 'approach', label: 'Innspill', icon: Crosshair, desc: 'Slag mot green' },
            { key: 'putting', label: 'Putting', icon: CircleDot, desc: 'Slag på green' },
            { key: 'aroundGreen', label: 'Kortspill', icon: Flag, desc: 'Rundt green' },
          ].map(cat => {
            const gap = getGapToElite(cat.key as 'approach' | 'putting' | 'aroundGreen');
            const Icon = cat.icon;

            return (
              <Card key={cat.key} padding="md">
                <div style={styles.categoryCard}>
                  <div style={styles.categoryCardHeader}>
                    <div style={styles.categoryCardIcon}>
                      <Icon size={20} color="var(--accent)" />
                    </div>
                    <div>
                      <SubSectionTitle style={{ margin: 0 }}>{cat.label}</SubSectionTitle>
                      <span style={styles.categoryCardDesc}>{cat.desc}</span>
                    </div>
                  </div>

                  <div style={styles.categoryCardStats}>
                    <div style={styles.categoryCardStat}>
                      <span style={styles.statLabel}>Du</span>
                      <span style={{
                        ...styles.statValue,
                        color: getSGColor(gap?.playerValue || 0),
                      }}>
                        {formatSG(gap?.playerValue)}
                      </span>
                    </div>
                    <div style={styles.categoryCardDivider} />
                    <div style={styles.categoryCardStat}>
                      <span style={styles.statLabel}>Elite</span>
                      <span style={{ ...styles.statValue, color: 'var(--status-success)' }}>
                        {formatSG(gap?.eliteValue)}
                      </span>
                    </div>
                    <div style={styles.categoryCardDivider} />
                    <div style={styles.categoryCardStat}>
                      <span style={styles.statLabel}>Gap</span>
                      <span style={{
                        ...styles.statValue,
                        color: (gap?.gap || 0) >= 0 ? 'var(--status-success)' : 'var(--status-error)',
                      }}>
                        {formatSG(gap?.gap)}
                      </span>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div style={styles.miniProgressTrack}>
                    <div
                      style={{
                        ...styles.miniProgressFill,
                        width: `${Math.max(5, Math.min(100, ((gap?.playerValue || 0) + 0.5) / ((gap?.eliteValue || 0.8) + 0.5) * 100))}%`,
                        backgroundColor: getSGColor(gap?.playerValue || 0),
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Approach Analysis by Distance */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ margin: 0 }}>Approach-analyse</SectionTitle>
          <Badge variant="accent">Pro Data</Badge>
        </div>

        <Card padding="md">
          <div style={styles.approachCard}>
            <p style={styles.approachIntro}>
              Se hvordan PGA-proffene presterer fra ulike avstander. Bruk dette for å identifisere dine fokusområder.
            </p>

            <div style={styles.approachGrid}>
              {approachSkills.map((skill, index) => (
                <ApproachDistanceCard key={skill.distance} skill={skill} index={index} />
              ))}
            </div>

            <div style={styles.approachLegend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--status-success)' }} />
                <span>Fairway</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--status-warning)' }} />
                <span>Rough</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Top PGA Players */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ margin: 0 }}>PGA Tour Topp 5</SectionTitle>
          <Badge variant="success">2025</Badge>
        </div>

        <Card padding="none">
          <div style={styles.playerList}>
            {topPlayers.map((player, index) => (
              <div key={player.name} style={styles.playerRow}>
                <div style={styles.playerRank}>
                  {index === 0 && <Trophy size={16} color="var(--achievement)" />}
                  {index > 0 && <span style={styles.rankNumber}>{index + 1}</span>}
                </div>
                <div style={styles.playerInfo}>
                  <span style={styles.playerName}>{player.name}</span>
                  <span style={styles.playerMeta}>
                    {player.eventsPlayed} turneringer, {player.wins} seiere
                  </span>
                </div>
                <div style={styles.playerStats}>
                  <span style={{
                    ...styles.playerSG,
                    color: getSGColor(player.sgTotal),
                  }}>
                    {formatSG(player.sgTotal)}
                  </span>
                  <span style={styles.playerSGLabel}>Total SG</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* WAGR Rankings */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ margin: 0 }}>WAGR - Verdens beste amatører</SectionTitle>
          <Globe size={20} color="var(--text-secondary)" />
        </div>

        <div style={styles.wagrGrid}>
          {/* Men */}
          <Card padding="md">
            <div style={styles.wagrCard}>
              <div style={styles.wagrHeader}>
                <Users size={18} color="var(--accent)" />
                <SubSectionTitle style={{ margin: 0 }}>Menn</SubSectionTitle>
              </div>
              <div style={styles.wagrList}>
                {wagrRankings.men.map((player, index) => (
                  <div key={player.name} style={styles.wagrRow}>
                    <div style={styles.wagrRank}>
                      {index === 0 ? (
                        <Star size={14} color="var(--achievement)" fill="var(--achievement)" />
                      ) : (
                        <span>{player.rank}</span>
                      )}
                    </div>
                    <div style={styles.wagrInfo}>
                      <span style={styles.wagrName}>{player.name}</span>
                      <span style={styles.wagrCountry}>{player.country}</span>
                    </div>
                    <div style={styles.wagrPoints}>
                      {player.pointsAvg.toFixed(0)}
                    </div>
                    <div style={{
                      ...styles.wagrMove,
                      color: player.move > 0 ? 'var(--status-success)' : player.move < 0 ? 'var(--status-error)' : 'var(--text-tertiary)',
                    }}>
                      {player.move > 0 && <TrendingUp size={12} />}
                      {player.move < 0 && <TrendingDown size={12} />}
                      {player.move === 0 && '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Women */}
          <Card padding="md">
            <div style={styles.wagrCard}>
              <div style={styles.wagrHeader}>
                <Users size={18} color="var(--accent)" />
                <SubSectionTitle style={{ margin: 0 }}>Kvinner</SubSectionTitle>
              </div>
              <div style={styles.wagrList}>
                {wagrRankings.women.map((player, index) => (
                  <div key={player.name} style={styles.wagrRow}>
                    <div style={styles.wagrRank}>
                      {index === 0 ? (
                        <Star size={14} color="var(--achievement)" fill="var(--achievement)" />
                      ) : (
                        <span>{player.rank}</span>
                      )}
                    </div>
                    <div style={styles.wagrInfo}>
                      <span style={styles.wagrName}>{player.name}</span>
                      <span style={styles.wagrCountry}>{player.country}</span>
                    </div>
                    <div style={styles.wagrPoints}>
                      {player.pointsAvg.toFixed(0)}
                    </div>
                    <div style={{
                      ...styles.wagrMove,
                      color: player.move > 0 ? 'var(--status-success)' : player.move < 0 ? 'var(--status-error)' : 'var(--text-tertiary)',
                    }}>
                      {player.move > 0 && <TrendingUp size={12} />}
                      {player.move < 0 && <TrendingDown size={12} />}
                      {player.move === 0 && '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Inspiration Quote */}
      <section style={styles.section}>
        <Card variant="flat" padding="spacious">
          <div style={styles.quoteCard}>
            <Zap size={24} color="var(--accent)" />
            <blockquote style={styles.quote}>
              "The most important shot in golf is the next one."
            </blockquote>
            <cite style={styles.quoteCite}>— Ben Hogan</cite>
          </div>
        </Card>
      </section>
    </AppShellTemplate>
  );
};

// Approach Distance Card Component
const ApproachDistanceCard: React.FC<{ skill: ApproachSkillData; index: number }> = ({ skill, index }) => {
  const gradients = [
    'linear-gradient(135deg, var(--tier-success/20) 0%, rgb(var(--status-success)) 100%)',
    'linear-gradient(135deg, var(--tier-info/20) 0%, rgb(var(--status-info)) 100%)',
    'linear-gradient(135deg, var(--tier-navy-light) 0%, var(--tier-navy) 100%)',
    'linear-gradient(135deg, var(--status-warning-light) 0%, rgb(var(--status-warning)) 100%)',
  ];

  return (
    <div style={styles.approachDistanceCard}>
      <div style={{ ...styles.approachDistanceHeader, background: gradients[index % 4] }}>
        <Target size={18} color="white" />
        <span style={styles.approachDistanceTitle}>{skill.distance}</span>
      </div>
      <div style={styles.approachDistanceBody}>
        <div style={styles.approachLieRow}>
          <span style={styles.approachLieLabel}>Fairway</span>
          <div style={styles.approachLieStats}>
            <div style={styles.approachLieStat}>
              <span style={styles.approachLieValue}>
                {skill.fairway.sgPerShot >= 0 ? '+' : ''}{skill.fairway.sgPerShot.toFixed(2)}
              </span>
              <span style={styles.approachLieMeta}>SG/slag</span>
            </div>
            <div style={styles.approachLieStat}>
              <span style={styles.approachLieValue}>{skill.fairway.proximity.toFixed(1)}m</span>
              <span style={styles.approachLieMeta}>Prox</span>
            </div>
            <div style={styles.approachLieStat}>
              <span style={styles.approachLieValue}>{Math.round(skill.fairway.greenHitRate * 100)}%</span>
              <span style={styles.approachLieMeta}>GIR</span>
            </div>
          </div>
        </div>
        <div style={styles.approachDivider} />
        <div style={styles.approachLieRow}>
          <span style={{ ...styles.approachLieLabel, color: 'var(--status-warning)' }}>Rough</span>
          <div style={styles.approachLieStats}>
            <div style={styles.approachLieStat}>
              <span style={styles.approachLieValue}>
                {skill.rough.sgPerShot >= 0 ? '+' : ''}{skill.rough.sgPerShot.toFixed(2)}
              </span>
              <span style={styles.approachLieMeta}>SG/slag</span>
            </div>
            <div style={styles.approachLieStat}>
              <span style={styles.approachLieValue}>{skill.rough.proximity.toFixed(1)}m</span>
              <span style={styles.approachLieMeta}>Prox</span>
            </div>
            <div style={styles.approachLieStat}>
              <span style={styles.approachLieValue}>{Math.round(skill.rough.greenHitRate * 100)}%</span>
              <span style={styles.approachLieMeta}>GIR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },

  // Hero Card
  heroCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-5)',
  },
  heroHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
  },
  heroIcon: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark, var(--accent)) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  heroTitle: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  heroSubtitle: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  heroStats: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 'var(--spacing-6)',
    flexWrap: 'wrap',
  },
  heroStatMain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'var(--spacing-1)',
  },
  heroStatLabel: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  heroStatValue: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  heroStatMeta: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
  },
  heroStatSecondary: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
    marginLeft: 'auto',
  },
  gapIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  gapLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  gapValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },

  // Progress
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  progressPercent: {
    fontWeight: 600,
    color: 'var(--accent)',
  },
  progressTrack: {
    position: 'relative',
    height: '12px',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: '6px',
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent) 0%, var(--status-success) 100%)',
    borderRadius: '6px',
    transition: 'width 0.5s ease-out',
  },
  progressMarker: {
    position: 'absolute',
    top: '-4px',
    width: '4px',
    height: '20px',
    backgroundColor: 'var(--text-tertiary)',
    borderRadius: '2px',
    transform: 'translateX(-50%)',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    marginTop: 'var(--spacing-1)',
  },

  // Category Grid
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--spacing-4)',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  categoryCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  categoryCardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardDesc: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  categoryCardStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 'var(--radius-md)',
  },
  categoryCardStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    flex: 1,
  },
  categoryCardDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'var(--border-subtle)',
  },
  statLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  miniProgressTrack: {
    height: '4px',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },

  // Approach Analysis
  approachCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  approachIntro: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  approachGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--spacing-4)',
  },
  approachDistanceCard: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
  },
  approachDistanceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    color: 'white',
  },
  approachDistanceTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
  },
  approachDistanceBody: {
    padding: 'var(--spacing-3)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  approachLieRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-2)',
  },
  approachLieLabel: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--status-success)',
    minWidth: '50px',
  },
  approachLieStats: {
    display: 'flex',
    gap: 'var(--spacing-3)',
  },
  approachLieStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  approachLieValue: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  approachLieMeta: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  approachDivider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: 'var(--spacing-1) 0',
  },
  approachLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--spacing-4)',
    paddingTop: 'var(--spacing-2)',
    borderTop: '1px solid var(--border-subtle)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
  },

  // Player List
  playerList: {
    display: 'flex',
    flexDirection: 'column',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
    gap: 'var(--spacing-3)',
  },
  playerRank: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  playerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  playerName: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  playerMeta: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  playerStats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  playerSG: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  playerSGLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },

  // WAGR Grid
  wagrGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--spacing-4)',
  },
  wagrCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  wagrHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    paddingBottom: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  wagrList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  wagrRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.15s ease',
  },
  wagrRank: {
    width: '24px',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  wagrInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  wagrName: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  wagrCountry: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  wagrPoints: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--accent)',
    fontVariantNumeric: 'tabular-nums',
  },
  wagrMove: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--font-size-caption1)',
    width: '20px',
    justifyContent: 'center',
  },

  // Quote Card
  quoteCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    textAlign: 'center',
  },
  quote: {
    fontSize: 'var(--font-size-title3)',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: 1.5,
  },
  quoteCite: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    fontStyle: 'normal',
  },
};

export default BenchmarkPage;
