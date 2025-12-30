/**
 * Decision Anchor Component
 *
 * ALWAYS VISIBLE - This is the anchor to the already-made decision.
 * Must never scroll out of view.
 *
 * Purpose: Reduce decision friction to near zero.
 * One clear priority. One primary action. Secondary info after action.
 */

import React, { useState } from 'react';
import { Play, Check, Clock, Pause, X, ChevronDown, AlertTriangle, Zap } from 'lucide-react';
import { DecisionAnchorProps, RescheduleOption } from './types';

// Semantic style tokens (NO raw hex values)
const styles = {
  container: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    backgroundColor: 'var(--background-white)',
    borderBottom: '1px solid var(--border-default)',
    padding: 'var(--spacing-4)',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  focusLine: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
    marginBottom: 'var(--spacing-1)',
    fontWeight: 500,
  },
  recommendationLine: {
    fontSize: 'var(--font-size-subheadline)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    marginBottom: 'var(--spacing-3)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap' as const,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
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
  badgeCollision: {
    backgroundColor: 'var(--warning-muted)',
    color: 'var(--warning)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flexWrap: 'wrap' as const,
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-5)',
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minHeight: '44px',
  },
  primaryButtonHover: {
    backgroundColor: 'var(--accent-hover)',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minHeight: '36px',
  },
  ghostButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-2)',
    backgroundColor: 'transparent',
    color: 'var(--text-tertiary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-footnote)',
    cursor: 'pointer',
  },
  timerDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--text-primary)',
  },
  rescheduleDropdown: {
    position: 'relative' as const,
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: 'var(--spacing-1)',
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-elevated)',
    overflow: 'hidden',
    minWidth: '160px',
    zIndex: 60,
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left' as const,
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease',
  },
  collisionWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--warning-muted)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 'var(--spacing-3)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
  },
  noRecommendation: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-size-subheadline)',
  },
};

// Format elapsed time as MM:SS or HH:MM:SS
const formatElapsedTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format duration in Norwegian
const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}t ${mins}min` : `${hrs}t`;
  }
  return `${minutes} min`;
};

// Translate category to Norwegian
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

export const DecisionAnchor: React.FC<DecisionAnchorProps> = ({
  data,
  onStartWorkout,
  onReschedule,
  onComplete,
  onPause,
  onCancel,
  onSelectWorkout,
}) => {
  const [showRescheduleOptions, setShowRescheduleOptions] = useState(false);
  const { weeklyFocus, recommendedWorkout, state, collision, elapsedTime } = data;

  const rescheduleOptions: { label: string; option: RescheduleOption }[] = [
    { label: '15 minutter', option: { type: 'delay', minutes: 15 } },
    { label: '30 minutter', option: { type: 'delay', minutes: 30 } },
    { label: '60 minutter', option: { type: 'delay', minutes: 60 } },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!showRescheduleOptions) return;

    const handleClickOutside = () => setShowRescheduleOptions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showRescheduleOptions]);

  // Render based on state
  const renderContent = () => {
    switch (state) {
      case 'S5_IN_PROGRESS':
        return (
          <>
            <div style={styles.focusLine}>Pågår</div>
            <div style={styles.recommendationLine}>
              <span style={{ ...styles.badge, ...styles.badgeInProgress }}>
                <Play size={12} />
                Pågår
              </span>
              <span>{recommendedWorkout?.name}</span>
            </div>
            <div style={styles.actions}>
              <div style={styles.timerDisplay}>
                <Clock size={20} style={{ color: 'var(--text-tertiary)' }} />
                {formatElapsedTime(elapsedTime || 0)}
              </div>
              <button
                style={styles.primaryButton}
                onClick={onComplete}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, styles.primaryButtonHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--accent)')
                }
              >
                <Check size={18} />
                Fullfør
              </button>
              {onPause && (
                <button style={styles.ghostButton} onClick={onPause}>
                  <Pause size={16} />
                  Pause
                </button>
              )}
              {onCancel && (
                <button style={styles.ghostButton} onClick={onCancel}>
                  <X size={16} />
                  Avbryt
                </button>
              )}
            </div>
          </>
        );

      case 'S6_COMPLETED':
        return (
          <>
            <div style={styles.focusLine}>I dag: {weeklyFocus}</div>
            <div style={styles.recommendationLine}>
              <span style={{ ...styles.badge, ...styles.badgeCompleted }}>
                <Check size={12} />
                Fullført
              </span>
              <span>{recommendedWorkout?.name}</span>
            </div>
            <div style={styles.actions}>
              <button style={styles.secondaryButton} onClick={onSelectWorkout}>
                Loggfør notat
              </button>
            </div>
          </>
        );

      case 'S4_COLLISION':
        return (
          <>
            <div style={styles.focusLine}>I dag: {weeklyFocus}</div>
            <div style={styles.collisionWarning}>
              <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
              <span>
                Konflikt med {collision?.conflictingEvent.title}
              </span>
            </div>
            <div style={styles.recommendationLine}>
              <span style={{ ...styles.badge, ...styles.badgeCollision }}>
                <AlertTriangle size={12} />
                Konflikt
              </span>
              <span>
                {recommendedWorkout?.name} · {formatDuration(recommendedWorkout?.duration || 0)} ·{' '}
                {translateCategory(recommendedWorkout?.category || '')}
              </span>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.primaryButton}
                onClick={() => onReschedule({ type: 'delay', minutes: 30 })}
              >
                Flytt 30 min
              </button>
              <button style={styles.secondaryButton} onClick={onStartWorkout}>
                Start likevel
              </button>
            </div>
          </>
        );

      case 'S3_NO_RECOMMENDATION':
        return (
          <>
            <div style={styles.focusLine}>I dag: {weeklyFocus}</div>
            <div style={{ ...styles.recommendationLine, ...styles.noRecommendation }}>
              Ingen anbefalt økt i dag
            </div>
            <div style={styles.actions}>
              <button style={styles.primaryButton} onClick={onStartWorkout}>
                <Zap size={18} />
                Start 15 min terskeløkt
              </button>
              <button style={styles.secondaryButton} onClick={onSelectWorkout}>
                Velg økt
              </button>
            </div>
          </>
        );

      case 'S2_UNSCHEDULED':
        return (
          <>
            <div style={styles.focusLine}>I dag: {weeklyFocus}</div>
            <div style={styles.recommendationLine}>
              <span style={{ ...styles.badge, ...styles.badgeRecommended }}>Anbefalt</span>
              <span>
                {recommendedWorkout?.name} · {formatDuration(recommendedWorkout?.duration || 0)} ·{' '}
                {translateCategory(recommendedWorkout?.category || '')}
              </span>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.primaryButton}
                onClick={onStartWorkout}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, styles.primaryButtonHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--accent)')
                }
              >
                <Play size={18} />
                Start nå
              </button>
              <div style={styles.rescheduleDropdown}>
                <button
                  style={styles.secondaryButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRescheduleOptions(!showRescheduleOptions);
                  }}
                >
                  Planlegg
                  <ChevronDown size={14} />
                </button>
                {showRescheduleOptions && (
                  <div style={styles.dropdown}>
                    {rescheduleOptions.map(({ label, option }) => (
                      <button
                        key={label}
                        style={styles.dropdownItem}
                        onClick={() => {
                          onReschedule(option);
                          setShowRescheduleOptions(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = 'var(--background-surface)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        Om {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'S1_SCHEDULED':
      case 'S0_DEFAULT':
      default:
        return (
          <>
            <div style={styles.focusLine}>I dag: {weeklyFocus}</div>
            <div style={styles.recommendationLine}>
              <span style={{ ...styles.badge, ...styles.badgeRecommended }}>Anbefalt</span>
              <span>
                {recommendedWorkout?.name} · {formatDuration(recommendedWorkout?.duration || 0)} ·{' '}
                {translateCategory(recommendedWorkout?.category || '')}
              </span>
            </div>
            <div style={styles.actions}>
              <button
                style={styles.primaryButton}
                onClick={onStartWorkout}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, styles.primaryButtonHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--accent)')
                }
              >
                <Play size={18} />
                Start nå
              </button>
              <div style={styles.rescheduleDropdown}>
                <button
                  style={styles.secondaryButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRescheduleOptions(!showRescheduleOptions);
                  }}
                >
                  Utsett
                  <ChevronDown size={14} />
                </button>
                {showRescheduleOptions && (
                  <div style={styles.dropdown}>
                    {rescheduleOptions.map(({ label, option }) => (
                      <button
                        key={label}
                        style={styles.dropdownItem}
                        onClick={() => {
                          onReschedule(option);
                          setShowRescheduleOptions(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = 'var(--background-surface)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      style={{
                        ...styles.dropdownItem,
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                      onClick={() => {
                        // TODO: Open time picker
                        setShowRescheduleOptions(false);
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--background-surface)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      Velg tidspunkt...
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default DecisionAnchor;
