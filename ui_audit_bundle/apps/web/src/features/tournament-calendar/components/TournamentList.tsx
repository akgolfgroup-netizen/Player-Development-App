// @ts-nocheck
/**
 * TournamentList - Tournament Grid and Past Results List
 *
 * Renders upcoming tournaments in a responsive grid
 * and past tournaments with results in a compact list.
 *
 * Design System: AK Golf Premium Light
 */

import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';
import StateCard from '../../../ui/composites/StateCard';
import { Tournament, PlayerCategory } from '../types';
import TournamentCard from './TournamentCard';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

// ============================================================================
// PAST TOURNAMENT CARD
// ============================================================================

interface PastTournamentCardProps {
  tournament: Tournament;
}

function PastTournamentCard({ tournament }: PastTournamentCardProps) {
  if (!tournament.result) return null;

  const isTopThree = tournament.result.position <= 3;

  return (
    <div style={styles.pastCard}>
      <div style={styles.pastCardPosition}>
        {isTopThree ? (
          <Medal size={20} color="var(--achievement)" />
        ) : (
          <span style={styles.positionNumber}>{tournament.result.position}</span>
        )}
      </div>
      <div style={styles.pastCardInfo}>
        <div style={styles.pastCardName}>{tournament.name}</div>
        <div style={styles.pastCardMeta}>
          {formatDate(tournament.startDate)} · {tournament.venue}
        </div>
      </div>
      <div style={styles.pastCardResult}>
        <div style={styles.pastCardResultPosition}>
          {tournament.result.position}. plass
        </div>
        <div style={styles.pastCardResultScore}>
          Score: {tournament.result.score} · {tournament.result.field} deltakere
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface TournamentListProps {
  upcoming: Tournament[];
  past: Tournament[];
  playerCategory?: PlayerCategory;
  onSelect: (t: Tournament) => void;
  onRegister: (t: Tournament) => void;
  onAddToCalendar: (t: Tournament) => void;
  onPlanTournament: (t: Tournament) => void;
}

export default function TournamentList({
  upcoming,
  past,
  playerCategory,
  onSelect,
  onRegister,
  onAddToCalendar,
  onPlanTournament,
}: TournamentListProps) {
  return (
    <>
      {/* Upcoming Tournaments */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Kommende turneringer</SectionTitle>

        {upcoming.length === 0 ? (
          <StateCard
            variant="empty"
            icon={Trophy}
            title="Ingen kommende turneringer"
            description="Prøv å endre filter eller søkekriterier"
          />
        ) : (
          <div style={styles.cardGrid}>
            {upcoming.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                playerCategory={playerCategory}
                onSelect={onSelect}
                onRegister={onRegister}
                onAddToCalendar={onAddToCalendar}
                onPlanTournament={onPlanTournament}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past Tournaments */}
      {past.length > 0 && (
        <section style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>Tidligere resultater</SectionTitle>
          <div style={styles.pastList}>
            {past.map(tournament => (
              <PastTournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginTop: 'var(--spacing-4)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-4) 0',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 'var(--spacing-4)',
  },
  pastList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-2)',
  },
  pastCard: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
    border: '1px solid var(--border-subtle)',
  },
  pastCardPosition: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--background-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionNumber: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  pastCardInfo: {
    flex: 1,
  },
  pastCardName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  pastCardMeta: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  pastCardResult: {
    textAlign: 'right' as const,
  },
  pastCardResultPosition: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  pastCardResultScore: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
};
