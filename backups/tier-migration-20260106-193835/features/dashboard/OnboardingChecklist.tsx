/**
 * OnboardingChecklist - First-time user setup guide
 *
 * Shows a checklist of recommended setup steps for new users.
 * Tracks completion status and allows dismissal.
 *
 * WCAG AA Compliant:
 * - Keyboard navigable
 * - Screen reader friendly
 * - Sufficient color contrast
 * - 44px minimum touch targets
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * (except dynamic progress width which requires runtime value)
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Target,
  Calendar,
  Trophy,
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
  LucideIcon,
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  checkKey: string;
  optional?: boolean;
}

interface StepItemProps {
  step: OnboardingStep;
  isCompleted: boolean;
  onNavigate: (route: string) => void;
}

interface OnboardingChecklistProps {
  completionStatus?: Record<string, boolean>;
  onDismiss?: () => void;
  showDismissButton?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Onboarding steps configuration - defined outside component
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Fullfør profilen din',
    description: 'Legg til bilde og kontaktinformasjon',
    icon: User,
    route: '/profil/rediger',
    checkKey: 'profileComplete',
  },
  {
    id: 'goal',
    title: 'Sett ditt første mål',
    description: 'Definer hva du vil oppnå denne uken',
    icon: Target,
    route: '/maalsetninger/new',
    checkKey: 'hasGoals',
  },
  {
    id: 'session',
    title: 'Planlegg en treningsøkt',
    description: 'Book din første økt med treneren',
    icon: Calendar,
    route: '/sessions/new',
    checkKey: 'hasScheduledSession',
  },
  {
    id: 'tournament',
    title: 'Registrer deg til en turnering',
    description: 'Finn kommende turneringer i din region',
    icon: Trophy,
    route: '/tournaments',
    checkKey: 'hasUpcomingTournament',
    optional: true,
  },
];

// ============================================================================
// STEP ITEM COMPONENT
// ============================================================================

const StepItem = memo(({ step, isCompleted, onNavigate }: StepItemProps) => {
  const Icon = step.icon;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(step.route);
    }
  }, [onNavigate, step.route]);

  return (
    <button
      className={`w-full flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors min-h-[72px] border-none bg-transparent text-left hover:bg-ak-surface-subtle ${
        isCompleted ? 'opacity-70' : ''
      }`}
      onClick={() => onNavigate(step.route)}
      onKeyDown={handleKeyDown}
      aria-label={`${step.title}${isCompleted ? ' (fullført)' : ''}`}
      role="listitem"
    >
      {/* Completion checkbox */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          isCompleted
            ? 'bg-ak-status-success text-white border-none'
            : 'bg-transparent text-ak-text-tertiary border-2 border-ak-border-default'
        }`}
        aria-hidden="true"
      >
        {isCompleted ? (
          <CheckCircle2 size={18} />
        ) : (
          <Circle size={14} />
        )}
      </div>

      {/* Step icon */}
      <div
        className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
          isCompleted
            ? 'bg-ak-status-success/10 text-ak-status-success'
            : 'bg-ak-primary/10 text-ak-primary'
        }`}
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0">
        <div className={`text-[15px] font-semibold text-ak-text-primary mb-0.5 ${isCompleted ? 'line-through text-ak-text-tertiary' : ''}`}>
          {step.title}
          {step.optional && (
            <span className="ml-2 text-[11px] font-medium text-ak-text-tertiary bg-ak-surface-subtle px-2 py-0.5 rounded">
              Valgfritt
            </span>
          )}
        </div>
        <div className="text-[13px] text-ak-text-secondary">
          {step.description}
        </div>
      </div>

      {/* Arrow */}
      {!isCompleted && (
        <ChevronRight size={20} className="text-ak-text-tertiary flex-shrink-0" aria-hidden="true" />
      )}
    </button>
  );
});

StepItem.displayName = 'StepItem';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const OnboardingChecklist = memo(({
  completionStatus = {},
  onDismiss,
  showDismissButton = true,
}: OnboardingChecklistProps) => {
  const navigate = useNavigate();

  // Calculate completion progress
  const { completedCount, requiredCount, progressPercent } = useMemo(() => {
    const requiredSteps = ONBOARDING_STEPS.filter(s => !s.optional);
    const completed = requiredSteps.filter(s => completionStatus[s.checkKey]).length;
    const percent = requiredSteps.length > 0
      ? Math.round((completed / requiredSteps.length) * 100)
      : 0;

    return {
      completedCount: completed,
      requiredCount: requiredSteps.length,
      progressPercent: percent,
    };
  }, [completionStatus]);

  // Memoized navigation handler
  const handleNavigate = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  // Keyboard handler for dismiss button
  const handleDismissKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDismiss?.();
    }
  }, [onDismiss]);

  // All required steps completed?
  const allRequiredComplete = progressPercent === 100;

  return (
    <div
      className="bg-ak-surface-base rounded-2xl border border-ak-border-subtle shadow-sm overflow-hidden"
      role="region"
      aria-label="Kom i gang med AK Golf"
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 pb-4 border-b border-ak-border-subtle bg-ak-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-ak-primary flex items-center justify-center text-white" aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-ak-primary uppercase tracking-wider mb-0.5">
              Velkommen!
            </div>
            <SectionTitle className="text-lg font-bold text-ak-text-primary m-0 p-0">Kom i gang</SectionTitle>
          </div>
        </div>

        {showDismissButton && (
          <button
            className="bg-transparent border-none p-2 cursor-pointer text-ak-text-tertiary rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors hover:bg-ak-surface-subtle"
            onClick={onDismiss}
            onKeyDown={handleDismissKeyDown}
            aria-label="Lukk kom i gang-guiden"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3 border-b border-ak-border-subtle bg-ak-surface-subtle">
        <div className="h-2 bg-gray-200 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-ak-status-success rounded transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Fremgang: ${progressPercent}%`}
          />
        </div>
        <div className="text-[13px] text-ak-text-secondary font-medium">
          {allRequiredComplete
            ? 'Alt klart! Du er klar til å begynne.'
            : `${completedCount} av ${requiredCount} steg fullført`}
        </div>
      </div>

      {/* Steps list */}
      <div className="py-2" role="list" aria-label="Oppsettssteg">
        {ONBOARDING_STEPS.map((step) => (
          <StepItem
            key={step.id}
            step={step}
            isCompleted={!!completionStatus[step.checkKey]}
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-ak-border-subtle bg-ak-surface-subtle flex justify-between items-center">
        <button
          className="text-[13px] text-ak-text-tertiary bg-none border-none cursor-pointer px-3 py-2 min-h-[44px] flex items-center hover:text-ak-text-secondary"
          onClick={onDismiss}
          onKeyDown={handleDismissKeyDown}
          aria-label="Hopp over guiden og gå til dashbordet"
        >
          Hopp over for nå
        </button>

        {allRequiredComplete && (
          <Button
            variant="primary"
            size="sm"
            onClick={onDismiss}
            aria-label="Fullfør oppsett og lukk guiden"
          >
            Ferdig!
          </Button>
        )}
      </div>
    </div>
  );
});

OnboardingChecklist.displayName = 'OnboardingChecklist';

export default OnboardingChecklist;
