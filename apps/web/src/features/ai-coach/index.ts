/**
 * AI Coach Feature Module
 *
 * Provides AI-powered coaching assistance with:
 * - Global floating chat button (AICoachButton)
 * - Chat panel (AICoachPanel)
 * - Contextual guide (AICoachGuide)
 * - Shared state via context (AICoachProvider)
 */

// Context & Provider
export { AICoachProvider, useAICoach } from './context/AICoachContext';

// Components
export { AICoachButton } from './components/AICoachButton';
export { AICoachPanel } from './components/AICoachPanel';
export { AICoachGuide } from './components/AICoachGuide';

// Types
export type {
  AICoachState,
  AICoachContextValue,
  ChatMessage,
  GuideConfig,
} from './types';
