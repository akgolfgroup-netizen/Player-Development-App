/**
 * AK Golf Academy - Coach Alerts Page
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Display actionable alerts for coach attention
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
 */

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock, AlertCircle, ChevronRight, Filter } from "lucide-react";
import { tokens } from "../../design-tokens";

// Typography from design tokens
const typography = tokens.typography;

//////////////////////////////
// 1. TYPES
//////////////////////////////

type Alert = {
  id: string;
  athleteId: string;
  athleteName: string;
  type: "proof_uploaded" | "plan_pending" | "note_request" | "milestone";
  message: string;
  createdAt: string;
  read: boolean;
};

type AlertFilter = "all" | "unread";

//////////////////////////////
// 2. MOCK DATA
//////////////////////////////

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    athleteId: "1",
    athleteName: "Anders Hansen",
    type: "proof_uploaded",
    message: "Ny video lastet opp: Putting øvelse",
    createdAt: "2025-12-21T10:30:00Z",
    read: false,
  },
  {
    id: "a2",
    athleteId: "2",
    athleteName: "Emma Berg",
    type: "plan_pending",
    message: "Treningsplan venter på godkjenning",
    createdAt: "2025-12-21T09:15:00Z",
    read: false,
  },
  {
    id: "a3",
    athleteId: "3",
    athleteName: "Lars Olsen",
    type: "milestone",
    message: "Fullført 10 økter denne måneden",
    createdAt: "2025-12-20T16:00:00Z",
    read: true,
  },
  {
    id: "a4",
    athleteId: "4",
    athleteName: "Sofie Andersen",
    type: "note_request",
    message: "Bedt om tilbakemelding på siste økt",
    createdAt: "2025-12-20T14:30:00Z",
    read: true,
  },
];

//////////////////////////////
// 3. HELPERS
//////////////////////////////

const sortAlphabetically = (alerts: Alert[]): Alert[] =>
  [...alerts].sort((a, b) => a.athleteName.localeCompare(b.athleteName));

const formatTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Nå nettopp";
  if (diffHours < 24) return `${diffHours} timer siden`;
  if (diffDays === 1) return "I går";
  return `${diffDays} dager siden`;
};

const getAlertConfig = (type: Alert["type"]) => {
  switch (type) {
    case "proof_uploaded":
      return { icon: CheckCircle, color: tokens.colors.success, label: "Dokumentasjon" };
    case "plan_pending":
      return { icon: Clock, color: tokens.colors.warning, label: "Treningsplan" };
    case "note_request":
      return { icon: AlertCircle, color: tokens.colors.primary, label: "Tilbakemelding" };
    case "milestone":
      return { icon: Bell, color: tokens.colors.gold, label: "Milepæl" };
    default:
      return { icon: Bell, color: tokens.colors.steel, label: "Varsel" };
  }
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

interface CoachAlertsPageProps {
  alerts?: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

export default function CoachAlertsPage({ alerts: apiAlerts, onAlertClick }: CoachAlertsPageProps = {}) {
  const [alerts, setAlerts] = useState<Alert[]>(apiAlerts || MOCK_ALERTS);
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [loading, setLoading] = useState(false);

  // Fetch alerts if not provided via props
  useEffect(() => {
    if (!apiAlerts) {
      setLoading(true);
      fetch("/api/coach/alerts")
        .then((r) => {
          if (r.status === 403) {
            throw new Error("UPGRADE_REQUIRED");
          }
          return r.json();
        })
        .then((data) => {
          if (data.alerts) {
            setAlerts(data.alerts);
          }
        })
        .catch(() => {
          // Keep mock data on error
        })
        .finally(() => setLoading(false));
    }
  }, [apiAlerts]);

  const filteredAlerts = sortAlphabetically(
    filter === "unread" ? alerts.filter((a) => !a.read) : alerts
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
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              position: "relative",
              width: 48,
              height: 48,
              borderRadius: tokens.borderRadius.md,
              backgroundColor: `${tokens.colors.primary}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={24} color={tokens.colors.primary} />
            {unreadCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: tokens.colors.error,
                  color: tokens.colors.white,
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </div>
            )}
          </div>
          <div>
            <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
              Varsler
            </h1>
            <p style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, margin: 0, marginTop: "4px" }}>
              {unreadCount} uleste av {alerts.length} totalt
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ padding: "0 24px 16px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: tokens.borderRadius.md,
              border: "none",
              backgroundColor: filter === "all" ? tokens.colors.primary : tokens.colors.white,
              color: filter === "all" ? tokens.colors.white : tokens.colors.charcoal,
              cursor: "pointer",
              boxShadow: tokens.shadows.card,
              ...typography.body as React.CSSProperties,
              fontWeight: 500,
            }}
          >
            <Filter size={16} />
            Alle
          </button>
          <button
            onClick={() => setFilter("unread")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: tokens.borderRadius.md,
              border: "none",
              backgroundColor: filter === "unread" ? tokens.colors.primary : tokens.colors.white,
              color: filter === "unread" ? tokens.colors.white : tokens.colors.charcoal,
              cursor: "pointer",
              boxShadow: tokens.shadows.card,
              ...typography.body as React.CSSProperties,
              fontWeight: 500,
            }}
          >
            Uleste
            {unreadCount > 0 && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: tokens.borderRadius.sm,
                  backgroundColor: filter === "unread" ? "rgba(255,255,255,0.2)" : `${tokens.colors.error}15`,
                  color: filter === "unread" ? tokens.colors.white : tokens.colors.error,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div style={{ padding: "0 24px 24px" }}>
        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel }}>
              Laster varsler...
            </p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.borderRadius.lg,
              boxShadow: tokens.shadows.card,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <Bell size={40} color={tokens.colors.mist} style={{ marginBottom: "12px" }} />
            <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel }}>
              {filter === "unread" ? "Ingen uleste varsler" : "Ingen varsler"}
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.borderRadius.lg,
              boxShadow: tokens.shadows.card,
              overflow: "hidden",
            }}
          >
            {filteredAlerts.map((alert, index) => {
              const config = getAlertConfig(alert.type);
              const AlertIcon = config.icon;

              return (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => handleAlertClick(alert)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 20px",
                    backgroundColor: alert.read ? "transparent" : `${tokens.colors.primary}05`,
                    border: "none",
                    borderBottom: index < filteredAlerts.length - 1 ? `1px solid ${tokens.colors.mist}` : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* Alert Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: tokens.borderRadius.md,
                      backgroundColor: `${config.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AlertIcon size={22} color={config.color} />
                  </div>

                  {/* Alert Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span
                        style={{
                          ...typography.body as React.CSSProperties,
                          fontWeight: alert.read ? 400 : 600,
                          color: tokens.colors.charcoal,
                        }}
                      >
                        {alert.athleteName}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: tokens.borderRadius.sm,
                          backgroundColor: `${config.color}15`,
                          color: config.color,
                          ...typography.caption as React.CSSProperties,
                          fontWeight: 500,
                        }}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p
                      style={{
                        ...typography.caption as React.CSSProperties,
                        color: tokens.colors.steel,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {alert.message}
                    </p>
                  </div>

                  {/* Time & Arrow */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel }}>
                      {formatTimeAgo(alert.createdAt)}
                    </span>
                    {!alert.read && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: tokens.colors.primary,
                        }}
                      />
                    )}
                    <ChevronRight size={18} color={tokens.colors.steel} />
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

//////////////////////////////
// 5. STRICT NOTES
//////////////////////////////

/*
- Alerts are sorted alphabetically by athlete name only.
- Do NOT prioritize or rank alerts by importance.
- Do NOT show "urgent" or "critical" labels.
- Do NOT compare athletes to each other.
- Do NOT show performance metrics inline.
- This is a neutral notification feed only.
*/
