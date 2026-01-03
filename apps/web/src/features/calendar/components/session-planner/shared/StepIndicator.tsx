/**
 * StepIndicator Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles
 *
 * Visual progress indicator for the session planner wizard.
 * Shows current step, completed steps, and remaining steps.
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
                transition-all duration-200 border-2
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                ${isActive
                  ? 'bg-ak-brand-primary text-white border-ak-brand-primary'
                  : isCompleted
                  ? 'bg-ak-status-success text-white border-ak-status-success'
                  : 'bg-ak-surface-subtle text-ak-text-tertiary border-ak-border-default'
                }
              `}
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
                className={`flex-1 h-0.5 max-w-8 ${
                  index < currentStepIndex ? 'bg-ak-status-success' : 'bg-ak-border-default'
                }`}
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
            } ${
              isActive
                ? 'bg-ak-brand-primary'
                : isPast
                ? 'bg-ak-status-success'
                : 'bg-ak-border-default'
            }`}
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
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-ak-border-default" />

        {/* Progress fill - needs inline style for dynamic width */}
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-300 bg-ak-brand-primary"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
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
                  transition-all duration-200 border-2
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  ${isActive || isCompleted
                    ? 'bg-ak-brand-primary text-white border-ak-brand-primary'
                    : 'bg-white text-ak-text-tertiary border-ak-border-default'
                  }
                `}
              >
                {isCompleted ? <Check size={12} /> : index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Labels - need inline style for dynamic width */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = step === currentStep;

          return (
            <span
              key={step}
              className={`text-xs text-center ${
                isActive ? 'text-ak-brand-primary font-semibold' : 'text-ak-text-tertiary'
              }`}
              style={{ width: `${100 / steps.length}%` }}
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
