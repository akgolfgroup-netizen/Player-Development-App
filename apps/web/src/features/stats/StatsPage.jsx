import React, { useEffect, useMemo, useState } from "react";
import { tokens } from "../../design-tokens";

/**
 * StatsPage.jsx
 * Phase 1: Demo mode only (DataGolf integration kommer i Fase 2)
 * Phase 2: Live API integration
 *
 * Design System: v3.0 Blue Palette
 */

// Design System colors (using tokens directly in components)

// ============================================================================
// FEATURE FLAGS
// ============================================================================
const FEATURE_FLAGS = {
  ENABLE_LIVE_API: false,
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};

const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || '',
  statsEndpoint: '/api/v1/datagolf/compare',
};

// Demo data for each tour
const DEMO_BY_TOUR = {
  PGA: {
    tour: "PGA",
    sgTotal: 1.8,
    sgComponents: { offTee: 1.2, approach: 0.8, aroundGreen: 0.3, putting: -0.5 },
    traditional: {
      drivingDistanceMeters: { you: 268.0, tourAvg: 260.0 },
      drivingAccuracyPct: { you: 65.0, tourAvg: 70.0 },
      girPct: { you: 68.0, tourAvg: 66.0 },
      scramblingPct: { you: 58.0, tourAvg: 62.0 },
      puttsPerRound: { you: 29.5, tourAvg: 29.0 },
    },
    summary: {
      strengths: ["Driving Distance (+8m)", "GIR % (+2.0%)"],
      improvements: ["Driving Accuracy (-5.0%)", "Scrambling (-4.0%)", "Putts per Round (+0.5)"],
    },
  },
  LPGA: {
    tour: "LPGA",
    sgTotal: 1.2,
    sgComponents: { offTee: 0.6, approach: 0.7, aroundGreen: 0.2, putting: -0.3 },
    traditional: {
      drivingDistanceMeters: { you: 235.0, tourAvg: 230.0 },
      drivingAccuracyPct: { you: 69.0, tourAvg: 72.0 },
      girPct: { you: 70.0, tourAvg: 68.0 },
      scramblingPct: { you: 60.0, tourAvg: 63.0 },
      puttsPerRound: { you: 29.8, tourAvg: 29.3 },
    },
    summary: {
      strengths: ["GIR % (+2.0%)"],
      improvements: ["Driving Accuracy (-3.0%)", "Scrambling (-3.0%)", "Putts per Round (+0.5)"],
    },
  },
  DP: {
    tour: "DP",
    sgTotal: 1.0,
    sgComponents: { offTee: 0.7, approach: 0.5, aroundGreen: 0.2, putting: -0.4 },
    traditional: {
      drivingDistanceMeters: { you: 265.0, tourAvg: 258.0 },
      drivingAccuracyPct: { you: 66.0, tourAvg: 69.0 },
      girPct: { you: 67.0, tourAvg: 65.0 },
      scramblingPct: { you: 57.0, tourAvg: 60.0 },
      puttsPerRound: { you: 29.6, tourAvg: 29.2 },
    },
    summary: {
      strengths: ["Driving Distance (+7m)", "GIR % (+2.0%)"],
      improvements: ["Driving Accuracy (-3.0%)", "Scrambling (-3.0%)", "Putts per Round (+0.4)"],
    },
  },
};

function formatSigned(n, digits = 2) {
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(digits)}`;
}

function pctDelta(you, avg) {
  if (avg === 0) return 0;
  return (you / avg) * 100;
}

function verdictLabel(sgTotal) {
  if (sgTotal >= 1.5) return "Eksepsjonell ytelse!";
  if (sgTotal >= 0.5) return "Sterk ytelse.";
  if (sgTotal >= -0.5) return "Omtrent tour-nivå.";
  return "Under tour-nivå - se forbedringsområder.";
}

function logApiError(context, error, statusCode) {
  if (!FEATURE_FLAGS.DEBUG_MODE) return;

  const details = {
    context,
    statusCode: statusCode ?? 'N/A',
    message: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
  };
  console.warn('[StatsPage API Error]', details);
}

async function fetchStats(tour, signal) {
  const demo = DEMO_BY_TOUR[tour];

  if (!FEATURE_FLAGS.ENABLE_LIVE_API) {
    return { ok: true, data: demo, source: "demo" };
  }

  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.statsEndpoint}?tour=${encodeURIComponent(tour)}`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      signal,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logApiError('HTTP error', `${res.status} ${res.statusText} - ${body.slice(0, 200)}`, res.status);
      return { ok: false, error: `API-feil: ${res.status}`, data: demo, source: "demo" };
    }

    const json = await res.json();
    if (!json || typeof json.sgTotal !== "number" || !json.sgComponents || !json.traditional) {
      logApiError('Invalid response format', 'Missing required fields');
      return { ok: false, error: "Ugyldig API-respons", data: demo, source: "demo" };
    }

    const data = {
      tour,
      sgTotal: json.sgTotal,
      sgComponents: json.sgComponents,
      traditional: json.traditional,
      summary: json.summary ?? demo.summary,
    };

    return { ok: true, data, source: "api" };
  } catch (e) {
    if (e?.name !== "AbortError") {
      logApiError('Network/CORS error', e);
    }
    return { ok: false, error: "Nettverksfeil", data: demo, source: "demo" };
  }
}

function Card({ title, children }) {
  return (
    <div style={{ border: `1px solid ${tokens.semantic.border.default}`, borderRadius: 12, padding: 16, background: "white" }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function StatRow({ label, you, avg, unit, invertBetter }) {
  const delta = you - avg;
  const ratio = pctDelta(you, avg);
  const better = invertBetter ? delta <= 0 : delta >= 0;
  const sign = delta >= 0 ? "+" : "";
  return (
    <div style={{ padding: "10px 0", borderTop: `1px solid ${tokens.semantic.border.subtle}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ opacity: 0.85 }}>
          <span style={{ fontWeight: 700 }}>{sign}{delta.toFixed(1)}{unit}</span>{" "}
          <span style={{ opacity: 0.75 }}>({ratio.toFixed(0)}%)</span>{" "}
          <span style={{ marginLeft: 8, color: better ? tokens.colors.success : tokens.colors.warning }}>
            {better ? "+" : "-"}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 8, opacity: 0.9, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Du</div>
          <div style={{ fontWeight: 700 }}>{you.toFixed(1)}{unit}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Tour Avg</div>
          <div style={{ fontWeight: 700 }}>{avg.toFixed(1)}{unit}</div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  const isPositive = value.startsWith('+');
  const isNegative = value.startsWith('-');
  return (
    <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${tokens.semantic.border.subtle}` }}>
      <div style={{ opacity: 0.8, marginBottom: 4 }}>{title}</div>
      <div style={{
        fontSize: 22,
        fontWeight: 800,
        color: isPositive ? tokens.colors.success : isNegative ? tokens.colors.warning : 'inherit'
      }}>
        {value}
      </div>
    </div>
  );
}

function btn(active) {
  return {
    padding: "8px 10px",
    borderRadius: 12,
    border: `1px solid ${tokens.semantic.border.default}`,
    background: active ? tokens.colors.ink : "white",
    color: active ? "white" : tokens.colors.ink,
    cursor: "pointer",
    fontWeight: 700,
  };
}

export default function StatsPage() {
  const [tour, setTour] = useState("PGA");
  const [activeTab, setActiveTab] = useState("sg");

  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("demo");
  const [data, setData] = useState(DEMO_BY_TOUR.PGA);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);

    fetchStats(tour, ac.signal).then((r) => {
      setLoading(false);
      setSource(r.source);
      setData(r.data);
    });

    return () => ac.abort();
  }, [tour]);

  const banner = useMemo(() => {
    if (loading) return { type: "loading", text: "Laster statistikk..." };

    if (!FEATURE_FLAGS.ENABLE_LIVE_API) {
      return {
        type: "info",
        text: "Demo-modus aktiv. Live data kommer i Fase 2."
      };
    }

    if (source === "api") {
      return { type: "ok", text: "Live data lastet fra API." };
    }

    return {
      type: "info",
      text: "Viser demo-data (API midlertidig utilgjengelig)."
    };
  }, [loading, source]);

  const bannerStyles = {
    loading: { background: tokens.semantic.background.default, color: tokens.colors.steel },
    info: { background: tokens.colors.snow, color: tokens.colors.primary },
    ok: { background: `${tokens.colors.success}15`, color: tokens.colors.success },
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      <h1 style={{ margin: "6px 0 14px" }}>Statistikk</h1>

      <div
        style={{
          padding: 12,
          borderRadius: 12,
          border: `1px solid ${tokens.semantic.border.default}`,
          background: "white",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 700 }}>Strokes Gained Profil</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ opacity: 0.8 }}>Sammenlign med:</span>
            <select
              value={tour}
              onChange={(e) => setTour(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 10 }}
            >
              <option value="PGA">PGA Tour</option>
              <option value="LPGA">LPGA Tour</option>
              <option value="DP">DP World Tour</option>
            </select>
          </div>
        </div>

        <div style={{
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 6,
          ...bannerStyles[banner.type]
        }}>
          {banner.type === "ok" && <span style={{ color: tokens.colors.success }}>&#10003;</span>}
          {banner.type === "info" && <span>&#8505;</span>}
          {banner.type === "loading" && <span>&#8987;</span>}
          {banner.text}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => setActiveTab("min")} style={btn(activeTab === "min")}>Min Statistikk</button>
          <button onClick={() => setActiveTab("sg")} style={btn(activeTab === "sg")}>SG Profil</button>
          <button onClick={() => setActiveTab("peer")} style={btn(activeTab === "peer")}>Peer</button>
          <button onClick={() => setActiveTab("tour")} style={btn(activeTab === "tour")}>Tour</button>
          <button onClick={() => setActiveTab("trends")} style={btn(activeTab === "trends")}>Trends</button>
        </div>
      </div>

      {activeTab !== "sg" ? (
        <Card title="Ikke implementert i denne filen">
          <div style={{ opacity: 0.85 }}>
            Fanen <b>{activeTab}</b> er markert som "kommer senere" i Fase-planen.
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <Card title="Din SG vs Tour Snitt">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ opacity: 0.8 }}>Total Strokes Gained</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: data.sgTotal >= 0 ? tokens.colors.success : tokens.colors.warning }}>
                  {formatSigned(data.sgTotal, 2)}
                </div>
                <div style={{ opacity: 0.8 }}>vs {tour} Tour Average (0.00)</div>
              </div>
              <div style={{ alignSelf: "center", fontWeight: 800 }}>{verdictLabel(data.sgTotal)}</div>
            </div>
          </Card>

          <Card title="SG Komponenter">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              <MiniStat title="Off Tee" value={formatSigned(data.sgComponents.offTee)} />
              <MiniStat title="Approach" value={formatSigned(data.sgComponents.approach)} />
              <MiniStat title="Around Green" value={formatSigned(data.sgComponents.aroundGreen)} />
              <MiniStat title="Putting" value={formatSigned(data.sgComponents.putting)} />
            </div>
          </Card>

          <Card title="Tradisjonelle Statistikker vs Tour">
            <StatRow
              label="Driving Distance"
              you={data.traditional.drivingDistanceMeters.you}
              avg={data.traditional.drivingDistanceMeters.tourAvg}
              unit="m"
            />
            <StatRow
              label="Driving Accuracy"
              you={data.traditional.drivingAccuracyPct.you}
              avg={data.traditional.drivingAccuracyPct.tourAvg}
              unit="%"
            />
            <StatRow
              label="Greens in Regulation (GIR)"
              you={data.traditional.girPct.you}
              avg={data.traditional.girPct.tourAvg}
              unit="%"
            />
            <StatRow
              label="Scrambling"
              you={data.traditional.scramblingPct.you}
              avg={data.traditional.scramblingPct.tourAvg}
              unit="%"
            />
            <StatRow
              label="Putts per Round"
              you={data.traditional.puttsPerRound.you}
              avg={data.traditional.puttsPerRound.tourAvg}
              unit=""
              invertBetter
            />
          </Card>

          <Card title="Oppsummering">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6, color: tokens.colors.success }}>Styrker vs Tour</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {data.summary.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6, color: tokens.colors.warning }}>Forbedringsomrader</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {data.summary.improvements.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card title="Stats Dashboard - Fase 1">
            <div style={{ opacity: 0.9 }}>
              <strong>Aktivt:</strong> Min Statistikk, SG Profil (demo fallback), Peer Sammenligning
              <br />
              <strong>Kommer snart:</strong> Tour Benchmark (Fase 2), Live Trends (Fase 3)
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
