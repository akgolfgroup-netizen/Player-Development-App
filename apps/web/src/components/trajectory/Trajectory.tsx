/**
 * TRAJECTORY Component - Shared between Golfer and Coach views
 *
 * Contract: IMPLEMENTATION_CONTRACT.md (T-01 to T-62)
 * Contract: COACH_ADMIN_SCREEN_CONTRACT.md (CTV-C01: identical to golfer)
 *
 * PURPOSE: Historical view without trends or predictions
 *
 * NON-NEGOTIABLE:
 * - Chronological list ONLY (no charts, no graphs)
 * - No trend lines, no predictions
 * - No "on track" labels
 * - No averages, no "best/worst"
 * - Filter chips in neutral charcoal
 * - No interpretation of data
 */

import React, { useState } from "react";
import { SectionTitle } from "../typography";

//////////////////////////////
// 1. TYPES
//////////////////////////////

type TestResult = {
  id: string;
  testName: string;
  date: string;
  value: number;
  unit: string;
  category: string;
};

type TrajectoryProps = {
  athleteId: string;
  results?: TestResult[];
};

//////////////////////////////
// 2. MOCK DATA (TEMP)
//////////////////////////////

const MOCK_RESULTS: TestResult[] = [
  { id: "1", testName: "Putteavstand 3m", date: "2024-12-18", value: 72, unit: "%", category: "putting" },
  { id: "2", testName: "Putteavstand 3m", date: "2024-11-20", value: 68, unit: "%", category: "putting" },
  { id: "3", testName: "Putteavstand 3m", date: "2024-10-15", value: 65, unit: "%", category: "putting" },
  { id: "4", testName: "Drivelengde", date: "2024-12-10", value: 245, unit: "m", category: "driving" },
  { id: "5", testName: "Drivelengde", date: "2024-11-05", value: 240, unit: "m", category: "driving" },
  { id: "6", testName: "GIR", date: "2024-12-01", value: 55, unit: "%", category: "approach" },
];

const CATEGORIES = [
  { id: "all", label: "Alle" },
  { id: "putting", label: "Putting" },
  { id: "driving", label: "Driving" },
  { id: "approach", label: "Approach" },
];

//////////////////////////////
// 3. HELPERS
//////////////////////////////

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sortByDateDesc(results: TestResult[]): TestResult[] {
  return [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

//////////////////////////////
// 4. STYLES (using CSS vars)
//////////////////////////////

const styles = {
  container: {
    fontFamily: "var(--font-family)",
    padding: "var(--spacing-4)",
  } as React.CSSProperties,

  header: {
    marginBottom: "var(--spacing-4)",
  } as React.CSSProperties,

  title: {
    fontSize: "var(--font-size-title2)",
    lineHeight: "var(--line-height-title2)",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  } as React.CSSProperties,

  filterContainer: {
    display: "flex",
    gap: "var(--spacing-2)",
    marginBottom: "var(--spacing-4)",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  // CRITICAL: Filter chips use neutral charcoal - not primary color
  filterChip: {
    padding: "var(--spacing-1) var(--spacing-3)",
    fontSize: "var(--font-size-footnote)",
    fontWeight: 500,
    color: "var(--text-secondary)",
    backgroundColor: "var(--background-surface)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-full)",
    cursor: "pointer",
  } as React.CSSProperties,

  filterChipSelected: {
    padding: "var(--spacing-1) var(--spacing-3)",
    fontSize: "var(--font-size-footnote)",
    fontWeight: 500,
    color: "var(--text-inverse)",
    backgroundColor: "var(--background-inverse)", // Neutral charcoal - contract requirement
    border: "1px solid var(--background-inverse)",
    borderRadius: "var(--radius-full)",
    cursor: "pointer",
  } as React.CSSProperties,

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  } as React.CSSProperties,

  listItem: {
    padding: "var(--spacing-3)",
    marginBottom: "var(--spacing-2)",
    backgroundColor: "var(--background-white)",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--shadow-card)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,

  itemLeft: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-1)",
  } as React.CSSProperties,

  testName: {
    fontSize: "var(--font-size-body)",
    fontWeight: 600,
    color: "var(--text-primary)",
  } as React.CSSProperties,

  testDate: {
    fontSize: "var(--font-size-footnote)",
    color: "var(--text-secondary)",
  } as React.CSSProperties,

  // Value shown in neutral color - no interpretation
  testValue: {
    fontSize: "var(--font-size-title3)",
    fontWeight: 700,
    color: "var(--text-primary)", // Neutral - no green/red
  } as React.CSSProperties,

  emptyState: {
    textAlign: "center" as const,
    padding: "var(--spacing-8)",
    color: "var(--text-secondary)",
    fontSize: "var(--font-size-body)",
  } as React.CSSProperties,
};

//////////////////////////////
// 5. COMPONENT
//////////////////////////////

export default function Trajectory({
  athleteId,
  results = MOCK_RESULTS,
}: TrajectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredResults =
    selectedCategory === "all"
      ? results
      : results.filter((r) => r.category === selectedCategory);

  const sortedResults = sortByDateDesc(filteredResults);

  return (
    <div style={styles.container}>
      {/* Header - No interpretation text */}
      <header style={styles.header}>
        <SectionTitle style={styles.title}>Historikk</SectionTitle>
      </header>

      {/* Filter Chips - Neutral charcoal for selected */}
      <div style={styles.filterContainer}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            style={
              selectedCategory === cat.id
                ? styles.filterChipSelected
                : styles.filterChip
            }
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results List - Chronological, no trends */}
      {sortedResults.length === 0 ? (
        <p style={styles.emptyState}>Ingen testresultater</p>
      ) : (
        <ul style={styles.list}>
          {sortedResults.map((result) => (
            <li key={result.id} style={styles.listItem}>
              <div style={styles.itemLeft}>
                <span style={styles.testName}>{result.testName}</span>
                <span style={styles.testDate}>{formatDate(result.date)}</span>
              </div>
              <span style={styles.testValue}>
                {result.value}
                {result.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

//////////////////////////////
// 6. STRICT NOTES (CONTRACT)
//////////////////////////////

/*
 * T-01: Screen shows chronological list ONLY
 * T-02: No trend lines - NEVER
 * T-03: No charts or graphs - NEVER
 * T-04: No predictions - NEVER
 * T-05: No "on track" labels - NEVER
 * T-06: No averages - NEVER
 * T-07: No "best/worst" - NEVER
 * T-08: Filter chips use charcoal (neutral)
 * T-09: Values shown without interpretation
 * T-10: No sparklines or mini-charts
 *
 * CTV-C01: Coach view MUST be identical to golfer view
 */
