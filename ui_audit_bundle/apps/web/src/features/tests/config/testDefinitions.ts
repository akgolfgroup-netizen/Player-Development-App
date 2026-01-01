// ============================================================================
// TEST DEFINITIONS - Alle 20 IUP Golf Tester
// ============================================================================

export type FormType = 'simple' | 'percentage' | 'table' | 'round';
export type CalculationType = 'best' | 'average' | 'averageBest3' | 'percentage' | 'pei' | 'stddev' | 'direct';

export interface ScoringThreshold {
  max: number;
  label: string;
  color: string;
}

export interface ScoringThresholds {
  excellent: ScoringThreshold;
  good: ScoringThreshold;
  average: ScoringThreshold;
  needsWork: ScoringThreshold;
}

export interface ColumnDef {
  key: string;
  label: string;
  type: 'number' | 'select' | 'boolean';
  unit?: string;
  options?: { id: string; label: string; color?: string }[];
  required?: boolean;
}

export interface TestDefinition {
  id: string;
  testNumber: number;
  name: string;
  shortName: string;
  category: 'speed' | 'distance' | 'accuracy' | 'short_game' | 'putting' | 'physical' | 'scoring' | 'mental';
  icon: string;
  description: string;
  purpose: string;
  methodology: string[];
  equipment: string[];
  duration: string;
  attempts: number;
  unit: string;
  lowerIsBetter: boolean;
  formType: FormType;
  calculationType: CalculationType;
  scoring: ScoringThresholds;
  tips: string[];
  formConfig?: {
    columns?: ColumnDef[];
    distances?: number[];
    targetWidth?: number;
    holes?: number;
  };
}

// ============================================================================
// SCORING PRESETS
// ============================================================================

const speedScoring: ScoringThresholds = {
  excellent: { max: 120, label: 'Utmerket', color: '#22C55E' },
  good: { max: 110, label: 'Bra', color: '#EAB308' },
  average: { max: 100, label: 'Gjennomsnitt', color: '#F97316' },
  needsWork: { max: 0, label: 'Trenger arbeid', color: '#EF4444' },
};

const distanceScoring: ScoringThresholds = {
  excellent: { max: 280, label: 'Utmerket', color: '#22C55E' },
  good: { max: 250, label: 'Bra', color: '#EAB308' },
  average: { max: 220, label: 'Gjennomsnitt', color: '#F97316' },
  needsWork: { max: 0, label: 'Trenger arbeid', color: '#EF4444' },
};

const accuracyScoring: ScoringThresholds = {
  excellent: { max: 5, label: 'Utmerket', color: '#22C55E' },
  good: { max: 10, label: 'Bra', color: '#EAB308' },
  average: { max: 15, label: 'Gjennomsnitt', color: '#F97316' },
  needsWork: { max: 100, label: 'Trenger arbeid', color: '#EF4444' },
};

const percentageScoring: ScoringThresholds = {
  excellent: { max: 100, label: 'Utmerket', color: '#22C55E' },
  good: { max: 75, label: 'Bra', color: '#EAB308' },
  average: { max: 50, label: 'Gjennomsnitt', color: '#F97316' },
  needsWork: { max: 0, label: 'Trenger arbeid', color: '#EF4444' },
};

const puttingShortScoring: ScoringThresholds = {
  excellent: { max: 100, label: 'Utmerket', color: '#22C55E' },
  good: { max: 85, label: 'Bra', color: '#EAB308' },
  average: { max: 70, label: 'Gjennomsnitt', color: '#F97316' },
  needsWork: { max: 0, label: 'Trenger arbeid', color: '#EF4444' },
};

const physicalScoring: ScoringThresholds = {
  excellent: { max: 100, label: 'Utmerket', color: '#22C55E' },
  good: { max: 75, label: 'Bra', color: '#EAB308' },
  average: { max: 50, label: 'Gjennomsnitt', color: '#F97316' },
  needsWork: { max: 0, label: 'Trenger arbeid', color: '#EF4444' },
};

// ============================================================================
// TEST DEFINITIONS
// ============================================================================

export const testDefinitions: TestDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1: Driver Clubhead Speed
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'driver-clubhead-speed',
    testNumber: 1,
    name: 'Driver Klubbhodehastighet',
    shortName: 'Driver Speed',
    category: 'speed',
    icon: '⚡',
    description: 'Mål klubbhodehastighet med driver. 6 slag, beste resultat teller.',
    purpose: 'Klubbhodehastighet er en av de viktigste faktorene for å oppnå lang slaglengde. Denne testen gir deg et presist mål på din maksimale hastighet.',
    methodology: [
      'Varm opp grundig med dynamisk stretching',
      'Slå 5-10 oppvarmingsslag med driver',
      'Slå 6 slag med full innsats',
      'Noter hastigheten for hvert slag',
      'Beste resultat registreres',
    ],
    equipment: ['Driver', 'Launch Monitor (TrackMan, FlightScope, etc.)'],
    duration: '15-20 minutter',
    attempts: 6,
    unit: 'mph',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'best',
    scoring: speedScoring,
    tips: [
      'Fokuser på timing, ikke bare kraft',
      'Hold balansen gjennom hele svingen',
      'La kroppen rotere fritt',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2: 7-Iron Clubhead Speed
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: '7iron-clubhead-speed',
    testNumber: 2,
    name: '7-Jern Klubbhodehastighet',
    shortName: '7-Iron Speed',
    category: 'speed',
    icon: '⚡',
    description: 'Mål klubbhodehastighet med 7-jern. 6 slag, beste resultat teller.',
    purpose: 'Hastighet med jern korrelerer med carry-avstand og muligheten til å treffe greener fra lengre hold.',
    methodology: [
      'Varm opp med stretching og svingøvelser',
      'Slå 5-10 oppvarmingsslag',
      'Slå 6 slag med full innsats',
      'Noter hastigheten for hvert slag',
      'Beste resultat registreres',
    ],
    equipment: ['7-Jern', 'Launch Monitor'],
    duration: '15-20 minutter',
    attempts: 6,
    unit: 'mph',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'best',
    scoring: { ...speedScoring, excellent: { ...speedScoring.excellent, max: 95 }, good: { ...speedScoring.good, max: 85 } },
    tips: [
      'Behold samme tempo som med driver',
      'Fokuser på solid treff',
      'La armene svinge fritt',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3: Driver Carry Distance
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'driver-carry-distance',
    testNumber: 3,
    name: 'Driver Carry-avstand',
    shortName: 'Driver Carry',
    category: 'distance',
    icon: '📏',
    description: 'Mål carry-avstand med driver. 6 slag, gjennomsnitt av beste 3.',
    purpose: 'Carry-avstand viser hvor langt ballen flyr i luften før den lander. Dette er viktig for å planlegge slag over hindringer.',
    methodology: [
      'Varm opp grundig',
      'Slå 6 slag med driver',
      'Noter carry-avstanden for hvert slag',
      'Gjennomsnitt av de 3 beste teller',
    ],
    equipment: ['Driver', 'Launch Monitor', 'Rangeballer eller premium baller'],
    duration: '15-20 minutter',
    attempts: 6,
    unit: 'm',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'averageBest3',
    scoring: distanceScoring,
    tips: [
      'Bruk samme ball-type for konsistente resultater',
      'Vær oppmerksom på vindforhold',
      'Fokuser på kvalitetstreff, ikke bare kraft',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 4: PEI (Proximity to Efficiency Index)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'pei-accuracy',
    testNumber: 4,
    name: 'PEI - Presisjon',
    shortName: 'PEI',
    category: 'accuracy',
    icon: '🎯',
    description: 'Slå 10 slag fra 100m. Mål avstand til flagg. Beregn PEI.',
    purpose: 'PEI (Precision Error Index) måler hvor presist du treffer i forhold til slaglengden. En PEI på 5% betyr at ballen lander 5m fra målet på et 100m slag.',
    methodology: [
      'Velg et mål på ca. 100 meter',
      'Slå 10 slag mot målet',
      'Mål avstand fra ball til mål for hvert slag',
      'PEI beregnes: (snitt avstand til mål / slaglengde) × 100',
    ],
    equipment: ['Wedge eller kort jern', 'Laseravstandsmåler', 'Måltavle eller flagg'],
    duration: '20-25 minutter',
    attempts: 10,
    unit: '%',
    lowerIsBetter: true,
    formType: 'table',
    calculationType: 'pei',
    scoring: accuracyScoring,
    tips: [
      'Velg en konsistent avstand for sammenligning over tid',
      'Noter vindforhold',
      'Fokuser på retning før avstand',
    ],
    formConfig: {
      columns: [
        { key: 'distance', label: 'Avstand til mål', type: 'number', unit: 'm', required: true },
        { key: 'toHole', label: 'Avstand til hull', type: 'number', unit: 'm', required: true },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 5: Fairway Accuracy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'fairway-accuracy',
    testNumber: 5,
    name: 'Fairway-treff',
    shortName: 'FIR',
    category: 'accuracy',
    icon: '🏌️',
    description: 'Slå 10 driver-slag mot fairway-mål. Tell treff innenfor 30m bredde.',
    purpose: 'Fairway-treff er avgjørende for å sette opp gode approach-slag. Denne testen måler din evne til å treffe fairway konsistent.',
    methodology: [
      'Marker et mål 30m bredt (typisk fairway-bredde)',
      'Slå 10 driver-slag',
      'Tell antall slag som lander innenfor målområdet',
      'Prosent treff = (antall treff / 10) × 100',
    ],
    equipment: ['Driver', 'Markører for målområde'],
    duration: '15-20 minutter',
    attempts: 10,
    unit: '%',
    lowerIsBetter: false,
    formType: 'percentage',
    calculationType: 'percentage',
    scoring: percentageScoring,
    tips: [
      'Velg en spesifikk landingssone',
      'Fokuser på å treffe mitten av kølla',
      'Bruk din normale svingrutine',
    ],
    formConfig: {
      targetWidth: 30,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 6: GIR Simulation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gir-simulation',
    testNumber: 6,
    name: 'GIR Simulering',
    shortName: 'GIR',
    category: 'accuracy',
    icon: '🟢',
    description: 'Slå approach-slag til 9 ulike avstander. Tell greener truffet.',
    purpose: 'Greens in Regulation (GIR) er en av de viktigste statistikkene for scoring. Denne testen simulerer approach-slag fra typiske avstander.',
    methodology: [
      'Sett opp 9 mål på ulike avstander (80-180m)',
      'Slå ett slag til hver avstand',
      'Tell antall slag som treffer green',
      'GIR% = (antall treff / 9) × 100',
    ],
    equipment: ['Jern (6-9)', 'Wedger', 'Launch Monitor eller visuell vurdering'],
    duration: '25-30 minutter',
    attempts: 9,
    unit: '%',
    lowerIsBetter: false,
    formType: 'table',
    calculationType: 'percentage',
    scoring: percentageScoring,
    tips: [
      'Kjenn dine avstander med hvert jern',
      'Sikt mot midten av green',
      'Ta hensyn til vind og terreng',
    ],
    formConfig: {
      distances: [80, 100, 120, 140, 160, 180, 90, 110, 130],
      columns: [
        { key: 'distance', label: 'Avstand', type: 'number', unit: 'm', required: true },
        { key: 'hit', label: 'Traff green', type: 'boolean', required: true },
        { key: 'toHole', label: 'Avstand til hull', type: 'number', unit: 'm' },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 7: Short Game Up & Down
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'short-game-up-down',
    testNumber: 7,
    name: 'Up & Down',
    shortName: 'Up&Down',
    category: 'short_game',
    icon: '⛳',
    description: 'Chip og putt fra 10 posisjoner rundt green. Tell up-and-down prosent.',
    purpose: 'Up-and-down evne er avgjørende for å redde par når du bommer på green. Denne testen måler din kortspill-effektivitet.',
    methodology: [
      'Velg 10 ulike posisjoner rundt green (5-30m fra hull)',
      'Chip ballen på green',
      'Putt ut',
      'Tell antall ganger du får ballen i hullet på 2 slag eller mindre',
    ],
    equipment: ['Wedger (SW, LW)', 'Putter', 'Baller'],
    duration: '30-40 minutter',
    attempts: 10,
    unit: '%',
    lowerIsBetter: false,
    formType: 'round',
    calculationType: 'percentage',
    scoring: percentageScoring,
    tips: [
      'Vurder alltid hvor du vil lande ballen',
      'Les greenen før du chipper',
      'Øv på varierende lie-typer',
    ],
    formConfig: {
      columns: [
        { key: 'position', label: 'Posisjon', type: 'number' },
        { key: 'lie', label: 'Lie', type: 'select', options: [
          { id: 'fairway', label: 'Fairway', color: '#22C55E' },
          { id: 'rough', label: 'Rough', color: '#EAB308' },
          { id: 'bunker', label: 'Bunker', color: '#F97316' },
          { id: 'fringe', label: 'Fringe', color: '#3B82F6' },
        ]},
        { key: 'distance', label: 'Avstand', type: 'number', unit: 'm' },
        { key: 'upDown', label: 'Up&Down', type: 'boolean', required: true },
        { key: 'strokes', label: 'Antall slag', type: 'number' },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 8: Bunker Proximity
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'bunker-proximity',
    testNumber: 8,
    name: 'Bunker Presisjon',
    shortName: 'Bunker',
    category: 'short_game',
    icon: '🏖️',
    description: 'Slå 10 bunker-slag. Mål gjennomsnittlig avstand til hull.',
    purpose: 'Bunker-spill er ofte en svakhet for amatører. Denne testen måler din evne til å komme nær hullet fra sand.',
    methodology: [
      'Velg en green-side bunker',
      'Slå 10 slag fra bunker mot hull',
      'Mål avstand fra ball til hull for hvert slag',
      'Beregn gjennomsnittlig avstand',
    ],
    equipment: ['Sand Wedge', 'Laseravstandsmåler', 'Baller'],
    duration: '20-25 minutter',
    attempts: 10,
    unit: 'm',
    lowerIsBetter: true,
    formType: 'table',
    calculationType: 'average',
    scoring: accuracyScoring,
    tips: [
      'Åpne klubbflaten',
      'Sikt 5-10cm bak ballen',
      'Følg gjennom mot målet',
    ],
    formConfig: {
      columns: [
        { key: 'toHole', label: 'Avstand til hull', type: 'number', unit: 'm', required: true },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 9: Putting 1.5m
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'putting-1-5m',
    testNumber: 9,
    name: 'Putting 1.5m',
    shortName: 'Putt 1.5m',
    category: 'putting',
    icon: '🕳️',
    description: 'Putt 20 baller fra 1.5 meter. Tell antall holet.',
    purpose: 'Korte putter er avgjørende for scoring. Denne avstanden er typisk for "must-make" putter.',
    methodology: [
      'Mål opp 1.5 meter fra hullet',
      'Putt 20 baller',
      'Tell antall putter som går i hull',
      'Prosent holet = (antall i hull / 20) × 100',
    ],
    equipment: ['Putter', '20 baller', 'Målebånd'],
    duration: '15-20 minutter',
    attempts: 20,
    unit: '%',
    lowerIsBetter: false,
    formType: 'percentage',
    calculationType: 'percentage',
    scoring: puttingShortScoring,
    tips: [
      'Fokuser på å holde hodet stille',
      'Bruk samme pre-shot rutine for hver putt',
      'Øv fra ulike vinkler',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 10: Putting 3m
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'putting-3m',
    testNumber: 10,
    name: 'Putting 3m',
    shortName: 'Putt 3m',
    category: 'putting',
    icon: '🕳️',
    description: 'Putt 20 baller fra 3 meter. Tell antall holet.',
    purpose: 'Putter fra 3 meter er ofte avgjørende for birdie-muligheter og par-redninger.',
    methodology: [
      'Mål opp 3 meter fra hullet',
      'Putt 20 baller',
      'Tell antall putter som går i hull',
      'Prosent holet = (antall i hull / 20) × 100',
    ],
    equipment: ['Putter', '20 baller', 'Målebånd'],
    duration: '15-20 minutter',
    attempts: 20,
    unit: '%',
    lowerIsBetter: false,
    formType: 'percentage',
    calculationType: 'percentage',
    scoring: { ...puttingShortScoring, excellent: { ...puttingShortScoring.excellent, max: 70 }, good: { ...puttingShortScoring.good, max: 50 } },
    tips: [
      'Les greenen nøye',
      'Fokuser på hastighet først, deretter linje',
      'Øv fra ulike vinkler for variasjon',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 11: Lag Putting 10m
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'lag-putting-10m',
    testNumber: 11,
    name: 'Lag Putting 10m',
    shortName: 'Lag Putt',
    category: 'putting',
    icon: '📍',
    description: 'Putt 10 baller fra 10 meter. Mål gjennomsnittlig avstand til hull.',
    purpose: 'Lag putting handler om å få ballen nær hullet fra lang avstand for å unngå tre-putter.',
    methodology: [
      'Mål opp 10 meter fra hullet',
      'Putt 10 baller',
      'Mål avstand fra ball til hull for hver putt',
      'Beregn gjennomsnittlig avstand',
    ],
    equipment: ['Putter', '10 baller', 'Målebånd'],
    duration: '15-20 minutter',
    attempts: 10,
    unit: 'cm',
    lowerIsBetter: true,
    formType: 'table',
    calculationType: 'average',
    scoring: { ...accuracyScoring, excellent: { ...accuracyScoring.excellent, max: 50 }, good: { ...accuracyScoring.good, max: 100 }, average: { ...accuracyScoring.average, max: 150 } },
    tips: [
      'Fokuser mer på hastighet enn linje',
      'Visualiser en stor sirkel rundt hullet',
      'Bruk en avslappet grep',
    ],
    formConfig: {
      columns: [
        { key: 'toHole', label: 'Avstand til hull', type: 'number', unit: 'cm', required: true },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 12: Med Ball Throw
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'med-ball-throw',
    testNumber: 12,
    name: 'Medisinball Kast',
    shortName: 'Med Ball',
    category: 'physical',
    icon: '💪',
    description: 'Kast 3kg medisinball med rotasjon. 3 forsøk, beste teller.',
    purpose: 'Rotasjonskraft er essensielt for svingfart. Denne testen måler eksplosiv kraft i overkroppen.',
    methodology: [
      'Stå med føttene skulderbredde fra hverandre',
      'Hold medisinballen ved hoften',
      'Roter og kast ballen så langt som mulig',
      '3 forsøk, beste resultat teller',
    ],
    equipment: ['3kg Medisinball', 'Målebånd', 'Åpent område'],
    duration: '10-15 minutter',
    attempts: 3,
    unit: 'm',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'best',
    scoring: physicalScoring,
    tips: [
      'Bruk hele kroppen i kastet',
      'Start rotasjonen fra hoftene',
      'Slipp ballen når armene er fremfor kroppen',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 13: Vertical Jump
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'vertical-jump',
    testNumber: 13,
    name: 'Vertikalt Hopp',
    shortName: 'Hopp',
    category: 'physical',
    icon: '🦘',
    description: 'Stående vertikalt hopp. 3 forsøk, beste teller.',
    purpose: 'Vertikalt hopp måler eksplosiv beinstyrke, som korrelerer med evnen til å generere kraft fra bakken i svingen.',
    methodology: [
      'Stå ved en vegg eller bruk hopptester',
      'Merk rekkevidde med arm strukket opp',
      'Hopp så høyt som mulig og merk høyeste punkt',
      '3 forsøk, beste resultat teller',
    ],
    equipment: ['Vegg med merker eller Vertec', 'Kritt (valgfritt)'],
    duration: '10-15 minutter',
    attempts: 3,
    unit: 'cm',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'best',
    scoring: physicalScoring,
    tips: [
      'Bruk armene aktivt',
      'Bøy knærne til ca. 90 grader',
      'Land mykt med bøyde knær',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 14: Hip Rotation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'hip-rotation',
    testNumber: 14,
    name: 'Hofterotasjon',
    shortName: 'Hofte',
    category: 'physical',
    icon: '🔄',
    description: 'Mål intern hofterotasjon i liggende posisjon.',
    purpose: 'God hoftemobilitet er viktig for å kunne rotere effektivt i golfsvingen uten å kompensere med andre kroppsdeler.',
    methodology: [
      'Ligg på ryggen med kneet bøyd 90 grader',
      'Roter foten utover (intern rotasjon)',
      'Mål vinkelen med goniometer',
      'Test begge sider',
    ],
    equipment: ['Goniometer', 'Benk eller matte'],
    duration: '10 minutter',
    attempts: 1,
    unit: '°',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'direct',
    scoring: physicalScoring,
    tips: [
      'Hold korsryggen flat mot underlaget',
      'Ikke tving bevegelsen',
      'Sammenlign høyre og venstre side',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 15: Thoracic Rotation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'thoracic-rotation',
    testNumber: 15,
    name: 'Thorax Rotasjon',
    shortName: 'Thorax',
    category: 'physical',
    icon: '🔄',
    description: 'Mål thorax-rotasjon i sittende posisjon.',
    purpose: 'Thorax-rotasjon er kritisk for baksvingen og gjennomsvingen. Begrenset rotasjon kan føre til kompensasjoner.',
    methodology: [
      'Sitt med rett rygg, armer krysset over brystet',
      'Roter overkroppen så langt som mulig',
      'Mål vinkelen med goniometer',
      'Test begge retninger',
    ],
    equipment: ['Goniometer', 'Stol uten armlener'],
    duration: '10 minutter',
    attempts: 1,
    unit: '°',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'direct',
    scoring: physicalScoring,
    tips: [
      'Hold hoftene stille',
      'Roter fra brystkassen, ikke skuldrene',
      'Pust ut mens du roterer',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 16: Plank Hold
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'plank-hold',
    testNumber: 16,
    name: 'Planke',
    shortName: 'Planke',
    category: 'physical',
    icon: '🏋️',
    description: 'Hold plankeposisjon så lenge som mulig med god form.',
    purpose: 'Kjernemuskulatur er fundamentet for en stabil golfsving. Planken tester utholdenhet i kjernen.',
    methodology: [
      'Innta plankeposisjon på underarmer og tær',
      'Hold kroppen i rett linje',
      'Start stoppeklokke',
      'Stopp når formen bryter sammen',
    ],
    equipment: ['Stoppeklokke', 'Matte'],
    duration: '5-10 minutter',
    attempts: 1,
    unit: 'sek',
    lowerIsBetter: false,
    formType: 'simple',
    calculationType: 'direct',
    scoring: { ...physicalScoring, excellent: { ...physicalScoring.excellent, max: 180 }, good: { ...physicalScoring.good, max: 120 }, average: { ...physicalScoring.average, max: 60 } },
    tips: [
      'Hold ryggen flat',
      'Stram magemusklene',
      'Pust jevnt gjennom testen',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 17: 9-Hole Scoring
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: '9-hole-scoring',
    testNumber: 17,
    name: '9-Hull Scoring',
    shortName: '9 Hull',
    category: 'scoring',
    icon: '⛳',
    description: 'Spill 9 hull under testforhold. Noter score.',
    purpose: 'Denne testen måler din evne til å score under kontrollerte forhold, og gir et bilde av ditt faktiske spillnivå.',
    methodology: [
      'Spill 9 hull på din hjemmebane eller en kjent bane',
      'Følg reglene nøye',
      'Noter score, fairway treff, GIR og putter for hvert hull',
      'Beregn total score i forhold til par',
    ],
    equipment: ['Fullt sett køller', 'Baller', 'Scoreark'],
    duration: '2-2.5 timer',
    attempts: 9,
    unit: 'slag',
    lowerIsBetter: true,
    formType: 'round',
    calculationType: 'direct',
    scoring: { ...accuracyScoring, excellent: { ...accuracyScoring.excellent, max: 36 }, good: { ...accuracyScoring.good, max: 40 }, average: { ...accuracyScoring.average, max: 45 } },
    tips: [
      'Spill din normale strategi',
      'Fokuser på prosess, ikke resultat',
      'Noter mentale observasjoner etter runden',
    ],
    formConfig: {
      holes: 9,
      columns: [
        { key: 'hole', label: 'Hull', type: 'number' },
        { key: 'par', label: 'Par', type: 'number' },
        { key: 'score', label: 'Score', type: 'number', required: true },
        { key: 'fir', label: 'FIR', type: 'boolean' },
        { key: 'gir', label: 'GIR', type: 'boolean' },
        { key: 'putts', label: 'Putter', type: 'number' },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 18: Mental Focus
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mental-focus',
    testNumber: 18,
    name: 'Mental Fokus',
    shortName: 'Mental',
    category: 'mental',
    icon: '🧠',
    description: 'Putt-serie med økende press. Evaluer mental kontroll.',
    purpose: 'Mental styrke er ofte det som skiller gode spillere fra de beste. Denne testen måler din evne til å prestere under press.',
    methodology: [
      'Sett opp en serie putter med økende vanskelighetsgrad',
      'Start med enkle putter, øk avstanden',
      'Evaluer fokus og kontroll på skala 1-10 etter hver putt',
      'Beregn gjennomsnittlig mental score',
    ],
    equipment: ['Putter', 'Baller'],
    duration: '20-30 minutter',
    attempts: 10,
    unit: '/10',
    lowerIsBetter: false,
    formType: 'round',
    calculationType: 'average',
    scoring: { ...physicalScoring, excellent: { ...physicalScoring.excellent, max: 10 }, good: { ...physicalScoring.good, max: 8 }, average: { ...physicalScoring.average, max: 6 } },
    tips: [
      'Bruk pusteteknikker mellom putter',
      'Visualiser suksess før hver putt',
      'Observer tankene dine uten å dømme',
    ],
    formConfig: {
      columns: [
        { key: 'round', label: 'Runde', type: 'number' },
        { key: 'distance', label: 'Avstand', type: 'number', unit: 'm' },
        { key: 'holed', label: 'Holet', type: 'boolean' },
        { key: 'focusRating', label: 'Fokus (1-10)', type: 'number', required: true },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 19: Pre-Shot Routine Consistency
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'preshot-routine',
    testNumber: 19,
    name: 'Pre-Shot Rutine',
    shortName: 'Rutine',
    category: 'mental',
    icon: '⏱️',
    description: 'Observer og ti pre-shot rutine over 10 slag. Mål konsistens.',
    purpose: 'En konsistent pre-shot rutine hjelper deg å prestere under press. Denne testen måler hvor stabil rutinen din er.',
    methodology: [
      'Slå 10 slag med din normale pre-shot rutine',
      'La en partner time rutinen fra start til treff',
      'Beregn standardavvik i tid',
      'Lavere standardavvik = mer konsistent',
    ],
    equipment: ['Stoppeklokke', 'Partner (valgfritt)'],
    duration: '20 minutter',
    attempts: 10,
    unit: 'sek',
    lowerIsBetter: true,
    formType: 'simple',
    calculationType: 'stddev',
    scoring: { ...accuracyScoring, excellent: { ...accuracyScoring.excellent, max: 2 }, good: { ...accuracyScoring.good, max: 4 }, average: { ...accuracyScoring.average, max: 6 } },
    tips: [
      'Definer klare steg i rutinen din',
      'Bruk samme rutine for alle slag',
      'Inkluder et mentalt cue før svingen',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 20: Competition Simulation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'competition-simulation',
    testNumber: 20,
    name: 'Konkurransesimulering',
    shortName: 'Konkurranse',
    category: 'mental',
    icon: '🏆',
    description: 'Spill 3 hull med simulert konkurransepress. Score og mental evaluering.',
    purpose: 'Denne testen simulerer konkurransesituasjoner for å måle din evne til å prestere når det gjelder.',
    methodology: [
      'Velg 3 utfordrende hull',
      'Sett opp en "konsekvens" for dårlig score (f.eks. ekstra øvelse)',
      'Spill hullene med full konsentrasjon',
      'Evaluer score og mental prestasjon',
    ],
    equipment: ['Fullt sett køller', 'Scoreark'],
    duration: '45-60 minutter',
    attempts: 3,
    unit: 'slag',
    lowerIsBetter: true,
    formType: 'round',
    calculationType: 'direct',
    scoring: { ...accuracyScoring, excellent: { ...accuracyScoring.excellent, max: 9 }, good: { ...accuracyScoring.good, max: 12 }, average: { ...accuracyScoring.average, max: 15 } },
    tips: [
      'Skap et realistisk press-scenario',
      'Fokuser på prosess, ikke utfall',
      'Reflekter over mentale utfordringer etterpå',
    ],
    formConfig: {
      holes: 3,
      columns: [
        { key: 'hole', label: 'Hull', type: 'number' },
        { key: 'par', label: 'Par', type: 'number' },
        { key: 'score', label: 'Score', type: 'number', required: true },
        { key: 'mentalRating', label: 'Mental (1-10)', type: 'number', required: true },
      ],
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines the score level based on the result value and scoring thresholds.
 * Returns the appropriate threshold (excellent, good, average, needsWork) with label and color.
 */
export const getScoreLevel = (
  result: number,
  scoring: ScoringThresholds,
  lowerIsBetter: boolean
): ScoringThreshold => {
  if (lowerIsBetter) {
    // Lower is better (e.g., PEI, distance to hole)
    if (result <= scoring.excellent.max) return scoring.excellent;
    if (result <= scoring.good.max) return scoring.good;
    if (result <= scoring.average.max) return scoring.average;
    return scoring.needsWork;
  } else {
    // Higher is better (e.g., speed, distance, percentage)
    if (result >= scoring.excellent.max) return scoring.excellent;
    if (result >= scoring.good.max) return scoring.good;
    if (result >= scoring.average.max) return scoring.average;
    return scoring.needsWork;
  }
};

export const getTestById = (id: string): TestDefinition | undefined => {
  return testDefinitions.find(t => t.id === id);
};

export const getTestByNumber = (num: number): TestDefinition | undefined => {
  return testDefinitions.find(t => t.testNumber === num);
};

export const getTestsByCategory = (category: TestDefinition['category']): TestDefinition[] => {
  return testDefinitions.filter(t => t.category === category);
};

export const getTestsByFormType = (formType: FormType): TestDefinition[] => {
  return testDefinitions.filter(t => t.formType === formType);
};

export const getAllTestIds = (): string[] => {
  return testDefinitions.map(t => t.id);
};

export default testDefinitions;
