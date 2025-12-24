import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  Search,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  Clock,
  MessageCircle,
  ChevronRight,
  Phone,
  Mail,
  XCircle
} from 'lucide-react';
import { tokens as designTokens } from '../../design-tokens';

interface PlayerRegression {
  id: string;
  name: string;
  avatar?: string;
  category: 'A' | 'B' | 'C';
  currentHcp: number;
  previousHcp: number;
  hcpChange: number;
  daysSinceSession: number;
  missedSessions: number;
  totalSessions: number;
  lastSession: string;
  concerns: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
  notes?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const mockRegressionPlayers: PlayerRegression[] = [
  {
    id: '1',
    name: 'Jonas Pedersen',
    category: 'B',
    currentHcp: 16.8,
    previousHcp: 14.2,
    hcpChange: 2.6,
    daysSinceSession: 28,
    missedSessions: 4,
    totalSessions: 22,
    lastSession: '2024-12-22',
    concerns: ['Manglende trening', 'Motivasjon', 'Teknikk-regresjon'],
    contactInfo: {
      phone: '+47 912 34 567',
      email: 'jonas.pedersen@email.no'
    },
    notes: 'Nevnte skolepress sist vi snakket. Bør følges opp.',
    riskLevel: 'high'
  },
  {
    id: '2',
    name: 'Kristine Olsen',
    category: 'A',
    currentHcp: 7.5,
    previousHcp: 5.8,
    hcpChange: 1.7,
    daysSinceSession: 14,
    missedSessions: 2,
    totalSessions: 38,
    lastSession: '2025-01-05',
    concerns: ['Putting-problemer', 'Selvtillit'],
    contactInfo: {
      phone: '+47 923 45 678',
      email: 'kristine.olsen@email.no'
    },
    riskLevel: 'medium'
  },
  {
    id: '3',
    name: 'Martin Haugen',
    category: 'C',
    currentHcp: 32.0,
    previousHcp: 28.5,
    hcpChange: 3.5,
    daysSinceSession: 42,
    missedSessions: 6,
    totalSessions: 12,
    lastSession: '2024-12-08',
    concerns: ['Lang pause', 'Mulig avslutning?'],
    contactInfo: {
      phone: '+47 934 56 789',
      email: 'martin.haugen@email.no'
    },
    notes: 'Har ikke svart på meldinger. Prøv å ringe.',
    riskLevel: 'high'
  },
  {
    id: '4',
    name: 'Ida Eriksen',
    category: 'B',
    currentHcp: 18.2,
    previousHcp: 16.9,
    hcpChange: 1.3,
    daysSinceSession: 10,
    missedSessions: 1,
    totalSessions: 25,
    lastSession: '2025-01-09',
    concerns: ['Svingteknikk endring', 'Usikkerhet'],
    contactInfo: {
      phone: '+47 945 67 890',
      email: 'ida.eriksen@email.no'
    },
    riskLevel: 'low'
  },
  {
    id: '5',
    name: 'Lars Johansen',
    category: 'A',
    currentHcp: 6.2,
    previousHcp: 4.8,
    hcpChange: 1.4,
    daysSinceSession: 21,
    missedSessions: 3,
    totalSessions: 48,
    lastSession: '2024-12-29',
    concerns: ['Skade?', 'Lite konkurranser'],
    contactInfo: {
      phone: '+47 956 78 901',
      email: 'lars.johansen@email.no'
    },
    notes: 'Mulig håndleddskade. Sjekk status.',
    riskLevel: 'medium'
  }
];

export const CoachStatsRegression: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredPlayers = useMemo(() => {
    let players = [...mockRegressionPlayers];

    if (searchQuery) {
      players = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (riskFilter !== 'all') {
      players = players.filter(p => p.riskLevel === riskFilter);
    }

    // Sort by risk level (high first) then by HCP change
    players.sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      }
      return b.hcpChange - a.hcpChange;
    });

    return players;
  }, [searchQuery, riskFilter]);

  const stats = useMemo(() => ({
    total: mockRegressionPlayers.length,
    highRisk: mockRegressionPlayers.filter(p => p.riskLevel === 'high').length,
    mediumRisk: mockRegressionPlayers.filter(p => p.riskLevel === 'medium').length,
    lowRisk: mockRegressionPlayers.filter(p => p.riskLevel === 'low').length
  }), []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'A': return { bg: '#dcfce7', text: '#166534' };
      case 'B': return { bg: '#dbeafe', text: '#1e40af' };
      case 'C': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#dc2626' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#d97706' };
      case 'low': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#16a34a' };
      default: return { bg: '#f3f4f6', border: '#e5e7eb', text: '#374151' };
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'Høy risiko';
      case 'medium': return 'Medium risiko';
      case 'low': return 'Lav risiko';
      default: return risk;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingDown size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: designTokens.colors.text.primary,
              margin: 0
            }}>
              Oppfølging påkrevd
            </h1>
            <p style={{
              fontSize: '14px',
              color: designTokens.colors.text.secondary,
              margin: 0
            }}>
              Spillere med negativ utvikling som trenger oppmerksomhet
            </p>
          </div>
        </div>
      </div>

      {/* Risk Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: '0 0 4px 0' }}>
            Totalt
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: designTokens.colors.text.primary, margin: 0 }}>
            {stats.total}
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <AlertTriangle size={14} color="#dc2626" />
            <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>Høy risiko</p>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626', margin: 0 }}>
            {stats.highRisk}
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <p style={{ fontSize: '12px', color: '#d97706', margin: '0 0 4px 0' }}>
            Medium risiko
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', margin: 0 }}>
            {stats.mediumRisk}
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <p style={{ fontSize: '12px', color: '#16a34a', margin: '0 0 4px 0' }}>
            Lav risiko
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', margin: 0 }}>
            {stats.lowRisk}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: designTokens.colors.text.tertiary
            }}
          />
          <input
            type="text"
            placeholder="Søk etter spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '10px',
              border: `1px solid ${designTokens.colors.border.light}`,
              backgroundColor: designTokens.colors.background.card,
              fontSize: '14px',
              color: designTokens.colors.text.primary,
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'high', 'medium', 'low'] as const).map(risk => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: riskFilter === risk
                  ? risk === 'all' ? designTokens.colors.primary[500]
                    : getRiskColor(risk).text
                  : designTokens.colors.background.card,
                color: riskFilter === risk
                  ? 'white'
                  : designTokens.colors.text.secondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {risk === 'all' ? 'Alle' : getRiskLabel(risk)}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPlayers.map((player) => {
          const riskColors = getRiskColor(player.riskLevel);
          return (
            <div
              key={player.id}
              style={{
                backgroundColor: designTokens.colors.background.card,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${riskColors.border}`,
                borderLeft: `4px solid ${riskColors.text}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Left side - Player info */}
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: riskColors.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: riskColors.text
                  }}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: designTokens.colors.text.primary,
                        margin: 0
                      }}>
                        {player.name}
                      </h3>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: getCategoryColor(player.category).bg,
                        color: getCategoryColor(player.category).text
                      }}>
                        Kat. {player.category}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: riskColors.bg,
                        color: riskColors.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {player.riskLevel === 'high' && <AlertTriangle size={10} />}
                        {getRiskLabel(player.riskLevel)}
                      </span>
                    </div>

                    {/* Warning stats */}
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#dc2626" />
                        <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '500' }}>
                          {player.daysSinceSession} dager siden sist
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XCircle size={14} color={designTokens.colors.text.tertiary} />
                        <span style={{ fontSize: '13px', color: designTokens.colors.text.secondary }}>
                          {player.missedSessions} økter avlyst/uteblitt
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color={designTokens.colors.text.tertiary} />
                        <span style={{ fontSize: '13px', color: designTokens.colors.text.secondary }}>
                          Sist: {formatDate(player.lastSession)}
                        </span>
                      </div>
                    </div>

                    {/* Concerns */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {player.concerns.map((concern, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#dc2626',
                          fontWeight: '500'
                        }}>
                          {concern}
                        </span>
                      ))}
                    </div>

                    {/* Notes if any */}
                    {player.notes && (
                      <div style={{
                        padding: '10px 12px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #f59e0b',
                        marginBottom: '12px'
                      }}>
                        <p style={{
                          fontSize: '13px',
                          color: '#92400e',
                          margin: 0,
                          fontStyle: 'italic'
                        }}>
                          {player.notes}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: designTokens.colors.primary[500],
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        <MessageCircle size={14} />
                        Send melding
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${designTokens.colors.border.light}`,
                        backgroundColor: 'transparent',
                        color: designTokens.colors.text.secondary,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        <Phone size={14} />
                        Ring
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${designTokens.colors.border.light}`,
                        backgroundColor: 'transparent',
                        color: designTokens.colors.text.secondary,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        <Mail size={14} />
                        E-post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side - HCP change */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '10px'
                  }}>
                    <ArrowDownRight size={18} color="#dc2626" />
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#dc2626'
                    }}>
                      +{player.hcpChange}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: 0 }}>
                      HCP: {player.previousHcp} → {player.currentHcp}
                    </p>
                  </div>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${designTokens.colors.border.light}`,
                    backgroundColor: 'transparent',
                    color: designTokens.colors.text.secondary,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Se historikk
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: designTokens.colors.background.card,
          borderRadius: '16px',
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          <TrendingDown size={48} color={designTokens.colors.text.tertiary} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: designTokens.colors.text.secondary,
            margin: 0
          }}>
            Ingen spillere funnet med valgt filter
          </p>
        </div>
      )}
    </div>
  );
};

export default CoachStatsRegression;
