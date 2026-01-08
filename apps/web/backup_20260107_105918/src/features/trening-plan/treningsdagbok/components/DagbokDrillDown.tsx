/**
 * DagbokDrillDown
 *
 * Interactive drill-down visualization for AK Formula hierarchy.
 * User can click through: Pyramid → Phase → Area with hours/reps at each level.
 *
 * Example flow: TEK → Fase 4 (L-BALL) → Innspill 100m
 */

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Clock, Flame, TrendingUp } from 'lucide-react';
import type { Pyramid } from '../types';
import { PYRAMIDS, AREAS, L_PHASES, PYRAMID_COLORS } from '../constants';
import { PYRAMID_ICONS } from '../../../../constants/icons';

interface DrillDownData {
  pyramid: Pyramid;
  hours: number;
  reps: number;
  sessions: number;
  phases?: {
    phase: string;
    label: string;
    hours: number;
    reps: number;
    areas?: {
      area: string;
      label: string;
      hours: number;
      reps: number;
    }[];
  }[];
}

interface DagbokDrillDownProps {
  data: DrillDownData[];
  className?: string;
}

type DrillLevel = 'pyramid' | 'phase' | 'area';

const styles = {
  container: {
    backgroundColor: 'var(--card-background)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-default)',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  breadcrumbItem: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: isActive ? 'default' : 'pointer',
    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
    fontWeight: isActive ? 600 : 500,
  }),
  content: {
    padding: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  card: (pyramid: Pyramid) => ({
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    border: `2px solid ${PYRAMID_COLORS[pyramid].border}`,
    backgroundColor: PYRAMID_COLORS[pyramid].bg,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  cardIcon: (pyramid: Pyramid) => ({
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: PYRAMID_COLORS[pyramid].text,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  cardTitle: (pyramid: Pyramid) => ({
    fontSize: '15px',
    fontWeight: 600,
    color: PYRAMID_COLORS[pyramid].text,
    flex: 1,
  }),
  cardStats: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  statValue: {
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  backButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--accent)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 150ms ease',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: 'var(--text-tertiary)',
    fontSize: '14px',
  },
};

export const DagbokDrillDown: React.FC<DagbokDrillDownProps> = ({
  data,
  className = '',
}) => {
  const [selectedPyramid, setSelectedPyramid] = useState<Pyramid | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const currentLevel: DrillLevel = selectedPhase
    ? 'area'
    : selectedPyramid
    ? 'phase'
    : 'pyramid';

  const currentData = useMemo(() => {
    if (currentLevel === 'pyramid') {
      return data;
    }

    if (currentLevel === 'phase') {
      const pyramidData = data.find((d) => d.pyramid === selectedPyramid);
      return pyramidData?.phases || [];
    }

    if (currentLevel === 'area') {
      const pyramidData = data.find((d) => d.pyramid === selectedPyramid);
      const phaseData = pyramidData?.phases?.find((p) => p.phase === selectedPhase);
      return phaseData?.areas || [];
    }

    return [];
  }, [currentLevel, selectedPyramid, selectedPhase, data]);

  const handlePyramidClick = (pyramid: Pyramid) => {
    setSelectedPyramid(pyramid);
    setSelectedPhase(null);
  };

  const handlePhaseClick = (phase: string) => {
    setSelectedPhase(phase);
  };

  const handleBack = () => {
    if (currentLevel === 'area') {
      setSelectedPhase(null);
    } else if (currentLevel === 'phase') {
      setSelectedPyramid(null);
    }
  };

  const handleBreadcrumbClick = (level: DrillLevel) => {
    if (level === 'pyramid') {
      setSelectedPyramid(null);
      setSelectedPhase(null);
    } else if (level === 'phase') {
      setSelectedPhase(null);
    }
  };

  return (
    <div className={className} style={styles.container}>
      {/* Header with breadcrumb */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span
            style={styles.breadcrumbItem(currentLevel === 'pyramid')}
            onClick={() => handleBreadcrumbClick('pyramid')}
          >
            Pyramide
          </span>
          {selectedPyramid && (
            <>
              <ChevronRight size={14} />
              <span
                style={styles.breadcrumbItem(currentLevel === 'phase')}
                onClick={() => handleBreadcrumbClick('phase')}
              >
                {PYRAMIDS[selectedPyramid].label}
              </span>
            </>
          )}
          {selectedPhase && (
            <>
              <ChevronRight size={14} />
              <span style={styles.breadcrumbItem(currentLevel === 'area')}>
                {L_PHASES[selectedPhase as keyof typeof L_PHASES]?.label || selectedPhase}
              </span>
            </>
          )}
        </div>

        {currentLevel !== 'pyramid' && (
          <button style={styles.backButton} onClick={handleBack}>
            <ChevronLeft size={14} />
            Tilbake
          </button>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {currentLevel === 'pyramid' && (
          <div style={styles.grid}>
            {data.map((item) => {
              const Icon = PYRAMID_ICONS[item.pyramid];
              return (
                <div
                  key={item.pyramid}
                  style={styles.card(item.pyramid)}
                  onClick={() => handlePyramidClick(item.pyramid)}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.cardIcon(item.pyramid)}>
                      <Icon size={20} />
                    </div>
                    <div style={styles.cardTitle(item.pyramid)}>
                      {PYRAMIDS[item.pyramid].label}
                    </div>
                    <ChevronRight size={18} style={{ color: PYRAMID_COLORS[item.pyramid].text }} />
                  </div>

                  <div style={styles.cardStats}>
                    <div style={styles.stat}>
                      <Clock size={14} />
                      <span style={styles.statValue}>{item.hours}t</span>
                    </div>
                    <div style={styles.stat}>
                      <Flame size={14} />
                      <span style={styles.statValue}>{item.reps}</span> reps
                    </div>
                    <div style={styles.stat}>
                      <TrendingUp size={14} />
                      <span style={styles.statValue}>{item.sessions}</span> økter
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentLevel === 'phase' && selectedPyramid && (
          <div style={styles.grid}>
            {(currentData as any[]).map((item) => (
              <div
                key={item.phase}
                style={styles.card(selectedPyramid)}
                onClick={() => handlePhaseClick(item.phase)}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle(selectedPyramid)}>
                    {item.label}
                  </div>
                  <ChevronRight size={18} style={{ color: PYRAMID_COLORS[selectedPyramid].text }} />
                </div>

                <div style={styles.cardStats}>
                  <div style={styles.stat}>
                    <Clock size={14} />
                    <span style={styles.statValue}>{item.hours}t</span>
                  </div>
                  <div style={styles.stat}>
                    <Flame size={14} />
                    <span style={styles.statValue}>{item.reps}</span> reps
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentLevel === 'area' && selectedPyramid && (
          <div style={styles.grid}>
            {(currentData as any[]).map((item) => (
              <div
                key={item.area}
                style={{
                  ...styles.card(selectedPyramid),
                  cursor: 'default',
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle(selectedPyramid)}>
                    {item.label}
                  </div>
                </div>

                <div style={styles.cardStats}>
                  <div style={styles.stat}>
                    <Clock size={14} />
                    <span style={styles.statValue}>{item.hours}t</span>
                  </div>
                  <div style={styles.stat}>
                    <Flame size={14} />
                    <span style={styles.statValue}>{item.reps}</span> reps
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentData.length === 0 && (
          <div style={styles.emptyState}>
            Ingen data tilgjengelig for denne visningen
          </div>
        )}
      </div>
    </div>
  );
};

export default DagbokDrillDown;
