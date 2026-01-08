/**
 * PlayerOverviewPage
 *
 * Archetype: A - List/Index Page
 * Purpose: Display coach's assigned players
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import { useEffect, useState } from 'react';
import { PageTitle } from '../../components/typography/Headings';
import { PageHeader } from '../../ui/raw-blocks';

interface Player {
  id: string;
  name: string;
  category: string;
  handicap: number | null;
  status: string;
}

export function PlayerOverviewPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/coaches/me/players', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch players');
        return r.json();
      })
      .then((data) => {
        setPlayers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-tier-navy">Laster spillere...</div>;
  }

  if (error) {
    return <div className="p-6 text-tier-error">Feil: {error}</div>;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Mine spillere"
        subtitle="Oversikt over tildelte spillere"
        helpText="Komplett oversikt over alle spillere du er trener for. Se navn, kategori (A-K), handicap og status for hver spiller. Klikk på en spiller for å se detaljert profil, treningsdata og fremgang."
      />

      {players.length === 0 ? (
        <p className="text-tier-text-secondary">Ingen spillere tildelt ennå.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {players.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-tier-surface-base rounded-lg flex justify-between items-center"
            >
              <div>
                <strong className="text-base text-tier-navy">{p.name}</strong>
                <div className="text-sm text-tier-text-secondary">
                  Kategori {p.category} • HCP {p.handicap ?? '-'}
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs text-white ${
                  p.status === 'active' ? 'bg-tier-success' : 'bg-tier-text-tertiary'
                }`}
              >
                {p.status === 'active' ? 'Aktiv' : p.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerOverviewPage;
