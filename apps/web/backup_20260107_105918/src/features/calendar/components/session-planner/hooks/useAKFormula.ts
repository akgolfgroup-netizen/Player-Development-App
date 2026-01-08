/**
 * useAKFormula Hook
 *
 * Comprehensive hook for TIER Golf formula system:
 * - Formula generation from user selections
 * - Formula parsing back to components
 * - Validation rules
 * - Human-readable text generation
 *
 * Based on: TIER_GOLF_KATEGORI_HIERARKI_v2.0.md
 */

import { useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/** Pyramidenivå - fra fundament til topp */
export type Pyramid = 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';

/** Treningsområder */
export type Area =
  // Full Swing (5)
  | 'TEE'
  | 'INN200'
  | 'INN150'
  | 'INN100'
  | 'INN50'
  // Kortspill (4)
  | 'CHIP'
  | 'PITCH'
  | 'LOB'
  | 'BUNKER'
  // Putting (7)
  | 'PUTT0-3'
  | 'PUTT3-5'
  | 'PUTT5-10'
  | 'PUTT10-15'
  | 'PUTT15-25'
  | 'PUTT25-40'
  | 'PUTT40+'
  // Spill
  | 'BANE';

/** Motorisk læringsfase */
export type LPhase = 'L-KROPP' | 'L-ARM' | 'L-KØLLE' | 'L-BALL' | 'L-AUTO';

/** Clubspeed nivå (0-100 i steg på 10) */
export type CSLevel = 0 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

/** Miljø */
export type Environment = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

/** Pressnivå */
export type Pressure = 'PR1' | 'PR2' | 'PR3' | 'PR4' | 'PR5';

/** P-Posisjon (1.0 - 10.0) */
export type Position =
  | 'P1.0'
  | 'P2.0'
  | 'P3.0'
  | 'P4.0'
  | 'P4.5'
  | 'P5.0'
  | 'P5.5'
  | 'P6.0'
  | 'P6.1'
  | 'P6.5'
  | 'P7.0'
  | 'P8.0'
  | 'P9.0'
  | 'P10.0';

/** Putting fokusområder */
export type PuttingFocus = 'GREEN' | 'SIKTE' | 'TEKN' | 'BALL' | 'SPEED';

/** Putting faser */
export type PuttingPhase = 'S' | 'B' | 'I' | 'F';

/** Turneringstype */
export type TournamentType = 'RES' | 'UTV' | 'TRE';

/** Fysisk treningsfokus */
export type PhysicalFocus = 'STYRKE' | 'MOBILITET' | 'POWER' | 'KONDISJON' | 'STABILITET';

/** Spillfokus */
export type PlayFocus = 'STRATEGI' | 'SCORING' | 'RISIKO';

/** Områdekategori */
export type AreaCategory = 'fullSwing' | 'shortGame' | 'putting';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Pyramidenivåer med metadata */
export const PYRAMIDS: Record<Pyramid, { label: string; description: string; icon: string }> = {
  FYS: {
    label: 'Fysisk',
    description: 'Styrke, power, mobilitet, stabilitet',
    icon: 'Dumbbell',  // Changed from 🏋️
  },
  TEK: {
    label: 'Teknikk',
    description: 'Bevegelsesmønster, posisjoner, sekvens',
    icon: 'Settings',  // Changed from 🎯
  },
  SLAG: {
    label: 'Golfslag',
    description: 'Slagkvalitet, avstand, nøyaktighet',
    icon: 'Target',  // Changed from ⛳
  },
  SPILL: {
    label: 'Spill',
    description: 'Strategi, banehåndtering, scoring',
    icon: 'Flag',  // Changed from 🏌️
  },
  TURN: {
    label: 'Turnering',
    description: 'Mental prestasjon, konkurransefokus',
    icon: 'Trophy',  // Changed from 🏆
  },
};

/** Områder med metadata */
export const AREAS: Record<
  Area,
  {
    label: string;
    description: string;
    category: AreaCategory;
    usesCS: boolean;
    usesPosition: boolean;
  }
> = {
  // Full Swing
  TEE: {
    label: 'Tee Total',
    description: 'Driver og woods fra tee',
    category: 'fullSwing',
    usesCS: true,
    usesPosition: true,
  },
  INN200: {
    label: 'Innspill 200+ m',
    description: 'Woods, hybrid, long iron',
    category: 'fullSwing',
    usesCS: true,
    usesPosition: true,
  },
  INN150: {
    label: 'Innspill 150-200 m',
    description: '5-7 jern',
    category: 'fullSwing',
    usesCS: true,
    usesPosition: true,
  },
  INN100: {
    label: 'Innspill 100-150 m',
    description: '8-PW',
    category: 'fullSwing',
    usesCS: true,
    usesPosition: true,
  },
  INN50: {
    label: 'Innspill 50-100 m',
    description: 'Wedges (full swing)',
    category: 'fullSwing',
    usesCS: true,
    usesPosition: true,
  },
  // Kortspill
  CHIP: {
    label: 'Chip',
    description: 'Lav bue, mye rulle',
    category: 'shortGame',
    usesCS: false,
    usesPosition: true,
  },
  PITCH: {
    label: 'Pitch',
    description: 'Middels bue, middels rulle',
    category: 'shortGame',
    usesCS: false,
    usesPosition: true,
  },
  LOB: {
    label: 'Lob',
    description: 'Høy bue, lite rulle',
    category: 'shortGame',
    usesCS: false,
    usesPosition: true,
  },
  BUNKER: {
    label: 'Bunker',
    description: 'Sand, greenside',
    category: 'shortGame',
    usesCS: false,
    usesPosition: true,
  },
  // Putting
  'PUTT0-3': {
    label: '0-3 ft',
    description: 'Makk-putts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  'PUTT3-5': {
    label: '3-5 ft',
    description: 'Korte putts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  'PUTT5-10': {
    label: '5-10 ft',
    description: 'Mellomputts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  'PUTT10-15': {
    label: '10-15 ft',
    description: 'Mellom-lange putts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  'PUTT15-25': {
    label: '15-25 ft',
    description: 'Lange putts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  'PUTT25-40': {
    label: '25-40 ft',
    description: 'Lag putts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  'PUTT40+': {
    label: '40+ ft',
    description: 'Ekstra lange putts',
    category: 'putting',
    usesCS: false,
    usesPosition: false,
  },
  // Spill
  BANE: {
    label: 'Bane',
    description: 'Spill på bane',
    category: 'fullSwing',
    usesCS: true,
    usesPosition: false,
  },
};

/** L-Faser med metadata */
export const L_PHASES: Record<
  LPhase,
  {
    label: string;
    description: string;
    recommendedCS: { min: CSLevel; max: CSLevel } | null;
  }
> = {
  'L-KROPP': {
    label: 'Kun kropp',
    description: 'Isolert bevegelse uten utstyr',
    recommendedCS: null, // CS0 eller ingen
  },
  'L-ARM': {
    label: 'Med armer',
    description: 'Kropp + armer, ingen kølle',
    recommendedCS: null,
  },
  'L-KØLLE': {
    label: 'Med kølle',
    description: 'Uten ball, fokus på posisjoner',
    recommendedCS: { min: 20, max: 40 },
  },
  'L-BALL': {
    label: 'Med ball',
    description: 'Lav hastighet, fokus på følelse',
    recommendedCS: { min: 40, max: 60 },
  },
  'L-AUTO': {
    label: 'Automatisert',
    description: 'Full hastighet, varierende forhold',
    recommendedCS: { min: 70, max: 100 },
  },
};

/** CS-nivåer */
export const CS_LEVELS: CSLevel[] = [0, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/** Miljø med metadata */
export const ENVIRONMENTS: Record<Environment, { label: string; description: string }> = {
  M0: { label: 'Off-course', description: 'Gym, hjemme' },
  M1: { label: 'Simulator', description: 'Innendørs, nett, Trackman' },
  M2: { label: 'Range', description: 'Utendørs, matte eller gress' },
  M3: { label: 'Øvingsfelt', description: 'Kortbane, chipping/putting green' },
  M4: { label: 'Bane (trening)', description: 'Treningsrunde på bane' },
  M5: { label: 'Bane (turnering)', description: 'Turneringsrunde' },
};

/** Pressnivåer med metadata */
export const PRESSURE_LEVELS: Record<Pressure, { label: string; description: string }> = {
  PR1: { label: 'Ingen press', description: 'Utforskende, ingen konsekvens' },
  PR2: { label: 'Selvmonitorering', description: 'Måltall, tracking' },
  PR3: { label: 'Sosial', description: 'Med andre, observert' },
  PR4: { label: 'Konkurranse', description: 'Spill mot andre' },
  PR5: { label: 'Turnering', description: 'Resultat teller, ranking' },
};

/** Hovedposisjoner */
export const POSITIONS: Record<Position, { label: string; description: string }> = {
  'P1.0': { label: 'Address', description: 'Statisk startposisjon' },
  'P2.0': { label: 'Takeaway', description: 'Skaft parallelt (backswing)' },
  'P3.0': { label: 'Mid-Backswing', description: 'Lead arm parallelt' },
  'P4.0': { label: 'Topp', description: 'Maksimal rotasjon' },
  'P4.5': { label: 'Transition', description: 'Midt i transition' },
  'P5.0': { label: 'Downswing start', description: 'Lead arm parallelt (ned)' },
  'P5.5': { label: 'Shallowed', description: 'Skaft til albueplan' },
  'P6.0': { label: 'Delivery', description: 'Skaft parallelt (downswing)' },
  'P6.1': { label: 'Release-punkt', description: 'Klubbhode krysser hendene' },
  'P6.5': { label: 'Pre-impact', description: 'Siste posisjon før treff' },
  'P7.0': { label: 'Impact', description: 'Treff' },
  'P8.0': { label: 'Release', description: 'Skaft parallelt post-impact' },
  'P9.0': { label: 'Follow-through', description: 'Trail arm parallelt' },
  'P10.0': { label: 'Finish', description: 'Fullført rotasjon, balanse' },
};

/** Posisjonsliste i rekkefølge */
export const POSITION_ORDER: Position[] = [
  'P1.0',
  'P2.0',
  'P3.0',
  'P4.0',
  'P4.5',
  'P5.0',
  'P5.5',
  'P6.0',
  'P6.1',
  'P6.5',
  'P7.0',
  'P8.0',
  'P9.0',
  'P10.0',
];

/** Putting fokusområder */
export const PUTTING_FOCUS: Record<PuttingFocus, { label: string; description: string }> = {
  GREEN: { label: 'Greenlesning', description: 'Fall, break, grain' },
  SIKTE: { label: 'Sikte', description: 'Alignment, aim point' },
  TEKN: { label: 'Teknikk', description: 'FWD press, loft, attack' },
  BALL: { label: 'Ballstart', description: 'Startlinje' },
  SPEED: { label: 'Speed', description: 'Lengdekontroll' },
};

/** Putting faser */
export const PUTTING_PHASES: Record<PuttingPhase, { label: string; description: string }> = {
  S: { label: 'Setup', description: 'Adressering, alignment' },
  B: { label: 'Backstroke', description: 'Tilbakeslag' },
  I: { label: 'Impact', description: 'Treff' },
  F: { label: 'Follow-through', description: 'Gjennomslag' },
};

/** Vanlige putting fasekombinasjoner */
export const PUTTING_PHASE_COMBOS = ['S', 'S-B', 'S-I', 'S-F', 'B-I', 'I-F'] as const;

/** Turneringstyper */
export const TOURNAMENT_TYPES: Record<TournamentType, { label: string; description: string }> = {
  RES: { label: 'Resultat', description: 'Full prestasjonsmodus' },
  UTV: { label: 'Utvikling', description: 'Teste spesifikke ting under press' },
  TRE: { label: 'Trening', description: 'Teknisk trening under turneringspress' },
};

/** Fysisk treningsfokus */
export const PHYSICAL_FOCUS: Record<PhysicalFocus, { label: string; description: string }> = {
  STYRKE: { label: 'Styrke', description: 'Styrketrening' },
  MOBILITET: { label: 'Mobilitet', description: 'Bevegelighet og fleksibilitet' },
  POWER: { label: 'Power', description: 'Eksplosivitet og kraft' },
  KONDISJON: { label: 'Kondisjon', description: 'Utholdenhet' },
  STABILITET: { label: 'Stabilitet', description: 'Core og balanse' },
};

/** Spillfokus */
export const PLAY_FOCUS: Record<PlayFocus, { label: string; description: string }> = {
  STRATEGI: { label: 'Strategi', description: 'Banestrategi og beslutninger' },
  SCORING: { label: 'Scoring', description: 'Scoringsfokus' },
  RISIKO: { label: 'Risiko', description: 'Risikostyring' },
};

// =============================================================================
// FORMULA INPUT TYPE
// =============================================================================

export interface FormulaInput {
  pyramid: Pyramid;
  area?: Area;
  lPhase?: LPhase;
  csLevel?: CSLevel;
  environment: Environment;
  pressure: Pressure;
  positionStart?: Position;
  positionEnd?: Position;
  puttingFocus?: PuttingFocus;
  puttingPhases?: string; // e.g., "S-F"
  tournamentType?: TournamentType;
  physicalFocus?: PhysicalFocus;
  playFocus?: PlayFocus;
}

export interface ParsedFormula extends FormulaInput {
  formula: string;
  title: string;
  description: string;
  isValid: boolean;
  errors: string[];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getAreaCategory(area: Area): AreaCategory {
  return AREAS[area].category;
}

function isPuttingArea(area: Area): boolean {
  return area.startsWith('PUTT');
}

function isFullSwingArea(area: Area): boolean {
  return ['TEE', 'INN200', 'INN150', 'INN100', 'INN50'].includes(area);
}

function isShortGameArea(area: Area): boolean {
  return ['CHIP', 'PITCH', 'LOB', 'BUNKER'].includes(area);
}

function formatPositionRange(start?: Position, end?: Position): string {
  if (!start) return '';
  if (!end || start === end) return start;
  return `${start}-${end}`;
}

function generateTitle(input: FormulaInput): string {
  const { pyramid, area, positionStart, positionEnd, puttingFocus, physicalFocus, playFocus } =
    input;

  // FYS: Fysisk fokus
  if (pyramid === 'FYS' && physicalFocus) {
    return PHYSICAL_FOCUS[physicalFocus].label;
  }

  // TURN: Turneringstype
  if (pyramid === 'TURN' && input.tournamentType) {
    return `Turnering – ${TOURNAMENT_TYPES[input.tournamentType].label}`;
  }

  // SPILL: Spillfokus
  if (pyramid === 'SPILL' && playFocus) {
    return `Spill – ${PLAY_FOCUS[playFocus].label}`;
  }

  if (!area) return PYRAMIDS[pyramid].label;

  const areaLabel = AREAS[area].label;

  // Putting: Fokusområde
  if (isPuttingArea(area) && puttingFocus) {
    return `Putting ${areaLabel} – ${PUTTING_FOCUS[puttingFocus].label}`;
  }

  // Full swing/kortspill: Posisjoner
  if (positionStart) {
    const posRange = formatPositionRange(positionStart, positionEnd);
    const posLabels = positionEnd
      ? `${POSITIONS[positionStart].label} → ${POSITIONS[positionEnd].label}`
      : POSITIONS[positionStart].label;
    return `${areaLabel} – ${posLabels}`;
  }

  return areaLabel;
}

function generateDescription(input: FormulaInput): string {
  const parts: string[] = [];

  // Pyramide
  parts.push(PYRAMIDS[input.pyramid].label);

  // Miljø
  parts.push(ENVIRONMENTS[input.environment].label);

  // L-fase
  if (input.lPhase) {
    parts.push(L_PHASES[input.lPhase].label);
  }

  // CS
  if (input.csLevel !== undefined && input.csLevel > 0) {
    parts.push(`${input.csLevel}% hastighet`);
  }

  // Press
  parts.push(PRESSURE_LEVELS[input.pressure].label);

  return parts.join(' • ');
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateFormula(input: FormulaInput): string[] {
  const errors: string[] = [];

  // FYS må ha M0
  if (input.pyramid === 'FYS' && input.environment !== 'M0') {
    errors.push('Fysisk trening krever M0 (off-course)');
  }

  // FYS trenger fysicalFocus
  if (input.pyramid === 'FYS' && !input.physicalFocus) {
    errors.push('Fysisk trening krever et fokusområde');
  }

  // TURN må ha M5 og PR5
  if (input.pyramid === 'TURN') {
    if (input.environment !== 'M5') {
      errors.push('Turnering krever M5');
    }
    if (input.pressure !== 'PR5') {
      errors.push('Turnering krever PR5');
    }
    if (!input.tournamentType) {
      errors.push('Turnering krever en type (RES/UTV/TRE)');
    }
  }

  // TEK/SLAG/SPILL trenger område
  if (['TEK', 'SLAG', 'SPILL'].includes(input.pyramid) && !input.area) {
    errors.push('Velg et treningsområde');
  }

  // CS validering for full swing
  if (input.area && isFullSwingArea(input.area)) {
    if (input.csLevel === undefined) {
      errors.push('Full swing krever CS-nivå');
    }
  }

  // CS skal IKKE brukes for kortspill/putting
  if (input.area && (isShortGameArea(input.area) || isPuttingArea(input.area))) {
    if (input.csLevel !== undefined && input.csLevel > 0) {
      errors.push('CS brukes ikke for kortspill/putting');
    }
  }

  // Putting trenger fokus og faser
  if (input.area && isPuttingArea(input.area)) {
    if (!input.puttingFocus) {
      errors.push('Putting krever et fokusområde');
    }
    if (!input.puttingPhases) {
      errors.push('Putting krever fase-valg');
    }
  }

  // L-fase og CS anbefaling
  if (input.lPhase && input.csLevel !== undefined) {
    const recommended = L_PHASES[input.lPhase].recommendedCS;
    if (recommended) {
      if (input.csLevel < recommended.min || input.csLevel > recommended.max) {
        errors.push(
          `${input.lPhase} anbefaler CS${recommended.min}-${recommended.max}, du har valgt CS${input.csLevel}`
        );
      }
    } else if (input.csLevel > 0 && ['L-KROPP', 'L-ARM'].includes(input.lPhase)) {
      errors.push(`${input.lPhase} bruker normalt CS0`);
    }
  }

  return errors;
}

// =============================================================================
// FORMULA GENERATION
// =============================================================================

function generateFormula(input: FormulaInput): string {
  const parts: string[] = [];

  // 1. Pyramide
  parts.push(input.pyramid);

  // FYS-formel: FYS_[Fokus]_M0
  if (input.pyramid === 'FYS') {
    if (input.physicalFocus) {
      parts.push(input.physicalFocus);
    }
    parts.push(input.environment);
    return parts.join('_');
  }

  // TURN-formel: TURN_[Type]_M5_PR5
  if (input.pyramid === 'TURN') {
    if (input.tournamentType) {
      parts.push(input.tournamentType);
    }
    parts.push(input.environment);
    parts.push(input.pressure);
    return parts.join('_');
  }

  // 2. Område
  if (input.area) {
    parts.push(input.area);
  }

  // 3. L-fase
  if (input.lPhase) {
    parts.push(input.lPhase);
  }

  // 4. CS (kun for full swing)
  if (input.area && isFullSwingArea(input.area) && input.csLevel !== undefined) {
    parts.push(`CS${input.csLevel}`);
  }

  // SPILL med CS
  if (input.pyramid === 'SPILL' && input.csLevel !== undefined) {
    parts.push(`CS${input.csLevel}`);
  }

  // 5. Miljø
  parts.push(input.environment);

  // 6. Press
  parts.push(input.pressure);

  // 7a. P-Posisjon (for full swing og kortspill)
  if (input.area && (isFullSwingArea(input.area) || isShortGameArea(input.area))) {
    const posRange = formatPositionRange(input.positionStart, input.positionEnd);
    if (posRange) {
      parts.push(posRange);
    }
  }

  // 7b. Putting-spesifikk: Fokus og Faser
  if (input.area && isPuttingArea(input.area)) {
    if (input.puttingFocus) {
      parts.push(input.puttingFocus);
    }
    if (input.puttingPhases) {
      parts.push(input.puttingPhases);
    }
  }

  // SPILL fokus
  if (input.pyramid === 'SPILL' && input.playFocus) {
    parts.push(input.playFocus);
  }

  return parts.join('_');
}

// =============================================================================
// FORMULA PARSING
// =============================================================================

function parseFormula(formula: string): Partial<FormulaInput> {
  const parts = formula.split('_');
  const result: Partial<FormulaInput> = {};

  if (parts.length === 0) return result;

  // Første del er alltid pyramide
  const pyramidPart = parts[0] as Pyramid;
  if (Object.keys(PYRAMIDS).includes(pyramidPart)) {
    result.pyramid = pyramidPart;
  }

  // Parse resten basert på pyramide
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    // Område
    if (Object.keys(AREAS).includes(part)) {
      result.area = part as Area;
      continue;
    }

    // L-fase
    if (part.startsWith('L-')) {
      result.lPhase = part as LPhase;
      continue;
    }

    // CS-nivå
    if (part.startsWith('CS')) {
      const level = parseInt(part.replace('CS', ''), 10);
      if (CS_LEVELS.includes(level as CSLevel)) {
        result.csLevel = level as CSLevel;
      }
      continue;
    }

    // Miljø
    if (part.startsWith('M') && part.length === 2) {
      if (Object.keys(ENVIRONMENTS).includes(part)) {
        result.environment = part as Environment;
      }
      continue;
    }

    // Press
    if (part.startsWith('PR')) {
      if (Object.keys(PRESSURE_LEVELS).includes(part)) {
        result.pressure = part as Pressure;
      }
      continue;
    }

    // P-posisjon (enkelt eller range)
    if (part.startsWith('P') && part.includes('.')) {
      if (part.includes('-')) {
        const [start, end] = part.split('-');
        result.positionStart = start as Position;
        result.positionEnd = end as Position;
      } else {
        result.positionStart = part as Position;
      }
      continue;
    }

    // Putting fokus
    if (Object.keys(PUTTING_FOCUS).includes(part)) {
      result.puttingFocus = part as PuttingFocus;
      continue;
    }

    // Putting faser
    if (
      PUTTING_PHASE_COMBOS.includes(part as (typeof PUTTING_PHASE_COMBOS)[number]) ||
      Object.keys(PUTTING_PHASES).includes(part)
    ) {
      result.puttingPhases = part;
      continue;
    }

    // Turneringstype
    if (Object.keys(TOURNAMENT_TYPES).includes(part)) {
      result.tournamentType = part as TournamentType;
      continue;
    }

    // Fysisk fokus
    if (Object.keys(PHYSICAL_FOCUS).includes(part)) {
      result.physicalFocus = part as PhysicalFocus;
      continue;
    }

    // Spillfokus
    if (Object.keys(PLAY_FOCUS).includes(part)) {
      result.playFocus = part as PlayFocus;
      continue;
    }
  }

  return result;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAKFormula() {
  /**
   * Genererer en komplett ParsedFormula fra input
   */
  const createFormula = useCallback((input: FormulaInput): ParsedFormula => {
    const errors = validateFormula(input);
    const formula = generateFormula(input);
    const title = generateTitle(input);
    const description = generateDescription(input);

    return {
      ...input,
      formula,
      title,
      description,
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  /**
   * Parser en formelstreng tilbake til komponenter
   */
  const parse = useCallback((formula: string): Partial<FormulaInput> => {
    return parseFormula(formula);
  }, []);

  /**
   * Validerer input og returnerer feil
   */
  const validate = useCallback((input: FormulaInput): string[] => {
    return validateFormula(input);
  }, []);

  /**
   * Returnerer gyldige områder basert på pyramidenivå
   */
  const getValidAreas = useCallback((pyramid: Pyramid): Area[] => {
    if (pyramid === 'FYS' || pyramid === 'TURN') {
      return [];
    }

    if (pyramid === 'SPILL') {
      return ['BANE'];
    }

    // TEK og SLAG: alle områder
    return Object.keys(AREAS).filter((a) => a !== 'BANE') as Area[];
  }, []);

  /**
   * Returnerer gyldige miljøer basert på pyramidenivå
   */
  const getValidEnvironments = useCallback((pyramid: Pyramid): Environment[] => {
    if (pyramid === 'FYS') {
      return ['M0'];
    }
    if (pyramid === 'TURN') {
      return ['M5'];
    }
    return Object.keys(ENVIRONMENTS) as Environment[];
  }, []);

  /**
   * Returnerer gyldige pressnivåer basert på pyramidenivå
   */
  const getValidPressureLevels = useCallback((pyramid: Pyramid): Pressure[] => {
    if (pyramid === 'TURN') {
      return ['PR5'];
    }
    return Object.keys(PRESSURE_LEVELS) as Pressure[];
  }, []);

  /**
   * Returnerer anbefalt CS-range basert på L-fase
   */
  const getRecommendedCS = useCallback(
    (lPhase: LPhase): { min: CSLevel; max: CSLevel } | null => {
      return L_PHASES[lPhase].recommendedCS;
    },
    []
  );

  /**
   * Sjekker om et område bruker CS
   */
  const areaUsesCS = useCallback((area: Area): boolean => {
    return AREAS[area].usesCS;
  }, []);

  /**
   * Sjekker om et område bruker P-posisjoner
   */
  const areaUsesPosition = useCallback((area: Area): boolean => {
    return AREAS[area].usesPosition;
  }, []);

  /**
   * Sjekker om et område er putting
   */
  const isPutting = useCallback((area: Area): boolean => {
    return isPuttingArea(area);
  }, []);

  return {
    // Core functions
    createFormula,
    parse,
    validate,

    // Context-aware getters
    getValidAreas,
    getValidEnvironments,
    getValidPressureLevels,
    getRecommendedCS,

    // Area helpers
    areaUsesCS,
    areaUsesPosition,
    isPutting,

    // Constants (for building UIs)
    pyramids: PYRAMIDS,
    areas: AREAS,
    lPhases: L_PHASES,
    csLevels: CS_LEVELS,
    environments: ENVIRONMENTS,
    pressureLevels: PRESSURE_LEVELS,
    positions: POSITIONS,
    positionOrder: POSITION_ORDER,
    puttingFocus: PUTTING_FOCUS,
    puttingPhases: PUTTING_PHASES,
    puttingPhaseCombos: PUTTING_PHASE_COMBOS,
    tournamentTypes: TOURNAMENT_TYPES,
    physicalFocus: PHYSICAL_FOCUS,
    playFocus: PLAY_FOCUS,
  };
}

export default useAKFormula;
