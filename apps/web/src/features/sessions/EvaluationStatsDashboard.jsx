/**
 * EvaluationStatsDashboard - Display session evaluation statistics
 *
 * Shows:
 * - Average ratings over time (focus, technical, energy, mental)
 * - Pre-shot routine consistency
 * - Technical cues usage frequency
 * - Session trends and insights
 */
import React from 'react';
import { tokens, typographyStyle } from '../../design-tokens';
import { TrendingUp, TrendingDown, Target, Battery, BarChart2, Calendar } from 'lucide-react';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatCard({ title, value, subtitle, trend, icon: Icon, color }) {
  const trendColor = trend > 0 ? tokens.colors.success : trend < 0 ? tokens.colors.error : tokens.colors.steel;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : null;

  return (
    <div
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing.lg,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: tokens.spacing.sm, marginTop: tokens.spacing.xs }}>
            <span style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal }}>
              {value}
            </span>
            {trend !== undefined && TrendIcon && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: trendColor, ...typographyStyle('caption') }}>
                <TrendIcon size={14} />
                {Math.abs(trend).toFixed(1)}
              </span>
            )}
          </div>
          {subtitle && (
            <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>
              {subtitle}
            </span>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: tokens.borderRadius.md,
              backgroundColor: `${color || tokens.colors.primary}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} color={color || tokens.colors.primary} />
          </div>
        )}
      </div>
    </div>
  );
}

function RatingBar({ label, value, maxValue = 10, color }) {
  const percentage = (value / maxValue) * 100;

  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.xs }}>
        <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>{label}</span>
        <span style={{ ...typographyStyle('label'), color: tokens.colors.primary }}>{value.toFixed(1)}/10</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: tokens.colors.mist,
          borderRadius: tokens.borderRadius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color || tokens.colors.primary,
            borderRadius: tokens.borderRadius.full,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

function TechnicalCuesList({ cues }) {
  if (!cues || cues.length === 0) {
    return (
      <p style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
        Ingen tekniske cues registrert enna
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
      {cues.map((cue, index) => (
        <div
          key={cue.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: tokens.spacing.sm,
            backgroundColor: index === 0 ? `${tokens.colors.primary}10` : tokens.colors.snow,
            borderRadius: tokens.borderRadius.md,
          }}
        >
          <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
            {cue.name}
          </span>
          <span style={{ ...typographyStyle('label'), color: tokens.colors.primary }}>
            {cue.count}x
          </span>
        </div>
      ))}
    </div>
  );
}

function PreShotRoutineChart({ data }) {
  if (!data) {
    return (
      <p style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
        Ingen pre-shot data tilgjengelig
      </p>
    );
  }

  const total = data.yes + data.partial + data.no;
  const percentages = {
    yes: total > 0 ? (data.yes / total) * 100 : 0,
    partial: total > 0 ? (data.partial / total) * 100 : 0,
    no: total > 0 ? (data.no / total) * 100 : 0,
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          height: '24px',
          borderRadius: tokens.borderRadius.md,
          overflow: 'hidden',
          marginBottom: tokens.spacing.md,
        }}
      >
        <div style={{ width: `${percentages.yes}%`, backgroundColor: tokens.colors.success }} />
        <div style={{ width: `${percentages.partial}%`, backgroundColor: tokens.colors.warning }} />
        <div style={{ width: `${percentages.no}%`, backgroundColor: tokens.colors.error }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: tokens.colors.success, borderRadius: '2px' }} />
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>Ja ({percentages.yes.toFixed(0)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: tokens.colors.warning, borderRadius: '2px' }} />
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>Delvis ({percentages.partial.toFixed(0)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: tokens.colors.error, borderRadius: '2px' }} />
          <span style={{ ...typographyStyle('caption'), color: tokens.colors.steel }}>Nei ({percentages.no.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing.lg,
        marginBottom: tokens.spacing.md,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <h3
        style={{
          ...typographyStyle('title3'),
          color: tokens.colors.charcoal,
          marginBottom: tokens.spacing.md,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EvaluationStatsDashboard({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div style={{ padding: tokens.spacing.lg, textAlign: 'center' }}>
        <span style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
          Laster statistikk...
        </span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: tokens.spacing.lg, textAlign: 'center' }}>
        <span style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
          Ingen statistikk tilgjengelig
        </span>
      </div>
    );
  }

  // Calculate trends (compare to previous period)
  const focusTrend = stats.trends?.focus || 0;
  const technicalTrend = stats.trends?.technical || 0;
  const energyTrend = stats.trends?.energy || 0;

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        minHeight: '100vh',
        fontFamily: tokens.typography.fontFamily,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <h1 style={{ ...typographyStyle('title1'), color: tokens.colors.charcoal }}>
          Evalueringsstatistikk
        </h1>
        <p style={{ ...typographyStyle('body'), color: tokens.colors.steel }}>
          Oversikt over dine treningsevalueringer
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: tokens.spacing.md,
          marginBottom: tokens.spacing.lg,
        }}
      >
        <StatCard
          title="Antall okter"
          value={stats.totalSessions || 0}
          subtitle="siste 30 dager"
          icon={Calendar}
          color={tokens.colors.primary}
        />
        <StatCard
          title="Gj.snitt fokus"
          value={(stats.averages?.focus || 0).toFixed(1)}
          trend={focusTrend}
          icon={Target}
          color={tokens.colors.success}
        />
        <StatCard
          title="Gj.snitt teknikk"
          value={(stats.averages?.technical || 0).toFixed(1)}
          trend={technicalTrend}
          icon={BarChart2}
          color={tokens.colors.primary}
        />
        <StatCard
          title="Gj.snitt energi"
          value={(stats.averages?.energy || 0).toFixed(1)}
          trend={energyTrend}
          icon={Battery}
          color={tokens.colors.warning}
        />
      </div>

      {/* Rating Breakdown */}
      <Section title="Gjennomsnittlige vurderinger">
        <RatingBar
          label="Fokus"
          value={stats.averages?.focus || 0}
          color={tokens.colors.success}
        />
        <RatingBar
          label="Teknisk"
          value={stats.averages?.technical || 0}
          color={tokens.colors.primary}
        />
        <RatingBar
          label="Energi"
          value={stats.averages?.energy || 0}
          color={tokens.colors.warning}
        />
        <RatingBar
          label="Mental"
          value={stats.averages?.mental || 0}
          color={tokens.colors.gold}
        />
      </Section>

      {/* Pre-shot Routine */}
      <Section title="Pre-shot rutine konsistens">
        <PreShotRoutineChart data={stats.preShotRoutine} />
        {stats.preShotRoutine && (
          <div style={{ marginTop: tokens.spacing.md }}>
            <p style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
              Gjennomsnitt: {stats.preShotRoutine.averageCount?.toFixed(0) || 0} av {stats.preShotRoutine.averageTotal?.toFixed(0) || 0} slag
            </p>
          </div>
        )}
      </Section>

      {/* Top Technical Cues */}
      <Section title="Mest brukte tekniske cues">
        <TechnicalCuesList cues={stats.topTechnicalCues} />
      </Section>

      {/* Insights */}
      {stats.insights && stats.insights.length > 0 && (
        <Section title="Innsikt">
          {stats.insights.map((insight, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: tokens.spacing.sm,
                padding: tokens.spacing.sm,
                backgroundColor: tokens.colors.snow,
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.sm,
              }}
            >
              <span style={{ fontSize: '16px' }}>{insight.icon || '💡'}</span>
              <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
                {insight.text}
              </span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
