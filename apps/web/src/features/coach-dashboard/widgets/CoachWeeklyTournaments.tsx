/**
 * AK Golf Academy - Coach Weekly Tournaments Widget
 * Design System v3.0 - Blue Palette 01
 *
 * Viser ukens turneringer med spillerdeltakelse.
 * Gir oversikt over hvem som spiller hvor.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
} from 'lucide-react';
import { tokens } from '../../../design-tokens';

interface TournamentPlayer {
  id: string;
  name: string;
  avatarInitials: string;
  category: string;
  teeTime?: string;
}

interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  type: 'national' | 'regional' | 'club' | 'international';
  players: TournamentPlayer[];
}

interface CoachWeeklyTournamentsProps {
  onViewAll?: () => void;
}

export default function CoachWeeklyTournaments({ onViewAll }: CoachWeeklyTournamentsProps) {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/v1/coach/dashboard/tournaments');
        if (response.ok) {
          const data = await response.json();
          setTournaments(data.tournaments || []);
        }
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
        // Mock data for development
        setTournaments([
          {
            id: '1',
            name: 'NM Junior 2025',
            location: 'Oslo Golfklubb',
            startDate: '2025-12-22',
            endDate: '2025-12-24',
            type: 'national',
            players: [
              { id: 'p1', name: 'Anders Hansen', avatarInitials: 'AH', category: 'A', teeTime: '08:30' },
              { id: 'p2', name: 'Sofie Andersen', avatarInitials: 'SA', category: 'A', teeTime: '09:15' },
              { id: 'p3', name: 'Emma Berg', avatarInitials: 'EB', category: 'B', teeTime: '10:00' },
            ],
          },
          {
            id: '2',
            name: 'Sør-Cup Runde 4',
            location: 'Kristiansand GK',
            startDate: '2025-12-23',
            endDate: '2025-12-23',
            type: 'regional',
            players: [
              { id: 'p4', name: 'Erik Johansen', avatarInitials: 'EJ', category: 'B', teeTime: '11:30' },
              { id: 'p5', name: 'Lars Olsen', avatarInitials: 'LO', category: 'C', teeTime: '12:15' },
            ],
          },
          {
            id: '3',
            name: 'Julecup 2025',
            location: 'Bergen GK',
            startDate: '2025-12-26',
            endDate: '2025-12-26',
            type: 'club',
            players: [
              { id: 'p6', name: 'Mikkel Pedersen', avatarInitials: 'MP', category: 'C' },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Get tournament type badge
  const getTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      national: { bg: `${tokens.colors.gold}20`, text: '#8B6914', label: 'Nasjonal' },
      international: { bg: `${tokens.colors.primary}15`, text: tokens.colors.primary, label: 'Internasjonal' },
      regional: { bg: `${tokens.colors.primaryLight}15`, text: tokens.colors.primaryLight, label: 'Regional' },
      club: { bg: `${tokens.colors.steel}15`, text: tokens.colors.steel, label: 'Klubb' },
    };
    return styles[type] || styles.club;
  };

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

    if (start === end) {
      return startDate.toLocaleDateString('nb-NO', options);
    }
    return `${startDate.toLocaleDateString('nb-NO', { day: 'numeric' })}-${endDate.toLocaleDateString('nb-NO', options)}`;
  };

  // Get days until tournament
  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'I dag';
    if (diff === 1) return 'I morgen';
    if (diff < 0) return 'Pågår';
    return `Om ${diff} dager`;
  };

  // Total players this week
  const totalPlayers = new Set(
    tournaments.flatMap((t) => t.players.map((p) => p.id))
  ).size;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: `3px solid ${tokens.colors.gray300}`,
            borderTopColor: tokens.colors.gold,
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: tokens.radius.md,
              backgroundColor: `${tokens.colors.gold}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trophy size={20} color={tokens.colors.gold} />
          </div>
          <div>
            <h3
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Ukens turneringer
            </h3>
            <span
              style={{
                ...tokens.typography.caption1,
                color: tokens.colors.steel,
              }}
            >
              {totalPlayers} spillere deltar
            </span>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: tokens.colors.primary,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Se alle
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Tournaments list */}
      {tournaments.length === 0 ? (
        <div
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            backgroundColor: tokens.colors.gray100,
            borderRadius: tokens.radius.md,
          }}
        >
          <Trophy size={32} color={tokens.colors.gray300} style={{ marginBottom: '8px' }} />
          <p
            style={{
              ...tokens.typography.subheadline,
              color: tokens.colors.steel,
              margin: 0,
            }}
          >
            Ingen turneringer denne uken
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tournaments.map((tournament) => {
            const typeBadge = getTypeBadge(tournament.type);
            const daysUntil = getDaysUntil(tournament.startDate);

            return (
              <div
                key={tournament.id}
                onClick={() => navigate(`/coach/tournaments/${tournament.id}`)}
                style={{
                  padding: '16px',
                  backgroundColor: tokens.colors.white,
                  borderRadius: tokens.radius.md,
                  border: `1px solid ${tokens.colors.gray200}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Tournament header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4
                        style={{
                          ...tokens.typography.headline,
                          color: tokens.colors.charcoal,
                          margin: 0,
                        }}
                      >
                        {tournament.name}
                      </h4>
                      <span
                        style={{
                          padding: '2px 8px',
                          backgroundColor: typeBadge.bg,
                          color: typeBadge.text,
                          borderRadius: tokens.radius.sm,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {typeBadge.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          ...tokens.typography.caption1,
                          color: tokens.colors.steel,
                        }}
                      >
                        <MapPin size={12} />
                        {tournament.location}
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          ...tokens.typography.caption1,
                          color: tokens.colors.steel,
                        }}
                      >
                        <Calendar size={12} />
                        {formatDateRange(tournament.startDate, tournament.endDate)}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      backgroundColor:
                        daysUntil === 'I dag' || daysUntil === 'Pågår'
                          ? `${tokens.colors.success}15`
                          : tokens.colors.gray100,
                      color:
                        daysUntil === 'I dag' || daysUntil === 'Pågår'
                          ? tokens.colors.success
                          : tokens.colors.steel,
                      borderRadius: tokens.radius.sm,
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {daysUntil}
                  </span>
                </div>

                {/* Players */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: `1px solid ${tokens.colors.gray100}`,
                  }}
                >
                  <Users size={14} color={tokens.colors.steel} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                    {tournament.players.slice(0, 4).map((player, index) => (
                      <div
                        key={player.id}
                        title={`${player.name}${player.teeTime ? ` - Tee: ${player.teeTime}` : ''}`}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: tokens.colors.primary,
                          color: tokens.colors.white,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 600,
                          marginLeft: index > 0 ? '-8px' : 0,
                          border: `2px solid ${tokens.colors.white}`,
                        }}
                      >
                        {player.avatarInitials}
                      </div>
                    ))}
                    {tournament.players.length > 4 && (
                      <span
                        style={{
                          ...tokens.typography.caption1,
                          color: tokens.colors.steel,
                          marginLeft: '4px',
                        }}
                      >
                        +{tournament.players.length - 4} til
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      ...tokens.typography.caption1,
                      color: tokens.colors.primary,
                      fontWeight: 500,
                    }}
                  >
                    {tournament.players.length} spillere
                  </span>
                  <ChevronRight size={16} color={tokens.colors.steel} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
