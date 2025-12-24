/**
 * AK Golf Academy - Coach Injury/Illness Tracker Widget
 * Design System v3.0 - Blue Palette 01
 *
 * Viser oversikt over spillere med skader eller sykdom.
 * Hjelper treneren å holde oversikt over hvem som er ute.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Thermometer,
  Activity,
  ChevronRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { tokens } from '../../../design-tokens';

interface InjuryRecord {
  id: string;
  playerId: string;
  playerName: string;
  avatarInitials: string;
  type: 'injury' | 'illness' | 'recovery';
  description: string;
  affectedArea?: string;
  startDate: string;
  expectedReturn?: string;
  status: 'active' | 'recovering' | 'cleared';
  notes?: string;
}

interface CoachInjuryTrackerProps {
  onViewAll?: () => void;
}

export default function CoachInjuryTracker({ onViewAll }: CoachInjuryTrackerProps) {
  const navigate = useNavigate();
  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch injury records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/v1/coach/dashboard/injuries');
        if (response.ok) {
          const data = await response.json();
          setRecords(data.records || []);
        }
      } catch (error) {
        console.error('Failed to fetch injury records:', error);
        // Mock data for development
        setRecords([
          {
            id: '1',
            playerId: 'p1',
            playerName: 'Lars Olsen',
            avatarInitials: 'LO',
            type: 'injury',
            description: 'Strekk i høyre skulder',
            affectedArea: 'Skulder',
            startDate: '2025-12-15',
            expectedReturn: '2025-12-28',
            status: 'active',
            notes: 'Unngå full svingstyrke',
          },
          {
            id: '2',
            playerId: 'p2',
            playerName: 'Erik Johansen',
            avatarInitials: 'EJ',
            type: 'illness',
            description: 'Forkjølelse',
            startDate: '2025-12-19',
            expectedReturn: '2025-12-23',
            status: 'recovering',
          },
          {
            id: '3',
            playerId: 'p3',
            playerName: 'Mikkel Pedersen',
            avatarInitials: 'MP',
            type: 'recovery',
            description: 'Tilbake etter kneoperasjon',
            affectedArea: 'Kne',
            startDate: '2025-11-01',
            expectedReturn: '2025-12-25',
            status: 'recovering',
            notes: 'Gradvis opptrapping',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Get icon and color for record type/status
  const getRecordStyle = (type: string, status: string) => {
    if (status === 'cleared') {
      return {
        Icon: CheckCircle,
        bg: `${tokens.colors.success}10`,
        color: tokens.colors.success,
        label: 'Friskmeldt',
      };
    }

    const styles: Record<string, { Icon: React.ElementType; bg: string; color: string; label: string }> = {
      injury: {
        Icon: Activity,
        bg: `${tokens.colors.error}10`,
        color: tokens.colors.error,
        label: 'Skade',
      },
      illness: {
        Icon: Thermometer,
        bg: `${tokens.colors.warning}10`,
        color: '#B8860B',
        label: 'Sykdom',
      },
      recovery: {
        Icon: Heart,
        bg: `${tokens.colors.primary}10`,
        color: tokens.colors.primary,
        label: 'Rehabilitering',
      },
    };

    return styles[type] || styles.illness;
  };

  // Calculate days until expected return
  const getDaysUntilReturn = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return 'Snart';
    if (diff === 1) return '1 dag';
    return `${diff} dager`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      active: { bg: `${tokens.colors.error}15`, color: tokens.colors.error, label: 'Aktiv' },
      recovering: { bg: `${tokens.colors.warning}15`, color: '#B8860B', label: 'Under behandling' },
      cleared: { bg: `${tokens.colors.success}15`, color: tokens.colors.success, label: 'Friskmeldt' },
    };
    return styles[status] || styles.active;
  };

  // Count by status
  const activeCount = records.filter((r) => r.status === 'active').length;
  const recoveringCount = records.filter((r) => r.status === 'recovering').length;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: `3px solid ${tokens.colors.gray300}`,
            borderTopColor: tokens.colors.error,
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
              backgroundColor: `${tokens.colors.error}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heart size={20} color={tokens.colors.error} />
          </div>
          <div>
            <h3
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Skade/Sykdom
            </h3>
            <span
              style={{
                ...tokens.typography.caption1,
                color: tokens.colors.steel,
              }}
            >
              {activeCount} aktive, {recoveringCount} under behandling
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

      {/* Records list */}
      {records.length === 0 ? (
        <div
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            backgroundColor: `${tokens.colors.success}08`,
            borderRadius: tokens.radius.md,
          }}
        >
          <CheckCircle size={32} color={tokens.colors.success} style={{ marginBottom: '8px' }} />
          <p
            style={{
              ...tokens.typography.subheadline,
              color: tokens.colors.success,
              margin: 0,
            }}
          >
            Alle spillere er friske
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {records.map((record) => {
            const recordStyle = getRecordStyle(record.type, record.status);
            const statusBadge = getStatusBadge(record.status);
            const daysUntil = getDaysUntilReturn(record.expectedReturn);

            return (
              <div
                key={record.id}
                onClick={() => navigate(`/coach/athletes/${record.playerId}`)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  backgroundColor: recordStyle.bg,
                  borderRadius: tokens.radius.md,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: tokens.radius.sm,
                    backgroundColor: tokens.colors.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <recordStyle.Icon size={18} color={recordStyle.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: tokens.colors.primary,
                        color: tokens.colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {record.avatarInitials}
                    </span>
                    <span
                      style={{
                        ...tokens.typography.headline,
                        color: tokens.colors.charcoal,
                        fontWeight: 600,
                      }}
                    >
                      {record.playerName}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                        borderRadius: tokens.radius.sm,
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <p
                    style={{
                      ...tokens.typography.subheadline,
                      color: tokens.colors.charcoal,
                      margin: '0 0 4px',
                    }}
                  >
                    {record.description}
                    {record.affectedArea && (
                      <span style={{ color: tokens.colors.steel }}>
                        {' '}
                        ({record.affectedArea})
                      </span>
                    )}
                  </p>

                  {record.notes && (
                    <p
                      style={{
                        ...tokens.typography.caption1,
                        color: tokens.colors.steel,
                        margin: '0 0 6px',
                        fontStyle: 'italic',
                      }}
                    >
                      {record.notes}
                    </p>
                  )}

                  {/* Expected return */}
                  {record.expectedReturn && daysUntil && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={12} color={tokens.colors.steel} />
                      <span
                        style={{
                          ...tokens.typography.caption1,
                          color: tokens.colors.steel,
                        }}
                      >
                        Forventet tilbake:{' '}
                        <strong style={{ color: tokens.colors.charcoal }}>
                          {daysUntil}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                <ChevronRight size={16} color={tokens.colors.steel} style={{ flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
