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

import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react";
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';

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

export default function AdminEscalationSupport({ cases: propCases }: AdminEscalationSupportProps = {}) {
  const { user } = useAuth();
  const [cases, setCases] = useState<SupportCase[]>(propCases || []);
  const [loading, setLoading] = useState(!propCases);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/support-cases');
      const casesData = response.data?.data?.cases || response.data?.data || response.data || [];

      if (Array.isArray(casesData) && casesData.length > 0) {
        setCases(casesData.map((c: { id: string; title?: string; subject?: string; status?: string; createdAt?: string; created_at?: string }) => ({
          id: c.id,
          title: c.title || c.subject || 'Ukjent sak',
          status: (c.status as SupportCase['status']) || 'open',
          createdAt: c.createdAt || c.created_at,
        })));
      } else {
        setCases(MOCK_CASES);
      }
    } catch (err) {
      console.error('Error fetching support cases:', err);
      setCases(MOCK_CASES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!propCases && user) {
      fetchCases();
    }
  }, [propCases, user, fetchCases]);

  const updateStatus = async (id: string, status: SupportCase["status"]) => {
    try {
      await apiClient.patch(`/admin/support-cases/${id}`, { status });
    } catch (err) {
      console.error('Error updating case status:', err);
      // Continue with optimistic update even if API fails
    }
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent)" />
      </div>
    );
  }

  const getStatusConfig = (status: SupportCase["status"]) => {
    switch (status) {
      case 'open':
        return {
          icon: AlertCircle,
          color: 'var(--error)',
          bg: 'rgba(var(--error-rgb), 0.15)',
          label: 'Åpen',
        };
      case 'in_progress':
        return {
          icon: Clock,
          color: 'var(--warning)',
          bg: 'rgba(var(--warning-rgb), 0.15)',
          label: 'Under arbeid',
        };
      case 'closed':
        return {
          icon: CheckCircle,
          color: 'var(--success)',
          bg: 'rgba(var(--success-rgb), 0.15)',
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Support & Eskalering"
        subtitle={`${openCount} aktive saker`}
      />

      {/* Cases List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
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
                  borderBottom: index < cases.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
                }}
              >
                {/* Case Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {caseItem.title}
                  </div>
                  {caseItem.createdAt && (
                    <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', marginTop: '4px' }}>
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
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: statusConfig.bg,
                  }}
                >
                  <StatusIcon size={14} color={statusConfig.color} />
                  <span
                    style={{
                      fontSize: '13px', lineHeight: '18px',
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
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${'var(--warning)'}`,
                          backgroundColor: 'transparent',
                          color: 'var(--warning)',
                          fontSize: '13px', lineHeight: '18px',
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
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${'var(--success)'}`,
                        backgroundColor: 'transparent',
                        color: 'var(--success)',
                        fontSize: '13px', lineHeight: '18px',
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
