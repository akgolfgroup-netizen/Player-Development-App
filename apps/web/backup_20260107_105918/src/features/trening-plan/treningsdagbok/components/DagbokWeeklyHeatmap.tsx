/**
 * DagbokWeeklyHeatmap
 *
 * 7x5 heatmap grid showing training intensity.
 * Rows: Monday-Sunday, Columns: FYS/TEK/SLAG/SPILL/TURN
 */

import React, { useState, useCallback } from 'react';

import type { WeeklyHeatmapData, HeatmapCell, DagbokWeeklyHeatmapProps, Pyramid } from '../types';
import {
  DAY_NAMES,
  HEATMAP_PYRAMID_ORDER,
  PYRAMIDS,
  HEATMAP_INTENSITY_COLORS_FALLBACK,
} from '../constants';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    padding: '16px',
    backgroundColor: 'var(--card-background)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  weekLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  grid: {
    display: 'grid',
    gap: '3px',
  },
  headerRow: {
    display: 'contents',
  },
  cornerCell: {
    width: '40px',
  },
  pyramidHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  pyramidIcon: {
    fontSize: '14px',
    marginBottom: '2px',
  },
  row: {
    display: 'contents',
  },
  dayLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  cell: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 'var(--radius-xs)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 500,
    color: 'transparent',
    border: '1px solid transparent',
  },
  cellHover: {
    border: '1px solid var(--accent)',
    color: 'var(--text-primary)',
  },
  tooltip: {
    position: 'absolute' as const,
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--bg-overlay)',
    color: 'var(--text-inverted)',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
  },
  tooltipLabel: {
    color: 'var(--text-inverted)',
    opacity: 0.7,
  },
  tooltipValue: {
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  legendLabel: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
  },
  legendCells: {
    display: 'flex',
    gap: '2px',
  },
  legendCell: (intensity: number) => ({
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    backgroundColor: HEATMAP_INTENSITY_COLORS_FALLBACK[intensity as 0 | 1 | 2 | 3 | 4],
    border: '1px solid var(--border-subtle)',
  }),
  summary: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2px',
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  summaryLabel: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
  },
  skeletonCell: {
    backgroundColor: 'var(--skeleton-bg)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

// =============================================================================
// CELL COMPONENT
// =============================================================================

interface HeatmapCellComponentProps {
  cell: HeatmapCell;
  dayName: string;
  pyramidLabel: string;
  onClick?: () => void;
}

const HeatmapCellComponent: React.FC<HeatmapCellComponentProps> = ({
  cell,
  dayName,
  pyramidLabel,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowTooltip(false);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          ...styles.cell,
          backgroundColor: HEATMAP_INTENSITY_COLORS_FALLBACK[cell.intensity],
          ...(isHovered ? styles.cellHover : {}),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        role="gridcell"
        aria-label={`${dayName} ${pyramidLabel}: ${cell.minutes} minutter`}
      >
        {cell.minutes > 0 && isHovered && cell.minutes}
      </div>

      {showTooltip && cell.minutes > 0 && (
        <div style={styles.tooltip}>
          <div style={{ marginBottom: '4px', fontWeight: 600 }}>
            {dayName} | {pyramidLabel}
          </div>
          <div style={styles.tooltipRow}>
            <span style={styles.tooltipLabel}>Tid:</span>
            <span style={styles.tooltipValue}>{cell.minutes} min</span>
          </div>
          <div style={styles.tooltipRow}>
            <span style={styles.tooltipLabel}>Okter:</span>
            <span style={styles.tooltipValue}>{cell.sessions}</span>
          </div>
          {cell.complianceRate > 0 && (
            <div style={styles.tooltipRow}>
              <span style={styles.tooltipLabel}>Compliance:</span>
              <span style={styles.tooltipValue}>{cell.complianceRate}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// COMPONENT
// =============================================================================

export const DagbokWeeklyHeatmap: React.FC<DagbokWeeklyHeatmapProps> = ({
  data,
  isLoading = false,
  onCellClick,
  className = '',
}) => {
  // Create grid template
  const gridStyle = {
    ...styles.grid,
    gridTemplateColumns: `40px repeat(${HEATMAP_PYRAMID_ORDER.length}, 1fr)`,
    gridTemplateRows: `auto repeat(7, 1fr)`,
  };

  if (isLoading) {
    return (
      <div className={className} style={styles.container}>
        <div style={styles.header}>
          <span style={styles.title}>Ukeoversikt</span>
        </div>
        <div style={gridStyle}>
          {/* Header row skeleton */}
          <div style={styles.cornerCell} />
          {HEATMAP_PYRAMID_ORDER.map((p) => (
            <div key={p} style={{ ...styles.cell, ...styles.skeletonCell }} />
          ))}
          {/* Data rows skeleton */}
          {Array.from({ length: 7 }).map((_, day) => (
            <React.Fragment key={day}>
              <div style={styles.dayLabel}>{DAY_NAMES[day]}</div>
              {HEATMAP_PYRAMID_ORDER.map((p) => (
                <div key={`${day}-${p}`} style={{ ...styles.cell, ...styles.skeletonCell }} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Find cells by day and pyramid
  const getCellData = (day: number, pyramid: Pyramid): HeatmapCell => {
    return (
      data.cells.find((c) => c.day === day && c.pyramid === pyramid) || {
        day,
        pyramid,
        minutes: 0,
        sessions: 0,
        intensity: 0,
        plannedMinutes: 0,
        complianceRate: 0,
      }
    );
  };

  return (
    <div className={className} style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Ukeoversikt</span>
        <span style={styles.weekLabel}>
          Uke {data.weekNumber}, {data.year}
        </span>
      </div>

      <div style={gridStyle}>
        {/* Header row with pyramid labels */}
        <div style={styles.cornerCell} />
        {HEATMAP_PYRAMID_ORDER.map((pyramid) => (
          <div key={pyramid} style={styles.pyramidHeader}>
            <span style={styles.pyramidIcon}>{PYRAMIDS[pyramid].icon}</span>
            <span>{pyramid}</span>
          </div>
        ))}

        {/* Data rows */}
        {Array.from({ length: 7 }).map((_, day) => (
          <React.Fragment key={day}>
            <div style={styles.dayLabel}>{DAY_NAMES[day]}</div>
            {HEATMAP_PYRAMID_ORDER.map((pyramid) => {
              const cell = getCellData(day, pyramid);
              return (
                <HeatmapCellComponent
                  key={`${day}-${pyramid}`}
                  cell={cell}
                  dayName={DAY_NAMES[day]}
                  pyramidLabel={PYRAMIDS[pyramid].label}
                  onClick={() => onCellClick?.(cell)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendLabel}>Mindre</span>
        <div style={styles.legendCells}>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div key={intensity} style={styles.legendCell(intensity)} />
          ))}
        </div>
        <span style={styles.legendLabel}>Mer</span>
      </div>

      {/* Summary */}
      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{data.totalSessions}</span>
          <span style={styles.summaryLabel}>Okter</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{data.totalMinutes}</span>
          <span style={styles.summaryLabel}>Minutter</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{data.avgMinutesPerDay}</span>
          <span style={styles.summaryLabel}>Snitt/dag</span>
        </div>
      </div>
    </div>
  );
};

export default DagbokWeeklyHeatmap;
