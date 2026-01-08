import React from 'react';
import { AppShell, PageHeader, CardSimple, CardHeader } from '../raw-blocks';
import { Button, Text, Badge, Divider, Avatar } from '../primitives';
import { Tabs, Dropdown, Modal } from '../composites';

/**
 * DetailTemplate
 * Detail view template for individual items
 */

interface DetailField {
  id: string;
  label: string;
  value: React.ReactNode;
  type?: 'text' | 'badge' | 'avatar' | 'custom';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
}

interface DetailSection {
  id: string;
  title?: string;
  fields: DetailField[];
}

interface DetailAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  danger?: boolean;
}

interface DetailTab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number | string;
}

interface DetailTemplateProps {
  /** Page title */
  title: string;
  /** Page subtitle */
  subtitle?: string;
  /** Status badge */
  status?: {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'error' | 'primary';
  };
  /** Detail sections */
  sections: DetailSection[];
  /** Content tabs */
  tabs?: DetailTab[];
  /** Primary action */
  primaryAction?: DetailAction;
  /** Additional actions (dropdown) */
  actions?: DetailAction[];
  /** Back handler */
  onBack?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Header image/avatar */
  headerImage?: string;
  /** Show timestamps */
  createdAt?: string;
  updatedAt?: string;
}

const DetailTemplate: React.FC<DetailTemplateProps> = ({
  title,
  subtitle,
  status,
  sections,
  tabs,
  primaryAction,
  actions,
  onBack,
  loading = false,
  headerImage,
  createdAt,
  updatedAt,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderFieldValue = (field: DetailField) => {
    switch (field.type) {
      case 'badge':
        return (
          <Badge variant={field.variant as any} pill>
            {field.value}
          </Badge>
        );

      case 'avatar':
        if (typeof field.value === 'string') {
          return <Avatar src={field.value} name={field.label} size="sm" />;
        }
        return field.value;

      case 'custom':
        return field.value;

      default:
        return (
          <Text variant="body" color="primary">
            {field.value || '—'}
          </Text>
        );
    }
  };

  return (
    <AppShell
      header={
        <PageHeader
          title={title}
          subtitle={subtitle}
          onBack={onBack}
          actions={
            <div style={styles.headerActions}>
              {status && (
                <Badge variant={status.variant} pill>
                  {status.label}
                </Badge>
              )}

              {primaryAction && (
                <Button
                  variant={primaryAction.variant || 'primary'}
                  onClick={primaryAction.onClick}
                  leftIcon={primaryAction.icon}
                >
                  {primaryAction.label}
                </Button>
              )}

              {actions && actions.length > 0 && (
                <Dropdown
                  trigger={
                    <Button variant="outline">
                      More
                    </Button>
                  }
                  items={actions.map((action) => ({
                    id: action.id,
                    label: action.label,
                    icon: action.icon,
                    danger: action.danger,
                    onClick: action.onClick,
                  }))}
                  placement="bottom-right"
                />
              )}
            </div>
          }
        />
      }
    >
      <div style={styles.container}>
        {/* Header Image */}
        {headerImage && (
          <div
            style={{
              ...styles.headerImage,
              backgroundImage: `url(${headerImage})`,
            }}
          />
        )}

        {/* Detail Sections */}
        <div style={styles.sectionsContainer}>
          {sections.map((section) => (
            <CardSimple key={section.id} padding="lg">
              {section.title && (
                <>
                  <CardHeader title={section.title} size="sm" />
                  <Divider spacing={16} />
                </>
              )}

              <div style={styles.fieldsGrid}>
                {section.fields.map((field) => (
                  <div key={field.id} style={styles.field}>
                    <Text variant="caption1" color="secondary" weight={600}>
                      {field.label}
                    </Text>
                    <div style={styles.fieldValue}>
                      {renderFieldValue(field)}
                    </div>
                  </div>
                ))}
              </div>
            </CardSimple>
          ))}

          {/* Timestamps */}
          {(createdAt || updatedAt) && (
            <CardSimple padding="md">
              <div style={styles.timestamps}>
                {createdAt && (
                  <Text variant="caption1" color="tertiary">
                    Opprettet: {formatTimestamp(createdAt)}
                  </Text>
                )}
                {updatedAt && (
                  <Text variant="caption1" color="tertiary">
                    Sist oppdatert: {formatTimestamp(updatedAt)}
                  </Text>
                )}
              </div>
            </CardSimple>
          )}
        </div>

        {/* Content Tabs */}
        {tabs && tabs.length > 0 && (
          <div style={styles.tabsContainer}>
            <Tabs
              tabs={tabs}
              variant="underline"
              defaultActiveTab={tabs[0]?.id}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Bekreft sletting"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
            >
              Avbryt
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                // Handle delete
                setDeleteModalOpen(false);
              }}
            >
              Slett
            </Button>
          </>
        }
      >
        <Text>
          Er du sikker på at du vil slette dette elementet? Denne handlingen kan ikke angres.
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
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  headerImage: {
    width: '100%',
    height: '300px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
  },
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-5)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  fieldValue: {
    minHeight: '24px',
  },
  timestamps: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
    flexWrap: 'wrap',
  },
  tabsContainer: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    boxShadow: 'var(--shadow-card)',
  },
};

// Responsive styles
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  if (mediaQuery.matches) {
    styles.headerActions = {
      ...styles.headerActions,
      flexWrap: 'wrap',
    };
    styles.fieldsGrid = {
      ...styles.fieldsGrid,
      gridTemplateColumns: '1fr',
    };
    styles.timestamps = {
      ...styles.timestamps,
      flexDirection: 'column',
      alignItems: 'flex-start',
    };
  }
}

export default DetailTemplate;
