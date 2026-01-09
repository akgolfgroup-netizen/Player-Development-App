/**
 * Golf Sport Configuration
 *
 * Complete configuration for golf as a sport in the multi-sport platform.
 * This file contains all golf-specific data that was previously hardcoded
 * throughout the application.
 *
 * @see types.ts for interface definitions
 */

import type {
  SportConfig,
  TrainingAreaGroup,
  Environment,
  TrainingPhase,
  IntensityLevel,
  PressureLevel,
  GoalCategory,
  PerformanceMetric,
  SportTerminology,
  Equipment,
  TestProtocol,
  SportNavigation,
} from './types';

// Import golf test definitions
import { testDefinitions as golfTestDefinitions } from '../../features/tests/config/testDefinitions';

// ============================================================================
// TRAINING AREAS - Full Swing, Short Game, Putting
// ============================================================================

const trainingAreas: TrainingAreaGroup[] = [
  {
    code: 'fullSwing',
    label: 'Full Swing',
    labelNO: 'Full Sving',
    icon: 'Golf',
    areas: [
      {
        code: 'TEE',
        label: 'Tee Total',
        labelNO: 'Tee Total',
        icon: 'Golf',
        description: 'Driver, 3-wood',
        descriptionNO: 'Driver, 3-tre',
        usesIntensity: true,
      },
      {
        code: 'INN200',
        label: 'Approach 200+ m',
        labelNO: 'Innspill 200+ m',
        icon: 'Target',
        description: '3-wood, hybrid, long iron',
        descriptionNO: '3-tre, hybrid, langt jern',
        usesIntensity: true,
      },
      {
        code: 'INN150',
        label: 'Approach 150-200 m',
        labelNO: 'Innspill 150-200 m',
        icon: 'Target',
        description: '5-7 iron',
        descriptionNO: '5-7 jern',
        usesIntensity: true,
      },
      {
        code: 'INN100',
        label: 'Approach 100-150 m',
        labelNO: 'Innspill 100-150 m',
        icon: 'Target',
        description: '8-PW',
        descriptionNO: '8-PW',
        usesIntensity: true,
      },
      {
        code: 'INN50',
        label: 'Approach 50-100 m',
        labelNO: 'Innspill 50-100 m',
        icon: 'Target',
        description: 'Wedges (full swing)',
        descriptionNO: 'Wedger (full sving)',
        usesIntensity: true,
      },
    ],
  },
  {
    code: 'shortGame',
    label: 'Short Game',
    labelNO: 'Kortspill',
    icon: 'Ruler',
    areas: [
      {
        code: 'CHIP',
        label: 'Chip',
        labelNO: 'Chip',
        icon: 'Ruler',
        description: 'Low trajectory, more roll',
        descriptionNO: 'Lav bue, mye rulle',
        usesIntensity: false,
      },
      {
        code: 'PITCH',
        label: 'Pitch',
        labelNO: 'Pitch',
        icon: 'Ruler',
        description: 'Medium trajectory, medium roll',
        descriptionNO: 'Middels bue, middels rulle',
        usesIntensity: false,
      },
      {
        code: 'LOB',
        label: 'Lob',
        labelNO: 'Lob',
        icon: 'Ruler',
        description: 'High trajectory, little roll',
        descriptionNO: 'Høy bue, lite rulle',
        usesIntensity: false,
      },
      {
        code: 'BUNKER',
        label: 'Bunker',
        labelNO: 'Bunker',
        icon: 'Umbrella',
        description: 'Sand, greenside',
        descriptionNO: 'Sand, greenside',
        usesIntensity: false,
      },
    ],
  },
  {
    code: 'putting',
    label: 'Putting',
    labelNO: 'Putting',
    icon: 'Flag',
    areas: [
      {
        code: 'PUTT0-3',
        label: '0-3 ft',
        labelNO: '0-3 fot',
        icon: 'Flag',
        description: 'Tap-in putts',
        descriptionNO: 'Makk-putts',
        usesIntensity: false,
      },
      {
        code: 'PUTT3-5',
        label: '3-5 ft',
        labelNO: '3-5 fot',
        icon: 'Flag',
        description: 'Short putts',
        descriptionNO: 'Korte',
        usesIntensity: false,
      },
      {
        code: 'PUTT5-10',
        label: '5-10 ft',
        labelNO: '5-10 fot',
        icon: 'Flag',
        description: 'Medium putts',
        descriptionNO: 'Mellom',
        usesIntensity: false,
      },
      {
        code: 'PUTT10-15',
        label: '10-15 ft',
        labelNO: '10-15 fot',
        icon: 'Flag',
        description: 'Medium-long putts',
        descriptionNO: 'Mellom-lange',
        usesIntensity: false,
      },
      {
        code: 'PUTT15-25',
        label: '15-25 ft',
        labelNO: '15-25 fot',
        icon: 'Flag',
        description: 'Long putts',
        descriptionNO: 'Lange',
        usesIntensity: false,
      },
      {
        code: 'PUTT25-40',
        label: '25-40 ft',
        labelNO: '25-40 fot',
        icon: 'Flag',
        description: 'Lag putts',
        descriptionNO: 'Lag putts',
        usesIntensity: false,
      },
      {
        code: 'PUTT40+',
        label: '40+ ft',
        labelNO: '40+ fot',
        icon: 'Flag',
        description: 'Extra long putts',
        descriptionNO: 'Ekstra lange',
        usesIntensity: false,
      },
    ],
  },
];

// ============================================================================
// ENVIRONMENTS - Where training takes place
// ============================================================================

const environments: Environment[] = [
  {
    code: 'M0',
    label: 'Off-course',
    labelNO: 'Off-course',
    description: 'Gym, home, not golf-specific',
    descriptionNO: 'Gym, hjemme, ikke golf-spesifikt',
    icon: 'Dumbbell',
    type: 'indoor',
    competitionLevel: 0,
  },
  {
    code: 'M1',
    label: 'Indoor',
    labelNO: 'Innendørs',
    description: 'Net, simulator, TrackMan',
    descriptionNO: 'Nett, simulator, TrackMan',
    icon: 'Home',
    type: 'indoor',
    competitionLevel: 0,
  },
  {
    code: 'M2',
    label: 'Range',
    labelNO: 'Range',
    description: 'Outdoor, mat or grass',
    descriptionNO: 'Utendørs, matte eller gress',
    icon: 'Building',
    type: 'outdoor',
    competitionLevel: 1,
  },
  {
    code: 'M3',
    label: 'Practice facility',
    labelNO: 'Øvingsfelt',
    description: 'Short course, chipping green, putting green',
    descriptionNO: 'Kortbane, chipping green, putting green',
    icon: 'Flag',
    type: 'outdoor',
    competitionLevel: 2,
  },
  {
    code: 'M4',
    label: 'Course practice',
    labelNO: 'Bane trening',
    description: 'Practice round on course',
    descriptionNO: 'Treningsrunde på bane',
    icon: 'Trees',
    type: 'outdoor',
    competitionLevel: 3,
  },
  {
    code: 'M5',
    label: 'Course competition',
    labelNO: 'Bane turnering',
    description: 'Tournament round',
    descriptionNO: 'Turneringsrunde',
    icon: 'Trophy',
    type: 'outdoor',
    competitionLevel: 5,
  },
];

// ============================================================================
// TRAINING PHASES - Motor learning progression (L-phases)
// ============================================================================

const phases: TrainingPhase[] = [
  {
    code: 'L-KROPP',
    label: 'Body',
    labelNO: 'Kropp',
    description: 'Body movement only, no equipment',
    descriptionNO: 'Kun kroppsbevegelse, ingen utstyr',
    icon: 'Body',
    intensityRange: 'CS0',
    order: 1,
  },
  {
    code: 'L-ARM',
    label: 'Arm',
    labelNO: 'Arm',
    description: 'Body + arms, no club/ball',
    descriptionNO: 'Kropp + armer, ingen kølle/ball',
    icon: 'Arm',
    intensityRange: 'CS0',
    order: 2,
  },
  {
    code: 'L-KØLLE',
    label: 'Club',
    labelNO: 'Kølle',
    description: 'Body + arms + club, no ball',
    descriptionNO: 'Kropp + armer + kølle, ingen ball',
    icon: 'Golf',
    intensityRange: 'CS20-40',
    order: 3,
  },
  {
    code: 'L-BALL',
    label: 'Ball',
    labelNO: 'Ball',
    description: 'Everything included, low speed',
    descriptionNO: 'Alt inkludert, lav hastighet',
    icon: 'Circle',
    intensityRange: 'CS40-60',
    order: 4,
  },
  {
    code: 'L-AUTO',
    label: 'Auto',
    labelNO: 'Auto',
    description: 'Full speed, automated',
    descriptionNO: 'Full hastighet, automatisert',
    icon: 'Zap',
    intensityRange: 'CS70-100',
    order: 5,
  },
];

// ============================================================================
// INTENSITY LEVELS - Club Speed (CS) percentages
// ============================================================================

const intensityLevels: IntensityLevel[] = [
  { code: 'CS0', value: 0, label: '0%', labelNO: '0%', description: 'Physical training (off-course)', descriptionNO: 'Fysisk trening (off-course)' },
  { code: 'CS20', value: 20, label: '20%', labelNO: '20%', description: 'Extremely slow, position only', descriptionNO: 'Ekstrem sakte, kun posisjon' },
  { code: 'CS30', value: 30, label: '30%', labelNO: '30%', description: 'Very slow, movement flow', descriptionNO: 'Veldig sakte, bevegelsesflyt' },
  { code: 'CS40', value: 40, label: '40%', labelNO: '40%', description: 'Slow, focus on pattern', descriptionNO: 'Langsom, fokus på mønster' },
  { code: 'CS50', value: 50, label: '50%', labelNO: '50%', description: 'Moderate, comfort zone', descriptionNO: 'Moderat, komfortsone' },
  { code: 'CS60', value: 60, label: '60%', labelNO: '60%', description: 'Increased speed, starting to challenge', descriptionNO: 'Økt hastighet, begynner utfordre' },
  { code: 'CS70', value: 70, label: '70%', labelNO: '70%', description: 'Competition-like', descriptionNO: 'Konkurranselignende' },
  { code: 'CS80', value: 80, label: '80%', labelNO: '80%', description: 'High intensity', descriptionNO: 'Høy intensitet' },
  { code: 'CS90', value: 90, label: '90%', labelNO: '90%', description: 'Near-maximum', descriptionNO: 'Nær-maksimal' },
  { code: 'CS100', value: 100, label: '100%', labelNO: '100%', description: 'Maximum effort', descriptionNO: 'Maksimal innsats' },
];

// ============================================================================
// PRESSURE LEVELS - Physical & mental load (PR)
// ============================================================================

const pressureLevels: PressureLevel[] = [
  { code: 'PR1', level: 1, label: 'None', labelNO: 'Ingen', description: 'Exploratory, no consequence', descriptionNO: 'Utforskende, ingen konsekvens', icon: 'Smile' },
  { code: 'PR2', level: 2, label: 'Self-monitoring', labelNO: 'Selvmonitorering', description: 'Metrics, tracking, but no social', descriptionNO: 'Måltall, tracking, men ingen sosial', icon: 'BarChart' },
  { code: 'PR3', level: 3, label: 'Social', labelNO: 'Sosial', description: 'With others, observed', descriptionNO: 'Med andre, observert', icon: 'Users' },
  { code: 'PR4', level: 4, label: 'Competition', labelNO: 'Konkurranse', description: 'Stakes, playing against others', descriptionNO: 'Innsats, spill mot andre', icon: 'Flame' },
  { code: 'PR5', level: 5, label: 'Tournament', labelNO: 'Turnering', description: 'Result counts, ranking', descriptionNO: 'Resultat teller, ranking', icon: 'Trophy' },
];

// ============================================================================
// GOAL CATEGORIES
// ============================================================================

const goalCategories: GoalCategory[] = [
  { id: 'score', name: 'Score', nameNO: 'Score', icon: 'Target', color: 'blue', description: 'Scoring goals', descriptionNO: 'Scoremål' },
  { id: 'teknikk', name: 'Technique', nameNO: 'Teknikk', icon: 'Crosshair', color: 'green', description: 'Technical improvement', descriptionNO: 'Teknisk forbedring' },
  { id: 'fysisk', name: 'Physical', nameNO: 'Fysisk', icon: 'Dumbbell', color: 'orange', description: 'Physical fitness', descriptionNO: 'Fysisk form' },
  { id: 'mental', name: 'Mental', nameNO: 'Mental', icon: 'Brain', color: 'purple', description: 'Mental strength', descriptionNO: 'Mental styrke' },
  { id: 'turnering', name: 'Tournament', nameNO: 'Turnering', icon: 'Trophy', color: 'gold', description: 'Competition results', descriptionNO: 'Konkurranseresultater' },
  { id: 'prosess', name: 'Process', nameNO: 'Prosess', icon: 'RefreshCw', color: 'teal', description: 'Process goals', descriptionNO: 'Prosessmål' },
];

// ============================================================================
// PERFORMANCE METRICS - Strokes Gained and others
// ============================================================================

const performanceMetrics: PerformanceMetric[] = [
  {
    id: 'handicap',
    name: 'Handicap',
    nameNO: 'Handicap',
    unit: '',
    description: 'Official golf handicap index',
    descriptionNO: 'Offisielt golf handicap index',
    category: 'scoring',
    higherIsBetter: false,
    benchmarks: { amateur: 25, intermediate: 15, advanced: 5, elite: 0, professional: -5 },
  },
  {
    id: 'sg_total',
    name: 'Strokes Gained: Total',
    nameNO: 'Strokes Gained: Total',
    unit: 'strokes',
    description: 'Total strokes gained vs field',
    descriptionNO: 'Totalt strokes gained mot feltet',
    category: 'scoring',
    higherIsBetter: true,
  },
  {
    id: 'sg_tee',
    name: 'Strokes Gained: Off the Tee',
    nameNO: 'Strokes Gained: Utslagsstedet',
    unit: 'strokes',
    description: 'Strokes gained from tee shots',
    descriptionNO: 'Strokes gained fra utslag',
    category: 'tee',
    higherIsBetter: true,
  },
  {
    id: 'sg_approach',
    name: 'Strokes Gained: Approach',
    nameNO: 'Strokes Gained: Innspill',
    unit: 'strokes',
    description: 'Strokes gained from approach shots',
    descriptionNO: 'Strokes gained fra innspill',
    category: 'approach',
    higherIsBetter: true,
  },
  {
    id: 'sg_around',
    name: 'Strokes Gained: Around the Green',
    nameNO: 'Strokes Gained: Rundt greenen',
    unit: 'strokes',
    description: 'Strokes gained from short game',
    descriptionNO: 'Strokes gained fra kortspill',
    category: 'short_game',
    higherIsBetter: true,
  },
  {
    id: 'sg_putting',
    name: 'Strokes Gained: Putting',
    nameNO: 'Strokes Gained: Putting',
    unit: 'strokes',
    description: 'Strokes gained on the green',
    descriptionNO: 'Strokes gained på greenen',
    category: 'putting',
    higherIsBetter: true,
  },
  {
    id: 'clubhead_speed',
    name: 'Clubhead Speed',
    nameNO: 'Klubbhodehastighet',
    unit: 'mph',
    description: 'Speed of clubhead at impact',
    descriptionNO: 'Hastighet på klubbhodet ved treff',
    category: 'speed',
    higherIsBetter: true,
    benchmarks: { amateur: 85, intermediate: 95, advanced: 105, elite: 115, professional: 120 },
  },
  {
    id: 'ball_speed',
    name: 'Ball Speed',
    nameNO: 'Ballhastighet',
    unit: 'mph',
    description: 'Speed of ball after impact',
    descriptionNO: 'Hastighet på ballen etter treff',
    category: 'speed',
    higherIsBetter: true,
  },
  {
    id: 'smash_factor',
    name: 'Smash Factor',
    nameNO: 'Smash Factor',
    unit: '',
    description: 'Ball speed / clubhead speed ratio',
    descriptionNO: 'Ballhastighet / klubbhodehastighet ratio',
    category: 'efficiency',
    higherIsBetter: true,
    benchmarks: { amateur: 1.40, intermediate: 1.44, advanced: 1.47, elite: 1.49, professional: 1.50 },
  },
  {
    id: 'carry_distance',
    name: 'Carry Distance',
    nameNO: 'Carry-distanse',
    unit: 'yards',
    description: 'Distance ball travels in air',
    descriptionNO: 'Distanse ballen flyr i lufta',
    category: 'distance',
    higherIsBetter: true,
  },
  {
    id: 'total_distance',
    name: 'Total Distance',
    nameNO: 'Total distanse',
    unit: 'yards',
    description: 'Total distance including roll',
    descriptionNO: 'Total distanse inkludert rulle',
    category: 'distance',
    higherIsBetter: true,
  },
];

// ============================================================================
// EQUIPMENT
// ============================================================================

const equipment: Equipment[] = [
  {
    id: 'trackman',
    name: 'TrackMan',
    nameNO: 'TrackMan',
    category: 'launch_monitor',
    icon: 'Radar',
    description: 'Radar-based launch monitor',
    providesData: true,
    dataTypes: ['clubhead_speed', 'ball_speed', 'launch_angle', 'spin_rate', 'carry_distance'],
  },
  {
    id: 'gcquad',
    name: 'GCQuad',
    nameNO: 'GCQuad',
    category: 'launch_monitor',
    icon: 'Camera',
    description: 'Camera-based launch monitor',
    providesData: true,
    dataTypes: ['clubhead_speed', 'ball_speed', 'launch_angle', 'spin_rate', 'carry_distance'],
  },
  {
    id: 'driver',
    name: 'Driver',
    nameNO: 'Driver',
    category: 'club',
    icon: 'Golf',
    providesData: false,
  },
  {
    id: 'putter',
    name: 'Putter',
    nameNO: 'Putter',
    category: 'club',
    icon: 'Flag',
    providesData: false,
  },
];

// ============================================================================
// TERMINOLOGY
// ============================================================================

const terminology: SportTerminology = {
  // Roles
  athlete: 'Player',
  athletePlural: 'Players',
  coach: 'Coach',
  coachPlural: 'Coaches',

  // Norwegian roles
  athleteNO: 'Spiller',
  athletePluralNO: 'Spillere',
  coachNO: 'Trener',
  coachPluralNO: 'Trenere',

  // Training
  session: 'Session',
  sessionPlural: 'Sessions',
  practice: 'Practice',
  drill: 'Drill',
  drillPlural: 'Drills',

  // Norwegian training
  sessionNO: 'Økt',
  sessionPluralNO: 'Økter',
  practiceNO: 'Trening',
  drillNO: 'Øvelse',
  drillPluralNO: 'Øvelser',

  // Competition
  competition: 'Tournament',
  competitionPlural: 'Tournaments',
  match: 'Round',
  matchPlural: 'Rounds',

  // Norwegian competition
  competitionNO: 'Turnering',
  competitionPluralNO: 'Turneringer',
  matchNO: 'Runde',
  matchPluralNO: 'Runder',

  // Performance
  score: 'Score',
  result: 'Result',
  personalBest: 'Personal Best',

  // Norwegian performance
  scoreNO: 'Score',
  resultNO: 'Resultat',
  personalBestNO: 'Personlig rekord',

  // Golf-specific
  swing: 'Swing',
  swingNO: 'Sving',
  shortGame: 'Short Game',
  shortGameNO: 'Kortspill',
  putting: 'Putting',
  puttingNO: 'Putting',
  approach: 'Approach',
  approachNO: 'Innspill',
  teeShot: 'Tee Shot',
  teeShotNO: 'Utslag',
  course: 'Course',
  courseNO: 'Bane',
  hole: 'Hole',
  holeNO: 'Hull',
  par: 'Par',
  parNO: 'Par',
  birdie: 'Birdie',
  birdieNO: 'Birdie',
  eagle: 'Eagle',
  eagleNO: 'Eagle',
  bogey: 'Bogey',
  bogeyNO: 'Bogey',
};

// ============================================================================
// NAVIGATION
// ============================================================================

const navigation: SportNavigation = {
  quickActions: [
    {
      label: 'Log Training',
      labelNO: 'Logg trening',
      icon: 'Plus',
      href: '/trening/logg',
      variant: 'primary',
    },
    {
      label: 'Register Test',
      labelNO: 'Registrer test',
      icon: 'Target',
      href: '/trening/testing/registrer',
      variant: 'secondary',
    },
    {
      label: 'View Calendar',
      labelNO: 'Se kalender',
      icon: 'Calendar',
      href: '/plan/kalender',
      variant: 'secondary',
    },
  ],
  testing: {
    hubPath: '/trening/testing',
    registerPath: '/trening/testing/registrer',
    resultsPath: '/analyse/tester',
    label: 'Test Protocol',
    labelNO: 'Testprotokoll',
  },
  itemOverrides: [
    // Golf-specific terminology overrides (if needed)
  ],
};

// ============================================================================
// COMPLETE GOLF CONFIG
// ============================================================================

export const GOLF_CONFIG: SportConfig = {
  id: 'golf',
  name: 'Golf',
  nameNO: 'Golf',
  icon: 'Golf',
  color: '#2E7D32', // Green

  trainingAreas,
  environments,
  phases,
  intensityLevels,
  pressureLevels,

  testProtocols: golfTestDefinitions as unknown as TestProtocol[],
  performanceMetrics,
  benchmarkSource: 'DataGolf',

  goalCategories,
  terminology,
  equipment,
  navigation,

  metadata: {
    maxHolesPerRound: 18,
    parRange: [3, 4, 5],
    handicapSystem: 'WHS', // World Handicap System
  },
};

export default GOLF_CONFIG;
