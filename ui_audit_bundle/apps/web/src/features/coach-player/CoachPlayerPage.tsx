/**
 * CoachPlayerPage
 * Coach-only player profile view
 * Shows player info, KPI stats, recent videos, sessions, and goals
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCoachPlayer } from '../../data/hooks/useCoachPlayer';
import { track } from '../../analytics/track';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import StateCard from '../../ui/composites/StateCard';
import { PageTitle, SectionTitle } from '../../components/typography';

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4, 16px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3, 12px)',
    marginBottom: 'var(--spacing-2, 8px)',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 4px)',
    padding: '8px 12px',
    backgroundColor: 'var(--background-surface)',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  playerMeta: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 12px)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3, 12px)',
    borderBottom: '1px solid var(--border-subtle, #eee)',
  },
  listItemLast: {
    borderBottom: 'none',
  },
  listItemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  listItemTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  listItemMeta: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  statusPending: {
    backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
    color: 'var(--warning)',
  },
  statusReviewed: {
    backgroundColor: 'color-mix(in srgb, var(--success) 15%, transparent)',
    color: 'var(--success)',
  },
  statusFollowup: {
    backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)',
    color: 'var(--error)',
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  progressTrack: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--accent)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    minWidth: '40px',
    textAlign: 'right' as const,
  },
  emptyState: {
    padding: 'var(--spacing-4, 16px)',
    textAlign: 'center' as const,
    color: 'var(--text-secondary)',
    fontSize: '13px',
  },
  loadingContainer: {
    padding: 'var(--spacing-6, 24px)',
  },
};

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

function getStatusStyle(status: string): React.CSSProperties {
  switch (status) {
    case 'reviewed':
      return { ...styles.statusBadge, ...styles.statusReviewed };
    case 'needs_followup':
      return { ...styles.statusBadge, ...styles.statusFollowup };
    default:
      return { ...styles.statusBadge, ...styles.statusPending };
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'reviewed':
      return 'Gjennomgått';
    case 'needs_followup':
      return 'Oppfølging';
    default:
      return 'Venter';
  }
}

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function CoachPlayerPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useCoachPlayer(playerId || '');

  // Analytics: Track screen view
  useEffect(() => {
    if (playerId) {
      track('screen_view', {
        screen: 'CoachPlayerPage',
        source: 'navigation',
        id: playerId,
      });
    }
  }, [playerId]);

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <StateCard
          title="Laster spillerdata..."
          description="Vennligst vent"
          variant="info"
        />
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div style={styles.loadingContainer}>
        <StateCard
          title="Kunne ikke laste spillerdata"
          description={error}
          variant="error"
          action={
            <Button variant="secondary" onClick={refetch}>
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  // No data
  if (!data) {
    return (
      <div style={styles.loadingContainer}>
        <StateCard
          title="Ingen data tilgjengelig"
          description="Kunne ikke finne spillerdata"
          variant="empty"
        />
      </div>
    );
  }

  const { player, stats, videos, sessions, goals } = data;

  return (
    <div style={styles.container}>
      {/* Header with back button and player info */}
      <div style={styles.header}>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Tilbake
        </Button>
        <div style={styles.playerInfo}>
          <PageTitle style={styles.playerName}>{player.name}</PageTitle>
          {player.tier && (
            <p style={styles.playerMeta}>{player.tier}</p>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Nøkkeltall</SectionTitle>
        <StatsGridTemplate items={stats} columns={2} />
      </section>

      {/* Recent Videos */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Siste videoer</SectionTitle>
        <Card>
          {videos.length === 0 ? (
            <StateCard variant="empty" title="Ingen videoer" compact />
          ) : (
            videos.map((video, index) => (
              <Link
                key={video.id}
                to={`/coach/videos`}
                style={{
                  ...styles.listItem,
                  ...(index === videos.length - 1 ? styles.listItemLast : {}),
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onClick={() => {
                  track('screen_view', {
                    screen: 'CoachVideoReview',
                    source: 'coach_player_page',
                    id: video.id,
                    action: 'open',
                  });
                }}
              >
                <div style={styles.listItemLeft}>
                  <span style={styles.listItemTitle}>{video.title}</span>
                  <span style={styles.listItemMeta}>
                    {formatDate(video.date)} {video.category && `• ${video.category}`}
                  </span>
                </div>
                <span style={getStatusStyle(video.status)}>
                  {getStatusLabel(video.status)}
                </span>
              </Link>
            ))
          )}
        </Card>
      </section>

      {/* Recent Sessions */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Siste økter</SectionTitle>
        <Card>
          {sessions.length === 0 ? (
            <StateCard variant="empty" title="Ingen økter" compact />
          ) : (
            sessions.map((session, index) => (
              <div
                key={session.id}
                style={{
                  ...styles.listItem,
                  ...(index === sessions.length - 1 ? styles.listItemLast : {}),
                }}
              >
                <div style={styles.listItemLeft}>
                  <span style={styles.listItemTitle}>{session.title}</span>
                  <span style={styles.listItemMeta}>
                    {formatDate(session.date)} • {session.duration} min
                  </span>
                </div>
              </div>
            ))
          )}
        </Card>
      </section>

      {/* Goals Summary */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Aktive mål</SectionTitle>
        <Card>
          {goals.length === 0 ? (
            <StateCard variant="empty" title="Ingen aktive mål" compact />
          ) : (
            goals.map((goal, index) => {
              const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div
                  key={goal.id}
                  style={{
                    ...styles.listItem,
                    ...(index === goals.length - 1 ? styles.listItemLast : {}),
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: 'var(--spacing-2, 8px)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={styles.listItemTitle}>{goal.title}</span>
                    <span style={styles.listItemMeta}>
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                    <span style={styles.progressValue}>{progress}%</span>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </section>
    </div>
  );
}

export default CoachPlayerPage;
