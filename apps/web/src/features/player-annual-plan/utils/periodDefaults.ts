/**
 * Period Defaults and Colors
 * Standard values for period types (E/G/S/T)
 */

export const PERIOD_COLORS = {
  E: {
    primary: '#10B981',
    light: '#D1FAE5',
    dark: '#047857',
    text: '#065F46',
  },
  G: {
    primary: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1E40AF',
    text: '#1E3A8A',
  },
  S: {
    primary: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    text: '#92400E',
  },
  T: {
    primary: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
    text: '#991B1B',
  },
};

export const PERIOD_LABELS = {
  E: 'Etablering',
  G: 'Grunntrening',
  S: 'Spesialisering',
  T: 'Turnering',
};

export const PERIOD_DESCRIPTIONS = {
  E: 'Bygge teknisk grunnlag og grunnkondisjon',
  G: 'Øke treningsvolum og bygge fysisk kapasitet',
  S: 'Golf-spesifikk trening og pre-sesong forberedelse',
  T: 'Konkurransesesong med vedlikeholdstrening',
};

export const PERIOD_DEFAULTS = {
  E: {
    name: 'Etablering',
    description: 'Bygge teknisk grunnlag',
    weeklyFrequency: 3,
    defaultWeeks: 6,
    goals: ['Bygge treningsvaner', 'Grunnleggende teknikk', 'Baseline'],
  },
  G: {
    name: 'Grunntrening',
    description: 'Øke volum og styrke',
    weeklyFrequency: 5,
    defaultWeeks: 16,
    goals: ['Øke styrke', 'Teknisk utvikling', 'Bygge volum'],
  },
  S: {
    name: 'Spesialisering',
    description: 'Golf-spesifikk forberedelse',
    weeklyFrequency: 4,
    defaultWeeks: 10,
    goals: ['Pre-sesong', 'Short game', 'Mental trening'],
  },
  T: {
    name: 'Turnering',
    description: 'Konkurransesesong',
    weeklyFrequency: 4,
    defaultWeeks: 16,
    goals: ['Prestere', 'Vedlikeholde', 'Analysere'],
  },
};
