# Sammenligning og Analytics System
> Spiller-sammenligning, Coach-verktøy og DataGolf-integrasjon
> Versjon: 1.0 | Dato: 15. desember 2025

---

## 📋 INNHOLDSFORTEGNELSE

1. [Spiller-sammenligning (Peer Comparison)](#1-spiller-sammenligning)
2. [Coach Analytics (Multi-level Comparison)](#2-coach-analytics)
3. [DataGolf Integrasjon](#3-datagolf-integrasjon)
4. [Filter-system](#4-filter-system)
5. [Dashboard og Visualisering](#5-dashboard-og-visualisering)
6. [Database Schema](#6-database-schema)

---

# 1. SPILLER-SAMMENLIGNING

## 1.1 Peer Group Definisjon

### Formel for å finne sammenlignbare spillere

```typescript
interface PeerGroup {
  player_id: UUID
  peer_criteria: {
    same_category: boolean      // Samme kategori (D, E, etc.)
    age_range?: number          // ±2 år
    gender?: "same" | "all"     // Samme kjønn eller alle
    geography?: string          // Region/nasjonalitet
    similar_handicap?: number   // ±2 strokes
  }
}

function findPeerGroup(player: Player, criteria: PeerCriteria): Player[] {
  let peers = []

  // 1. Start med samme kategori
  peers = getAllPlayers().filter(p => p.category === player.category)

  // 2. Filtrer på alder hvis spesifisert
  if (criteria.age_range) {
    const playerAge = calculateAge(player.dateOfBirth)
    peers = peers.filter(p => {
      const peerAge = calculateAge(p.dateOfBirth)
      return Math.abs(playerAge - peerAge) <= criteria.age_range
    })
  }

  // 3. Filtrer på kjønn hvis spesifisert
  if (criteria.gender === "same") {
    peers = peers.filter(p => p.gender === player.gender)
  }

  // 4. Filtrer på handicap hvis spesifisert
  if (criteria.similar_handicap && player.handicap) {
    peers = peers.filter(p =>
      p.handicap &&
      Math.abs(p.handicap - player.handicap) <= criteria.similar_handicap
    )
  }

  return peers
}
```

## 1.2 Test-sammenligning med Peers

### Formel: Percentile Ranking

```typescript
function calculatePercentileRank(
  playerValue: number,
  peerValues: number[],
  lowerIsBetter: boolean = false
): number {
  // Sorter verdier
  const sorted = [...peerValues].sort((a, b) => a - b)

  // Finn spillerens posisjon
  let rank = 0
  for (let i = 0; i < sorted.length; i++) {
    if (lowerIsBetter) {
      if (playerValue <= sorted[i]) {
        rank = i
        break
      }
    } else {
      if (playerValue <= sorted[i]) {
        rank = i
        break
      }
    }
  }

  // Beregn percentile (0-100)
  const percentile = (rank / sorted.length) * 100

  return lowerIsBetter ? 100 - percentile : percentile
}
```

### Eksempel: Driver Avstand Sammenligning

```typescript
interface TestComparison {
  player_id: UUID
  test_number: number
  player_value: number

  peer_stats: {
    peer_count: number
    mean: number
    median: number
    std_dev: number
    min: number
    max: number
    percentile_25: number
    percentile_50: number
    percentile_75: number
    percentile_90: number
  }

  player_ranking: {
    percentile: number        // 0-100, hvor 90 = bedre enn 90% av peers
    rank: number              // 1, 2, 3, etc.
    total_in_group: number
    z_score: number           // Standard deviations fra gjennomsnittet
  }

  comparison_text: string     // "Better than 85% of peers in your category"
}

function comparePlayerTopeers(
  player: Player,
  testNumber: number
): TestComparison {
  // 1. Hent peer group
  const peers = findPeerGroup(player, {
    same_category: true,
    age_range: 3,
    gender: "same"
  })

  // 2. Hent alle peer test-resultater
  const peerResults = peers.map(peer => {
    const result = getLatestTestResult(peer, testNumber)
    return result?.value
  }).filter(v => v != null)

  // 3. Hent spillerens resultat
  const playerResult = getLatestTestResult(player, testNumber)

  // 4. Beregn statistikk
  const mean = peerResults.reduce((sum, v) => sum + v, 0) / peerResults.length
  const sorted = [...peerResults].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  const std_dev = calculateStdDev(peerResults)

  // 5. Beregn percentile
  const lowerIsBetter = [3, 4, 17].includes(testNumber) // Nøyaktighet, PEI, Distraksjon
  const percentile = calculatePercentileRank(
    playerResult.value,
    peerResults,
    lowerIsBetter
  )

  // 6. Beregn z-score
  const z_score = (playerResult.value - mean) / std_dev

  // 7. Beregn rank
  const rank = lowerIsBetter
    ? sorted.filter(v => v < playerResult.value).length + 1
    : sorted.filter(v => v > playerResult.value).length + 1

  // 8. Generer comparison text
  let comparisonText = ""
  if (percentile >= 90) comparisonText = "Excellent - Top 10% in your category"
  else if (percentile >= 75) comparisonText = "Very good - Top 25%"
  else if (percentile >= 50) comparisonText = "Above average - Top 50%"
  else if (percentile >= 25) comparisonText = "Below average"
  else comparisonText = "Needs improvement - Bottom 25%"

  return {
    player_id: player.id,
    test_number: testNumber,
    player_value: playerResult.value,

    peer_stats: {
      peer_count: peerResults.length,
      mean: round(mean, 2),
      median: round(median, 2),
      std_dev: round(std_dev, 2),
      min: Math.min(...peerResults),
      max: Math.max(...peerResults),
      percentile_25: sorted[Math.floor(sorted.length * 0.25)],
      percentile_50: median,
      percentile_75: sorted[Math.floor(sorted.length * 0.75)],
      percentile_90: sorted[Math.floor(sorted.length * 0.90)]
    },

    player_ranking: {
      percentile: round(percentile, 1),
      rank,
      total_in_group: peerResults.length,
      z_score: round(z_score, 2)
    },

    comparison_text: comparisonText
  }
}
```

## 1.3 Benchmark Session Peer Comparison

### Sammenlign hele benchmark-session

```typescript
interface BenchmarkPeerComparison {
  player_id: UUID
  session_id: UUID

  overall_performance: {
    player_pass_rate: number      // % av tester bestått
    peer_avg_pass_rate: number
    player_percentile: number
  }

  test_comparisons: TestComparison[]  // Alle tester i session

  strengths: string[]     // Tester hvor spiller er top 25%
  weaknesses: string[]    // Tester hvor spiller er bottom 25%

  recommendation: string
}

function compareBenchmarkToPeers(
  player: Player,
  sessionId: UUID
): BenchmarkPeerComparison {
  const session = getBenchmarkSession(sessionId)
  const peers = findPeerGroup(player, {
    same_category: true,
    gender: "same"
  })

  // 1. Beregn spillerens pass rate
  const playerTests = session.testsCompleted
  const playerPassRate = (playerTests.filter(t => t.passed).length / playerTests.length) * 100

  // 2. Beregn peer gjennomsnittlig pass rate
  const peerPassRates = peers.map(peer => {
    const peerSession = getLatestBenchmarkSession(peer)
    if (!peerSession) return null

    return (peerSession.testsCompleted.filter(t => t.passed).length /
            peerSession.testsCompleted.length) * 100
  }).filter(r => r != null)

  const peerAvgPassRate = peerPassRates.reduce((sum, r) => sum + r, 0) / peerPassRates.length

  // 3. Sammenlign hver test
  const testComparisons = playerTests.map(test =>
    comparePlayerToPeers(player, test.test_number)
  )

  // 4. Identifiser styrker og svakheter
  const strengths = testComparisons
    .filter(tc => tc.player_ranking.percentile >= 75)
    .map(tc => getTestName(tc.test_number))

  const weaknesses = testComparisons
    .filter(tc => tc.player_ranking.percentile <= 25)
    .map(tc => getTestName(tc.test_number))

  // 5. Generer anbefaling
  let recommendation = ""
  if (strengths.length >= 5) {
    recommendation = "Strong overall performance. Focus on weaknesses: " + weaknesses.join(", ")
  } else if (weaknesses.length >= 5) {
    recommendation = "Multiple areas need improvement. Prioritize: " + weaknesses.slice(0, 3).join(", ")
  } else {
    recommendation = "Balanced performance. Continue current training approach."
  }

  return {
    player_id: player.id,
    session_id: sessionId,
    overall_performance: {
      player_pass_rate: round(playerPassRate, 1),
      peer_avg_pass_rate: round(peerAvgPassRate, 1),
      player_percentile: calculatePercentileRank(playerPassRate, peerPassRates, false)
    },
    test_comparisons: testComparisons,
    strengths,
    weaknesses,
    recommendation
  }
}
```

---

# 2. COACH ANALYTICS

## 2.1 Multi-Level Comparison

### Sammenlign spiller mot ALLE kategorier

```typescript
interface MultiLevelComparison {
  player_id: UUID
  test_number: number
  player_value: number
  player_category: string

  by_category: {
    [category: string]: {
      category: string
      requirement: number
      peer_count: number
      peer_mean: number
      peer_median: number
      player_would_rank: number      // Hvor ville spiller rangert i denne kategorien?
      player_percentile: number
      meets_requirement: boolean
    }
  }

  progression_outlook: {
    current_category: string
    ready_for_next: boolean
    categories_where_competitive: string[]  // Kategorier hvor spiller er top 50%
    realistic_target_category: string
  }
}

function comparePlayerToAllLevels(
  player: Player,
  testNumber: number
): MultiLevelComparison {
  const categories = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
  const playerResult = getLatestTestResult(player, testNumber)

  const byCategory = {}

  categories.forEach(category => {
    // 1. Hent alle spillere i denne kategorien
    const categoryPlayers = getAllPlayers().filter(p => p.category === category)

    // 2. Hent deres resultater
    const categoryResults = categoryPlayers.map(p => {
      const result = getLatestTestResult(p, testNumber)
      return result?.value
    }).filter(v => v != null)

    if (categoryResults.length === 0) return

    // 3. Beregn statistikk
    const mean = categoryResults.reduce((sum, v) => sum + v, 0) / categoryResults.length
    const sorted = [...categoryResults].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]

    // 4. Beregn hvor spilleren ville rangert
    const lowerIsBetter = [3, 4, 17].includes(testNumber)
    const rank = lowerIsBetter
      ? sorted.filter(v => v < playerResult.value).length + 1
      : sorted.filter(v => v > playerResult.value).length + 1

    const percentile = calculatePercentileRank(
      playerResult.value,
      categoryResults,
      lowerIsBetter
    )

    // 5. Sjekk om oppfyller krav
    const requirement = getRequirement(category, player.gender, testNumber)
    const meetsRequirement = lowerIsBetter
      ? playerResult.value <= requirement
      : playerResult.value >= requirement

    byCategory[category] = {
      category,
      requirement,
      peer_count: categoryResults.length,
      peer_mean: round(mean, 2),
      peer_median: round(median, 2),
      player_would_rank: rank,
      player_percentile: round(percentile, 1),
      meets_requirement: meetsRequirement
    }
  })

  // 6. Analyser progresjonsmuligheter
  const categoriesWhereCompetitive = Object.entries(byCategory)
    .filter(([cat, stats]) => stats.player_percentile >= 50)
    .map(([cat, stats]) => cat)

  const highestCompetitiveCategory = categoriesWhereCompetitive[0] || player.category

  return {
    player_id: player.id,
    test_number: testNumber,
    player_value: playerResult.value,
    player_category: player.category,
    by_category: byCategory,
    progression_outlook: {
      current_category: player.category,
      ready_for_next: byCategory[getNextCategory(player.category)]?.meets_requirement || false,
      categories_where_competitive: categoriesWhereCompetitive,
      realistic_target_category: highestCompetitiveCategory
    }
  }
}
```

## 2.2 Coach Dashboard - Gruppe-analyse

### Analyser hele spillergruppen

```typescript
interface CoachGroupAnalysis {
  coach_id: UUID
  analysis_date: Date

  player_count: number
  players_by_category: {
    [category: string]: number
  }

  group_performance: {
    avg_benchmark_pass_rate: number
    avg_training_hours_per_week: number
    avg_improvement_last_3_months: number
  }

  top_performers: Player[]      // Top 10%
  needs_attention: Player[]     // Bottom 10% eller mange failing tests

  test_analysis: {
    [test_number: number]: {
      test_name: string
      group_avg: number
      group_pass_rate: number
      best_performer: Player
      worst_performer: Player
    }
  }

  category_transition_candidates: {
    player: Player
    from_category: string
    to_category: string
    readiness_score: number
    missing_criteria: string[]
  }[]
}

function analyzeCoachGroup(coachId: UUID): CoachGroupAnalysis {
  // 1. Hent alle spillere for coach
  const players = getAllPlayers().filter(p => p.coachId === coachId)

  // 2. Grupperstatistikk
  const playersByCategory = {}
  players.forEach(p => {
    playersByCategory[p.category] = (playersByCategory[p.category] || 0) + 1
  })

  // 3. Gjennomsnittlig prestasjon
  const benchmarkSessions = players.map(p => getLatestBenchmarkSession(p))
  const avgPassRate = benchmarkSessions.reduce((sum, s) =>
    sum + (s.passRate || 0), 0
  ) / benchmarkSessions.length

  // 4. Identifiser top performers og needs attention
  const playerScores = players.map(p => {
    const session = getLatestBenchmarkSession(p)
    return {
      player: p,
      score: session?.passRate || 0
    }
  }).sort((a, b) => b.score - a.score)

  const topPerformers = playerScores.slice(0, Math.ceil(players.length * 0.1))
    .map(ps => ps.player)

  const needsAttention = playerScores.slice(-Math.ceil(players.length * 0.1))
    .map(ps => ps.player)

  // 5. Test-analyse per test
  const testAnalysis = {}
  for (let testNum = 1; testNum <= 20; testNum++) {
    const allResults = players.map(p => {
      const result = getLatestTestResult(p, testNum)
      return { player: p, value: result?.value, passed: result?.passed }
    }).filter(r => r.value != null)

    if (allResults.length === 0) continue

    const groupAvg = allResults.reduce((sum, r) => sum + r.value, 0) / allResults.length
    const passRate = (allResults.filter(r => r.passed).length / allResults.length) * 100

    const sortedResults = [...allResults].sort((a, b) => b.value - a.value)

    testAnalysis[testNum] = {
      test_name: getTestName(testNum),
      group_avg: round(groupAvg, 2),
      group_pass_rate: round(passRate, 1),
      best_performer: sortedResults[0].player,
      worst_performer: sortedResults[sortedResults.length - 1].player
    }
  }

  // 6. Kategori-overgang kandidater
  const transitionCandidates = players.map(p => {
    const readiness = calculateCategoryReadiness(p, getNextCategory(p.category))
    if (readiness.readiness_score >= 75) {
      return {
        player: p,
        from_category: p.category,
        to_category: getNextCategory(p.category),
        readiness_score: readiness.readiness_score,
        missing_criteria: readiness.criteria.filter(c => !c.met).map(c => c.name)
      }
    }
    return null
  }).filter(c => c != null)

  return {
    coach_id: coachId,
    analysis_date: new Date(),
    player_count: players.length,
    players_by_category: playersByCategory,
    group_performance: {
      avg_benchmark_pass_rate: round(avgPassRate, 1),
      avg_training_hours_per_week: calculateAvgTrainingHours(players),
      avg_improvement_last_3_months: calculateAvgImprovement(players)
    },
    top_performers: topPerformers,
    needs_attention: needsAttention,
    test_analysis: testAnalysis,
    category_transition_candidates: transitionCandidates
  }
}
```

## 2.3 Coach Filter System

### Avansert filtrering av spillere

```typescript
interface CoachFilter {
  // Basis-filtre
  category?: string[]           // ["D", "E"]
  gender?: "M" | "K" | "all"
  age_range?: { min: number, max: number }

  // Prestasjon-filtre
  handicap_range?: { min: number, max: number }
  avg_score_range?: { min: number, max: number }
  pass_rate_range?: { min: number, max: number }  // % av benchmark-tester bestått

  // Test-spesifikke filtre
  test_filters?: {
    test_number: number
    comparison: ">=" | "<=" | "==" | "between"
    value: number | { min: number, max: number }
    passed?: boolean
  }[]

  // Progresjon-filtre
  improvement_last_3_months?: { min: number, max: number }  // Strokes forbedring
  ready_for_progression?: boolean

  // Aktivitet-filtre
  last_benchmark_date?: { from: Date, to: Date }
  training_hours_per_week?: { min: number, max: number }

  // Breaking points-filtre
  active_breaking_points?: { min: number, max: number }
  breaking_point_category?: "Teknikk" | "Taktikk" | "Fysikk" | "Psyke" | "Utstyr"

  // Sortering
  sort_by?: "name" | "category" | "pass_rate" | "improvement" | "last_test_date"
  sort_direction?: "asc" | "desc"
}

function filterPlayers(coachId: UUID, filters: CoachFilter): Player[] {
  let players = getAllPlayers().filter(p => p.coachId === coachId)

  // Basis-filtre
  if (filters.category) {
    players = players.filter(p => filters.category.includes(p.category))
  }

  if (filters.gender && filters.gender !== "all") {
    players = players.filter(p => p.gender === filters.gender)
  }

  if (filters.age_range) {
    players = players.filter(p => {
      const age = calculateAge(p.dateOfBirth)
      return age >= filters.age_range.min && age <= filters.age_range.max
    })
  }

  // Prestasjon-filtre
  if (filters.pass_rate_range) {
    players = players.filter(p => {
      const session = getLatestBenchmarkSession(p)
      if (!session) return false
      return session.passRate >= filters.pass_rate_range.min &&
             session.passRate <= filters.pass_rate_range.max
    })
  }

  // Test-spesifikke filtre
  if (filters.test_filters) {
    filters.test_filters.forEach(tf => {
      players = players.filter(p => {
        const result = getLatestTestResult(p, tf.test_number)
        if (!result) return false

        if (tf.passed !== undefined && result.passed !== tf.passed) return false

        switch (tf.comparison) {
          case ">=":
            return result.value >= tf.value
          case "<=":
            return result.value <= tf.value
          case "==":
            return result.value === tf.value
          case "between":
            return result.value >= tf.value.min && result.value <= tf.value.max
          default:
            return true
        }
      })
    })
  }

  // Progresjon-filtre
  if (filters.ready_for_progression !== undefined) {
    players = players.filter(p => {
      const readiness = calculateCategoryReadiness(p, getNextCategory(p.category))
      return (readiness.readiness_score >= 90) === filters.ready_for_progression
    })
  }

  // Sortering
  if (filters.sort_by) {
    players = players.sort((a, b) => {
      let aValue, bValue

      switch (filters.sort_by) {
        case "name":
          aValue = a.firstName + " " + a.lastName
          bValue = b.firstName + " " + b.lastName
          break
        case "pass_rate":
          aValue = getLatestBenchmarkSession(a)?.passRate || 0
          bValue = getLatestBenchmarkSession(b)?.passRate || 0
          break
        // ... andre sorteringer
      }

      if (filters.sort_direction === "desc") {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })
  }

  return players
}
```

---

# 3. DATAGOLF INTEGRASJON

## 3.1 DataGolf API Oversikt

### Tilgjengelige data fra DataGolf

```typescript
interface DataGolfAPI {
  // Player Stats
  player_stats: {
    player_id: string
    player_name: string

    // Strokes Gained
    sg_total: number
    sg_off_tee: number
    sg_approach: number
    sg_around_green: number
    sg_putting: number

    // Traditional stats
    driving_distance: number
    driving_accuracy: number
    gir_percent: number          // Greens in regulation
    scrambling_percent: number
    putts_per_round: number

    // Advanced
    proximity_to_hole: {
      "50-75": number,
      "75-100": number,
      "100-125": number,
      "125-150": number,
      "150-175": number,
      "175-200": number,
      "200+": number
    }
  }

  // Tour averages
  tour_averages: {
    tour: "pga" | "european" | "korn_ferry" | "challenge"
    stats: PlayerStats
  }

  // Field strength
  field_strength: {
    tournament_id: string
    avg_world_rank: number
    datagolf_rating: number
  }
}
```

## 3.2 IUP til DataGolf Mapping

### Map IUP tester til DataGolf metrics

```typescript
interface IUPToDataGolfMapping {
  iup_test: number
  iup_test_name: string
  datagolf_metric: string
  conversion_formula: (iup_value: number) => number
  correlation_strength: number  // 0-1, hvor sterk korrelasjon
}

const IUP_DATAGOLF_MAPPINGS: IUPToDataGolfMapping[] = [
  {
    iup_test: 1,
    iup_test_name: "Driver Avstand",
    datagolf_metric: "driving_distance",
    conversion_formula: (meters) => meters * 1.094,  // meter til yards
    correlation_strength: 0.95
  },
  {
    iup_test: 4,
    iup_test_name: "Wedge PEI",
    datagolf_metric: "proximity_50_125",
    conversion_formula: (pei) => {
      // PEI til feet from hole
      // Lower PEI = better = closer proximity
      return pei * 30  // Rough conversion
    },
    correlation_strength: 0.85
  },
  {
    iup_test: 5,
    iup_test_name: "Lag-kontroll Putting",
    datagolf_metric: "sg_putting",
    conversion_formula: (points) => {
      // 9 points = ~+0.5 SG
      // 0 points = ~-1.5 SG
      return (points / 9) * 2.0 - 1.5
    },
    correlation_strength: 0.75
  }
  // ... flere mappings
]
```

## 3.3 Benchmark mot Tour-snitt

### Sammenlign IUP-spiller med PGA/DP World Tour

```typescript
interface TourBenchmark {
  player_id: UUID
  comparison_tour: "pga" | "european" | "korn_ferry"

  comparisons: {
    metric: string
    player_value: number
    tour_average: number
    tour_top_10: number
    tour_median: number

    player_vs_tour_avg: number      // Differanse
    player_percentile: number        // Estimert percentile på tour
    player_sg_equivalent: number     // Strokes gained equivalent
  }[]

  overall_assessment: {
    total_sg_vs_tour: number
    competitive_on_tour: boolean
    estimated_tour_rank: number
    areas_above_tour_avg: string[]
    areas_below_tour_avg: string[]
  }
}

function benchmarkAgainstTour(
  player: Player,
  tour: "pga" | "european" | "korn_ferry"
): TourBenchmark {
  // 1. Hent tour averages fra DataGolf
  const tourAverages = await fetchDataGolfTourAverages(tour)

  // 2. Hent spillerens tester
  const playerTests = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(testNum =>
    getLatestTestResult(player, testNum)
  )

  // 3. Sammenlign hver metrikk
  const comparisons = IUP_DATAGOLF_MAPPINGS.map(mapping => {
    const playerTest = playerTests.find(t => t.testId === mapping.iup_test)
    if (!playerTest) return null

    const playerValueConverted = mapping.conversion_formula(playerTest.value)
    const tourAvg = tourAverages[mapping.datagolf_metric]

    // Estimer player percentile (krever historiske data)
    const percentile = estimatePercentile(playerValueConverted, tour, mapping.datagolf_metric)

    // Konverter til strokes gained
    const sgEquivalent = convertToStrokesGained(
      playerValueConverted,
      tourAvg,
      mapping.datagolf_metric
    )

    return {
      metric: mapping.datagolf_metric,
      player_value: round(playerValueConverted, 2),
      tour_average: round(tourAvg, 2),
      tour_top_10: round(tourAverages[mapping.datagolf_metric + "_top10"], 2),
      tour_median: round(tourAverages[mapping.datagolf_metric + "_median"], 2),
      player_vs_tour_avg: round(playerValueConverted - tourAvg, 2),
      player_percentile: percentile,
      player_sg_equivalent: round(sgEquivalent, 3)
    }
  }).filter(c => c != null)

  // 4. Beregn total SG
  const totalSG = comparisons.reduce((sum, c) => sum + c.player_sg_equivalent, 0)

  // 5. Vurder konkurransedyktighet
  const competitiveOnTour = totalSG >= -2.0  // Innenfor 2 slag per runde

  return {
    player_id: player.id,
    comparison_tour: tour,
    comparisons,
    overall_assessment: {
      total_sg_vs_tour: round(totalSG, 2),
      competitive_on_tour: competitiveOnTour,
      estimated_tour_rank: estimateTourRank(totalSG, tour),
      areas_above_tour_avg: comparisons.filter(c => c.player_vs_tour_avg > 0).map(c => c.metric),
      areas_below_tour_avg: comparisons.filter(c => c.player_vs_tour_avg < 0).map(c => c.metric)
    }
  }
}
```

## 3.4 DataGolf Live Data Integration

### Real-time tournament data

```typescript
interface DataGolfLiveIntegration {
  // Fetch current tournament data
  async fetchCurrentTournaments(): Promise<Tournament[]>

  // Fetch player performance in tournament
  async fetchPlayerTournamentStats(
    playerId: string,
    tournamentId: string
  ): Promise<TournamentStats>

  // Fetch field strength
  async fetchFieldStrength(tournamentId: string): Promise<FieldStrength>

  // Historical comparison
  async fetchHistoricalStats(
    playerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<HistoricalStats>
}

// Eksempel: Sammenlign IUP-spiller med turnering
async function compareToTournamentField(
  player: Player,
  tournamentId: string
): Promise<TournamentComparison> {
  // 1. Hent turneringsdata
  const tournament = await dataGolf.fetchTournament(tournamentId)
  const field = await dataGolf.fetchFieldStrength(tournamentId)

  // 2. Beregn spillerens estimerte score
  const playerBenchmark = benchmarkAgainstTour(player, tournament.tour)
  const estimatedScore = field.avg_score - playerBenchmark.overall_assessment.total_sg_vs_tour

  // 3. Sammenlign
  return {
    player_id: player.id,
    tournament_id: tournamentId,
    tournament_name: tournament.name,
    field_strength: field.datagolf_rating,
    player_estimated_score: round(estimatedScore, 1),
    field_avg_score: round(field.avg_score, 1),
    player_vs_field: round(estimatedScore - field.avg_score, 1),
    competitive: Math.abs(estimatedScore - field.avg_score) <= 3.0
  }
}
```

---

# 4. FILTER-SYSTEM

## 4.1 Advanced Query Builder

### Komplett filter-system

```typescript
interface AdvancedFilter {
  // Logiske operatorer
  operator: "AND" | "OR"

  // Filter-grupper
  filters: FilterGroup[]
}

interface FilterGroup {
  field: string              // "category", "test_1_value", "handicap", etc.
  comparison: Comparison     // "equals", "greater_than", "between", "in_list"
  value: any

  // Nested filters
  sub_filters?: AdvancedFilter
}

type Comparison =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "greater_or_equal"
  | "less_than"
  | "less_or_equal"
  | "between"
  | "in_list"
  | "not_in_list"
  | "contains"
  | "starts_with"
  | "ends_with"

// Eksempel: Finn spillere som:
// - Er kategori D ELLER E
// - OG har Driver > 250m
// - OG har bestått <70% av siste benchmark
const advancedFilter: AdvancedFilter = {
  operator: "AND",
  filters: [
    {
      field: "category",
      comparison: "in_list",
      value: ["D", "E"]
    },
    {
      field: "test_1_value",
      comparison: "greater_than",
      value: 250
    },
    {
      field: "latest_benchmark_pass_rate",
      comparison: "less_than",
      value: 70
    }
  ]
}

function executeAdvancedFilter(
  players: Player[],
  filter: AdvancedFilter
): Player[] {
  return players.filter(player => {
    return evaluateFilterGroup(player, filter)
  })
}

function evaluateFilterGroup(
  player: Player,
  filter: AdvancedFilter
): boolean {
  const results = filter.filters.map(f => {
    // Hent feltverdi
    const fieldValue = getFieldValue(player, f.field)

    // Sammenlign
    switch (f.comparison) {
      case "equals":
        return fieldValue === f.value
      case "greater_than":
        return fieldValue > f.value
      case "between":
        return fieldValue >= f.value.min && fieldValue <= f.value.max
      case "in_list":
        return f.value.includes(fieldValue)
      // ... andre comparisons
    }

    // Nested filters
    if (f.sub_filters) {
      return evaluateFilterGroup(player, f.sub_filters)
    }

    return false
  })

  // Kombiner med operator
  if (filter.operator === "AND") {
    return results.every(r => r)
  } else {
    return results.some(r => r)
  }
}
```

## 4.2 Saved Filters / Presets

### Lagrede filtere for rask tilgang

```typescript
interface SavedFilter {
  id: UUID
  coach_id: UUID
  name: string
  description: string
  filter: AdvancedFilter
  created_at: Date
  last_used: Date
  use_count: number
}

// Preset-filtere
const PRESET_FILTERS: SavedFilter[] = [
  {
    name: "Ready for Progression",
    description: "Players ready to move to next category",
    filter: {
      operator: "AND",
      filters: [
        { field: "category_readiness_score", comparison: "greater_or_equal", value: 90 }
      ]
    }
  },
  {
    name: "Needs Attention",
    description: "Players with low pass rates or declining performance",
    filter: {
      operator: "OR",
      filters: [
        { field: "latest_benchmark_pass_rate", comparison: "less_than", value: 50 },
        { field: "improvement_last_3_months", comparison: "less_than", value: 0 }
      ]
    }
  },
  {
    name: "Physical Weaknesses",
    description: "Players failing 2+ physical tests",
    filter: {
      operator: "AND",
      filters: [
        { field: "test_12_passed", comparison: "equals", value: false },
        { field: "test_13_passed", comparison: "equals", value: false }
      ]
    }
  },
  {
    name: "High Performers",
    description: "Top 25% in benchmark pass rate",
    filter: {
      operator: "AND",
      filters: [
        { field: "latest_benchmark_pass_rate", comparison: "greater_or_equal", value: 75 }
      ]
    }
  }
]
```

## 4.3 Export og Rapportering

### Eksporter filtrerte data

```typescript
interface ExportOptions {
  format: "csv" | "excel" | "pdf" | "json"
  include_fields: string[]
  include_charts?: boolean
  include_recommendations?: boolean
}

async function exportFilteredPlayers(
  players: Player[],
  options: ExportOptions
): Promise<File> {
  const data = players.map(player => {
    const row = {}

    options.include_fields.forEach(field => {
      row[field] = getFieldValue(player, field)
    })

    return row
  })

  switch (options.format) {
    case "csv":
      return generateCSV(data)
    case "excel":
      return generateExcel(data, options.include_charts)
    case "pdf":
      return generatePDFReport(players, options)
    case "json":
      return JSON.stringify(data, null, 2)
  }
}
```

---

# 5. DASHBOARD OG VISUALISERING

## 5.1 Spiller Dashboard

### Hovedvisning for spiller

```typescript
interface PlayerDashboard {
  player: Player

  // Oversikt
  overview: {
    current_category: string
    avg_score_last_20_rounds: number
    handicap: number
    days_since_last_test: number
  }

  // Peer comparison
  peer_comparison: {
    percentile_in_category: number
    rank_in_category: number
    total_in_category: number
    comparison_text: string
  }

  // Test performance
  latest_benchmark: {
    date: Date
    pass_rate: number
    tests_passed: number
    tests_failed: number
    comparison_to_previous: number  // % endring
  }

  // Strengths & Weaknesses
  top_3_strengths: {
    test_name: string
    percentile: number
  }[]

  top_3_weaknesses: {
    test_name: string
    percentile: number
    gap_to_requirement: number
  }[]

  // Progression
  category_readiness: {
    score: number
    ready: boolean
    missing_criteria: string[]
  }

  // Charts data
  charts: {
    test_progression: {
      test_number: number
      data_points: { date: Date, value: number }[]
    }[]

    peer_comparison_radar: {
      test_name: string
      player_value: number
      peer_avg: number
      category_requirement: number
    }[]
  }
}
```

## 5.2 Coach Dashboard

### Hovedvisning for coach

```typescript
interface CoachDashboard {
  coach: Coach

  // Oversikt
  overview: {
    total_players: number
    players_by_category: { [category: string]: number }
    avg_group_pass_rate: number
    players_ready_for_progression: number
  }

  // Aktivitet
  recent_activity: {
    benchmark_sessions_this_week: number
    training_sessions_this_week: number
    tests_completed_this_week: number
  }

  // Spillere som trenger oppmerksomhet
  needs_attention: {
    player: Player
    reason: string
    priority: "high" | "medium" | "low"
  }[]

  // Top performers
  top_performers: {
    player: Player
    achievement: string
    date: Date
  }[]

  // Gruppe-analyse
  group_performance: {
    test_number: number
    test_name: string
    group_avg: number
    group_pass_rate: number
    trend: "improving" | "stable" | "declining"
  }[]

  // Charts
  charts: {
    category_distribution: { category: string, count: number }[]

    pass_rate_trend: {
      week_number: number
      avg_pass_rate: number
    }[]

    test_comparison_heatmap: {
      player: string
      tests: { [test_number: number]: "pass" | "fail" | "not_tested" }
    }[]
  }
}
```

## 5.3 Sammenligning Visualiseringer

### Radar Chart - Peer Comparison

```typescript
interface RadarChartData {
  categories: string[]  // Test names
  series: {
    name: string       // "You", "Category Average", "Requirement"
    data: number[]     // Values for each test
  }[]
}

function generatePeerComparisonRadar(
  player: Player,
  testNumbers: number[]
): RadarChartData {
  const categories = testNumbers.map(n => getTestName(n))
  const playerData = []
  const peerAvgData = []
  const requirementData = []

  testNumbers.forEach(testNum => {
    const comparison = comparePlayerToPeers(player, testNum)

    playerData.push(comparison.player_value)
    peerAvgData.push(comparison.peer_stats.mean)
    requirementData.push(getRequirement(player.category, player.gender, testNum))
  })

  return {
    categories,
    series: [
      { name: "You", data: playerData },
      { name: "Category Average", data: peerAvgData },
      { name: "Requirement", data: requirementData }
    ]
  }
}
```

### Heatmap - Multi-level Comparison

```typescript
interface HeatmapData {
  x_labels: string[]    // Test names
  y_labels: string[]    // Categories
  data: number[][]      // Values
  color_scale: {
    min: number
    max: number
    colors: string[]
  }
}

function generateMultiLevelHeatmap(
  player: Player,
  testNumbers: number[]
): HeatmapData {
  const categories = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const testNames = testNumbers.map(n => getTestName(n))

  const data = categories.map(category => {
    return testNumbers.map(testNum => {
      const comparison = comparePlayerToAllLevels(player, testNum)
      return comparison.by_category[category]?.player_percentile || 0
    })
  })

  return {
    x_labels: testNames,
    y_labels: categories,
    data,
    color_scale: {
      min: 0,
      max: 100,
      colors: ["#ff0000", "#ffff00", "#00ff00"]  // Red -> Yellow -> Green
    }
  }
}
```

---

# 6. DATABASE SCHEMA

## 6.1 Peer Comparison Tables

```typescript
// Lagre pre-beregnede peer comparisons for performance
model PeerComparison {
  id                UUID      @id @default(uuid())
  playerId          UUID
  testNumber        Int
  calculatedAt      DateTime  @default(now())

  // Peer group info
  peerCount         Int
  peerMean          Decimal
  peerMedian        Decimal
  peerStdDev        Decimal

  // Player ranking
  playerValue       Decimal
  playerPercentile  Decimal
  playerRank        Int
  playerZScore      Decimal

  // Relations
  player            Player    @relation(fields: [playerId], references: [id])

  @@index([playerId, testNumber])
  @@index([calculatedAt])
  @@map("peer_comparisons")
}
```

## 6.2 DataGolf Integration Tables

```typescript
model DataGolfPlayer {
  id                UUID      @id @default(uuid())
  dataGolfId        String    @unique
  playerName        String
  lastSynced        DateTime

  // Stats
  sgTotal           Decimal?
  sgOffTee          Decimal?
  sgApproach        Decimal?
  sgAroundGreen     Decimal?
  sgPutting         Decimal?

  drivingDistance   Decimal?
  drivingAccuracy   Decimal?
  girPercent        Decimal?
  scramblingPercent Decimal?

  // Link to IUP player (optional)
  iupPlayerId       UUID?
  iupPlayer         Player?   @relation(fields: [iupPlayerId], references: [id])

  @@map("datagolf_players")
}

model DataGolfTourAverage {
  id        UUID      @id @default(uuid())
  tour      String    // "pga", "european", etc.
  season    Int
  stats     Json      // All tour averages
  updatedAt DateTime  @updatedAt

  @@unique([tour, season])
  @@map("datagolf_tour_averages")
}
```

## 6.3 Saved Filters Tables

```typescript
model SavedFilter {
  id          UUID      @id @default(uuid())
  coachId     UUID
  name        String
  description String?
  filter      Json      // AdvancedFilter structure

  createdAt   DateTime  @default(now())
  lastUsed    DateTime?
  useCount    Int       @default(0)

  // Relations
  coach       Coach     @relation(fields: [coachId], references: [id])

  @@index([coachId])
  @@map("saved_filters")
}
```

## 6.4 Analytics Cache Tables

```typescript
model AnalyticsCache {
  id              UUID      @id @default(uuid())
  cacheKey        String    @unique
  cacheType       String    // "peer_comparison", "multi_level", "coach_group"
  data            Json

  calculatedAt    DateTime  @default(now())
  expiresAt       DateTime

  @@index([cacheKey])
  @@index([expiresAt])
  @@map("analytics_cache")
}
```

---

## 📊 OPPSUMMERING

### Hovedfunksjoner:

**1. Spiller-sammenligning:**
- ✅ Peer group definisjon (kategori, alder, kjønn)
- ✅ Percentile ranking per test
- ✅ Benchmark session comparison
- ✅ Strengths/weaknesses identifikasjon

**2. Coach Analytics:**
- ✅ Multi-level comparison (alle kategorier)
- ✅ Gruppe-analyse (hele coachens spillergruppe)
- ✅ Avansert filter-system
- ✅ Kategori-overgang kandidater
- ✅ Eksport og rapportering

**3. DataGolf Integrasjon:**
- ✅ IUP til DataGolf mapping
- ✅ Tour benchmark (PGA/DP World Tour)
- ✅ Live tournament data
- ✅ Strokes gained conversion

**4. Visualiseringer:**
- ✅ Radar charts (peer comparison)
- ✅ Heatmaps (multi-level)
- ✅ Trend charts (progresjon)
- ✅ Distribution charts

**5. Database:**
- ✅ Peer comparison cache
- ✅ DataGolf integration tables
- ✅ Saved filters
- ✅ Analytics cache

---

**Dokumentversjon**: 1.0
**Status**: ✅ Komplett for implementering
**Sist oppdatert**: 15. desember 2025
