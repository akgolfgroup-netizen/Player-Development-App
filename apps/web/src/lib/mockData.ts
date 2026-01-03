/**
 * ============================================================
 * MOCK DATA - AK Golf Academy
 * ============================================================
 *
 * Mock data for development and testing.
 * Used by hub pages and dashboard components.
 *
 * ============================================================
 */

// =============================================================================
// USER DATA
// =============================================================================

export const mockPlayer = {
  id: 'player-001',
  firstName: 'Anders',
  lastName: 'Kristiansen',
  email: 'anders@example.com',
  role: 'player',
  avatar: null,
  kategori: 3,
  klubb: 'Holtsmark Golf',
  hcp: 12.4,
  registeredAt: '2024-01-15',
};

export const mockCoaches = [
  {
    id: 'coach-001',
    firstName: 'Erik',
    lastName: 'Hansen',
    role: 'head_coach',
    specialty: 'Long game',
    avatar: null,
  },
  {
    id: 'coach-002',
    firstName: 'Maria',
    lastName: 'Olsen',
    role: 'coach',
    specialty: 'Short game',
    avatar: null,
  },
];

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export const mockDashboardStats = {
  treningsdager: 12,
  kommendeTester: 2,
  ukesMal: 75,
  badges: 8,
};

export const mockTreningStats = {
  okterDenneMnd: 15,
  timerTrent: 24,
  ovelserFullfort: 87,
  testerGjennomfort: 3,
};

export const mockUtviklingStats = {
  kategoriFremgang: 68,
  testScore: 82,
  badgesOpptjent: 12,
  ukentligForbedring: 5,
};

export const mockPlanStats = {
  planlagteOkter: 8,
  kommendeTurneringer: 3,
  aktiveMaal: 5,
  fullforteMaal: 12,
};

export const mockMerStats = {
  ulesteMeldinger: 3,
  nyFeedback: 2,
  ressurser: 45,
};

// =============================================================================
// RECENT ACTIVITIES
// =============================================================================

export const mockRecentActivities = [
  {
    id: 'activity-001',
    title: 'Treningsøkt: Short game fokus',
    type: 'trening',
    date: 'I dag, 14:30',
    icon: 'Dumbbell',
    color: '#059669',
  },
  {
    id: 'activity-002',
    title: 'Test fullført: Putting presisjon',
    type: 'test',
    date: 'I går, 10:00',
    icon: 'Target',
    color: '#0284C7',
  },
  {
    id: 'activity-003',
    title: 'Badge opptjent: Konsistent trening',
    type: 'badge',
    date: '2 dager siden',
    icon: 'Award',
    color: '#B8860B',
  },
  {
    id: 'activity-004',
    title: 'Mål fullført: 10 treningsøkter',
    type: 'maal',
    date: '3 dager siden',
    icon: 'CheckCircle',
    color: '#059669',
  },
];

// =============================================================================
// TRAINING SESSIONS
// =============================================================================

export const mockSessions = [
  {
    id: 'session-001',
    title: 'Short game fokus',
    date: '2025-01-03',
    duration: 90,
    fokusomrade: 'Short game',
    status: 'completed',
    rating: 4,
    notes: 'God økt med fokus på chipping',
  },
  {
    id: 'session-002',
    title: 'Driver og fairway',
    date: '2025-01-02',
    duration: 60,
    fokusomrade: 'Long game',
    status: 'completed',
    rating: 3,
    notes: 'Utfordringer med slice',
  },
  {
    id: 'session-003',
    title: 'Putting drill',
    date: '2025-01-01',
    duration: 45,
    fokusomrade: 'Putting',
    status: 'completed',
    rating: 5,
    notes: 'Beste putting-økt på lenge!',
  },
];

export const mockUpcomingSessions = [
  {
    id: 'upcoming-001',
    title: 'Treneravtale med Erik',
    date: '2025-01-05',
    time: '10:00',
    duration: 60,
    coach: 'Erik Hansen',
    location: 'Holtsmark Golf',
  },
  {
    id: 'upcoming-002',
    title: 'Gruppetrening',
    date: '2025-01-07',
    time: '14:00',
    duration: 120,
    coach: 'Maria Olsen',
    location: 'Innendørs range',
  },
];

// =============================================================================
// TESTS & RESULTS
// =============================================================================

export const mockTestResults = [
  {
    id: 'test-001',
    testType: 'putting_presisjon',
    name: 'Putting presisjon',
    date: '2025-01-02',
    score: 82,
    previousScore: 75,
    improvement: 7,
    category: 'putting',
  },
  {
    id: 'test-002',
    testType: 'driver_distanse',
    name: 'Driver distanse',
    date: '2024-12-28',
    score: 245,
    previousScore: 238,
    improvement: 7,
    unit: 'm',
    category: 'long_game',
  },
  {
    id: 'test-003',
    testType: 'chip_accuracy',
    name: 'Chip accuracy',
    date: '2024-12-20',
    score: 68,
    previousScore: 62,
    improvement: 6,
    unit: '%',
    category: 'short_game',
  },
];

export const mockUpcomingTests = [
  {
    id: 'upcoming-test-001',
    name: 'Putting presisjon',
    scheduledDate: '2025-01-10',
    category: 'putting',
  },
  {
    id: 'upcoming-test-002',
    name: 'Bunker escape rate',
    scheduledDate: '2025-01-15',
    category: 'short_game',
  },
];

// =============================================================================
// BADGES & ACHIEVEMENTS
// =============================================================================

export const mockBadges = [
  {
    id: 'badge-001',
    name: 'Konsistent trening',
    description: '10 treningsøkter på 30 dager',
    earnedAt: '2025-01-01',
    icon: 'Dumbbell',
    tier: 'bronze',
  },
  {
    id: 'badge-002',
    name: 'Putting mester',
    description: '85% presisjon på putting test',
    earnedAt: '2024-12-28',
    icon: 'Target',
    tier: 'silver',
  },
  {
    id: 'badge-003',
    name: 'Målbevisst',
    description: 'Fullført 5 mål',
    earnedAt: '2024-12-15',
    icon: 'Award',
    tier: 'gold',
  },
];

export const mockNextBadges = [
  {
    id: 'next-badge-001',
    name: 'Treningsjunkie',
    description: '25 treningsøkter på 30 dager',
    progress: 60,
    requirement: 25,
    current: 15,
  },
  {
    id: 'next-badge-002',
    name: 'Driver konge',
    description: '260m gjennomsnitt på driver test',
    progress: 94,
    requirement: 260,
    current: 245,
    unit: 'm',
  },
];

// =============================================================================
// GOALS
// =============================================================================

export const mockGoals = [
  {
    id: 'goal-001',
    title: 'Reduser HCP til 10',
    type: 'sesong',
    targetDate: '2025-06-30',
    progress: 45,
    status: 'in_progress',
    metrics: {
      target: 10,
      current: 12.4,
      unit: 'hcp',
    },
  },
  {
    id: 'goal-002',
    title: '20 treningsøkter denne mnd',
    type: 'kortsiktig',
    targetDate: '2025-01-31',
    progress: 75,
    status: 'in_progress',
    metrics: {
      target: 20,
      current: 15,
      unit: 'økter',
    },
  },
  {
    id: 'goal-003',
    title: 'Bestå kategori 2 test',
    type: 'langsiktig',
    targetDate: '2025-12-31',
    progress: 68,
    status: 'in_progress',
    metrics: {
      target: 100,
      current: 68,
      unit: '%',
    },
  },
];

// =============================================================================
// CALENDAR & TOURNAMENTS
// =============================================================================

export const mockCalendarEvents = [
  {
    id: 'event-001',
    title: 'Treneravtale',
    date: '2025-01-05',
    time: '10:00',
    type: 'trening',
    location: 'Holtsmark Golf',
  },
  {
    id: 'event-002',
    title: 'Vinterturneringen',
    date: '2025-01-12',
    time: '08:00',
    type: 'turnering',
    location: 'Losby Golf',
  },
  {
    id: 'event-003',
    title: 'Kategori-test',
    date: '2025-01-15',
    time: '14:00',
    type: 'test',
    location: 'Holtsmark Golf',
  },
];

export const mockTournaments = [
  {
    id: 'tournament-001',
    name: 'Vinterturneringen 2025',
    date: '2025-01-12',
    location: 'Losby Golf',
    status: 'registered',
    category: 'Seriespill',
  },
  {
    id: 'tournament-002',
    name: 'Vårcup',
    date: '2025-03-15',
    location: 'Oslo GK',
    status: 'open',
    category: 'Åpen',
    deadline: '2025-03-01',
  },
  {
    id: 'tournament-003',
    name: 'Juniorserien Runde 1',
    date: '2025-04-20',
    location: 'Holtsmark Golf',
    status: 'open',
    category: 'Junior',
    deadline: '2025-04-10',
  },
];

// =============================================================================
// MESSAGES & NOTIFICATIONS
// =============================================================================

export const mockMessages = [
  {
    id: 'msg-001',
    from: 'Erik Hansen',
    subject: 'Oppsummering etter økten',
    preview: 'Hei! Bra jobba i dag. Her er noen punkter...',
    date: '2025-01-03',
    unread: true,
  },
  {
    id: 'msg-002',
    from: 'Maria Olsen',
    subject: 'Neste gruppetrening',
    preview: 'Vi starter med short game fokus...',
    date: '2025-01-02',
    unread: true,
  },
  {
    id: 'msg-003',
    from: 'AK Golf Academy',
    subject: 'Ny badge opptjent!',
    preview: 'Gratulerer! Du har oppnådd "Konsistent trening"...',
    date: '2025-01-01',
    unread: false,
  },
];

export const mockNotifications = [
  {
    id: 'notif-001',
    type: 'reminder',
    title: 'Treneravtale i morgen',
    message: 'Du har avtale med Erik Hansen kl 10:00',
    date: '2025-01-04',
    read: false,
  },
  {
    id: 'notif-002',
    type: 'achievement',
    title: 'Badge opptjent!',
    message: 'Du har fått badgen "Konsistent trening"',
    date: '2025-01-01',
    read: true,
  },
];

// =============================================================================
// EXERCISES & RESOURCES
// =============================================================================

export const mockExercises = [
  {
    id: 'exercise-001',
    name: 'Gate drill',
    category: 'putting',
    difficulty: 'beginner',
    duration: 15,
    description: 'Øvelse for å forbedre putting presisjon',
    videoUrl: null,
  },
  {
    id: 'exercise-002',
    name: 'Ladder drill',
    category: 'putting',
    difficulty: 'intermediate',
    duration: 20,
    description: 'Avstands-kontroll øvelse',
    videoUrl: null,
  },
  {
    id: 'exercise-003',
    name: 'Alignment stick drill',
    category: 'full_swing',
    difficulty: 'beginner',
    duration: 15,
    description: 'Øvelse for bedre alignment',
    videoUrl: null,
  },
];

export const mockKnowledgeArticles = [
  {
    id: 'article-001',
    title: 'Putting: De 5 viktigste grunnprinsippene',
    category: 'teknikk',
    readTime: 5,
    publishedAt: '2024-12-15',
  },
  {
    id: 'article-002',
    title: 'Mental forberedelse før turnering',
    category: 'mental',
    readTime: 8,
    publishedAt: '2024-12-10',
  },
  {
    id: 'article-003',
    title: 'Oppvarming: Optimal rutine',
    category: 'fysisk',
    readTime: 4,
    publishedAt: '2024-12-05',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Simulate API delay
 */
export async function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get mock data with simulated delay
 */
export async function getMockData<T>(data: T, delayMs: number = 500): Promise<T> {
  await simulateDelay(delayMs);
  return data;
}

export default {
  player: mockPlayer,
  coaches: mockCoaches,
  dashboardStats: mockDashboardStats,
  treningStats: mockTreningStats,
  utviklingStats: mockUtviklingStats,
  planStats: mockPlanStats,
  merStats: mockMerStats,
  recentActivities: mockRecentActivities,
  sessions: mockSessions,
  upcomingSessions: mockUpcomingSessions,
  testResults: mockTestResults,
  upcomingTests: mockUpcomingTests,
  badges: mockBadges,
  nextBadges: mockNextBadges,
  goals: mockGoals,
  calendarEvents: mockCalendarEvents,
  tournaments: mockTournaments,
  messages: mockMessages,
  notifications: mockNotifications,
  exercises: mockExercises,
  knowledgeArticles: mockKnowledgeArticles,
};
