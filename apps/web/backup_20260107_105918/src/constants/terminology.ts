/**
 * Terminologi-Ordbok for IUP Golf App
 *
 * Sentralisert fil for alle norske termer og uttrykk.
 * Bruk disse konstantene i stedet for hardkodede strenger.
 *
 * Beslutninger:
 * - "Spiller" (ikke "Utøver") for personer som trener golf
 * - "Oversikt" (ikke "Dashboard") for hovedsiden
 * - Engelske golf-termer beholdes (Putting, Driving, etc.)
 */

// =============================================================================
// PERSONER
// =============================================================================

export const PERSON = {
  player: 'Spiller',
  players: 'Spillere',
  coach: 'Trener',
  coaches: 'Trenere',
  parent: 'Foresatt',
  parents: 'Foresatte',
  admin: 'Administrator',
} as const;

// =============================================================================
// NAVIGASJON
// =============================================================================

export const NAV = {
  dashboard: 'Oversikt',
  training: 'Trening',
  development: 'Utvikling',
  plan: 'Plan',
  more: 'Mer',
  calendar: 'Kalender',
  messages: 'Meldinger',
  statistics: 'Statistikk',
  settings: 'Innstillinger',
  profile: 'Profil',
  library: 'Bibliotek',
  exercises: 'Øvelser',
  tournaments: 'Turneringer',
  notes: 'Notater',
  groups: 'Grupper',
  insights: 'Innsikt',
  alerts: 'Varsler',
} as const;

// =============================================================================
// TRENING
// =============================================================================

export const TRAINING = {
  session: 'Økt',
  sessions: 'Økter',
  exercise: 'Øvelse',
  exercises: 'Øvelser',
  trainingPlan: 'Treningsplan',
  trainingPlans: 'Treningsplaner',
  workout: 'Trening',
  logTraining: 'Logg trening',
  mySessions: 'Mine økter',
  exerciseBank: 'Øvelsesbank',
  weeklyPlan: 'Ukeplan',
  annualPlan: 'Årsplan',
} as const;

// =============================================================================
// GOLF-KATEGORIER (norsk)
// =============================================================================

export const GOLF_CATEGORIES = {
  technique: 'Teknikk',
  shortGame: 'Kort spill',
  longGame: 'Langt spill',
  putting: 'Putting',
  coursePlay: 'Banespill',
  mental: 'Mental',
  physical: 'Fysisk',
  driving: 'Driving',
} as const;

// =============================================================================
// STATUS
// =============================================================================

export const STATUS = {
  completed: 'Fullført',
  inProgress: 'Pågår',
  planned: 'Planlagt',
  pending: 'Venter',
  active: 'Aktiv',
  inactive: 'Inaktiv',
  draft: 'Utkast',
  published: 'Publisert',
  cancelled: 'Avlyst',
  ready: 'Klar',
  limited: 'Begrenset',
  injured: 'Skadet',
  available: 'Tilgjengelig',
  booked: 'Booket',
  blocked: 'Blokkert',
} as const;

// =============================================================================
// PRESTASJONER
// =============================================================================

export const ACHIEVEMENTS = {
  achievements: 'Prestasjoner',
  badges: 'Merker',
  badge: 'Merke',
  milestone: 'Milepæl',
  milestones: 'Milepæler',
  progress: 'Fremgang',
  development: 'Utvikling',
  goals: 'Mål',
  goal: 'Mål',
  objectives: 'Målsetninger',
} as const;

// =============================================================================
// HANDLINGER
// =============================================================================

export const ACTIONS = {
  save: 'Lagre',
  cancel: 'Avbryt',
  edit: 'Rediger',
  delete: 'Slett',
  back: 'Tilbake',
  next: 'Neste',
  previous: 'Forrige',
  retry: 'Prøv igjen',
  confirm: 'Bekreft',
  close: 'Lukk',
  open: 'Åpne',
  view: 'Se',
  viewAll: 'Se alle',
  add: 'Legg til',
  remove: 'Fjern',
  create: 'Opprett',
  update: 'Oppdater',
  send: 'Send',
  search: 'Søk',
  filter: 'Filtrer',
  sort: 'Sorter',
  export: 'Eksporter',
  import: 'Importer',
  download: 'Last ned',
  upload: 'Last opp',
  approve: 'Godkjenn',
  reject: 'Avslå',
  assign: 'Tildel',
} as const;

// =============================================================================
// LOADING & FEILMELDINGER
// =============================================================================

export const LOADING = {
  default: 'Laster...',
  players: 'Laster spillere...',
  calendar: 'Laster kalender...',
  dashboard: 'Laster oversikt...',
  training: 'Laster trening...',
  statistics: 'Laster statistikk...',
  profile: 'Laster profil...',
  exercises: 'Laster øvelser...',
  sessions: 'Laster økter...',
  messages: 'Laster meldinger...',
  notes: 'Laster notater...',
  progress: 'Laster fremgangsdata...',
  archive: 'Laster arkiv...',
  achievements: 'Laster prestasjoner...',
  groups: 'Laster grupper...',
  tests: 'Laster tester...',
} as const;

export const ERRORS = {
  default: 'Noe gikk galt',
  loadFailed: 'Kunne ikke laste data',
  saveFailed: 'Kunne ikke lagre',
  deleteFailed: 'Kunne ikke slette',
  networkError: 'Nettverksfeil',
  unauthorized: 'Ikke autorisert',
  notFound: 'Ikke funnet',
  validationError: 'Ugyldig data',
  serverError: 'Serverfeil',
  tryAgain: 'Prøv igjen',
} as const;

export const EMPTY_STATES = {
  noData: 'Ingen data',
  noPlayers: 'Ingen spillere',
  noSessions: 'Ingen økter',
  noExercises: 'Ingen øvelser',
  noMessages: 'Ingen meldinger',
  noNotes: 'Ingen notater',
  noResults: 'Ingen resultater',
  noTasks: 'Ingen oppgaver',
  noPending: 'Ingen ventende oppgaver',
} as const;

// =============================================================================
// TID OG DATO
// =============================================================================

export const TIME = {
  today: 'I dag',
  yesterday: 'I går',
  tomorrow: 'I morgen',
  thisWeek: 'Denne uken',
  lastWeek: 'Forrige uke',
  nextWeek: 'Neste uke',
  thisMonth: 'Denne måneden',
  hoursAgo: 'timer siden',
  daysAgo: 'dager siden',
  justNow: 'Akkurat nå',
  lastActive: 'Sist aktiv',
} as const;

export const DAYS = {
  monday: 'Mandag',
  tuesday: 'Tirsdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
  saturday: 'Lørdag',
  sunday: 'Søndag',
} as const;

export const DAYS_SHORT = {
  monday: 'Man',
  tuesday: 'Tir',
  wednesday: 'Ons',
  thursday: 'Tor',
  friday: 'Fre',
  saturday: 'Lør',
  sunday: 'Søn',
} as const;

// =============================================================================
// FARGER (for UI-labels)
// =============================================================================

export const COLORS = {
  blue: 'Blå',
  green: 'Grønn',
  gold: 'Gull',
  red: 'Rød',
  lightBlue: 'Lys blå',
  purple: 'Lilla',
  pink: 'Rosa',
  teal: 'Turkis',
  orange: 'Oransje',
  gray: 'Grå',
} as const;

// =============================================================================
// KATEGORIER (spillernivå)
// =============================================================================

export const PLAYER_CATEGORIES = {
  categoryA: 'Kategori A',
  categoryB: 'Kategori B',
  categoryC: 'Kategori C',
  catA: 'Kat. A',
  catB: 'Kat. B',
  catC: 'Kat. C',
} as const;

// =============================================================================
// TRENINGSPERIODER
// =============================================================================

export const PERIODS = {
  G: 'Grunnleggende',
  S: 'Spesifikk',
  T: 'Turnering',
  E: 'Evaluering',
  fundamental: 'Grunnleggende',
  specific: 'Spesifikk',
  tournament: 'Turnering',
  evaluation: 'Evaluering',
} as const;

// =============================================================================
// ENERGI OG STRESS (for status)
// =============================================================================

export const LEVELS = {
  high: 'Høy',
  medium: 'Middels',
  low: 'Lav',
  noInjuries: 'Ingen skader',
} as const;

// =============================================================================
// HILSENER
// =============================================================================

export const GREETINGS = {
  morning: 'God morgen',
  afternoon: 'God dag',
  evening: 'God kveld',
  welcomeBack: 'Velkommen tilbake',
} as const;

// =============================================================================
// SAMLET EKSPORT
// =============================================================================

export const TERMINOLOGY = {
  person: PERSON,
  nav: NAV,
  training: TRAINING,
  golfCategories: GOLF_CATEGORIES,
  status: STATUS,
  achievements: ACHIEVEMENTS,
  actions: ACTIONS,
  loading: LOADING,
  errors: ERRORS,
  emptyStates: EMPTY_STATES,
  time: TIME,
  days: DAYS,
  daysShort: DAYS_SHORT,
  colors: COLORS,
  playerCategories: PLAYER_CATEGORIES,
  periods: PERIODS,
  levels: LEVELS,
  greetings: GREETINGS,
} as const;

export default TERMINOLOGY;
