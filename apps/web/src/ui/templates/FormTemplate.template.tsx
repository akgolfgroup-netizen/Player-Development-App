import React from 'react';
import { AppShell, PageHeader, CardSimple, CardHeader } from '../raw-blocks';
import { Button, Text, Divider } from '../primitives';
import { Modal } from '../composites';

/**
 * FormTemplate
 * Form page template with validation and multi-step support
 */

interface FormSection {
  id: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
}

interface FormTemplateProps {
  /** Page title */
  title: string;
  /** Page subtitle */
  subtitle?: string;
  /** Form sections */
  sections: FormSection[];
  /** Submit button label */
  submitLabel?: string;
  /** Submit handler */
  onSubmit: () => void | Promise<void>;
  /** Cancel button label */
  cancelLabel?: string;
  /** Cancel handler */
  onCancel?: () => void;
  /** Show cancel button */
  showCancel?: boolean;
  /** Form is valid */
  isValid?: boolean;
  /** Form is dirty (has changes) */
  isDirty?: boolean;
  /** Loading/submitting state */
  loading?: boolean;
  /** Show progress */
  showProgress?: boolean;
  /** Current step (for multi-step forms) */
  currentStep?: number;
  /** Total steps */
  totalSteps?: number;
  /** Step navigation */
  onStepChange?: (step: number) => void;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Success message */
  successMessage?: string;
}

const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  subtitle,
  sections,
  submitLabel = 'Submit',
  onSubmit,
  cancelLabel = 'Cancel',
  onCancel,
  showCancel = true,
  isValid = true,
  isDirty = false,
  loading = false,
  showProgress = false,
  currentStep,
  totalSteps,
  onStepChange,
  errors,
  successMessage,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);

  const isMultiStep = currentStep !== undefined && totalSteps !== undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setCancelModalOpen(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    setCancelModalOpen(false);
    onCancel?.();
  };

  const handleNextStep = () => {
    if (currentStep !== undefined && totalSteps !== undefined && currentStep < totalSteps) {
      onStepChange?.(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep !== undefined && currentStep > 1) {
      onStepChange?.(currentStep - 1);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <AppShell
      header={
        <PageHeader
          title={title}
          subtitle={subtitle}
          onBack={onCancel}
        />
      }
    >
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Progress Bar */}
          {isMultiStep && showProgress && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${((currentStep || 0) / (totalSteps || 1)) * 100}%`,
                  }}
                />
              </div>
              <Text variant="caption1" color="secondary">
                Step {currentStep} of {totalSteps}
              </Text>
            </div>
          )}

          {/* Form Sections */}
          {sections.map((section, index) => {
            // For multi-step forms, only show current step
            if (isMultiStep && currentStep !== index + 1) {
              return null;
            }

            return (
              <CardSimple key={section.id} padding="lg">
                {(section.title || section.description) && (
                  <>
                    <CardHeader
                      title={section.title || ''}
                      subtitle={section.description}
                      size="md"
                    />
                    <Divider spacing={16} />
                  </>
                )}

                <div style={styles.sectionContent}>
                  {section.content}
                </div>
              </CardSimple>
            );
          })}

          {/* Error Summary */}
          {errors && Object.keys(errors).length > 0 && (
            <CardSimple
              padding="md"
              style={{
                backgroundColor: 'rgba(196, 91, 78, 0.05)',
                borderLeft: '4px solid var(--ak-error)',
              }}
            >
              <Text variant="footnote" weight={600} color="error">
                Please fix the following errors:
              </Text>
              <ul style={styles.errorList}>
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>
                    <Text variant="caption1" color="error">
                      {message}
                    </Text>
                  </li>
                ))}
              </ul>
            </CardSimple>
          )}

          {/* Success Message */}
          {successMessage && (
            <CardSimple
              padding="md"
              style={{
                backgroundColor: 'rgba(74, 124, 89, 0.05)',
                borderLeft: '4px solid var(--ak-success)',
              }}
            >
              <Text variant="body" color="success">
                {successMessage}
              </Text>
            </CardSimple>
          )}

          {/* Form Actions */}
          <div style={styles.actions}>
            <div style={styles.leftActions}>
              {showCancel && onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  {cancelLabel}
                </Button>
              )}
            </div>

            <div style={styles.rightActions}>
              {isMultiStep && !isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={submitting}
                >
                  Previous
                </Button>
              )}

              {isMultiStep && !isLastStep ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={!isValid || submitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  disabled={!isValid || submitting}
                >
                  {submitLabel}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Discard Changes?"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setCancelModalOpen(false)}
            >
              Continue Editing
            </Button>
            <Button variant="danger" onClick={confirmCancel}>
              Discard
            </Button>
          </>
        }
      >
        <Text>
          You have unsaved changes. Are you sure you want to discard them?
        </Text>
      </Modal>
    </AppShell>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-5)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--gray-100)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--ak-primary)',
    transition: 'width 0.3s ease',
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  errorList: {
    margin: 'var(--spacing-2) 0 0 var(--spacing-5)',
    padding: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    paddingTop: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
  },
  leftActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
  },
  rightActions: {
    display: 'flex',
    gap: 'var(--spacing-3)',
  },
};

// Responsive styles
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    styles.actions = {
      ...styles.actions,
      flexDirection: 'column-reverse',
      alignItems: 'stretch',
    };
    styles.leftActions = {
      ...styles.leftActions,
      width: '100%',
    };
    styles.rightActions = {
      ...styles.rightActions,
      width: '100%',
      flexDirection: 'column',
    };
  }
}

export default FormTemplate;
