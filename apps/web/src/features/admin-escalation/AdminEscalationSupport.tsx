/**
 * AK Golf Academy - Admin Escalation / Support
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Handle operational issues and escalations
 * - Zero access to performance or athlete data
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Cases are operational, not analytical
 * - No links to athletes, coaches, or sessions
 */

import React, { useState } from "react";
import { AlertCircle, Clock, CheckCircle, Headphones } from "lucide-react";
import { tokens } from "../../design-tokens";

// Typography styles from design tokens
const typography = tokens.typography;

//////////////////////////////
// 1. TYPES
//////////////////////////////

type SupportCase = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "closed";
  createdAt?: string;
};

//////////////////////////////
// 2. MOCK DATA (TEMP)
//////////////////////////////

const MOCK_CASES: SupportCase[] = [
  { id: "s1", title: "Innloggingsproblem rapportert", status: "open", createdAt: "2024-01-15" },
  { id: "s2", title: "Treningsplan lagres ikke", status: "in_progress", createdAt: "2024-01-14" },
  { id: "s3", title: "Kalender synkronisering", status: "closed", createdAt: "2024-01-10" },
];

//////////////////////////////
// 3. COMPONENT
//////////////////////////////

interface AdminEscalationSupportProps {
  cases?: SupportCase[];
}

export default function AdminEscalationSupport({ cases: apiCases }: AdminEscalationSupportProps = {}) {
  const initialCases = apiCases || MOCK_CASES;
  const [cases, setCases] = useState<SupportCase[]>(initialCases);

  const updateStatus = (id: string, status: SupportCase["status"]) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const getStatusConfig = (status: SupportCase["status"]) => {
    switch (status) {
      case 'open':
        return {
          icon: AlertCircle,
          color: tokens.colors.error,
          bg: `${tokens.colors.error}15`,
          label: 'Åpen',
        };
      case 'in_progress':
        return {
          icon: Clock,
          color: tokens.colors.warning,
          bg: `${tokens.colors.warning}15`,
          label: 'Under arbeid',
        };
      case 'closed':
        return {
          icon: CheckCircle,
          color: tokens.colors.success,
          bg: `${tokens.colors.success}15`,
          label: 'Løst',
        };
    }
  };

  const openCount = cases.filter(c => c.status !== 'closed').length;

  return (
    <section
      aria-label="Support cases"
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Headphones size={28} color={tokens.colors.primary} />
          <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
            Support & Eskalering
          </h1>
        </div>
        <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel, margin: 0 }}>
          {openCount} aktive saker
        </p>
      </div>

      {/* Cases List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
            overflow: 'hidden',
          }}
        >
          {cases.map((caseItem, index) => {
            const statusConfig = getStatusConfig(caseItem.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={caseItem.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: index < cases.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                }}
              >
                {/* Case Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ ...typography.body as React.CSSProperties, fontWeight: 500, color: tokens.colors.charcoal }}>
                    {caseItem.title}
                  </div>
                  {caseItem.createdAt && (
                    <div style={{ ...typography.caption as React.CSSProperties, color: tokens.colors.steel, marginTop: '4px' }}>
                      Opprettet: {caseItem.createdAt}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: tokens.borderRadius.sm,
                    backgroundColor: statusConfig.bg,
                  }}
                >
                  <StatusIcon size={14} color={statusConfig.color} />
                  <span
                    style={{
                      ...typography.caption as React.CSSProperties,
                      fontWeight: 500,
                      color: statusConfig.color,
                    }}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                {/* Action Buttons */}
                {caseItem.status !== "closed" && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {caseItem.status === "open" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(caseItem.id, "in_progress")}
                        style={{
                          padding: '8px 16px',
                          borderRadius: tokens.borderRadius.sm,
                          border: `1px solid ${tokens.colors.warning}`,
                          backgroundColor: 'transparent',
                          color: tokens.colors.warning,
                          ...typography.caption as React.CSSProperties,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Start
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => updateStatus(caseItem.id, "closed")}
                      style={{
                        padding: '8px 16px',
                        borderRadius: tokens.borderRadius.sm,
                        border: `1px solid ${tokens.colors.success}`,
                        backgroundColor: 'transparent',
                        color: tokens.colors.success,
                        ...typography.caption as React.CSSProperties,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Lukk sak
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 4. STRICT NOTES
//////////////////////////////

/*
- Do NOT show user identifiers.
- Do NOT link to athlete or coach views.
- Do NOT add analytics or trends.
- This screen is for operational resolution only.
*/
