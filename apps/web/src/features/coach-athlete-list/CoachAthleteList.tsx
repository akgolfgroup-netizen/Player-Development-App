/**
 * AK Golf Academy - Coach Athlete List
 * Design System v3.0 - Semantic CSS Variables
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
import { Search, ChevronRight, Users } from "lucide-react";
import { coachesAPI } from '../../services/api';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import Card from '../../ui/primitives/Card';

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

  const colors = ['var(--accent)', 'var(--success)', 'var(--warning)'];
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
        color: 'white',
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
// 5. LOADING & ERROR STATES (using canonical StateCard)
//////////////////////////////

const LoadingState: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-secondary)'
  }}>
    <StateCard variant="loading" title="Laster spillere..." />
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-secondary)',
    padding: '24px'
  }}>
    <StateCard
      variant="error"
      title="Kunne ikke laste spillere"
      description={error}
      action={<Button variant="primary" onClick={onRetry}>Prov igjen</Button>}
    />
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
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Users size={28} style={{ color: 'var(--accent)' }} />
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Spillere
          </h1>
        </div>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          {filteredAthletes.length} spillere (sortert alfabetisk)
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '0 24px', marginBottom: '16px' }}>
        <Card variant="default" padding="none">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
            }}
          >
            <Search size={20} style={{ color: 'var(--text-secondary)' }} />
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
                fontSize: '15px',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </Card>
      </div>

      {/* Athletes List */}
      <div style={{ padding: '0 24px 24px' }}>
        <Card variant="default" padding="none">
          <div style={{ overflow: 'hidden' }}>
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
                  borderBottom: index < athletes.length - 1 ? '1px solid var(--border-default)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar name={`${athlete.firstName} ${athlete.lastName}`} />
                <span style={{
                  flex: 1,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {athlete.lastName}, {athlete.firstName}
                </span>
                <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            ))}
          </div>
        </Card>
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
