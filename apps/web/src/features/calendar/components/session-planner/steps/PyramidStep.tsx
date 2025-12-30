/**
 * PyramidStep Component
 *
 * Step 1: Select pyramid level (FYS, TEK, SLAG, SPILL, TURN)
 * For FYS: Also select physical focus
 * For TURN: Also select tournament type
 *
 * Uses semantic tokens only.
 */

import React from 'react';
import { type UseSessionPlannerResult } from '../hooks/useSessionPlanner';
import {
  PYRAMIDS,
  PHYSICAL_FOCUS,
  TOURNAMENT_TYPES,
  type Pyramid,
  type PhysicalFocus,
  type TournamentType,
} from '../hooks/useAKFormula';

interface PyramidStepProps {
  planner: UseSessionPlannerResult;
}

export const PyramidStep: React.FC<PyramidStepProps> = ({ planner }) => {
  const { formState, setPyramid, setPhysicalFocus, setTournamentType } = planner;

  const pyramidEntries = Object.entries(PYRAMIDS) as [Pyramid, typeof PYRAMIDS[Pyramid]][];

  return (
    <div className="space-y-6">
      {/* Pyramid selection */}
      <div>
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--calendar-text-secondary)' }}
        >
          Hva vil du trene?
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {pyramidEntries.map(([key, value]) => {
            const isSelected = formState.pyramid === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setPyramid(key)}
                className="flex flex-col items-center p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: isSelected
                    ? 'var(--calendar-event-recommended-bg)'
                    : 'var(--calendar-surface-elevated)',
                  border: `2px solid ${
                    isSelected
                      ? 'var(--ak-primary)'
                      : 'transparent'
                  }`,
                }}
              >
                <span className="text-2xl mb-2">{value.icon}</span>
                <span
                  className="font-medium text-sm"
                  style={{
                    color: isSelected
                      ? 'var(--ak-primary)'
                      : 'var(--calendar-text-primary)',
                  }}
                >
                  {value.label}
                </span>
                <span
                  className="text-xs text-center mt-1"
                  style={{ color: 'var(--calendar-text-tertiary)' }}
                >
                  {value.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FYS: Physical focus selection */}
      {formState.pyramid === 'FYS' && (
        <div>
          <h3
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--calendar-text-secondary)' }}
          >
            Fokusområde
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(PHYSICAL_FOCUS) as [PhysicalFocus, typeof PHYSICAL_FOCUS[PhysicalFocus]][]).map(
              ([key, value]) => {
                const isSelected = formState.physicalFocus === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPhysicalFocus(key)}
                    className="flex flex-col items-start p-3 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--calendar-event-recommended-bg)'
                        : 'var(--calendar-surface-elevated)',
                      border: `2px solid ${
                        isSelected ? 'var(--ak-primary)' : 'transparent'
                      }`,
                    }}
                  >
                    <span
                      className="font-medium text-sm"
                      style={{
                        color: isSelected
                          ? 'var(--ak-primary)'
                          : 'var(--calendar-text-primary)',
                      }}
                    >
                      {value.label}
                    </span>
                    <span
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--calendar-text-tertiary)' }}
                    >
                      {value.description}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* TURN: Tournament type selection */}
      {formState.pyramid === 'TURN' && (
        <div>
          <h3
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--calendar-text-secondary)' }}
          >
            Turneringstype
          </h3>

          <div className="space-y-2">
            {(Object.entries(TOURNAMENT_TYPES) as [TournamentType, typeof TOURNAMENT_TYPES[TournamentType]][]).map(
              ([key, value]) => {
                const isSelected = formState.tournamentType === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTournamentType(key)}
                    className="w-full flex items-center p-3 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--calendar-event-recommended-bg)'
                        : 'var(--calendar-surface-elevated)',
                      border: `2px solid ${
                        isSelected ? 'var(--ak-primary)' : 'transparent'
                      }`,
                    }}
                  >
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
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PyramidStep;
