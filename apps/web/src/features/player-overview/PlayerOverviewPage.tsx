import { useEffect, useState } from "react";
import { PageTitle } from '../../components/typography';

export function PlayerOverviewPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("/api/v1/coaches/me/players", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch players');
        return r.json();
      })
      .then(data => {
        setPlayers(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '24px' }}>Laster spillere...</div>;
  }

  if (error) {
    return <div style={{ padding: '24px', color: 'red' }}>Feil: {error}</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <PageTitle style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Mine spillere</PageTitle>

      {players.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Ingen spillere tildelt ennå.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {players.map((p: any) => (
            <div key={p.id} style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <strong style={{ fontSize: '16px' }}>{p.name}</strong>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Kategori {p.category} • HCP {p.handicap ?? '-'}
                </div>
              </div>
              <span style={{
                padding: '4px 8px',
                backgroundColor: p.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                {p.status === 'active' ? 'Aktiv' : p.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
