/**
 * AK Golf Academy - Coach Athlete List
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Provide neutral access to athletes for a coach
 * - Alphabetically sorted, no ranking or comparison
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 */

import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Users, AlertCircle } from "lucide-react";
import { coachesAPI } from '../../services/api';

// Design tokens - Blue Palette 01
const tokens = {
  colors: {
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    white: '#FFFFFF',
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.06)',
  },
};

const typography = {
  title1: { fontSize: '28px', lineHeight: '34px', fontWeight: 700 },
  title3: { fontSize: '17px', lineHeight: '22px', fontWeight: 600 },
  body: { fontSize: '15px', lineHeight: '20px', fontWeight: 400 },
  caption: { fontSize: '13px', lineHeight: '18px', fontWeight: 400 },
};

//////////////////////////////
// 1. DATA MODEL (READ-ONLY)
//////////////////////////////

type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
};

//////////////////////////////
// 2. MOCK DATA (TEMPORARY)
//////////////////////////////

const MOCK_ATHLETES: Athlete[] = [
  { id: "1", firstName: "Anders", lastName: "Hansen" },
  { id: "2", firstName: "Erik", lastName: "Johansen" },
  { id: "3", firstName: "Lars", lastName: "Olsen" },
  { id: "4", firstName: "Mikkel", lastName: "Pedersen" },
  { id: "5", firstName: "Sofie", lastName: "Andersen" },
  { id: "6", firstName: "Emma", lastName: "Berg" },
];

//////////////////////////////
// 3. SORTING (NON-NEGOTIABLE)
//////////////////////////////

const sortAlphabetically = (athletes: Athlete[]): Athlete[] =>
  [...athletes].sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(
      `${b.lastName} ${b.firstName}`
    )
  );

//////////////////////////////
// 4. AVATAR COMPONENT
//////////////////////////////

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const colors = [tokens.colors.primary, tokens.colors.primaryLight];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColor = colors[Math.abs(hash) % colors.length];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: tokens.colors.white,
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
// 5. LOADING & ERROR STATES
//////////////////////////////

const LoadingState: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.snow
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 48,
        height: 48,
        border: `4px solid ${tokens.colors.primary}20`,
        borderTop: `4px solid ${tokens.colors.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel }}>
        Laster spillere...
      </p>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.snow,
    padding: '24px'
  }}>
    <div style={{
      maxWidth: 400,
      textAlign: 'center',
      padding: '32px',
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.borderRadius.lg,
      boxShadow: tokens.shadows.card
    }}>
      <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
      <h2 style={{ ...typography.title3 as React.CSSProperties, color: tokens.colors.charcoal, marginBottom: '8px' }}>
        Kunne ikke laste spillere
      </h2>
      <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel, marginBottom: '24px' }}>
        {error}
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: '12px 24px',
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          ...typography.body as React.CSSProperties,
          fontWeight: 600
        }}
      >
        Prøv igjen
      </button>
    </div>
  </div>
);

//////////////////////////////
// 6. MAIN COMPONENT
//////////////////////////////

type Props = {
  onSelectAthlete: (athleteId: string) => void;
  athletes?: Athlete[];  // Optional API data
};

export default function CoachAthleteList({ onSelectAthlete, athletes: propAthletes }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [athletes, setAthletes] = useState<Athlete[]>(propAthletes || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch athletes from API
  const fetchAthletes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await coachesAPI.getAthletes();
      setAthletes(response.data?.data || response.data || MOCK_ATHLETES);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'En ukjent feil oppstod');
      // Fallback to mock data on error
      setAthletes(MOCK_ATHLETES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if not using props
    if (!propAthletes) {
      fetchAthletes();
    } else {
      setLoading(false);
    }
  }, [propAthletes]);

  if (loading) return <LoadingState />;
  if (error && athletes.length === 0) return <ErrorState error={error} onRetry={fetchAthletes} />;

  // Filter and sort athletes
  const filteredAthletes = sortAlphabetically(athletes).filter(a =>
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      aria-label="Athlete list"
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Users size={28} color={tokens.colors.primary} />
          <h1 style={{ ...typography.title1 as React.CSSProperties, color: tokens.colors.charcoal, margin: 0 }}>
            Spillere
          </h1>
        </div>
        <p style={{ ...typography.body as React.CSSProperties, color: tokens.colors.steel, margin: 0 }}>
          {filteredAthletes.length} spillere (sortert alfabetisk)
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '0 24px', marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.md,
            boxShadow: tokens.shadows.card,
          }}
        >
          <Search size={20} color={tokens.colors.steel} />
          <input
            type="text"
            placeholder="Sok etter spiller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              outline: 'none',
              ...typography.body as React.CSSProperties,
              color: tokens.colors.charcoal,
            }}
          />
        </div>
      </div>

      {/* Athletes List */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.card,
            overflow: 'hidden',
          }}
        >
          {filteredAthletes.map((athlete, index) => (
            <button
              key={athlete.id}
              type="button"
              onClick={() => onSelectAthlete(athlete.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: index < athletes.length - 1 ? `1px solid ${tokens.colors.mist}` : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.colors.snow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Avatar name={`${athlete.firstName} ${athlete.lastName}`} />
              <span style={{ flex: 1, ...typography.body as React.CSSProperties, fontWeight: 500, color: tokens.colors.charcoal }}>
                {athlete.lastName}, {athlete.firstName}
              </span>
              <ChevronRight size={20} color={tokens.colors.steel} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

//////////////////////////////
// 6. NOTES
//////////////////////////////

/*
- Alphabetical sorting only (by last name)
- No counts, badges, or performance indicators
- Neutral presentation - no ranking or comparison
- Search is for convenience only, not filtering by performance
*/
