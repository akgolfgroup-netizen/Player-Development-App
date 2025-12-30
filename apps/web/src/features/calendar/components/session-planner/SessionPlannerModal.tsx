/**
 * SessionPlannerModal Component
 *
 * Main container for the AK-formula session planner wizard.
 * Manages step navigation and renders appropriate step components.
 *
 * Uses semantic tokens only (no raw hex values).
 */

import React, { useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSessionPlanner, type WizardStep } from './hooks';
import { StepIndicatorWithLabels } from './shared';
import {
  PyramidStep,
  AreaStep,
  LPhaseStep,
  ContextStep,
  FocusStep,
  SummaryStep,
} from './steps';

export interface NewPlannedSession {
  formula: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  duration: number;
}

interface SessionPlannerModalProps {
  isOpen: boolean;
  initialDate?: Date;
  initialTime?: string;
  onClose: () => void;
  onSubmit: (session: NewPlannedSession) => void;
}

export const SessionPlannerModal: React.FC<SessionPlannerModalProps> = ({
  isOpen,
  initialDate,
  initialTime,
  onClose,
  onSubmit,
}) => {
  const planner = useSessionPlanner(initialDate);

  // Set initial time if provided
  React.useEffect(() => {
    if (initialTime) {
      planner.setStartTime(initialTime);
    }
  }, [initialTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!planner.parsedFormula) return;

    onSubmit({
      formula: planner.parsedFormula.formula,
      title: planner.parsedFormula.title,
      description: planner.parsedFormula.description,
      date: planner.formState.date,
      startTime: planner.formState.startTime,
      duration: planner.formState.duration,
    });

    planner.reset();
    onClose();
  }, [planner, onSubmit, onClose]);

  // Handle close with reset
  const handleClose = useCallback(() => {
    planner.reset();
    onClose();
  }, [planner, onClose]);

  // Render step content
  const renderStep = (step: WizardStep) => {
    switch (step) {
      case 'pyramid':
        return <PyramidStep planner={planner} />;
      case 'area':
        return <AreaStep planner={planner} />;
      case 'lphase':
        return <LPhaseStep planner={planner} />;
      case 'context':
        return <ContextStep planner={planner} />;
      case 'focus':
        return <FocusStep planner={planner} />;
      case 'summary':
        return <SummaryStep planner={planner} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const isSummaryStep = planner.currentStep === 'summary';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'var(--overlay-backdrop)' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg max-h-[90vh] rounded-xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: 'var(--calendar-surface-card)',
            boxShadow: 'var(--shadow-float)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b shrink-0"
            style={{ borderColor: 'var(--calendar-border)' }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--calendar-text-primary)' }}
            >
              Planlegg økt
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg transition-colors"
              style={{ color: 'var(--calendar-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--calendar-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Step indicator */}
          <div
            className="shrink-0 border-b"
            style={{ borderColor: 'var(--calendar-border)' }}
          >
            <StepIndicatorWithLabels
              steps={planner.steps}
              currentStep={planner.currentStep}
              currentStepIndex={planner.currentStepIndex}
              isStepComplete={planner.isStepComplete}
              onStepClick={planner.goToStep}
            />
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderStep(planner.currentStep)}
          </div>

          {/* Navigation footer */}
          <div
            className="flex items-center justify-between p-4 border-t shrink-0"
            style={{ borderColor: 'var(--calendar-border)' }}
          >
            {/* Back button */}
            <button
              type="button"
              onClick={planner.goBack}
              disabled={!planner.canGoBack}
              className="flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-40"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--calendar-text-secondary)',
              }}
            >
              <ChevronLeft size={16} />
              Tilbake
            </button>

            {/* Next/Submit button */}
            {isSummaryStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!planner.parsedFormula?.isValid}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-40"
                style={{
                  backgroundColor: 'var(--ak-primary)',
                  color: 'var(--text-inverse)',
                }}
              >
                Opprett økt
              </button>
            ) : (
              <button
                type="button"
                onClick={planner.goNext}
                disabled={!planner.canGoNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-40"
                style={{
                  backgroundColor: 'var(--ak-primary)',
                  color: 'var(--text-inverse)',
                }}
              >
                Neste
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionPlannerModal;
