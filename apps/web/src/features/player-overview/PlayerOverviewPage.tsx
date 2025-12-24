import { useEffect, useState } from "react";

export function PlayerOverviewPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/coach/players")
      .then(r => r.json())
      .then(setPlayers);
  }, []);

  return (
    <div>
      <h1>Players</h1>

      {players.map((p: any) => (
        <div key={p.id}>
          <strong>{p.name}</strong>
          <span> SG Total: {p.sgTotal}</span>
        </div>
      ))}
    </div>
  );
}
