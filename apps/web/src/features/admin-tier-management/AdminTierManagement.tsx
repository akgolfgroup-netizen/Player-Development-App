/**
 * AK Golf Academy - Admin Tier Management
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Manage subscription tiers as BILLING CONFIGURATION ONLY
 * - No evaluation, no prioritization, no insight into users
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 *
 * NON-NEGOTIABLE:
 * - Tiers are financial constructs only
 * - A tier MUST NOT imply skill, value, importance, or performance
 * - Changes affect FUTURE billing only, no retroactive effects
 */

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from "lucide-react";
import apiClient from "../../services/apiClient";


//////////////////////////////
// 1. TYPES
//////////////////////////////

type SubscriptionTier = {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: Record<string, boolean>;
  active: boolean;
};

//////////////////////////////
// 2. DEFAULT TIERS (fallback when API unavailable)
//////////////////////////////

const DEFAULT_TIERS: SubscriptionTier[] = [
  {
    id: "t1",
    name: "Standard",
    price: 99,
    interval: "monthly",
    features: {
      proof_enabled: true,
      trajectory_view: true,
      coach_notes: false,
    },
    active: true,
  },
  {
    id: "t2",
    name: "Pro",
    price: 199,
    interval: "monthly",
    features: {
      proof_enabled: true,
      trajectory_view: true,
      coach_notes: true,
    },
    active: true,
  },
  {
    id: "t3",
    name: "Team",
    price: 1999,
    interval: "yearly",
    features: {
      proof_enabled: true,
      trajectory_view: true,
      coach_notes: true,
    },
    active: false,
  },
];

//////////////////////////////
// 3. COMPONENT
//////////////////////////////

export default function AdminTierManagement() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadTiers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/tiers');
      setTiers(data.data.tiers || data.data || []);
    } catch {
      // API not available yet, use defaults
      setTiers(DEFAULT_TIERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTiers();
  }, [loadTiers]);

  const toggleActive = async (id: string) => {
    const tier = tiers.find(t => t.id === id);
    if (!tier) return;

    try {
      await apiClient.patch(`/admin/tiers/${id}`, { active: !tier.active });
    } catch {
      // API not available, just update locally
    }

    setTiers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
  };

  const formatInterval = (interval: SubscriptionTier["interval"]) => {
    return interval === "monthly" ? "/mnd" : "/år";
  };

  const featureLabels: Record<string, string> = {
    proof_enabled: "PROOF-visning",
    trajectory_view: "Utviklingsvisning",
    coach_notes: "Trenernotater",
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent)" />
      </div>
    );
  }

  return (
    <section
      aria-label="Tier management"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <CreditCard size={28} color={'var(--accent)'} />
          <h1 style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Abonnementsnivåer
          </h1>
        </div>
        <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-secondary)', margin: 0 }}>
          Konfigurasjon av faktureringsnivåer
        </p>
      </div>

      {/* Tier List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              style={{
                borderBottom: index < tiers.length - 1 ? `1px solid ${'var(--border-default)'}` : 'none',
              }}
            >
              {/* Tier Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                }}
              >
                {/* Tier Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', lineHeight: '20px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {tier.name}
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {tier.price} kr{formatInterval(tier.interval)}
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
                    backgroundColor: tier.active ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--text-secondary-rgb), 0.15)',
                  }}
                >
                  {tier.active ? (
                    <CheckCircle size={14} color={'var(--success)'} />
                  ) : (
                    <XCircle size={14} color={'var(--text-secondary)'} />
                  )}
                  <span
                    style={{
                      fontSize: '13px', lineHeight: '18px',
                      fontWeight: 500,
                      color: tier.active ? 'var(--success)' : 'var(--text-secondary)',
                    }}
                  >
                    {tier.active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </div>

                {/* Expand Button */}
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === tier.id ? null : tier.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${'var(--border-default)'}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {expandedId === tier.id ? (
                    <ChevronUp size={18} color={'var(--text-secondary)'} />
                  ) : (
                    <ChevronDown size={18} color={'var(--text-secondary)'} />
                  )}
                </button>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleActive(tier.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${tier.active ? 'var(--error)' : 'var(--success)'}`,
                    backgroundColor: 'transparent',
                    color: tier.active ? 'var(--error)' : 'var(--success)',
                    fontSize: '13px', lineHeight: '18px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tier.active ? 'Deaktiver' : 'Aktiver'}
                </button>
              </div>

              {/* Expanded Features */}
              {expandedId === tier.id && (
                <div
                  style={{
                    padding: '0 20px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${'var(--border-default)'}`,
                    }}
                  >
                    <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Inkluderte funksjoner
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(tier.features).map(([key, enabled]) => (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {enabled ? (
                            <CheckCircle size={16} color={'var(--success)'} />
                          ) : (
                            <XCircle size={16} color={'var(--text-secondary)'} />
                          )}
                          <span
                            style={{
                              fontSize: '15px', lineHeight: '20px',
                              color: enabled ? 'var(--text-primary)' : 'var(--text-secondary)',
                            }}
                          >
                            {featureLabels[key] || key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 4. STRICT NOTES
//////////////////////////////

/*
- Do NOT show number of users per tier.
- Do NOT show revenue per tier.
- Do NOT show "most popular" labels.
- Do NOT rank or compare tiers.
- Do NOT show athlete or coach identifiers.
- Do NOT auto-recommend tiers.
- Do NOT highlight tiers visually.
- Do NOT order tiers by popularity or revenue.
- Do NOT use words like "best", "premium", "top", "advanced".
- Flat list, no badges, no emphasis, no default selection.
- Changes affect FUTURE billing only, no retroactive effects.
- No visibility into who is affected.
*/
