/**
 * DagbokHierarchyFilters
 *
 * Advanced filter panel with conditional dropdowns based on
 * selected pyramid and area. Follows AK hierarchy rules.
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';

import type {
  DagbokState,
  DagbokActions,
  FilterVisibility,
  Area,
  LPhase,
  Environment,
  Pressure,
  CSLevel,
  Position,
  TournamentType,
  PhysicalFocus,
  PlayFocus,
  PuttingFocus,
} from '../types';

import type { FilterOptions } from '../hooks/useDagbokFilters';

import {
  AREAS,
  L_PHASES,
  ENVIRONMENTS,
  PRESSURE_LEVELS,
  POSITIONS,
  TOURNAMENT_TYPES,
  PHYSICAL_FOCUS,
  PLAY_FOCUS,
  PUTTING_FOCUS,
} from '../constants';

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    padding: '12px 16px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-default)',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    minWidth: '140px',
  },
  filterLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  selectWrapper: {
    position: 'relative' as const,
  },
  select: {
    width: '100%',
    padding: '6px 28px 6px 10px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'var(--card-background)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  },
  selectIcon: {
    position: 'absolute' as const,
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    color: 'var(--text-tertiary)',
  },
  emptyState: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic' as const,
    padding: '8px 0',
  },
};

// =============================================================================
// FILTER SELECT COMPONENT
// =============================================================================

interface FilterSelectProps<T> {
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  options: { value: T; label: string; description?: string }[];
  placeholder?: string;
  disabled?: boolean;
}

function FilterSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Alle',
  disabled = false,
}: FilterSelectProps<T>) {
  return (
    <div style={styles.filterGroup}>
      <span style={styles.filterLabel}>{label}</span>
      <div style={styles.selectWrapper}>
        <select
          value={value ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? null : (val as T));
          }}
          style={{
            ...styles.select,
            opacity: disabled ? 0.5 : 1,
          }}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} style={styles.selectIcon} />
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export interface DagbokHierarchyFiltersProps {
  state: DagbokState;
  actions: DagbokActions;
  visibility: FilterVisibility;
  options: FilterOptions;
  className?: string;
}

export const DagbokHierarchyFilters: React.FC<DagbokHierarchyFiltersProps> = ({
  state,
  actions,
  visibility,
  options,
  className = '',
}) => {
  // If no filters visible, don't render
  const hasVisibleFilters = Object.values(visibility).some(Boolean);

  if (!hasVisibleFilters) {
    return (
      <div className={className} style={styles.container}>
        <p style={styles.emptyState}>
          Velg en pyramidekategori for a vise avanserte filtre
        </p>
      </div>
    );
  }

  return (
    <div className={className} style={styles.container}>
      <div style={styles.grid}>
        {/* Area */}
        {visibility.showArea && (
          <FilterSelect<Area>
            label="Omrade"
            value={state.area}
            onChange={actions.setArea}
            options={options.areas}
            placeholder="Alle omrader"
          />
        )}

        {/* L-Phase */}
        {visibility.showLPhase && (
          <FilterSelect<LPhase>
            label="Laeringsfase"
            value={state.lPhase}
            onChange={actions.setLPhase}
            options={options.lPhases}
            placeholder="Alle faser"
          />
        )}

        {/* Environment */}
        {visibility.showEnvironment && (
          <FilterSelect<Environment>
            label="Miljo"
            value={state.environment}
            onChange={actions.setEnvironment}
            options={options.environments}
            placeholder="Alle miljoer"
          />
        )}

        {/* Pressure */}
        {visibility.showPressure && (
          <FilterSelect<Pressure>
            label="Press"
            value={state.pressure}
            onChange={actions.setPressure}
            options={options.pressures}
            placeholder="Alle nivåer"
          />
        )}

        {/* CS Level */}
        {visibility.showCS && (
          <FilterSelect<CSLevel>
            label="Club Speed"
            value={state.csLevel}
            onChange={actions.setCSLevel}
            options={options.csLevels}
            placeholder="Alle hastigheter"
          />
        )}

        {/* Position */}
        {visibility.showPosition && (
          <FilterSelect<Position>
            label="Posisjon"
            value={state.position}
            onChange={actions.setPosition}
            options={options.positions}
            placeholder="Alle posisjoner"
          />
        )}

        {/* Physical Focus (FYS) */}
        {visibility.showPhysicalFocus && (
          <FilterSelect<PhysicalFocus>
            label="Fokus"
            value={state.physicalFocus}
            onChange={actions.setPhysicalFocus}
            options={(Object.keys(PHYSICAL_FOCUS) as PhysicalFocus[]).map((f) => ({
              value: f,
              label: PHYSICAL_FOCUS[f].label,
              description: PHYSICAL_FOCUS[f].description,
            }))}
            placeholder="Alle fokusomrader"
          />
        )}

        {/* Tournament Type (TURN) */}
        {visibility.showTournamentType && (
          <FilterSelect<TournamentType>
            label="Turneringstype"
            value={state.tournamentType}
            onChange={actions.setTournamentType}
            options={(Object.keys(TOURNAMENT_TYPES) as TournamentType[]).map((t) => ({
              value: t,
              label: TOURNAMENT_TYPES[t].label,
              description: TOURNAMENT_TYPES[t].description,
            }))}
            placeholder="Alle typer"
          />
        )}

        {/* Play Focus (SPILL) */}
        {visibility.showPlayFocus && (
          <FilterSelect<PlayFocus>
            label="Spillfokus"
            value={state.playFocus}
            onChange={actions.setPlayFocus}
            options={(Object.keys(PLAY_FOCUS) as PlayFocus[]).map((f) => ({
              value: f,
              label: PLAY_FOCUS[f].label,
              description: PLAY_FOCUS[f].description,
            }))}
            placeholder="Alle fokusomrader"
          />
        )}

        {/* Putting Focus */}
        {visibility.showPuttingFocus && (
          <FilterSelect<PuttingFocus>
            label="Putting-fokus"
            value={state.puttingFocus}
            onChange={actions.setPuttingFocus}
            options={(Object.keys(PUTTING_FOCUS) as PuttingFocus[]).map((f) => ({
              value: f,
              label: PUTTING_FOCUS[f].label,
              description: PUTTING_FOCUS[f].description,
            }))}
            placeholder="Alle fokusomrader"
          />
        )}
      </div>
    </div>
  );
};

export default DagbokHierarchyFilters;
