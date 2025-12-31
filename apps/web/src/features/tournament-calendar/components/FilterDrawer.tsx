// @ts-nocheck
/**
 * FilterDrawer - Advanced Tournament Filters Panel
 *
 * Slide-in panel with comprehensive filter options:
 * - Tournament purpose (Resultat, Utvikling, Trening)
 * - Competition level
 * - Junior Tour Region
 * - Player category
 * - Tour series
 * - Status
 * - Date range
 * - Country
 *
 * Design System: AK Golf Premium Light
 */

import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import Button from '../../../ui/primitives/Button';
import { CardTitle, SubSectionTitle } from '../../../components/typography';
import {
  TournamentFilters,
  TourType,
  TournamentStatus,
  PlayerCategory,
  TournamentPurpose,
  CompetitionLevel,
  JuniorTourRegion,
  TOUR_LABELS,
  STATUS_LABELS,
  CATEGORY_LABELS,
  COUNTRY_LABELS,
  COUNTRY_GROUPS,
  PURPOSE_LABELS,
  PURPOSE_DESCRIPTIONS,
  LEVEL_LABELS,
  JUNIOR_TOUR_REGION_LABELS,
  JUNIOR_TOUR_REGION_DESCRIPTIONS,
} from '../types';

interface FilterDrawerProps {
  filters: TournamentFilters;
  onFiltersChange: (filters: TournamentFilters) => void;
  onClose: () => void;
  onClear: () => void;
}

export default function FilterDrawer({
  filters,
  onFiltersChange,
  onClose,
  onClear,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState<TournamentFilters>(filters);

  const toggleArrayFilter = <T extends string>(
    key: keyof TournamentFilters,
    value: T
  ) => {
    const current = (localFilters[key] as T[] | undefined) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, [key]: updated.length ? updated : undefined });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    onClose();
  };

  const categories: PlayerCategory[] = ['A', 'B', 'C', 'D', 'E'];
  const purposes: TournamentPurpose[] = ['RESULTAT', 'UTVIKLING', 'TRENING'];
  const levels: CompetitionLevel[] = [
    'internasjonal',
    'nasjonal',
    'regional',
    'klubb',
    'junior',
    'trenings_turnering',
  ];
  const juniorRegions: JuniorTourRegion[] = [
    'østlandet-øst',
    'østlandet-vest',
    'sørlandet',
    'vestlandet',
    'midt-norge',
    'nord-norge',
  ];
  const tours: TourType[] = [
    'junior_tour_regional',
    'srixon_tour',
    'garmin_norges_cup',
    'global_junior_tour',
    'nordic_league',
    'ega_turnering',
    'wagr_turnering',
    'college_turneringer',
    'challenge_tour',
    'dp_world_tour',
    'pga_tour',
  ];
  const statuses: TournamentStatus[] = [
    'open',
    'upcoming',
    'full',
    'ongoing',
    'finished',
  ];
  const dateRanges: { value: TournamentFilters['dateRange']; label: string }[] = [
    { value: 'next_30_days', label: 'Neste 30 dager' },
    { value: 'next_90_days', label: 'Neste 90 dager' },
    { value: 'this_season', label: 'Denne sesongen' },
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <SubSectionTitle style={styles.title}>Filtrer turneringer</SubSectionTitle>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          {/* Tournament Purpose Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Turneringsformål</CardTitle>
            <p style={styles.sectionDescription}>
              Hvordan du bør tilnærme deg turneringen
            </p>
            <div style={styles.chipGrid}>
              {purposes.map(purpose => {
                const isSelected = localFilters.purposes?.includes(purpose);
                return (
                  <button
                    key={purpose}
                    onClick={() => toggleArrayFilter('purposes', purpose)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                    title={PURPOSE_DESCRIPTIONS[purpose]}
                    aria-label={`${PURPOSE_LABELS[purpose]}: ${PURPOSE_DESCRIPTIONS[purpose]}`}
                  >
                    {PURPOSE_LABELS[purpose]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Competition Level Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Konkurransenivå</CardTitle>
            <div style={styles.chipGrid}>
              {levels.map(level => {
                const isSelected = localFilters.levels?.includes(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleArrayFilter('levels', level)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                    aria-label={`Konkurransenivå: ${LEVEL_LABELS[level]}`}
                  >
                    {LEVEL_LABELS[level]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Junior Tour Region Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Junior Tour Region</CardTitle>
            <p style={styles.sectionDescription}>
              Filtrer junior turneringer etter region (kun Junior Tour Regional)
            </p>
            <div style={styles.chipGrid}>
              {juniorRegions.map(region => {
                const isSelected = localFilters.juniorTourRegions?.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleArrayFilter('juniorTourRegions', region)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                    title={JUNIOR_TOUR_REGION_DESCRIPTIONS[region]}
                    aria-label={`${JUNIOR_TOUR_REGION_LABELS[region]}: ${JUNIOR_TOUR_REGION_DESCRIPTIONS[region]}`}
                  >
                    {JUNIOR_TOUR_REGION_LABELS[region]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Category Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Anbefalt spillernivå</CardTitle>
            <div style={styles.chipGrid}>
              {categories.map(cat => {
                const isSelected = localFilters.recommendedCategories?.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleArrayFilter('recommendedCategories', cat)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                    aria-label={`Spillerkategori ${CATEGORY_LABELS[cat]}`}
                  >
                    {CATEGORY_LABELS[cat]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tour Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Turneringsserie</CardTitle>
            <div style={styles.chipGrid}>
              {tours.map(tour => {
                const isSelected = localFilters.tours?.includes(tour);
                return (
                  <button
                    key={tour}
                    onClick={() => toggleArrayFilter('tours', tour)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                  >
                    {TOUR_LABELS[tour]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Status</CardTitle>
            <div style={styles.chipGrid}>
              {statuses.map(status => {
                const isSelected = localFilters.statuses?.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleArrayFilter('statuses', status)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                  >
                    {STATUS_LABELS[status]}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Tidsperiode</CardTitle>
            <div style={styles.chipGrid}>
              {dateRanges.map(({ value, label }) => {
                const isSelected = localFilters.dateRange === value;
                return (
                  <button
                    key={value}
                    onClick={() => setLocalFilters({
                      ...localFilters,
                      dateRange: isSelected ? undefined : value,
                    })}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                  >
                    {label}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Filter */}
          <div style={styles.section}>
            <CardTitle style={styles.sectionTitle}>Land</CardTitle>
            {/* Quick select groups */}
            <div style={{ ...styles.chipGrid, marginBottom: 'var(--spacing-3)' }}>
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  countries: COUNTRY_GROUPS.nordic,
                })}
                style={{
                  ...styles.chip,
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              >
                Norden
              </button>
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  countries: COUNTRY_GROUPS.europe,
                })}
                style={{
                  ...styles.chip,
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              >
                Europa
              </button>
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  countries: undefined,
                })}
                style={{
                  ...styles.chip,
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
              >
                Alle land
              </button>
            </div>
            <div style={styles.chipGrid}>
              {['NO', 'SE', 'DK', 'FI', 'GB', 'US', 'ES', 'DE', 'IE', 'ZA'].map(code => {
                const isSelected = localFilters.countries?.includes(code);
                return (
                  <button
                    key={code}
                    onClick={() => toggleArrayFilter('countries', code)}
                    style={{
                      ...styles.chip,
                      ...(isSelected ? styles.chipSelected : {}),
                    }}
                  >
                    {COUNTRY_LABELS[code] || code}
                    {isSelected && <CheckCircle size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <Button variant="ghost" onClick={handleClear}>
            Nullstill
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Bruk filter
          </Button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  panel: {
    width: '100%',
    maxWidth: '400px',
    height: '100%',
    backgroundColor: 'var(--background-white)',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  closeButton: {
    padding: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: 'var(--spacing-5)',
  },
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-2) 0',
  },
  sectionDescription: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 var(--spacing-3) 0',
  },
  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--spacing-2)',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  chipSelected: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4) var(--spacing-5)',
    borderTop: '1px solid var(--border-subtle)',
  },
};
