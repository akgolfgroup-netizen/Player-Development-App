// @ts-nocheck
/**
 * TournamentList - Tournament Grid and Past Results List
 *
 * Renders upcoming tournaments grouped by month in a responsive grid
 * and past tournaments with results in a compact list.
 *
 * Design System: AK Golf Premium Light
 */

import React, { useMemo } from 'react';
import { Trophy, Medal, Calendar } from 'lucide-react';
import { SectionTitle, SubSectionTitle } from '../../../components/typography';
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

function getMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
}

function getMonthKey(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Group tournaments by month
function groupByMonth(tournaments: Tournament[]): Map<string, { label: string; tournaments: Tournament[] }> {
  const groups = new Map<string, { label: string; tournaments: Tournament[] }>();

  tournaments.forEach(tournament => {
    const key = getMonthKey(tournament.startDate);
    const label = getMonthYear(tournament.startDate);

    if (!groups.has(key)) {
      groups.set(key, { label, tournaments: [] });
    }
    groups.get(key)!.tournaments.push(tournament);
  });

  return groups;
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
  onAbsenceRequest?: (t: Tournament) => void;
}

export default function TournamentList({
  upcoming,
  past,
  playerCategory,
  onSelect,
  onRegister,
  onAddToCalendar,
  onPlanTournament,
  onAbsenceRequest,
}: TournamentListProps) {
  // Group upcoming tournaments by month
  const upcomingByMonth = useMemo(() => {
    if (upcoming.length === 0) return [];

    const groups = groupByMonth(upcoming);
    // Convert Map to array and sort by month key
    return Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, data]) => ({
        key,
        label: data.label.charAt(0).toUpperCase() + data.label.slice(1), // Capitalize first letter
        tournaments: data.tournaments,
      }));
  }, [upcoming]);

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
          <div style={styles.monthGroups}>
            {upcomingByMonth.map(monthGroup => (
              <div key={monthGroup.key} style={styles.monthSection}>
                <SubSectionTitle style={styles.monthHeader}>
                  <Calendar size={16} style={{ marginRight: '8px', opacity: 0.7 }} />
                  {monthGroup.label}
                  <span style={styles.monthCount}>({monthGroup.tournaments.length})</span>
                </SubSectionTitle>
                <div style={styles.cardGrid}>
                  {monthGroup.tournaments.map(tournament => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      playerCategory={playerCategory}
                      onSelect={onSelect}
                      onRegister={onRegister}
                      onAddToCalendar={onAddToCalendar}
                      onPlanTournament={onPlanTournament}
                      onAbsenceRequest={onAbsenceRequest}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
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
  monthGroups: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-6)',
  },
  monthSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-3)',
  },
  monthHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    padding: '8px 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  monthCount: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    marginLeft: '8px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'var(--spacing-3)',
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
