import React from 'react';
import { TrendingUp, TrendingDown, Target, Minus } from 'lucide-react';
import { DashboardCard, WidgetHeader } from '../../ui/widgets';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';

/**
 * Strokes Gained Widget for Player Dashboard
 * Displays SG breakdown by category with tour comparison
 */

const SG_CATEGORIES = [
  { id: 'approach', label: 'Approach', icon: '🎯', color: 'var(--accent)' },
  { id: 'around_green', label: 'Kortspill', icon: '⛳', color: 'var(--success)' },
  { id: 'putting', label: 'Putting', icon: '🏌️', color: 'var(--warning)' },
];

const SGCategoryBar = ({ category, value, tourAvg = 0, pgaElite = 0.8 }) => {
  // Normalize value to a 0-100 scale for display
  // Range: -1.5 (worst) to +1.5 (elite)
  const normalizedValue = Math.max(0, Math.min(100, ((value + 1.5) / 3) * 100));
  const tourMarker = ((tourAvg + 1.5) / 3) * 100;
  const eliteMarker = ((pgaElite + 1.5) / 3) * 100;

  const getValueColor = () => {
    if (value >= 0.3) return 'var(--success)';
    if (value >= 0) return 'var(--accent)';
    if (value >= -0.3) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>{category.icon}</span>
          {category.label}
        </span>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: getValueColor(),
        }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      </div>

      {/* Progress bar with markers */}
      <div style={{
        position: 'relative',
        height: '8px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '4px',
        overflow: 'visible',
      }}>
        {/* Tour average marker */}
        <div style={{
          position: 'absolute',
          left: `${tourMarker}%`,
          top: '-2px',
          width: '2px',
          height: '12px',
          backgroundColor: 'var(--text-secondary)',
          borderRadius: '1px',
          zIndex: 2,
        }} title="PGA Tour snitt" />

        {/* Elite marker */}
        <div style={{
          position: 'absolute',
          left: `${eliteMarker}%`,
          top: '-2px',
          width: '2px',
          height: '12px',
          backgroundColor: 'var(--success)',
          borderRadius: '1px',
          zIndex: 2,
        }} title="PGA Elite" />

        {/* Value bar */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${normalizedValue}%`,
          backgroundColor: getValueColor(),
          borderRadius: '4px',
          transition: 'width 0.5s ease-out',
        }} />
      </div>

      {/* Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
        fontSize: '10px',
        color: 'var(--text-tertiary)',
      }}>
        <span>-1.5</span>
        <span>Tour avg</span>
        <span>+1.5</span>
      </div>
    </div>
  );
};

const SGSummaryCard = ({ total, trend, percentile }) => {
  const getTrendIcon = () => {
    if (trend > 0.05) return <TrendingUp size={16} style={{ color: 'var(--success)' }} />;
    if (trend < -0.05) return <TrendingDown size={16} style={{ color: 'var(--error)' }} />;
    return <Minus size={16} style={{ color: 'var(--text-secondary)' }} />;
  };

  const getTrendColor = () => {
    if (trend > 0.05) return 'var(--success)';
    if (trend < -0.05) return 'var(--error)';
    return 'var(--text-secondary)';
  };

  const getPercentileLabel = () => {
    if (percentile >= 90) return 'Elite';
    if (percentile >= 75) return 'Sterk';
    if (percentile >= 50) return 'Gjennomsnitt';
    if (percentile >= 25) return 'Under snitt';
    return 'Trenger fokus';
  };

  const getPercentileVariant = () => {
    if (percentile >= 75) return 'success';
    if (percentile >= 50) return 'accent';
    if (percentile >= 25) return 'warning';
    return 'error';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '20px',
    }}>
      <div>
        <p style={{
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
        }}>
          Total Strokes Gained
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{
            fontSize: '32px',
            fontWeight: 700,
            color: total >= 0 ? 'var(--success)' : 'var(--error)',
          }}>
            {total >= 0 ? '+' : ''}{total.toFixed(2)}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            color: getTrendColor(),
          }}>
            {getTrendIcon()}
            <span>{trend >= 0 ? '+' : ''}{trend.toFixed(2)} denne uken</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <Badge variant={getPercentileVariant()} size="md">
          {getPercentileLabel()}
        </Badge>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginTop: '4px',
          margin: '4px 0 0 0',
        }}>
          Top {100 - percentile}% vs tour
        </p>
      </div>
    </div>
  );
};

const StrokesGainedWidget = ({ data, loading, error, onViewDetails }) => {
  if (loading) {
    return (
      <DashboardCard padding="lg">
        <WidgetHeader title="Strokes Gained" icon={Target} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px 0',
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '48px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard padding="lg">
        <WidgetHeader title="Strokes Gained" icon={Target} />
        <StateCard
          variant="error"
          title="Kunne ikke laste SG-data"
          description="Prøv igjen senere"
          compact
        />
      </DashboardCard>
    );
  }

  if (!data) {
    return (
      <DashboardCard padding="lg">
        <WidgetHeader title="Strokes Gained" icon={Target} />
        <StateCard
          variant="empty"
          title="Laster SG-data..."
          description="Vennligst vent"
          compact
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard padding="lg">
      <WidgetHeader
        title="Strokes Gained"
        icon={Target}
        action={onViewDetails}
        actionLabel="Detaljer"
      />

      {/* Demo data indicator */}
      {data.isDemo && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          fontSize: '12px',
          color: 'var(--accent)',
        }}>
          <Target size={14} />
          <span>Eksempeldata – fullfør tester for å se dine resultater</span>
        </div>
      )}

      {/* Summary Card */}
      <SGSummaryCard
        total={data.total}
        trend={data.trend}
        percentile={data.percentile}
      />

      {/* Category Breakdown */}
      <div>
        {SG_CATEGORIES.map(category => {
          const categoryData = data.byCategory?.[category.id] || { value: 0, tourAvg: 0 };
          return (
            <SGCategoryBar
              key={category.id}
              category={category}
              value={categoryData.value}
              tourAvg={categoryData.tourAvg}
              pgaElite={categoryData.pgaElite || 0.8}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-default)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--text-secondary)',
            borderRadius: '2px',
          }} />
          Tour snitt
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--success)',
            borderRadius: '2px',
          }} />
          PGA Elite
        </div>
      </div>
    </DashboardCard>
  );
};

export default StrokesGainedWidget;
