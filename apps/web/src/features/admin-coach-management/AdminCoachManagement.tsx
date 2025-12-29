/**
 * AK Golf Academy - Admin Coach Management
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Manage coach accounts as system users
 * - No performance, no athlete linkage
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Coaches are users, not evaluable entities
 */

import React, { useState, useEffect, useCallback } from "react";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import apiClient from "../../services/apiClient";
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';


//////////////////////////////
// 1. TYPES
//////////////////////////////

type CoachAccount = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

//////////////////////////////
// 3. AVATAR COMPONENT
//////////////////////////////

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

//////////////////////////////
// 4. COMPONENT
//////////////////////////////

export default function AdminCoachManagement() {
  const [coaches, setCoaches] = useState<CoachAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoaches = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/coaches');
      const coachList = data.data.coaches || data.data || [];
      setCoaches(coachList.map((c: { id: string; firstName: string; lastName: string; user?: { email: string; isActive: boolean } }) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.user?.email || '',
        active: c.user?.isActive ?? true,
      })));
      setError(null);
    } catch (err) {
      console.error('Failed to load coaches:', err);
      setError('Kunne ikke laste trenere');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  const toggleActive = async (id: string) => {
    const coach = coaches.find(c => c.id === id);
    if (!coach) return;

    try {
      await apiClient.patch(`/coaches/${id}`, { isActive: !coach.active });
      setCoaches((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
      );
    } catch (err) {
      console.error('Failed to toggle coach status:', err);
      alert('Kunne ikke endre status');
    }
  };

  const activeCount = coaches.filter(c => c.active).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent)" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)' }}>{error}</p>
        <button onClick={loadCoaches} style={{ marginTop: '12px', padding: '8px 16px' }}>
          Prøv igjen
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label="Coach management"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Trenerkontoer"
        subtitle={`${activeCount} aktive av ${coaches.length} kontoer`}
      />

      {/* Coach List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          {coaches.map((coach, index) => (
            <div
              key={coach.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: index < coaches.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
              }}
            >
              <Avatar name={coach.name} />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {coach.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Mail size={14} color={'var(--text-secondary)'} />
                  <span style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
                    {coach.email}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: coach.active ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--text-secondary-rgb), 0.15)',
                }}
              >
                {coach.active ? (
                  <CheckCircle size={14} color={'var(--success)'} />
                ) : (
                  <XCircle size={14} color={'var(--text-secondary)'} />
                )}
                <span
                  style={{
                    fontSize: '13px', lineHeight: '18px',
                    fontWeight: 500,
                    color: coach.active ? 'var(--success)' : 'var(--text-secondary)',
                  }}
                >
                  {coach.active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => toggleActive(coach.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${coach.active ? 'var(--error)' : 'var(--success)'}`,
                  backgroundColor: 'transparent',
                  color: coach.active ? 'var(--error)' : 'var(--success)',
                  fontSize: '13px', lineHeight: '18px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {coach.active ? 'Deaktiver' : 'Aktiver'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 5. STRICT NOTES
//////////////////////////////

/*
- Do NOT show number of athletes per coach.
- Do NOT show activity, sessions, or results.
- Do NOT show rankings or comparisons.
- This screen manages access only.
*/
