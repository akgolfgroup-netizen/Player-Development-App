/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Tournament Details Panel
 *
 * Side panel (desktop) / bottom sheet (mobile) for tournament details.
 * Shows full tournament info with action buttons.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Flag,
  Clock,
  ExternalLink,
  Hotel,
  FileText,
  CalendarPlus,
  CheckCircle,
  Info,
} from 'lucide-react';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import { SectionTitle } from '../../components/typography';
import { tournamentsAPI } from '../../services/api';
import {
  Tournament,
  PlayerCategory,
  TOUR_LABELS,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from './types';
import {
  isTournamentRecommendedForPlayer,
  getCategoryBadgeConfig,
} from './hierarchy-config';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
  })} - ${endDate.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================================
// COMPONENT
// ============================================================================

interface TournamentDetailsPanelProps {
  tournament: Tournament;
  playerCategory?: PlayerCategory;
  onClose: () => void;
  onRegister: (t: Tournament) => void;
  onAddToCalendar: (t: Tournament) => void;
}

export default function TournamentDetailsPanel({
  tournament,
  playerCategory,
  onClose,
  onRegister,
  onAddToCalendar,
}: TournamentDetailsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isMarkedRegistered, setIsMarkedRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const isRecommended = playerCategory
    ? isTournamentRecommendedForPlayer(tournament, playerCategory)
    : false;
  const daysUntil = getDaysUntil(tournament.startDate);
  const isUpcoming = daysUntil >= 0;
  const showRegisterButton =
    tournament.status === 'open' && !tournament.isRegistered && !isMarkedRegistered;
  const isRegistered = tournament.isRegistered || isMarkedRegistered;
  const hasResult = tournament.result && tournament.status === 'finished';

  const handleMarkRegistered = async () => {
    if (isRegistering) return;

    setIsRegistering(true);
    try {
      await tournamentsAPI.addToCalendar(tournament.id, { isRegistered: true });
      setIsMarkedRegistered(true);
    } catch (error) {
      console.error('Failed to mark tournament as registered:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAbsenceApplication = () => {
    // Navigate to school plan with tournament context for absence application
    navigate('/skoleplan', {
      state: {
        tournamentAbsence: {
          name: tournament.name,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          venue: tournament.venue,
        },
      },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          ...styles.panel,
          ...(isMobile ? styles.panelMobile : styles.panelDesktop),
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <SectionTitle>{tournament.name}</SectionTitle>
            {isRecommended && (
              <Badge variant="accent" size="sm">
                Anbefalt for deg
              </Badge>
            )}
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Description */}
          {tournament.description && (
            <p style={styles.description}>{tournament.description}</p>
          )}

          {/* Info grid */}
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <Calendar size={18} color="var(--accent)" />
              <div>
                <div style={styles.infoLabel}>Dato</div>
                <div style={styles.infoValue}>
                  {formatDateRange(tournament.startDate, tournament.endDate)}
                </div>
                {isUpcoming && tournament.registrationDeadline && (
                  <div style={styles.infoSecondary}>
                    Påmeldingsfrist: {formatDate(tournament.registrationDeadline)}
                  </div>
                )}
              </div>
            </div>

            <div style={styles.infoItem}>
              <MapPin size={18} color="var(--accent)" />
              <div>
                <div style={styles.infoLabel}>Sted</div>
                <div style={styles.infoValue}>{tournament.venue}</div>
                <div style={styles.infoSecondary}>
                  {tournament.city}, {tournament.country}
                </div>
              </div>
            </div>

            {tournament.format && (
              <div style={styles.infoItem}>
                <Flag size={18} color="var(--accent)" />
                <div>
                  <div style={styles.infoLabel}>Format</div>
                  <div style={styles.infoValue}>{tournament.format}</div>
                </div>
              </div>
            )}

            <div style={styles.infoItem}>
              <Users size={18} color="var(--accent)" />
              <div>
                <div style={styles.infoLabel}>Deltakere</div>
                <div style={styles.infoValue}>
                  {tournament.currentParticipants ?? 0} / {tournament.maxParticipants ?? '∞'}
                </div>
              </div>
            </div>
          </div>

          {/* Category recommendation */}
          <div style={styles.categorySection}>
            <div style={styles.categorySectionHeader}>
              <Info size={16} color="var(--text-tertiary)" />
              <span style={styles.categorySectionTitle}>Anbefalt nivå</span>
            </div>
            <div style={styles.categoryInfo}>
              <span
                style={{
                  ...styles.categoryBadgeLarge,
                  backgroundColor: isRecommended
                    ? 'var(--accent-muted)'
                    : 'var(--background-elevated)',
                  color: isRecommended
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                  border: isRecommended
                    ? '1px solid var(--border-brand)'
                    : '1px solid var(--border-default)',
                }}
              >
                {CATEGORY_LABELS[tournament.recommendedCategory]}
              </span>
              <p style={styles.categoryDescription}>
                {tournament.recommendedLevelLabel}
              </p>
              {playerCategory && !isRecommended && (
                <p style={styles.categoryNote}>
                  Du er i {CATEGORY_LABELS[playerCategory]}. Denne turneringen kan
                  være mer utfordrende eller mindre passende for ditt nivå.
                </p>
              )}
            </div>
          </div>

          {/* Tour info */}
          <div style={styles.tourSection}>
            <div style={styles.tourLabel}>Serie</div>
            <div style={styles.tourValue}>{TOUR_LABELS[tournament.tour]}</div>
          </div>

          {/* Fee */}
          <div style={styles.feeSection}>
            <div style={styles.feeLabel}>Startavgift</div>
            <div style={styles.feeValue}>
              {tournament.entryFee === 0 ? 'Gratis' : `${tournament.entryFee} kr`}
            </div>
          </div>

          {/* Result (for completed tournaments) */}
          {hasResult && (
            <div style={styles.resultSection}>
              <div style={styles.resultHeader}>Ditt resultat</div>
              <div style={styles.resultContent}>
                <div style={styles.resultPosition}>
                  {tournament.result!.position}. plass
                </div>
                <div style={styles.resultDetails}>
                  <span>Score: {tournament.result!.score}</span>
                  {tournament.result!.scoreToPar !== undefined && (
                    <span>
                      ({tournament.result!.scoreToPar > 0 ? '+' : ''}
                      {tournament.result!.scoreToPar})
                    </span>
                  )}
                  <span> · {tournament.result!.field} deltakere</span>
                </div>
                {tournament.result!.rounds && (
                  <div style={styles.resultRounds}>
                    Runder: {tournament.result!.rounds.join(' - ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          {/* Primary action row */}
          <div style={styles.primaryActions}>
            {showRegisterButton && (
              <Button
                variant="primary"
                leftIcon={<ExternalLink size={18} />}
                onClick={() => onRegister(tournament)}
                style={{ flex: 1 }}
              >
                Meld deg på
              </Button>
            )}

            {isRegistered && (
              <div style={styles.registeredBadge}>
                <CheckCircle size={18} />
                Du er påmeldt
              </div>
            )}

            {!isRegistered && tournament.status !== 'open' && isUpcoming && (
              <Button
                variant="ghost"
                onClick={handleMarkRegistered}
                style={{ flex: 1 }}
              >
                Marker som påmeldt
              </Button>
            )}

            <Button
              variant="ghost"
              leftIcon={<CalendarPlus size={18} />}
              onClick={() => onAddToCalendar(tournament)}
              style={{ flex: 1 }}
            >
              Legg til i kalender
            </Button>
          </div>

          {/* Secondary actions */}
          <div style={styles.secondaryActions}>
            {tournament.hotelUrl && (
              <button
                onClick={() => window.open(tournament.hotelUrl, '_blank')}
                style={styles.secondaryButton}
              >
                <Hotel size={16} />
                Bestill hotell
              </button>
            )}

            <button
              onClick={handleAbsenceApplication}
              style={styles.secondaryButton}
            >
              <FileText size={16} />
              Søk idrettsfravær
            </button>

            {tournament.resultsUrl && (
              <button
                onClick={() => window.open(tournament.resultsUrl, '_blank')}
                style={styles.secondaryButton}
              >
                <ExternalLink size={16} />
                Se resultater
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--overlay-backdrop)',
    zIndex: 100,
  },

  panel: {
    position: 'fixed',
    backgroundColor: 'var(--background-white)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 101,
    overflow: 'hidden',
  },

  panelDesktop: {
    top: 0,
    right: 0,
    bottom: 0,
    width: '480px',
    maxWidth: '90vw',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
  },

  panelMobile: {
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '90vh',
    borderTopLeftRadius: 'var(--radius-lg)',
    borderTopRightRadius: 'var(--radius-lg)',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 'var(--spacing-5)',
    borderBottom: '1px solid var(--border-subtle)',
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },

  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.3,
  },

  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--background-surface)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    marginLeft: 'var(--spacing-3)',
    flexShrink: 0,
  },

  content: {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--spacing-5)',
  },

  description: {
    fontSize: '15px',
    color: 'var(--text-primary)',
    lineHeight: 1.6,
    margin: '0 0 var(--spacing-5) 0',
  },

  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-5)',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },

  infoLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    marginBottom: '2px',
  },

  infoValue: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },

  infoSecondary: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },

  categorySection: {
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },

  categorySectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-3)',
  },

  categorySectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },

  categoryInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },

  categoryBadgeLarge: {
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    alignSelf: 'flex-start',
  },

  categoryDescription: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.5,
  },

  categoryNote: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },

  tourSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-3) 0',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: 'var(--spacing-3)',
  },

  tourLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },

  tourValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },

  feeSection: {
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },

  feeLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--spacing-1)',
  },

  feeValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },

  resultSection: {
    backgroundColor: 'var(--accent-muted)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    borderLeft: '3px solid var(--accent)',
  },

  resultHeader: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--accent)',
    marginBottom: 'var(--spacing-2)',
  },

  resultContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
  },

  resultPosition: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },

  resultDetails: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },

  resultRounds: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    marginTop: 'var(--spacing-1)',
  },

  actions: {
    padding: 'var(--spacing-5)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-white)',
  },

  primaryActions: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    marginBottom: 'var(--spacing-4)',
  },

  registeredBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    flex: 1,
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--success-muted)',
    color: 'var(--success)',
    fontSize: '15px',
    fontWeight: 600,
  },

  secondaryActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap',
  },

  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-white)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
