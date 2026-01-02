/**
 * AK Golf Academy - Coach Alerts Page
 *
 * Archetype: A - List/Index Page
 * Purpose: Display actionable alerts for coach attention
 * - No ranking, no comparison between athletes
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Alerts are neutral observations, not rankings
 * - No "priority" or "importance" ordering
 * - Alphabetical by athlete name only
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { useAuth } from '../../contexts/AuthContext';
import { coachesAPI } from '../../services/api';

// ============================================================================
// TYPES
// ============================================================================

type Alert = {
  id: string;
  athleteId: string;
  athleteName: string;
  type: 'proof_uploaded' | 'plan_pending' | 'note_request' | 'milestone';
  message: string;
  createdAt: string;
  read: boolean;
};

type AlertFilter = 'all' | 'unread';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    athleteId: '1',
    athleteName: 'Anders Hansen',
    type: 'proof_uploaded',
    message: 'Ny video lastet opp: Putting øvelse',
    createdAt: '2025-12-21T10:30:00Z',
    read: false,
  },
  {
    id: 'a2',
    athleteId: '2',
    athleteName: 'Emma Berg',
    type: 'plan_pending',
    message: 'Treningsplan venter på godkjenning',
    createdAt: '2025-12-21T09:15:00Z',
    read: false,
  },
  {
    id: 'a3',
    athleteId: '3',
    athleteName: 'Lars Olsen',
    type: 'milestone',
    message: 'Fullført 10 økter denne måneden',
    createdAt: '2025-12-20T16:00:00Z',
    read: true,
  },
  {
    id: 'a4',
    athleteId: '4',
    athleteName: 'Sofie Andersen',
    type: 'note_request',
    message: 'Bedt om tilbakemelding på siste økt',
    createdAt: '2025-12-20T14:30:00Z',
    read: true,
  },
];

// ============================================================================
// HELPERS
// ============================================================================

const sortAlphabetically = (alerts: Alert[]): Alert[] =>
  [...alerts].sort((a, b) => a.athleteName.localeCompare(b.athleteName));

const formatTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Nå nettopp';
  if (diffHours < 24) return `${diffHours} timer siden`;
  if (diffDays === 1) return 'I går';
  return `${diffDays} dager siden`;
};

const getAlertConfig = (type: Alert['type']) => {
  switch (type) {
    case 'proof_uploaded':
      return {
        icon: CheckCircle,
        colorClass: 'text-ak-status-success bg-ak-status-success/15',
        label: 'Dokumentasjon',
      };
    case 'plan_pending':
      return {
        icon: Clock,
        colorClass: 'text-ak-status-warning bg-ak-status-warning/15',
        label: 'Treningsplan',
      };
    case 'note_request':
      return {
        icon: AlertCircle,
        colorClass: 'text-ak-brand-primary bg-ak-brand-primary/15',
        label: 'Tilbakemelding',
      };
    case 'milestone':
      return {
        icon: Bell,
        colorClass: 'text-ak-status-warning bg-ak-status-warning/15',
        label: 'Milepæl',
      };
    default:
      return {
        icon: Bell,
        colorClass: 'text-ak-text-secondary bg-ak-surface-subtle',
        label: 'Varsel',
      };
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

interface CoachAlertsPageProps {
  alerts?: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

export default function CoachAlertsPage({
  alerts: apiAlerts,
  onAlertClick,
}: CoachAlertsPageProps = {}) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(apiAlerts || []);
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [loading, setLoading] = useState(!apiAlerts);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await coachesAPI.getAlerts();
      const alertsData =
        response.data?.data?.alerts || response.data?.data || response.data || [];

      if (Array.isArray(alertsData) && alertsData.length > 0) {
        const transformedAlerts: Alert[] = alertsData.map(
          (a: {
            id: string;
            athleteId?: string;
            playerId?: string;
            player?: { id: string; firstName?: string; lastName?: string };
            athleteName?: string;
            playerName?: string;
            type?: string;
            message?: string;
            text?: string;
            description?: string;
            createdAt?: string;
            created_at?: string;
            read?: boolean;
            isRead?: boolean;
          }) => ({
            id: a.id,
            athleteId: a.athleteId || a.playerId || a.player?.id || '',
            athleteName:
              a.athleteName ||
              a.playerName ||
              (a.player
                ? `${a.player.firstName || ''} ${a.player.lastName || ''}`.trim()
                : 'Ukjent'),
            type: (a.type as Alert['type']) || 'milestone',
            message: a.message || a.text || a.description || '',
            createdAt: a.createdAt || a.created_at || new Date().toISOString(),
            read: a.read ?? a.isRead ?? false,
          })
        );
        setAlerts(transformedAlerts);
      } else {
        setAlerts(MOCK_ALERTS);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!apiAlerts && user) {
      fetchAlerts();
    }
  }, [apiAlerts, user, fetchAlerts]);

  const filteredAlerts = sortAlphabetically(
    filter === 'unread' ? alerts.filter((a) => !a.read) : alerts
  );

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const handleAlertClick = (alert: Alert) => {
    markAsRead(alert.id);
    onAlertClick?.(alert);
  };

  return (
    <section
      aria-label="Coach alerts"
      className="min-h-screen bg-ak-surface-subtle font-sans"
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-6 pb-0">
        <div className="relative w-12 h-12 rounded-lg bg-ak-brand-primary/10 flex items-center justify-center flex-shrink-0">
          <Bell size={24} className="text-ak-brand-primary" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ak-status-error text-white text-[11px] font-bold flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1">
          <PageHeader
            title="Varsler"
            subtitle={`${unreadCount} uleste av ${alerts.length} totalt`}
            divider={false}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="px-6 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`
              flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-none cursor-pointer shadow-sm text-[15px] font-medium
              ${filter === 'all'
                ? 'bg-ak-brand-primary text-white'
                : 'bg-ak-surface-base text-ak-text-primary'
              }
            `}
          >
            <Filter size={16} />
            Alle
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`
              flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-none cursor-pointer shadow-sm text-[15px] font-medium
              ${filter === 'unread'
                ? 'bg-ak-brand-primary text-white'
                : 'bg-ak-surface-base text-ak-text-primary'
              }
            `}
          >
            Uleste
            {unreadCount > 0 && (
              <span
                className={`
                  px-2 py-0.5 rounded text-xs font-semibold
                  ${filter === 'unread'
                    ? 'bg-white/20 text-white'
                    : 'bg-ak-status-error/15 text-ak-status-error'
                  }
                `}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-[15px] text-ak-text-secondary">Laster varsler...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-ak-surface-base rounded-xl shadow-sm py-12 px-6 text-center">
            <Bell size={40} className="text-ak-border-default mb-3 mx-auto" />
            <p className="text-[15px] text-ak-text-secondary">
              {filter === 'unread' ? 'Ingen uleste varsler' : 'Ingen varsler'}
            </p>
          </div>
        ) : (
          <div className="bg-ak-surface-base rounded-xl shadow-sm overflow-hidden">
            {filteredAlerts.map((alert, index) => {
              const config = getAlertConfig(alert.type);
              const AlertIcon = config.icon;

              return (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => handleAlertClick(alert)}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 border-none cursor-pointer text-left transition-colors
                    ${alert.read ? 'bg-transparent' : 'bg-ak-brand-primary/5'}
                    ${index < filteredAlerts.length - 1 ? 'border-b border-ak-border-default' : ''}
                    hover:bg-ak-surface-subtle
                  `}
                >
                  {/* Alert Icon */}
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${config.colorClass}`}
                  >
                    <AlertIcon size={22} />
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[15px] text-ak-text-primary ${alert.read ? 'font-normal' : 'font-semibold'}`}
                      >
                        {alert.athleteName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${config.colorClass}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-ak-text-secondary m-0 truncate">
                      {alert.message}
                    </p>
                  </div>

                  {/* Time & Arrow */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-ak-text-secondary">
                      {formatTimeAgo(alert.createdAt)}
                    </span>
                    {!alert.read && (
                      <div className="w-2 h-2 rounded-full bg-ak-brand-primary" />
                    )}
                    <ChevronRight size={18} className="text-ak-text-secondary" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/*
STRICT NOTES:
- Alerts are sorted alphabetically by athlete name only.
- Do NOT prioritize or rank alerts by importance.
- Do NOT show "urgent" or "critical" labels.
- Do NOT compare athletes to each other.
- Do NOT show performance metrics inline.
- This is a neutral notification feed only.
*/
