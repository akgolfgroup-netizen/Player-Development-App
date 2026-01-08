/**
 * AI Coach Types
 *
 * Centralized type definitions for the AI Coach feature.
 */

/**
 * Chat message structure
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Guide configuration for contextual help
 */
export interface GuideConfig {
  id: string;
  title: string;
  description: string;
  suggestions: string[];
  pageContext?: string;
}

/**
 * AI Trigger configuration for proactive suggestions
 * Based on user data state
 */
export interface AITriggerConfig {
  id: string;
  condition: string; // Description of when this trigger fires
  title: string;
  description: string;
  primaryAction: string;
  suggestions: string[];
}

/**
 * AI Trigger presets based on user state
 */
export const AI_TRIGGERS: Record<string, AITriggerConfig> = {
  // Dashboard triggers
  noGoals: {
    id: 'no-goals',
    condition: 'User has no active goals',
    title: 'Sett ditt første mål!',
    description: 'Du har ingen aktive mål ennå. Mål hjelper deg holde fokus og spore fremgang. La meg hjelpe deg sette et realistisk mål!',
    primaryAction: 'Hjelp meg sette et mål',
    suggestions: ['Hva er et godt mål?', 'Vis eksempler på mål'],
  },
  noSessions: {
    id: 'no-sessions',
    condition: 'User has no sessions this week',
    title: 'Planlegg ukens trening',
    description: 'Du har ingen planlagte økter denne uken. Skal jeg hjelpe deg lage en treningsplan?',
    primaryAction: 'Lag ukeplan',
    suggestions: ['Hvor mye bør jeg trene?', 'Foreslå øvelser'],
  },
  fewSessions: {
    id: 'few-sessions',
    condition: 'User has less than 3 sessions this week',
    title: 'Trenger du flere økter?',
    description: 'Du har bare noen få økter planlagt. For god utvikling anbefales minimum 3 økter per uke.',
    primaryAction: 'Legg til flere økter',
    suggestions: ['Hva kan jeg trene på?', 'Vis øvelsesbank'],
  },
  // Goals triggers
  behindSchedule: {
    id: 'behind-schedule',
    condition: 'User is behind on goal progress',
    title: 'Litt etter skjema',
    description: 'Du ligger litt bak planen på noen mål. La meg se på mulige justeringer eller alternative tilnærminger.',
    primaryAction: 'Juster målene mine',
    suggestions: ['Hvorfor ligger jeg bak?', 'Foreslå tiltak'],
  },
  goalNearCompletion: {
    id: 'goal-near-completion',
    condition: 'User is close to completing a goal',
    title: 'Nesten i mål!',
    description: 'Du er nær ved å nå et av målene dine! La meg gi deg noen tips for å fullføre sterkt.',
    primaryAction: 'Gi meg sluttspurt-tips',
    suggestions: ['Hva er neste steg?', 'Sett nytt mål'],
  },
  // Tests triggers
  newTestResult: {
    id: 'new-test-result',
    condition: 'User has a new test result',
    title: 'Ny testresultat',
    description: 'Jeg ser du har fått et nytt testresultat. Vil du at jeg forklarer hva det betyr for treningen din?',
    primaryAction: 'Forklar resultatet',
    suggestions: ['Hva bør jeg forbedre?', 'Sammenlign med forrige test'],
  },
  // Analysis triggers
  negativeTrend: {
    id: 'negative-trend',
    condition: 'User shows declining performance',
    title: 'La oss se på utviklingen',
    description: 'Jeg ser en nedadgående trend i noen områder. Dette kan ha flere årsaker. La meg hjelpe deg analysere.',
    primaryAction: 'Analyser trenden',
    suggestions: ['Hva kan være årsaken?', 'Foreslå justeringer'],
  },
  positiveTrend: {
    id: 'positive-trend',
    condition: 'User shows improving performance',
    title: 'Flott fremgang!',
    description: 'Du viser god fremgang! La meg foreslå hvordan du kan bygge videre på dette momentumet.',
    primaryAction: 'Maksimer fremgangen',
    suggestions: ['Hva fungerer?', 'Neste utfordring'],
  },
};

/**
 * AI Coach state
 */
export interface AICoachState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  isAvailable: boolean;
  unreadCount: number;
  hiddenGuides: string[];
}

/**
 * AI Coach context value
 */
export interface AICoachContextValue extends AICoachState {
  // Panel actions
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  minimizePanel: () => void;
  maximizePanel: () => void;

  // Chat actions
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  markAsRead: () => void;

  // Guide actions
  hideGuide: (guideId: string) => void;
  isGuideHidden: (guideId: string) => boolean;
  resetHiddenGuides: () => void;

  // Navigation from guide
  openPanelWithMessage: (message: string) => void;
}

/**
 * Quick action suggestion
 */
export interface QuickAction {
  label: string;
  message: string;
}

/**
 * Guide presets for different pages
 */
export const GUIDE_PRESETS: Record<string, GuideConfig> = {
  dashboard: {
    id: 'dashboard',
    title: 'Velkommen til dashboardet',
    description: 'Her får du oversikt over din golfutvikling. Jeg kan hjelpe deg med å forstå dataene og sette gode mål.',
    suggestions: [
      'Forklar mine resultater',
      'Hva bør jeg fokusere på?',
      'Sett et nytt mål',
    ],
    pageContext: 'dashboard',
  },
  categoryRequirements: {
    id: 'category-requirements',
    title: 'Kategori-krav',
    description: 'Se hvilke ferdigheter som kreves for å nå neste nivå. Jeg kan forklare kravene og gi deg treningsforslag.',
    suggestions: [
      'Forklar kravene for mitt nivå',
      'Hvilke ferdigheter mangler jeg?',
      'Lag en treningsplan',
    ],
    pageContext: 'category-requirements',
  },
  weeklyPlan: {
    id: 'weekly-plan',
    title: 'Ukeplan',
    description: 'Din personlige treningsplan. Spør meg om øvelser eller hvordan du kan tilpasse planen.',
    suggestions: [
      'Forklar dagens økt',
      'Tilpass planen min',
      'Vis alternativer',
    ],
    pageContext: 'weekly-plan',
  },
  tests: {
    id: 'tests',
    title: 'Tester og resultater',
    description: 'Spor fremgangen din gjennom tester. Jeg kan analysere resultatene og foreslå forbedringer.',
    suggestions: [
      'Analyser mine resultater',
      'Hva betyr denne testen?',
      'Hvordan forbedre meg?',
    ],
    pageContext: 'tests',
  },
  goals: {
    id: 'goals',
    title: 'Mål og progresjon',
    description: 'Sett og følg opp målene dine. La meg hjelpe deg med å lage realistiske og motiverende mål.',
    suggestions: [
      'Sett et nytt mål',
      'Sjekk fremgangen min',
      'Juster målene mine',
    ],
    pageContext: 'goals',
  },
  sessions: {
    id: 'sessions',
    title: 'Treningsøkter',
    description: 'Her ser du oversikten over alle øktene dine. Jeg kan hjelpe deg planlegge neste økt eller analysere treningshistorikken din.',
    suggestions: [
      'Planlegg en ny økt',
      'Analyser treningshistorikken',
      'Hva bør jeg trene på?',
    ],
    pageContext: 'sessions',
  },
  statistics: {
    id: 'statistics',
    title: 'Statistikk og analyse',
    description: 'Her kan du se detaljert statistikk over prestasjonene dine. Jeg kan forklare trendene og hjelpe deg forstå dataene.',
    suggestions: [
      'Forklar mine trender',
      'Sammenlign perioder',
      'Hva bør jeg forbedre?',
    ],
    pageContext: 'statistics',
  },
  calendar: {
    id: 'calendar',
    title: 'Kalender og planlegging',
    description: 'Oversikt over økter, turneringer og andre aktiviteter. La meg hjelpe deg planlegge tiden din effektivt.',
    suggestions: [
      'Optimaliser ukeplanen',
      'Når bør jeg hvile?',
      'Balanse trening/turnering',
    ],
    pageContext: 'calendar',
  },
  tournaments: {
    id: 'tournaments',
    title: 'Turneringer',
    description: 'Se kommende og tidligere turneringer. Jeg kan hjelpe deg forberede deg mentalt og fysisk.',
    suggestions: [
      'Forbered til turnering',
      'Analyser tidligere runder',
      'Tips for turneringsspill',
    ],
    pageContext: 'tournaments',
  },
  videoAnalysis: {
    id: 'video-analysis',
    title: 'Videoanalyse',
    description: 'Analyser teknikken din gjennom video. Jeg kan hjelpe deg forstå hva du ser og foreslå forbedringer.',
    suggestions: [
      'Hva bør jeg se etter?',
      'Sammenlign med ideell teknikk',
      'Øvelser for forbedring',
    ],
    pageContext: 'video-analysis',
  },
};

/**
 * Default quick actions for empty chat
 */
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { label: 'Treningsforslag', message: 'Hva bør jeg fokusere på i treningen min?' },
  { label: 'Teknikk-tips', message: 'Gi meg tips for å forbedre teknikken min' },
  { label: 'Mental styrke', message: 'Hvordan kan jeg bli sterkere mentalt på banen?' },
  { label: 'Mål-setting', message: 'Hjelp meg sette realistiske mål' },
];
