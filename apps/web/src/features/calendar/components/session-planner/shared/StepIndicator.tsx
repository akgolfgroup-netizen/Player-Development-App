/**
 * StepIndicator Component
 *
 * Visual progress indicator for the session planner wizard.
 * Shows current step, completed steps, and remaining steps.
 *
 * Uses semantic tokens only (no raw hex values).
 */

import React from 'react';
import { Check } from 'lucide-react';
import type { WizardStep } from '../hooks';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: WizardStep;
  currentStepIndex: number;
  isStepComplete: (step: WizardStep) => boolean;
  onStepClick?: (step: WizardStep) => void;
}

const STEP_LABELS: Record<WizardStep, string> = {
  pyramid: 'Nivå',
  area: 'Område',
  lphase: 'Fase',
  context: 'Kontekst',
  focus: 'Fokus',
  summary: 'Oppsummering',
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  currentStepIndex,
  isStepComplete,
  onStepClick,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = index < currentStepIndex || (index === currentStepIndex && isStepComplete(step));
        const isPast = index < currentStepIndex;
        const isClickable = isPast && onStepClick;

        return (
          <React.Fragment key={step}>
            {/* Step circle */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                transition-all duration-200
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
              style={{
                backgroundColor: isActive
                  ? 'var(--ak-primary)'
                  : isCompleted
                  ? 'var(--ak-success)'
                  : 'var(--calendar-surface-elevated)',
                color: isActive || isCompleted
                  ? 'var(--text-inverse)'
                  : 'var(--calendar-text-tertiary)',
                border: isActive
                  ? 'none'
                  : `2px solid ${isCompleted ? 'var(--ak-success)' : 'var(--calendar-border)'}`,
              }}
              title={STEP_LABELS[step]}
            >
              {isCompleted && !isActive ? (
                <Check size={16} />
              ) : (
                index + 1
              )}
            </button>

            {/* Connector line (not after last step) */}
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 max-w-8"
                style={{
                  backgroundColor: index < currentStepIndex
                    ? 'var(--ak-success)'
                    : 'var(--calendar-border)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * Compact step indicator for mobile
 */
export const StepIndicatorCompact: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  currentStepIndex,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isPast = index < currentStepIndex;

        return (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              isActive ? 'w-6' : 'w-1.5'
            }`}
            style={{
              backgroundColor: isActive
                ? 'var(--ak-primary)'
                : isPast
                ? 'var(--ak-success)'
                : 'var(--calendar-border)',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Step indicator with labels
 */
export const StepIndicatorWithLabels: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  currentStepIndex,
  isStepComplete,
  onStepClick,
}) => {
  return (
    <div className="px-4 py-3">
      {/* Progress bar */}
      <div className="relative mb-2">
        {/* Background track */}
        <div
          className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
          style={{ backgroundColor: 'var(--calendar-border)' }}
        />

        {/* Progress fill */}
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-300"
          style={{
            backgroundColor: 'var(--ak-primary)',
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step dots */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = index < currentStepIndex;
            const isPast = index < currentStepIndex;
            const isClickable = isPast && onStepClick;

            return (
              <button
                key={step}
                type="button"
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                  transition-all duration-200
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                `}
                style={{
                  backgroundColor: isActive || isCompleted
                    ? 'var(--ak-primary)'
                    : 'var(--background-white)',
                  color: isActive || isCompleted
                    ? 'var(--text-inverse)'
                    : 'var(--calendar-text-tertiary)',
                  border: `2px solid ${
                    isActive || isCompleted
                      ? 'var(--ak-primary)'
                      : 'var(--calendar-border)'
                  }`,
                }}
              >
                {isCompleted ? <Check size={12} /> : index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = step === currentStep;

          return (
            <span
              key={step}
              className="text-xs text-center"
              style={{
                color: isActive
                  ? 'var(--ak-primary)'
                  : 'var(--calendar-text-tertiary)',
                fontWeight: isActive ? 600 : 400,
                width: `${100 / steps.length}%`,
              }}
            >
              {STEP_LABELS[step]}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
