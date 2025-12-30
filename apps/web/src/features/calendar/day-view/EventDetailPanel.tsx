/**
 * Event Detail Panel Component
 *
 * Desktop: Side panel (slides in from right)
 * Mobile: Bottom sheet (slides up)
 *
 * Actions available:
 * - Start
 * - Utsett / Flytt (Reschedule)
 * - Kort ned (Shorten: 45 → 30 → 15)
 * - Marker fullført (Complete)
 * - Se øktinnhold (View content - read only)
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Clock,
  ChevronDown,
  Check,
  MapPin,
  Calendar,
  Eye,
  Timer,
  Target,
} from 'lucide-react';
import { EventDetailPanelProps, RescheduleOption, ShortenOption } from './types';

// Semantic styles (NO raw hex values)
const styles = {
  // Overlay
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--overlay-backdrop)',
    zIndex: 100,
    opacity: 0,
    pointerEvents: 'none' as const,
    transition: 'opacity 0.2s ease',
  },
  overlayOpen: {
    opacity: 1,
    pointerEvents: 'auto' as const,
  },

  // Desktop side panel
  sidePanel: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '400px',
    maxWidth: '100vw',
    backgroundColor: 'var(--background-white)',
    boxShadow: 'var(--shadow-float)',
    zIndex: 101,
    transform: 'translateX(100%)',
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sidePanelOpen: {
    transform: 'translateX(0)',
  },

  // Mobile bottom sheet
  bottomSheet: {
    position: 'fixed' as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 101,
    maxHeight: '85vh',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    display: 'flex',
    flexDirection: 'column' as const,
    paddingBottom: 'var(--safe-area-inset-bottom)',
  },
  bottomSheetOpen: {
    transform: 'translateY(0)',
  },
  bottomSheetHandle: {
    width: '36px',
    height: '4px',
    backgroundColor: 'var(--border-default)',
    borderRadius: 'var(--radius-full)',
    margin: '8px auto 0',
    flexShrink: 0,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
    flexShrink: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    transition: 'background-color 0.15s ease',
  },
  title: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    flex: 1,
    marginLeft: 'var(--spacing-3)',
  },

  // Content
  content: {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--spacing-4)',
  },
  section: {
    marginBottom: 'var(--spacing-6)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: 'var(--spacing-3)',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3) 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  infoIcon: {
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  infoValue: {
    fontSize: 'var(--font-size-subheadline)',
    color: 'var(--text-primary)',
    fontWeight: 500,
  },

  // Actions
  actionsContainer: {
    padding: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-surface)',
    flexShrink: 0,
  },
  primaryAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    width: '100%',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    marginBottom: 'var(--spacing-3)',
  },
  secondaryActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap' as const,
  },
  secondaryAction: {
    flex: 1,
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // Duration selector
  durationSelector: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    marginTop: 'var(--spacing-2)',
  },
  durationOption: {
    flex: 1,
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.15s ease',
  },
  durationOptionActive: {
    backgroundColor: 'var(--accent-muted)',
    borderColor: 'var(--border-brand)',
    color: 'var(--text-brand)',
  },

  // Reschedule options
  rescheduleOptions: {
    marginTop: 'var(--spacing-2)',
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  rescheduleOption: {
    display: 'block',
    width: '100%',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-subtle)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'background-color 0.1s ease',
  },

  // Badge
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
  },
  badgeRecommended: {
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--text-brand)',
  },
  badgeInProgress: {
    backgroundColor: 'var(--success-muted)',
    color: 'var(--success)',
  },
  badgeCompleted: {
    backgroundColor: 'var(--success-muted)',
    color: 'var(--success)',
  },
};

// Hook to detect mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Format duration
const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs} time ${mins} min` : `${hrs} time`;
  }
  return `${minutes} min`;
};

// Translate category
const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    teknikk: 'Teknikk',
    golfslag: 'Golfslag',
    spill: 'Spill',
    konkurranse: 'Konkurranse',
    fysisk: 'Fysisk',
    mental: 'Mental',
  };
  return translations[category] || category;
};

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  event,
  isOpen,
  onClose,
  onStart,
  onReschedule,
  onShorten,
  onComplete,
}) => {
  const isMobile = useIsMobile();
  const [showReschedule, setShowReschedule] = useState(false);
  const [showShorten, setShowShorten] = useState(false);

  // Close dropdowns when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowReschedule(false);
      setShowShorten(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!event) return null;

  const isAKWorkout = event.type === 'ak_workout' && event.workout;
  const workout = event.workout;
  const external = event.external;

  const rescheduleOptions: { label: string; option: RescheduleOption }[] = [
    { label: 'Om 15 minutter', option: { type: 'delay', minutes: 15 } },
    { label: 'Om 30 minutter', option: { type: 'delay', minutes: 30 } },
    { label: 'Om 60 minutter', option: { type: 'delay', minutes: 60 } },
  ];

  const shortenOptions: ShortenOption[] = [45, 30, 15];

  const panelStyle = isMobile
    ? { ...styles.bottomSheet, ...(isOpen ? styles.bottomSheetOpen : {}) }
    : { ...styles.sidePanel, ...(isOpen ? styles.sidePanelOpen : {}) };

  const renderWorkoutContent = () => {
    if (!workout) return null;

    return (
      <>
        {/* Header with badge */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          {workout.status === 'in_progress' && (
            <span style={{ ...styles.badge, ...styles.badgeInProgress }}>
              <Play size={12} />
              Pågår
            </span>
          )}
          {workout.status === 'completed' && (
            <span style={{ ...styles.badge, ...styles.badgeCompleted }}>
              <Check size={12} />
              Fullført
            </span>
          )}
          {workout.isRecommended && workout.status === 'scheduled' && (
            <span style={{ ...styles.badge, ...styles.badgeRecommended }}>
              Anbefalt
            </span>
          )}
        </div>

        {/* Info section */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Detaljer</div>

          <div style={styles.infoRow}>
            <Timer size={18} style={styles.infoIcon} />
            <div style={styles.infoContent}>
              <div style={styles.infoLabel}>Varighet</div>
              <div style={styles.infoValue}>{formatDuration(workout.duration)}</div>
            </div>
          </div>

          {workout.scheduledTime && (
            <div style={styles.infoRow}>
              <Clock size={18} style={styles.infoIcon} />
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Tidspunkt</div>
                <div style={styles.infoValue}>{workout.scheduledTime}</div>
              </div>
            </div>
          )}

          <div style={styles.infoRow}>
            <Target size={18} style={styles.infoIcon} />
            <div style={styles.infoContent}>
              <div style={styles.infoLabel}>Kategori</div>
              <div style={styles.infoValue}>{translateCategory(workout.category)}</div>
            </div>
          </div>

          {workout.location && (
            <div style={styles.infoRow}>
              <MapPin size={18} style={styles.infoIcon} />
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Sted</div>
                <div style={styles.infoValue}>{workout.location}</div>
              </div>
            </div>
          )}
        </div>

        {/* Description if available */}
        {workout.description && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Beskrivelse</div>
            <p style={{ fontSize: 'var(--font-size-subheadline)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {workout.description}
            </p>
          </div>
        )}
      </>
    );
  };

  const renderExternalContent = () => {
    if (!external) return null;

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Detaljer</div>

        <div style={styles.infoRow}>
          <Clock size={18} style={styles.infoIcon} />
          <div style={styles.infoContent}>
            <div style={styles.infoLabel}>Tid</div>
            <div style={styles.infoValue}>
              {external.startTime} - {external.endTime}
            </div>
          </div>
        </div>

        {external.source && (
          <div style={styles.infoRow}>
            <Calendar size={18} style={styles.infoIcon} />
            <div style={styles.infoContent}>
              <div style={styles.infoLabel}>Kilde</div>
              <div style={styles.infoValue}>{external.source}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (!isAKWorkout || !workout) return null;

    // In progress: Show complete button
    if (workout.status === 'in_progress') {
      return (
        <div style={styles.actionsContainer}>
          <button
            style={styles.primaryAction}
            onClick={onComplete}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            aria-label={`Marker ${workout.name} som fullført`}
          >
            <Check size={18} aria-hidden="true" />
            Marker som fullført
          </button>
        </div>
      );
    }

    // Completed: Show view content only
    if (workout.status === 'completed') {
      return (
        <div style={styles.actionsContainer}>
          <button
            style={styles.secondaryAction}
            onClick={() => {
              // TODO: Open workout content view
              console.log('View workout content');
            }}
            aria-label="Se innhold i økten"
          >
            <Eye size={16} aria-hidden="true" />
            Se øktinnhold
          </button>
        </div>
      );
    }

    // Scheduled: Full action set
    return (
      <div style={styles.actionsContainer}>
        <button
          style={styles.primaryAction}
          onClick={onStart}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
          aria-label={`Start ${workout.name}`}
        >
          <Play size={18} aria-hidden="true" />
          Start økt
        </button>

        <div style={styles.secondaryActions}>
          <button
            style={styles.secondaryAction}
            onClick={() => setShowReschedule(!showReschedule)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-brand)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            aria-expanded={showReschedule}
            aria-haspopup="menu"
            aria-label="Utsett trening"
          >
            <Clock size={16} aria-hidden="true" />
            Utsett
            <ChevronDown size={14} style={{ transform: showReschedule ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} aria-hidden="true" />
          </button>

          <button
            style={styles.secondaryAction}
            onClick={() => setShowShorten(!showShorten)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-brand)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            aria-expanded={showShorten}
            aria-haspopup="menu"
            aria-label="Kort ned varighet"
          >
            <Timer size={16} aria-hidden="true" />
            Kort ned
            <ChevronDown size={14} style={{ transform: showShorten ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} aria-hidden="true" />
          </button>
        </div>

        {/* Reschedule options */}
        {showReschedule && (
          <div style={styles.rescheduleOptions} role="menu" aria-label="Utsett trening">
            {rescheduleOptions.map(({ label, option }) => (
              <button
                key={label}
                style={styles.rescheduleOption}
                onClick={() => {
                  onReschedule(option);
                  setShowReschedule(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                role="menuitem"
              >
                {label}
              </button>
            ))}
            <button
              style={{ ...styles.rescheduleOption, borderBottom: 'none' }}
              onClick={() => {
                // TODO: Open time picker
                setShowReschedule(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              role="menuitem"
            >
              Velg tidspunkt...
            </button>
          </div>
        )}

        {/* Shorten options */}
        {showShorten && (
          <div style={styles.durationSelector} role="radiogroup" aria-label="Velg varighet">
            {shortenOptions.map((duration) => (
              <button
                key={duration}
                style={{
                  ...styles.durationOption,
                  ...(workout.duration === duration ? styles.durationOptionActive : {}),
                }}
                onClick={() => {
                  onShorten(duration);
                  setShowShorten(false);
                }}
                onMouseEnter={(e) => {
                  if (workout.duration !== duration) {
                    e.currentTarget.style.borderColor = 'var(--border-brand)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (workout.duration !== duration) {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }
                }}
                role="radio"
                aria-checked={workout.duration === duration}
                aria-label={`${duration} minutter`}
              >
                {duration} min
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const panelTitle = isAKWorkout ? workout?.name : external?.title;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          ...styles.overlay,
          ...(isOpen ? styles.overlayOpen : {}),
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
        aria-describedby="event-detail-content"
      >
        {/* Bottom sheet handle (mobile only) */}
        {isMobile && <div style={styles.bottomSheetHandle} aria-hidden="true" />}

        {/* Header */}
        <div style={styles.header}>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Lukk panel"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div style={styles.title} id="event-detail-title">
            {panelTitle}
          </div>
        </div>

        {/* Content */}
        <div style={styles.content} id="event-detail-content">
          {isAKWorkout ? renderWorkoutContent() : renderExternalContent()}
        </div>

        {/* Actions */}
        {renderActions()}
      </div>
    </>
  );
};

export default EventDetailPanel;
