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
  X
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';

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
 */

// Onboarding steps configuration - defined outside component
const ONBOARDING_STEPS = [
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

// Styles
const styles = {
  container: {
    backgroundColor: 'var(--card)',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--accent-muted)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--ak-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-inverse)',
  },
  headerText: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--ak-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '2px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    padding: 0,
  },
  dismissBtn: {
    background: 'transparent',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    borderRadius: '8px',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
  },
  progressBar: {
    padding: '12px 24px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-surface)',
  },
  progressTrack: {
    height: '8px',
    backgroundColor: 'var(--gray-200)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--ak-success)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  stepsList: {
    padding: '8px 0',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    minHeight: '72px',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  stepItemCompleted: {
    opacity: 0.7,
  },
  stepCheckbox: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  stepCheckboxIncomplete: {
    border: '2px solid var(--border-default)',
    backgroundColor: 'transparent',
    color: 'var(--text-tertiary)',
  },
  stepCheckboxComplete: {
    border: 'none',
    backgroundColor: 'var(--ak-success)',
    color: 'var(--text-inverse)',
  },
  stepIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepIconIncomplete: {
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--ak-primary)',
  },
  stepIconComplete: {
    backgroundColor: 'var(--success-muted)',
    color: 'var(--ak-success)',
  },
  stepContent: {
    flex: 1,
    minWidth: 0,
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  stepTitleCompleted: {
    textDecoration: 'line-through',
    color: 'var(--text-tertiary)',
  },
  stepDescription: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  stepOptionalBadge: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    backgroundColor: 'var(--background-surface)',
    padding: '2px 8px',
    borderRadius: '4px',
    marginLeft: '8px',
  },
  stepArrow: {
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-surface)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipLink: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 12px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  },
};

/**
 * Individual step item component
 */
const StepItem = memo(({ step, isCompleted, onNavigate }) => {
  const Icon = step.icon;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(step.route);
    }
  }, [onNavigate, step.route]);

  return (
    <button
      style={{
        ...styles.stepItem,
        ...(isCompleted ? styles.stepItemCompleted : {}),
      }}
      onClick={() => onNavigate(step.route)}
      onKeyDown={handleKeyDown}
      aria-label={`${step.title}${isCompleted ? ' (fullført)' : ''}`}
      role="listitem"
    >
      {/* Completion checkbox */}
      <div
        style={{
          ...styles.stepCheckbox,
          ...(isCompleted ? styles.stepCheckboxComplete : styles.stepCheckboxIncomplete),
        }}
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
        style={{
          ...styles.stepIcon,
          ...(isCompleted ? styles.stepIconComplete : styles.stepIconIncomplete),
        }}
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>

      {/* Step content */}
      <div style={styles.stepContent}>
        <div style={{
          ...styles.stepTitle,
          ...(isCompleted ? styles.stepTitleCompleted : {}),
        }}>
          {step.title}
          {step.optional && (
            <span style={styles.stepOptionalBadge}>Valgfritt</span>
          )}
        </div>
        <div style={styles.stepDescription}>
          {step.description}
        </div>
      </div>

      {/* Arrow */}
      {!isCompleted && (
        <ChevronRight size={20} style={styles.stepArrow} aria-hidden="true" />
      )}
    </button>
  );
});

StepItem.displayName = 'StepItem';

/**
 * OnboardingChecklist - Main component
 */
const OnboardingChecklist = memo(({
  completionStatus = {},
  onDismiss,
  showDismissButton = true,
}) => {
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
  const handleNavigate = useCallback((route) => {
    navigate(route);
  }, [navigate]);

  // Keyboard handler for dismiss button
  const handleDismissKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDismiss?.();
    }
  }, [onDismiss]);

  // All required steps completed?
  const allRequiredComplete = progressPercent === 100;

  return (
    <div
      style={styles.container}
      role="region"
      aria-label="Kom i gang med AK Golf"
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon} aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div style={styles.headerText}>
            <div style={styles.welcomeLabel}>Velkommen!</div>
            <SectionTitle style={styles.title}>Kom i gang</SectionTitle>
          </div>
        </div>

        {showDismissButton && (
          <button
            style={styles.dismissBtn}
            onClick={onDismiss}
            onKeyDown={handleDismissKeyDown}
            aria-label="Lukk kom i gang-guiden"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressPercent}%`,
            }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Fremgang: ${progressPercent}%`}
          />
        </div>
        <div style={styles.progressText}>
          {allRequiredComplete
            ? 'Alt klart! Du er klar til å begynne.'
            : `${completedCount} av ${requiredCount} steg fullført`}
        </div>
      </div>

      {/* Steps list */}
      <div style={styles.stepsList} role="list" aria-label="Oppsettssteg">
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
      <div style={styles.footer}>
        <button
          style={styles.skipLink}
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
