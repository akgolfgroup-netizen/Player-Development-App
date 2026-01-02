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
