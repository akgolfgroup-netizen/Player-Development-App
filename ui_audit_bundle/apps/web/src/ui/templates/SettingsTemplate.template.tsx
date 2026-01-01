import React from 'react';
import { AppShell, PageHeader, CardSimple } from '../raw-blocks';
import { Button, Text } from '../primitives';
import { Tabs, Modal, useToast } from '../composites';

/**
 * SettingsTemplate
 * Settings page template with tabbed sections
 */

interface SettingsTab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
}

interface SettingsTemplateProps {
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
  /** Settings tabs */
  tabs: SettingsTab[];
  /** Show save button */
  showSave?: boolean;
  /** Save handler */
  onSave?: () => void | Promise<void>;
  /** Show cancel button */
  showCancel?: boolean;
  /** Cancel handler */
  onCancel?: () => void;
  /** Show reset button */
  showReset?: boolean;
  /** Reset handler */
  onReset?: () => void;
  /** Unsaved changes */
  hasUnsavedChanges?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Sticky footer */
  stickyFooter?: boolean;
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  title = 'Settings',
  subtitle = 'Manage your preferences and configuration',
  tabs,
  showSave = true,
  onSave,
  showCancel = true,
  onCancel,
  showReset = false,
  onReset,
  hasUnsavedChanges = false,
  loading = false,
  stickyFooter = true,
}) => {
  const [saving, setSaving] = React.useState(false);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);

  const handleSave = async () => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setResetModalOpen(false);
    onReset?.();
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }
    onCancel?.();
  };

  return (
    <AppShell
      header={
        <PageHeader
          title={title}
          subtitle={subtitle}
        />
      }
    >
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Tabs */}
          <Tabs
            tabs={tabs}
            variant="pills"
            orientation="vertical"
            defaultActiveTab={tabs[0]?.id}
          />
        </div>

        {/* Footer Actions */}
        {(showSave || showCancel || showReset) && (
          <div
            style={{
              ...styles.footer,
              ...(stickyFooter && styles.footerSticky),
            }}
          >
            <div style={styles.footerContent}>
              {hasUnsavedChanges && (
                <Text variant="footnote" color="warning">
                  You have unsaved changes
                </Text>
              )}

              <div style={styles.footerActions}>
                {showReset && onReset && (
                  <Button
                    variant="ghost"
                    onClick={() => setResetModalOpen(true)}
                    disabled={loading || saving}
                  >
                    Reset to Defaults
                  </Button>
                )}

                <div style={styles.primaryActions}>
                  {showCancel && onCancel && (
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading || saving}
                    >
                      Cancel
                    </Button>
                  )}

                  {showSave && onSave && (
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      loading={saving}
                      disabled={loading || !hasUnsavedChanges}
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset to Defaults"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReset}
            >
              Reset
            </Button>
          </>
        }
      >
        <Text>
          Are you sure you want to reset all settings to their default values?
          This action cannot be undone.
        </Text>
      </Modal>
    </AppShell>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
    width: '100%',
    paddingBottom: '100px', // Space for sticky footer
  },
  content: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    boxShadow: 'var(--shadow-card)',
  },
  footer: {
    backgroundColor: 'var(--background-white)',
    borderTop: '1px solid var(--border-subtle)',
    padding: 'var(--spacing-4) 0',
    marginTop: 'auto',
  },
  footerSticky: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    boxShadow: 'var(--shadow-sm)',
  },
  footerContent: {
    width: '100%',
    padding: '0 var(--spacing-4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  primaryActions: {
    display: 'flex',
    gap: 'var(--spacing-3)',
  },
};

// Responsive styles
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    styles.footerActions = {
      ...styles.footerActions,
      flexDirection: 'column',
      alignItems: 'stretch',
    };
    styles.primaryActions = {
      ...styles.primaryActions,
      flexDirection: 'column',
      width: '100%',
    };
  }
}

export default SettingsTemplate;
