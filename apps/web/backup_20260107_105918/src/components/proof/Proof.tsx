/**
 * PROOF Component - Shared between Golfer and Coach views
 *
 * Contract: IMPLEMENTATION_CONTRACT.md (P-01 to P-63)
 * Contract: COACH_ADMIN_SCREEN_CONTRACT.md (CPV-C01: pixel-identical to golfer)
 *
 * PURPOSE: Present evidence of change without interpretation
 *
 * NON-NEGOTIABLE:
 * - Layout MUST be identical for positive/negative results
 * - Delta shown in neutral charcoal (no green/red)
 * - No causality language ("because you trained X")
 * - No effort data (hours, sessions)
 * - No motivation text
 * - Missing data shown as em-dash (—)
 */

import React from "react";
import { SectionTitle } from "../typography";

//////////////////////////////
// 1. TYPES
//////////////////////////////

type ProofData = {
  testName: string;
  testDate: string;
  current: number | null;
  baseline: number | null;
  unit: string;
};

type ProofProps = {
  athleteId: string;
  testId: string;
  data?: ProofData;
  onDismiss?: () => void;
};

//////////////////////////////
// 2. MOCK DATA (TEMP)
//////////////////////////////

const MOCK_PROOF: ProofData = {
  testName: "Putteavstand 3m",
  testDate: "2024-12-18",
  current: 72,
  baseline: 65,
  unit: "%",
};

//////////////////////////////
// 3. HELPERS
//////////////////////////////

function formatValue(value: number | null, unit: string): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${value}${unit}`;
}

function calculateDelta(
  current: number | null,
  baseline: number | null
): string {
  if (current === null || baseline === null) {
    return "—";
  }
  const delta = current - baseline;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

//////////////////////////////
// 4. STYLES (using CSS vars)
//////////////////////////////

const styles = {
  container: {
    fontFamily: "var(--font-family)",
    padding: "var(--spacing-4)",
    backgroundColor: "var(--background-white)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-card)",
  } as React.CSSProperties,

  header: {
    marginBottom: "var(--spacing-4)",
  } as React.CSSProperties,

  testName: {
    fontSize: "var(--font-size-title2)",
    lineHeight: "var(--line-height-title2)",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  } as React.CSSProperties,

  testDate: {
    fontSize: "var(--font-size-footnote)",
    lineHeight: "var(--line-height-footnote)",
    color: "var(--text-secondary)",
    marginTop: "var(--spacing-1)",
  } as React.CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "var(--spacing-4)",
    marginBottom: "var(--spacing-6)",
  } as React.CSSProperties,

  metricBox: {
    textAlign: "center" as const,
    padding: "var(--spacing-3)",
    backgroundColor: "var(--background-surface)",
    borderRadius: "var(--radius-sm)",
  } as React.CSSProperties,

  metricLabel: {
    fontSize: "var(--font-size-caption1)",
    lineHeight: "var(--line-height-caption1)",
    color: "var(--text-secondary)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "var(--spacing-1)",
  } as React.CSSProperties,

  metricValue: {
    fontSize: "var(--font-size-title1)",
    lineHeight: "var(--line-height-title1)",
    fontWeight: 700,
    color: "var(--text-primary)",
  } as React.CSSProperties,

  // CRITICAL: Delta uses neutral charcoal - NO green/red
  deltaValue: {
    fontSize: "var(--font-size-title1)",
    lineHeight: "var(--line-height-title1)",
    fontWeight: 700,
    color: "var(--background-inverse)", // Neutral - contract requirement
  } as React.CSSProperties,

  dismissButton: {
    width: "100%",
    padding: "var(--spacing-3)",
    fontSize: "var(--font-size-body)",
    fontWeight: 600,
    color: "var(--background-inverse)",
    backgroundColor: "var(--background-surface)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
  } as React.CSSProperties,
};

//////////////////////////////
// 5. COMPONENT
//////////////////////////////

export default function Proof({
  athleteId,
  testId,
  data = MOCK_PROOF,
  onDismiss,
}: ProofProps) {
  const delta = calculateDelta(data.current, data.baseline);

  return (
    <article style={styles.container} aria-label="Proof of change">
      {/* Header */}
      <header style={styles.header}>
        <SectionTitle style={styles.testName}>{data.testName}</SectionTitle>
        <p style={styles.testDate}>{formatDate(data.testDate)}</p>
      </header>

      {/* Metrics Grid - NÅ / BASELINE / ENDRING */}
      <div style={styles.grid}>
        {/* Current (NÅ) */}
        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Nå</div>
          <div style={styles.metricValue}>
            {formatValue(data.current, data.unit)}
          </div>
        </div>

        {/* Baseline */}
        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Baseline</div>
          <div style={styles.metricValue}>
            {formatValue(data.baseline, data.unit)}
          </div>
        </div>

        {/* Delta (ENDRING) - Always neutral color */}
        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Endring</div>
          <div style={styles.deltaValue}>{delta}{data.unit !== "%" ? "" : ""}</div>
        </div>
      </div>

      {/* Dismiss Button - "Forstått" per contract */}
      {onDismiss && (
        <button
          type="button"
          style={styles.dismissButton}
          onClick={onDismiss}
        >
          Forstått
        </button>
      )}
    </article>
  );
}

//////////////////////////////
// 6. STRICT NOTES (CONTRACT)
//////////////////////////////

/*
 * P-01: Screen shows ONLY test result comparison
 * P-02: No effort data (hours, sessions) - NEVER
 * P-03: No causality ("because you trained X") - NEVER
 * P-04: No motivation text - NEVER
 * P-05: Delta = Current - Baseline (factual)
 * P-06: Missing data shown as em-dash (—)
 * P-07: Layout identical for positive/negative
 * P-08: Delta color = charcoal (neutral)
 * P-09: Dismiss button = "Forstått" (not "OK")
 * P-10: No session count, no training hours
 *
 * CPV-C01: Coach view MUST be pixel-identical to golfer view
 */
