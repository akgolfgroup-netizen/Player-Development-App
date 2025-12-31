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
// UiCanon: CSS variables
import { TrendingUp, TrendingDown, Target, Battery, BarChart2, Calendar } from 'lucide-react';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatCard({ title, value, subtitle, trend, icon: Icon, color }) {
  const trendColor = trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--error)' : 'var(--text-secondary)';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : null;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {value}
            </span>
            {trend !== undefined && TrendIcon && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: trendColor, fontSize: '12px', lineHeight: '16px' }}>
                <TrendIcon size={14} />
                {Math.abs(trend).toFixed(1)}
              </span>
            )}
          </div>
          {subtitle && (
            <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>
              {subtitle}
            </span>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: `${color || 'var(--accent)'}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} color={color || 'var(--accent)'} />
          </div>
        )}
      </div>
    </div>
  );
}

function RatingBar({ label, value, maxValue = 10, color }) {
  const percentage = (value / maxValue) * 100;

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>{value.toFixed(1)}/10</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--border-default)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color || 'var(--accent)',
            borderRadius: '9999px',
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
      <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
        Ingen tekniske cues registrert enna
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {cues.map((cue, index) => (
        <div
          key={cue.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: index === 0 ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
            {cue.name}
          </span>
          <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--accent)' }}>
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
      <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
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
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div style={{ width: `${percentages.yes}%`, backgroundColor: 'var(--success)' }} />
        <div style={{ width: `${percentages.partial}%`, backgroundColor: 'var(--warning)' }} />
        <div style={{ width: `${percentages.no}%`, backgroundColor: 'var(--error)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--success)', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>Ja ({percentages.yes.toFixed(0)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--warning)', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>Delvis ({percentages.partial.toFixed(0)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--error)', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)' }}>Nei ({percentages.no.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <SubSectionTitle style={{ marginBottom: '16px' }}>
        {title}
      </SubSectionTitle>
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
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
          Laster statistikk...
        </span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
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
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <SectionTitle>
          Evalueringsstatistikk
        </SectionTitle>
        <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
          Oversikt over dine treningsevalueringer
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard
          title="Antall okter"
          value={stats.totalSessions || 0}
          subtitle="siste 30 dager"
          icon={Calendar}
          color={'var(--accent)'}
        />
        <StatCard
          title="Gj.snitt fokus"
          value={(stats.averages?.focus || 0).toFixed(1)}
          trend={focusTrend}
          icon={Target}
          color={'var(--success)'}
        />
        <StatCard
          title="Gj.snitt teknikk"
          value={(stats.averages?.technical || 0).toFixed(1)}
          trend={technicalTrend}
          icon={BarChart2}
          color={'var(--accent)'}
        />
        <StatCard
          title="Gj.snitt energi"
          value={(stats.averages?.energy || 0).toFixed(1)}
          trend={energyTrend}
          icon={Battery}
          color={'var(--warning)'}
        />
      </div>

      {/* Rating Breakdown */}
      <Section title="Gjennomsnittlige vurderinger">
        <RatingBar
          label="Fokus"
          value={stats.averages?.focus || 0}
          color={'var(--success)'}
        />
        <RatingBar
          label="Teknisk"
          value={stats.averages?.technical || 0}
          color={'var(--accent)'}
        />
        <RatingBar
          label="Energi"
          value={stats.averages?.energy || 0}
          color={'var(--warning)'}
        />
        <RatingBar
          label="Mental"
          value={stats.averages?.mental || 0}
          color={'var(--achievement)'}
        />
      </Section>

      {/* Pre-shot Routine */}
      <Section title="Pre-shot rutine konsistens">
        <PreShotRoutineChart data={stats.preShotRoutine} />
        {stats.preShotRoutine && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
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
                gap: '8px',
                padding: '8px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{insight.icon || '💡'}</span>
              <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
                {insight.text}
              </span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
