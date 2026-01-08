// @ts-nocheck
/**
 * TournamentCard - Individual Tournament Display Card
 *
 * Displays tournament information including:
 * - Name, dates, venue
 * - Category recommendation
 * - Registration status
 * - Quick actions (hotel, school absence, calendar)
 * - Entry fee and registration button
 *
 * Design System: TIER Golf Premium Light
 */

import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Flag,
  Star,
  Medal,
  Trophy,
  ChevronRight,
  ExternalLink,
  Hotel,
  FileText,
  Plus,
  Target,
} from 'lucide-react';
import Button from '../../../ui/primitives/Button';
import Badge from '../../../ui/primitives/Badge.primitive';
import { SubSectionTitle } from '../../../components/typography';
import {
  Tournament,
  TourType,
  TournamentStatus,
  PlayerCategory,
  STATUS_LABELS,
  CATEGORY_LABELS,
} from '../types';
import {
  getCategoryBadgeConfig,
  isTournamentRecommendedForPlayer,
} from '../hierarchy-config';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getTourIcon(tour: TourType) {
  switch (tour) {
    case 'pga_tour':
    case 'dp_world_tour':
    case 'challenge_tour':
      return Star;
    case 'wagr_turnering':
    case 'ega_turnering':
      return Medal;
    case 'nordic_league':
    case 'global_junior_tour':
      return Flag;
    default:
      return Trophy;
  }
}

function getStatusConfig(status: TournamentStatus, isRegistered?: boolean): {
  label: string;
  variant: 'success' | 'error' | 'neutral' | 'accent' | 'warning';
} {
  if (isRegistered) {
    return { label: 'Påmeldt', variant: 'success' };
  }

  switch (status) {
    case 'open':
      return { label: 'Åpen for påmelding', variant: 'accent' };
    case 'full':
      return { label: 'Fullt', variant: 'error' };
    case 'upcoming':
      return { label: 'Kommer snart', variant: 'neutral' };
    case 'ongoing':
      return { label: 'Pågår', variant: 'warning' };
    case 'finished':
      return { label: 'Avsluttet', variant: 'neutral' };
    default:
      return { label: STATUS_LABELS[status] || status, variant: 'neutral' };
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

interface TournamentCardProps {
  tournament: Tournament;
  playerCategory?: PlayerCategory;
  onSelect: (t: Tournament) => void;
  onRegister: (t: Tournament) => void;
  onAddToCalendar: (t: Tournament) => void;
  onPlanTournament: (t: Tournament) => void;
  onAbsenceRequest?: (t: Tournament) => void;
  compact?: boolean; // Compact mode for smaller cards
}

export default function TournamentCard({
  tournament,
  playerCategory,
  onSelect,
  onRegister,
  onAddToCalendar,
  onPlanTournament,
  onAbsenceRequest,
  compact = true, // Default to compact mode
}: TournamentCardProps) {
  const daysUntil = getDaysUntil(tournament.startDate);
  const statusConfig = getStatusConfig(tournament.status, tournament.isRegistered);
  const TourIcon = getTourIcon(tournament.tour);
  const isRecommended = playerCategory
    ? isTournamentRecommendedForPlayer(tournament, playerCategory)
    : false;
  const categoryBadgeConfig = getCategoryBadgeConfig(
    tournament.recommendedCategory,
    isRecommended
  );

  const showRegisterButton =
    tournament.status === 'open' && !tournament.isRegistered;

  // Compact card layout
  if (compact) {
    return (
      <div
        onClick={() => onSelect(tournament)}
        style={{
          ...compactStyles.card,
          border: tournament.isRegistered
            ? '2px solid var(--status-success)'
            : isRecommended
            ? '2px solid var(--accent)'
            : '1px solid var(--border-default)',
        }}
      >
        {/* Header Row */}
        <div style={compactStyles.header}>
          <div style={compactStyles.tourIcon}>
            <TourIcon size={16} color="var(--text-secondary)" />
          </div>
          <div style={compactStyles.headerContent}>
            <div style={compactStyles.titleRow}>
              <span style={compactStyles.title}>{tournament.name}</span>
              {daysUntil >= 0 && daysUntil <= 14 && (
                <span style={compactStyles.daysUntil}>
                  {daysUntil === 0 ? 'I dag!' : `Om ${daysUntil} d`}
                </span>
              )}
            </div>
            <div style={compactStyles.badges}>
              <span
                style={{
                  ...compactStyles.categoryBadge,
                  backgroundColor: isRecommended ? 'var(--accent-muted)' : 'var(--gray-100)',
                  color: isRecommended ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isRecommended ? 600 : 500,
                }}
              >
                {CATEGORY_LABELS[tournament.recommendedCategory]}
              </span>
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.label}
              </Badge>
              {isRecommended && (
                <span style={compactStyles.recommendedBadge}>Anbefalt</span>
              )}
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div style={compactStyles.details}>
          <div style={compactStyles.detailItem}>
            <Calendar size={12} color="var(--text-tertiary)" />
            <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
          </div>
          <div style={compactStyles.detailItem}>
            <MapPin size={12} color="var(--text-tertiary)" />
            <span style={compactStyles.venue}>{tournament.venue}, {tournament.city}</span>
          </div>
          <div style={compactStyles.detailItem}>
            <Users size={12} color="var(--text-tertiary)" />
            <span>{tournament.currentParticipants ?? 0}/{tournament.maxParticipants ?? '∞'} påmeldte</span>
          </div>
          {tournament.format && (
            <div style={compactStyles.detailItem}>
              <Flag size={12} color="var(--text-tertiary)" />
              <span>{tournament.format}</span>
            </div>
          )}
        </div>

        {/* Footer Row */}
        <div style={compactStyles.footer}>
          <div style={compactStyles.fee}>
            <span style={compactStyles.feeLabel}>Startavgift</span>
            <span style={compactStyles.feeValue}>
              {tournament.entryFee === 0 ? 'Gratis' : `${tournament.entryFee} kr`}
            </span>
          </div>
          <div style={compactStyles.actions}>
            <button
              onClick={e => {
                e.stopPropagation();
                onPlanTournament(tournament);
              }}
              style={compactStyles.planButton}
            >
              <Target size={12} />
              Planlegg
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onSelect(tournament);
              }}
              style={compactStyles.detailsLink}
            >
              Se detaljer
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full card layout (original)
  const showQuickActions = tournament.isRegistered;

  return (
    <div
      onClick={() => onSelect(tournament)}
      style={{
        ...styles.card,
        border: tournament.isRegistered
          ? '2px solid var(--status-success)'
          : isRecommended
          ? '2px solid var(--accent)'
          : '1px solid var(--border-default)',
      }}
    >
      {/* Header */}
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <div style={styles.tourIconContainer}>
            <TourIcon size={22} color="var(--text-secondary)" />
          </div>
          <div>
            <SubSectionTitle style={styles.cardTitle}>{tournament.name}</SubSectionTitle>
            <div style={styles.badgeRow}>
              <span
                style={{
                  ...styles.categoryBadge,
                  backgroundColor: `var(--${categoryBadgeConfig.bgClass.replace('bg-', '')}, var(--gray-100))`,
                  color: `var(--${categoryBadgeConfig.textClass.replace('text-', '')}, var(--text-secondary))`,
                }}
              >
                {CATEGORY_LABELS[tournament.recommendedCategory]}
              </span>
              <Badge
                variant={statusConfig.variant}
                size="sm"
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {daysUntil >= 0 && daysUntil <= 14 && (
          <div style={styles.daysUntilBadge}>
            {daysUntil === 0 ? 'I dag!' : `Om ${daysUntil} d`}
          </div>
        )}
      </div>

      {/* Details */}
      <div style={styles.cardDetails}>
        <div style={styles.detailItem}>
          <Calendar size={14} color="var(--text-tertiary)" />
          <span>{formatDateRange(tournament.startDate, tournament.endDate)}</span>
        </div>
        <div style={styles.detailItem}>
          <MapPin size={14} color="var(--text-tertiary)" />
          <span>{tournament.venue}, {tournament.city}</span>
        </div>
        <div style={styles.detailItem}>
          <Users size={14} color="var(--text-tertiary)" />
          <span>
            {tournament.currentParticipants ?? 0}/{tournament.maxParticipants ?? '∞'} påmeldte
          </span>
        </div>
        {tournament.format && (
          <div style={styles.detailItem}>
            <Flag size={14} color="var(--text-tertiary)" />
            <span>{tournament.format}</span>
          </div>
        )}
      </div>

      {/* Quick Actions (for registered tournaments) */}
      {showQuickActions && (
        <div style={styles.quickActions}>
          {tournament.hotelUrl && (
            <button
              onClick={e => {
                e.stopPropagation();
                window.open(tournament.hotelUrl, '_blank');
              }}
              style={styles.quickActionButton}
            >
              <Hotel size={12} />
              Bestill hotell
            </button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              onAbsenceRequest?.(tournament);
            }}
            style={styles.quickActionButton}
          >
            <FileText size={12} />
            Søk idrettsfravær
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onAddToCalendar(tournament);
            }}
            style={styles.quickActionButtonDashed}
          >
            <Plus size={12} />
            Legg til
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={styles.cardFooter}>
        <div>
          <span style={styles.feeLabel}>Startavgift</span>
          <div style={styles.feeValue}>
            {tournament.entryFee === 0 ? 'Gratis' : `${tournament.entryFee} kr`}
          </div>
        </div>
        <div style={styles.cardActions}>
          {/* PLANLEGG action - add to tournament plan */}
          <button
            onClick={e => {
              e.stopPropagation();
              onPlanTournament(tournament);
            }}
            style={styles.planButton}
            title="Legg til i turneringsplan"
          >
            <Target size={14} />
            Planlegg
          </button>
          {showRegisterButton && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ExternalLink size={14} />}
              onClick={e => {
                e.stopPropagation();
                onRegister(tournament);
              }}
            >
              Meld på
            </Button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              onSelect(tournament);
            }}
            style={styles.detailsLink}
          >
            Se detaljer
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
  tourIconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.3,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginTop: 'var(--spacing-2)',
    flexWrap: 'wrap' as const,
  },
  categoryBadge: {
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  daysUntilBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap' as const,
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  quickActions: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
    flexWrap: 'wrap' as const,
  },
  quickActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quickActionButtonDashed: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px dashed var(--border-default)',
    backgroundColor: 'transparent',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 'var(--spacing-3)',
    borderTop: '1px solid var(--border-subtle)',
  },
  feeLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  feeValue: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  detailsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--accent)',
    fontSize: '14px',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  planButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// ============================================================================
// COMPACT STYLES
// ============================================================================

const compactStyles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '8px',
  },
  tourIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  daysUntil: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    padding: '2px 6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
    flexWrap: 'wrap' as const,
  },
  categoryBadge: {
    fontSize: '10px',
    fontWeight: 500,
    padding: '2px 6px',
    borderRadius: '4px',
  },
  recommendedBadge: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--status-success)',
    backgroundColor: 'var(--success-muted, rgba(34, 197, 94, 0.1))',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginBottom: '10px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  venue: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-subtle)',
  },
  fee: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  feeLabel: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
  },
  feeValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  planButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-surface)',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  detailsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    color: 'var(--accent)',
    fontSize: '12px',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
};
