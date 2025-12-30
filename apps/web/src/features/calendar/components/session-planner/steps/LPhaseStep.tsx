/**
 * LPhaseStep Component
 *
 * Step 3: Select learning phase (L-KROPP, L-ARM, L-KØLLE, L-BALL, L-AUTO)
 * Shows recommended CS range for each phase.
 *
 * Uses semantic tokens only.
 */

import React from 'react';
import { type UseSessionPlannerResult } from '../hooks/useSessionPlanner';
import { L_PHASES, type LPhase } from '../hooks/useAKFormula';

interface LPhaseStepProps {
  planner: UseSessionPlannerResult;
}

const PHASE_ICONS: Record<LPhase, string> = {
  'L-KROPP': '🧍',
  'L-ARM': '💪',
  'L-KØLLE': '🏌️',
  'L-BALL': '⛳',
  'L-AUTO': '🚀',
};

export const LPhaseStep: React.FC<LPhaseStepProps> = ({ planner }) => {
  const { formState, setLPhase } = planner;

  const phases = Object.entries(L_PHASES) as [LPhase, typeof L_PHASES[LPhase]][];

  return (
    <div className="space-y-4">
      <div>
        <h3
          className="text-sm font-medium mb-1"
          style={{ color: 'var(--calendar-text-secondary)' }}
        >
          Læringsfase
        </h3>
        <p
          className="text-xs"
          style={{ color: 'var(--calendar-text-tertiary)' }}
        >
          Velg hvor du er i læringsprosessen
        </p>
      </div>

      <div className="space-y-2">
        {phases.map(([key, value]) => {
          const isSelected = formState.lPhase === key;
          const csRange = value.recommendedCS;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setLPhase(key)}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isSelected
                  ? 'var(--calendar-event-recommended-bg)'
                  : 'var(--calendar-surface-elevated)',
                border: `2px solid ${isSelected ? 'var(--ak-primary)' : 'transparent'}`,
              }}
            >
              {/* Icon */}
              <span className="text-2xl">{PHASE_ICONS[key]}</span>

              {/* Content */}
              <div className="flex-1 text-left">
                <span
                  className="font-medium text-sm block"
                  style={{
                    color: isSelected
                      ? 'var(--ak-primary)'
                      : 'var(--calendar-text-primary)',
                  }}
                >
                  {value.label}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--calendar-text-tertiary)' }}
                >
                  {value.description}
                </span>
              </div>

              {/* CS range badge */}
              {csRange && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--calendar-surface-base)',
                    color: 'var(--calendar-text-secondary)',
                  }}
                >
                  CS{csRange.min}-{csRange.max}
                </span>
              )}
              {!csRange && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--calendar-surface-base)',
                    color: 'var(--calendar-text-tertiary)',
                  }}
                >
                  CS0
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progression hint */}
      <div
        className="flex items-center gap-2 p-3 rounded-lg"
        style={{ backgroundColor: 'var(--info-muted)' }}
      >
        <span className="text-sm" style={{ color: 'var(--ak-info)' }}>
          💡
        </span>
        <span className="text-xs" style={{ color: 'var(--ak-info)' }}>
          Start med L-KROPP for nye bevegelser, og jobb deg oppover til L-AUTO
        </span>
      </div>
    </div>
  );
};

export default LPhaseStep;
